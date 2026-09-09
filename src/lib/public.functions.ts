import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

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

const enquirySchema = z.object({
  locale: z.string().max(8).optional().default("ru"),
  name: z.string().trim().min(1).max(200),
  place: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(200),
  preferredContact: z.string().trim().min(1).max(80),
  handle: z.string().trim().max(200).optional().default(""),
  timing: z.string().trim().min(1).max(80),
  purpose: z.string().trim().min(1).max(80),
  experience: z.string().trim().min(1).max(80),
  whyNorwich: z.string().trim().min(1).max(4000),
  message: z.string().trim().max(4000).optional().default(""),
  consent: z.string().optional().default(""),
  website: z.string().optional().default(""),
  fax_leave_empty: z.string().optional().default(""),
});

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => enquirySchema.parse(input))
  .handler(async ({ data }) => {
    // Honeypot fields — pretend success, store nothing.
    if (data.website || data.fax_leave_empty) return { ok: true as const };
    if (!data.consent) return { ok: false as const, message: "Требуется согласие" };

    const hash = await visitorHash("enquiry");
    const supabase = publicClient();

    const { data: allowed } = await supabase.rpc("can_submit_enquiry", { _ip_hash: hash });
    if (allowed === false) {
      return {
        ok: false as const,
        message:
          data.locale === "en"
            ? "Too many submissions. Please try again later."
            : "Слишком много заявок подряд. Попробуйте позже.",
      };
    }

    const { error } = await supabase.from("enquiries").insert({
      locale: data.locale || "ru",
      name: data.name,
      place: data.place,
      email: data.email,
      preferred_contact: data.preferredContact,
      handle: data.handle || null,
      timing: data.timing,
      purpose: data.purpose,
      experience: data.experience,
      why_norwich: data.whyNorwich,
      message: data.message || null,
      consent: true,
      ip_hash: hash,
      user_agent: deviceFromUA(getRequestHeader("user-agent") ?? ""),
    });

    if (error) {
      console.error("enquiry insert failed", error.message);
      return { ok: false as const };
    }
    return { ok: true as const };
  });

const viewSchema = z.object({
  path: z.string().max(300),
  locale: z.string().max(8).optional().default(""),
  referrer: z.string().max(500).optional().default(""),
});

export const trackPageView = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => viewSchema.parse(input))
  .handler(async ({ data }) => {
    const ua = getRequestHeader("user-agent") ?? "";
    if (/bot|crawler|spider|preview/i.test(ua)) return { ok: true as const };
    const supabase = publicClient();
    await supabase.from("page_views").insert({
      path: data.path.slice(0, 300),
      locale: data.locale || null,
      referrer: data.referrer ? data.referrer.slice(0, 500) : null,
      visitor_hash: await visitorHash("view"),
      device: deviceFromUA(ua),
    });
    return { ok: true as const };
  });
