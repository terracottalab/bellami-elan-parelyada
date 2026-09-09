import { createFileRoute } from "@tanstack/react-router";

import { safeEqual, telegramApi, webhookSecret } from "@/lib/telegram.server";

export const Route = createFileRoute("/api/public/telegram/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = await webhookSecret();
        const actual = request.headers.get("X-Telegram-Bot-Api-Secret-Token") ?? "";
        if (!safeEqual(actual, expected)) return new Response("Unauthorized", { status: 401 });

        const update = (await request.json()) as {
          message?: {
            text?: string;
            chat?: { id?: number; title?: string; username?: string; first_name?: string };
          };
        };
        const message = update.message;
        const chatId = message?.chat?.id;
        if (!chatId) return Response.json({ ok: true, ignored: true });

        const text = (message?.text ?? "").trim().toLowerCase();
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        if (text.startsWith("/start")) {
          await supabaseAdmin.from("telegram_subscribers").upsert(
            {
              chat_id: chatId,
              title: message?.chat?.title ?? message?.chat?.first_name ?? null,
              username: message?.chat?.username ?? null,
              is_active: true,
            },
            { onConflict: "chat_id" },
          );
          await telegramApi("sendMessage", {
            chat_id: chatId,
            text: "Готово! Сюда будут приходить уведомления о новых заявках и обращениях с сайта. Команда /stop отключает их.",
          });
        } else if (text.startsWith("/stop")) {
          await supabaseAdmin.from("telegram_subscribers").update({ is_active: false }).eq("chat_id", chatId);
          await telegramApi("sendMessage", {
            chat_id: chatId,
            text: "Уведомления отключены. Команда /start включит их снова.",
          });
        }

        return Response.json({ ok: true });
      },
    },
  },
});
