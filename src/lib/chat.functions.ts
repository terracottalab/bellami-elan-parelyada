import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";
import { generateText } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import type { SupabaseClient } from "@supabase/supabase-js";

const MAX_MESSAGE_LENGTH = 2000;
const KB_QUERY_LIMIT = 40;

const startSessionSchema = z.object({
  locale: z.enum(["ru", "en"]),
  name: z.string().trim().min(1).max(200),
  phone: z.string().trim().min(5).max(40),
  consent: z.literal(true),
});

const sendMessageSchema = z.object({
  sessionId: z.string().uuid(),
  message: z.string().trim().min(1).max(MAX_MESSAGE_LENGTH),
});

const escalationSchema = z.object({
  sessionId: z.string().uuid(),
  reason: z.string().trim().min(1).max(500),
});

async function visitorHash(salt: string) {
  const ip = getRequestIP({ xForwardedFor: true }) ?? "unknown";
  const ua = getRequestHeader("user-agent") ?? "";
  const data = new TextEncoder().encode(`${salt}:${ip}:${ua}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}

function deviceFromUA(ua: string) {
  if (/mobile|iphone|android/i.test(ua)) return "mobile";
  if (/ipad|tablet/i.test(ua)) return "tablet";
  if (/bot|crawler|spider/i.test(ua)) return "bot";
  return "desktop";
}

async function adminClient(): Promise<SupabaseClient<Database>> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as SupabaseClient<Database>;
}

// Rate limit check runs with service-role privileges only (no exposed DB helper).
async function withinRateLimit(supabase: SupabaseClient<Database>, ipHash: string) {
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error } = await supabase
    .from("enquiries")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gt("created_at", since);
  if (error) return true;
  return (count ?? 0) < 3;
}

async function getSession(supabase: SupabaseClient<Database>, sessionId: string) {
  const { data, error } = await supabase.from("chat_sessions").select("*").eq("id", sessionId).single();
  if (error || !data) return null;
  return data;
}

async function getHistory(supabase: SupabaseClient<Database>, sessionId: string) {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("role, content")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true })
    .limit(50);
  if (error || !data) return [];
  return data as Array<{ role: "user" | "assistant"; content: string }>;
}

async function getKnowledgeBase(locale: "ru" | "en") {
  const supabase = await adminClient();
  const { data, error } = await supabase
    .from("kb_chunks")
    .select("source, title, chunk")
    .or(`locale.eq.${locale},locale.eq.both`)
    .order("created_at", { ascending: true })
    .limit(KB_QUERY_LIMIT);
  if (error || !data) return [];
  return data as Array<{ source: string; title: string | null; chunk: string }>;
}

function isEscalation(text: string) {
  const lower = text.toLowerCase();
  const triggers = [
    "оператор",
    "человек",
    "владелец",
    "позвать",
    "поговорить",
    "связаться",
    "human",
    "operator",
    "owner",
    "contact",
    "manager",
  ];
  return triggers.some((t) => lower.includes(t));
}

function buildSystemPrompt(locale: "ru" | "en", kb: Array<{ source: string; title: string | null; chunk: string }>) {
  const chunks = kb
    .map((item, i) => `[${i + 1}] ${item.title ? item.title + "\n" : ""}${item.chunk}`)
    .join("\n\n");

  if (locale === "en") {
    return `You are Norwich Assistant, a helpful assistant for the Norwich Terrier kennel website of Bellami-Elan Parelyada (Pari).
Answer ONLY based on the source material below. If the material does not contain enough information for a confident answer, say exactly:
"I don't have enough information in the available materials to answer this confidently. I can pass your question to the owner."

Rules:
- Answer in English.
- Keep answers short: 2-4 friendly paragraphs.
- Do not invent facts about Pari that are not in the source material.
- When appropriate, offer to "Tell me more".

SOURCE MATERIAL:
${chunks}`;
  }

  return `Ты — Норвич Ассистент, помощник сайта питомника норвич-терьера Bellami-Elan Parelyada (Пари).
Отвечай ТОЛЬКО на основе приведённых ниже материалов. Если в материалах недостаточно информации для уверенного ответа, скажи точно такую фразу:
"У меня недостаточно информации в доступных материалах, чтобы уверенно ответить. Я могу передать ваш вопрос владельцу."

Правила:
- Отвечай на русском языке.
- Делай ответы короткими: 2-4 дружелюбных абзаца.
- Не придумывай факты о Пари, которых нет в материалах.
- При необходимости предлагай "Расскажите подробнее".

ИСТОЧНИКИ:
${chunks}`;
}

export const startChatSession = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => startSessionSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = await adminClient();
    const hash = await visitorHash("chat");
    const { data: session, error } = await supabase
      .from("chat_sessions")
      .insert({
        locale: data.locale,
        name: data.name,
        phone: data.phone,
        consent: true,
        status: "active",
        ip_hash: hash,
        user_agent: deviceFromUA(getRequestHeader("user-agent") ?? ""),
      })
      .select("id")
      .single();

    if (error || !session) {
      console.error("chat session insert failed", error?.message);
      throw new Error("Failed to start chat");
    }

    return { id: session.id };
  });

export const sendChatMessage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => sendMessageSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = await adminClient();
    const session = await getSession(supabase, data.sessionId);
    if (!session) throw new Error("Session not found");

    const hash = await visitorHash("chat");
    const { data: allowed } = await supabase.rpc("can_submit_enquiry", { _ip_hash: hash });
    if (allowed === false) {
      return {
        reply:
          session.locale === "en"
            ? "Too many messages. Please try again later."
            : "Слишком много сообщений подряд. Попробуйте позже.",
      };
    }

    await supabase.from("chat_messages").insert({
      session_id: data.sessionId,
      role: "user",
      content: data.message,
    });

    const locale = session.locale as "ru" | "en";

    if (isEscalation(data.message)) {
      const reason =
        locale === "en" ? "User requested owner contact" : "Пользователь попросил связаться с владельцем";
      await createTicket(supabase, data.sessionId, reason);
      return {
        reply:
          locale === "en"
            ? "I have passed your request to the owner. They will contact you soon."
            : "Я передал ваш запрос владельцу. Он свяжется с вами в ближайшее время.",
      };
    }

    const history = await getHistory(supabase, data.sessionId);
    const kb = await getKnowledgeBase(locale);
    const messages = [
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: data.message },
    ];

    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI not configured");

    const gateway = createLovableAiGatewayProvider(key);
    const result = await generateText({
      model: gateway("google/gemini-3.8-flash"),
      instructions: buildSystemPrompt(locale, kb),
      messages,
      providerOptions: {
        lovable: { service_tier: "priority" },
      },
    });

    const reply =
      result.text ||
      (locale === "en"
        ? "I don't have enough information in the available materials to answer this confidently. I can pass your question to the owner."
        : "У меня недостаточно информации в доступных материалах, чтобы уверенно ответить. Я могу передать ваш вопрос владельцу.");

    await supabase.from("chat_messages").insert({
      session_id: data.sessionId,
      role: "assistant",
      content: reply,
    });

    await supabase.from("chat_sessions").update({ updated_at: new Date().toISOString() }).eq("id", data.sessionId);

    return { reply };
  });

export const createTicketFromChat = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => escalationSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = await adminClient();
    const session = await getSession(supabase, data.sessionId);
    if (!session) throw new Error("Session not found");

    await createTicket(supabase, data.sessionId, data.reason);

    return {
      ok: true as const,
      message:
        session.locale === "en"
          ? "Your request has been sent to the owner. They will contact you soon."
          : "Ваш запрос отправлен владельцу. Он свяжется с вами в ближайшее время.",
    };
  });

export const createEnquiryFromChat = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => escalationSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = await adminClient();
    const session = await getSession(supabase, data.sessionId);
    if (!session) throw new Error("Session not found");

    const history = await getHistory(supabase, data.sessionId);
    const summary = history
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n")
      .slice(0, 4000);

    const { error } = await supabase.from("enquiries").insert({
      locale: session.locale,
      name: session.name,
      place: "—",
      email: "—",
      preferred_contact: `Phone: ${session.phone}`,
      handle: "",
      timing: "AI chat",
      purpose: "AI chat enquiry",
      experience: "—",
      why_norwich: data.reason,
      message: summary,
      consent: true,
      source: "ai_chat",
      chat_session_id: data.sessionId,
    });

    if (error) {
      console.error("enquiry from chat failed", error.message);
      throw new Error("Failed to create enquiry");
    }

    return {
      ok: true as const,
      message:
        session.locale === "en"
          ? "Your enquiry has been sent to the owner. They will contact you soon."
          : "Ваш запрос отправлен владельцу. Он свяжется с вами в ближайшее время.",
    };
  });

async function createTicket(supabase: SupabaseClient<Database>, sessionId: string, reason: string) {
  const number = `T-${Date.now().toString(36).toUpperCase()}`;
  const { error } = await supabase.from("tickets").insert({
    session_id: sessionId,
    number,
    reason,
  });
  if (error) {
    console.error("ticket insert failed", error.message);
    throw new Error("Failed to create ticket");
  }

  try {
    const session = await getSession(supabase, sessionId);
    const history = await getHistory(supabase, sessionId);
    const lastUser = [...history].reverse().find((m) => m.role === "user");
    const { notifyTelegram, chatNotification } = await import("./telegram.server");
    await notifyTelegram(
      chatNotification({
        name: session?.name ?? "—",
        contact: session?.phone ?? "—",
        subject: `${reason}${lastUser ? `\nСообщение: ${lastUser.content}` : ""}\nТикет ${number}`,
      }),
    );
  } catch (e) {
    console.error("telegram ticket notification failed", (e as Error).message);
  }
}

// Admin functions
const sessionFilterSchema = z.object({
  search: z.string().max(200).optional(),
  locale: z.enum(["ru", "en", ""]).optional().default(""),
  status: z.enum(["active", "closed", ""]).optional().default(""),
  hasTicket: z.boolean().optional().default(false),
});

const updateSessionSchema = z.object({
  sessionId: z.string().uuid(),
  status: z.enum(["active", "closed"]),
  summary: z.string().max(2000).nullable().optional(),
});

const updateTicketSchema = z.object({
  ticketId: z.string().uuid(),
  status: z.enum(["new", "in_progress", "resolved", "closed"]),
});

export const listChatSessions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => sessionFilterSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    let query = context.supabase
      .from("chat_sessions")
      .select(
        "*, chat_messages!inner(id), tickets(id, number, status)",
        { count: "exact" },
      )
      .order("updated_at", { ascending: false });

    if (data.locale) query = query.eq("locale", data.locale);
    if (data.status) query = query.eq("status", data.status);
    if (data.search) {
      query = query.or(`name.ilike.%${data.search}%,phone.ilike.%${data.search}%`);
    }

    const { data: rows, error } = await query.limit(200);
    if (error) {
      console.error("list chat sessions failed", error.message);
      throw new Error("Failed to load sessions");
    }

    const sessions = (rows ?? []).map((row: any) => ({
      ...row,
      message_count: row.chat_messages?.length ?? 0,
      ticket: row.tickets?.[0] ?? null,
      chat_messages: undefined,
      tickets: undefined,
    }));

    if (data.hasTicket) {
      return sessions.filter((s: any) => s.ticket);
    }
    return sessions;
  });

export const getChatSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ sessionId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { data: session, error } = await context.supabase
      .from("chat_sessions")
      .select("*, tickets(id, number, reason, status, summary)")
      .eq("id", data.sessionId)
      .single();
    if (error || !session) throw new Error("Session not found");
    return session;
  });

export const listChatMessages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ sessionId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { data: messages, error } = await context.supabase
      .from("chat_messages")
      .select("id, role, content, created_at")
      .eq("session_id", data.sessionId)
      .order("created_at", { ascending: true });
    if (error) throw new Error("Failed to load messages");
    return messages ?? [];
  });

export const updateChatSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => updateSessionSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { error } = await context.supabase
      .from("chat_sessions")
      .update({ status: data.status, summary: data.summary ?? null })
      .eq("id", data.sessionId);
    if (error) throw new Error("Failed to update session");
    return { ok: true as const };
  });

export const listTickets = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        search: z.string().max(200).optional(),
        status: z.enum(["new", "in_progress", "resolved", "closed", ""]).optional().default(""),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    let query = context.supabase
      .from("tickets")
      .select("*, chat_sessions(id, name, phone, locale)")
      .order("created_at", { ascending: false });

    if (data.status) query = query.eq("status", data.status);
    if (data.search) {
      query = query.or(`number.ilike.%${data.search}%,reason.ilike.%${data.search}%`);
    }

    const { data: rows, error } = await query.limit(200);
    if (error) throw new Error("Failed to load tickets");
    return rows ?? [];
  });

export const updateTicket = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => updateTicketSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { error } = await context.supabase.from("tickets").update({ status: data.status }).eq("id", data.ticketId);
    if (error) throw new Error("Failed to update ticket");
    return { ok: true as const };
  });
