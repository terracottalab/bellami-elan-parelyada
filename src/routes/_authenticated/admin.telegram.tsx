import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { getTelegramStatus, sendTelegramTest, setupTelegramWebhook } from "@/lib/telegram.functions";

export const Route = createFileRoute("/_authenticated/admin/telegram")({
  component: TelegramPage,
});

function TelegramPage() {
  const status = useServerFn(getTelegramStatus);
  const setup = useServerFn(setupTelegramWebhook);
  const test = useServerFn(sendTelegramTest);
  const queryClient = useQueryClient();
  const [note, setNote] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["telegram-status"],
    queryFn: () => status({ data: {} }),
  });

  const setupMutation = useMutation({
    mutationFn: () => setup({ data: {} }),
    onSuccess: () => {
      setNote("Бот подключён. Откройте его в Telegram и отправьте /start.");
      void queryClient.invalidateQueries({ queryKey: ["telegram-status"] });
    },
    onError: (e: Error) => setNote(`Ошибка: ${e.message}`),
  });

  const testMutation = useMutation({
    mutationFn: () => test({ data: {} }),
    onSuccess: () => setNote("Тестовое уведомление отправлено."),
    onError: (e: Error) => setNote(`Ошибка: ${e.message}`),
  });

  const subscribers = data?.subscribers ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Уведомления в Telegram</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Бот присылает имя, контакт и суть каждого нового обращения — с формы сайта и из чата.
        </p>
      </div>

      <div className="rounded-lg border border-border p-4 text-sm">
        {isLoading ? (
          <p className="text-muted-foreground">Загрузка…</p>
        ) : (
          <ul className="space-y-1 text-foreground">
            <li>
              Бот: {data?.botUsername ? `@${data.botUsername}` : "не отвечает — проверьте токен"}
            </li>
            <li>Подключение: {data?.webhookUrl ? "активно" : "не настроено"}</li>
            <li>Получателей уведомлений: {subscribers.filter((s) => s.is_active).length}</li>
          </ul>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setupMutation.mutate()}
            disabled={setupMutation.isPending}
            className="rounded-md bg-primary px-3 py-1.5 text-primary-foreground disabled:opacity-50"
          >
            {data?.webhookUrl ? "Переподключить бота" : "Подключить бота"}
          </button>
          <button
            type="button"
            onClick={() => testMutation.mutate()}
            disabled={testMutation.isPending || subscribers.length === 0}
            className="rounded-md border border-input px-3 py-1.5 text-foreground disabled:opacity-50"
          >
            Отправить тест
          </button>
          {data?.botUsername ? (
            <a
              href={`https://t.me/${data.botUsername}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-input px-3 py-1.5 text-foreground"
            >
              Открыть бота
            </a>
          ) : null}
        </div>
        {note ? <p className="mt-3 text-muted-foreground">{note}</p> : null}
      </div>

      <div className="rounded-lg border border-border p-4">
        <h2 className="text-sm font-semibold text-foreground">Кто получает уведомления</h2>
        {subscribers.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Пока никто. Откройте бота в Telegram и отправьте команду /start.
          </p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm text-foreground">
            {subscribers.map((s) => (
              <li key={s.chat_id}>
                {s.title ?? s.username ?? s.chat_id} — {s.is_active ? "включено" : "отключено"}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
