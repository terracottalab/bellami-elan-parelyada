import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const WEBHOOK_PATH = "/api/public/telegram/webhook";
const DEFAULT_WEBHOOK_URL = `https://project--8faab4ae-7bff-499e-ab95-370249eb95a8-dev.lovable.app${WEBHOOK_PATH}`;

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data: isAdmin } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (!isAdmin) throw new Error("Forbidden");
}

export const setupTelegramWebhook = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ url: z.string().url().optional() }).parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { telegramApi, webhookSecret } = await import("./telegram.server");
    await telegramApi("setWebhook", {
      url: data.url ?? DEFAULT_WEBHOOK_URL,
      secret_token: await webhookSecret(),
      allowed_updates: ["message"],
    });
    const info = (await telegramApi("getWebhookInfo", {})) as { url?: string };
    const me = (await telegramApi("getMe", {})) as { username?: string };
    return { ok: true as const, url: info.url ?? "", botUsername: me.username ?? "" };
  });

export const getTelegramStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { telegramApi } = await import("./telegram.server");
    let botUsername = "";
    let webhookUrl = "";
    try {
      const me = (await telegramApi("getMe", {})) as { username?: string };
      botUsername = me.username ?? "";
      const info = (await telegramApi("getWebhookInfo", {})) as { url?: string };
      webhookUrl = info.url ?? "";
    } catch (e) {
      console.error("telegram status failed", (e as Error).message);
    }
    const { data } = await context.supabase
      .from("telegram_subscribers")
      .select("chat_id, title, username, is_active, created_at")
      .order("created_at", { ascending: true });
    return { botUsername, webhookUrl, subscribers: data ?? [] };
  });

export const sendTelegramTest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { notifyTelegram, enquiryNotification } = await import("./telegram.server");
    await notifyTelegram(
      enquiryNotification({
        name: "Тестовая заявка",
        contact: "test@example.com",
        subject: "Проверка уведомлений из кабинета",
      }),
    );
    return { ok: true as const };
  });
