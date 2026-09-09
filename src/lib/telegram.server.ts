import type { Database } from "@/integrations/supabase/types";
import type { SupabaseClient } from "@supabase/supabase-js";

const API = "https://api.telegram.org/bot";

function token() {
  const t = process.env["TELEGRAM_BOT_TOKEN"];
  if (!t) throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  return t;
}

function toBase64Url(bytes: Uint8Array) {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function webhookSecret() {
  const data = new TextEncoder().encode(`telegram-webhook:${token()}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return toBase64Url(new Uint8Array(digest));
}

export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function telegramApi(method: string, body: Record<string, unknown>) {
  const res = await fetch(`${API}${token()}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as { ok: boolean; description?: string; result?: unknown };
  if (!res.ok || !json.ok) {
    console.error(`telegram ${method} failed [${res.status}]: ${json.description ?? "unknown"}`);
    throw new Error(`Telegram ${method} failed: ${json.description ?? res.status}`);
  }
  return json.result;
}

export function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function admin(): Promise<SupabaseClient<Database>> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as SupabaseClient<Database>;
}

/** Sends an HTML message to every active subscriber. Never throws. */
export async function notifyTelegram(text: string) {
  try {
    const supabase = await admin();
    const { data } = await supabase.from("telegram_subscribers").select("chat_id").eq("is_active", true);
    const chats = data ?? [];
    if (chats.length === 0) return;
    await Promise.all(
      chats.map((c) =>
        telegramApi("sendMessage", {
          chat_id: c.chat_id,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }).catch((e) => console.error("telegram notify failed", (e as Error).message)),
      ),
    );
  } catch (e) {
    console.error("telegram notify skipped", (e as Error).message);
  }
}

export function enquiryNotification(input: {
  name: string;
  contact: string;
  subject: string;
  locale?: string;
}) {
  return [
    "🐾 <b>Новая заявка с сайта</b>",
    `<b>Имя:</b> ${escapeHtml(input.name)}`,
    `<b>Контакт:</b> ${escapeHtml(input.contact)}`,
    `<b>Суть обращения:</b> ${escapeHtml(input.subject).slice(0, 2500)}`,
    input.locale ? `<i>Язык: ${escapeHtml(input.locale)}</i>` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function chatNotification(input: { name: string; contact: string; subject: string }) {
  return [
    "💬 <b>Обращение из чата на сайте</b>",
    `<b>Имя:</b> ${escapeHtml(input.name)}`,
    `<b>Контакт:</b> ${escapeHtml(input.contact)}`,
    `<b>Суть обращения:</b> ${escapeHtml(input.subject).slice(0, 2500)}`,
  ].join("\n");
}
