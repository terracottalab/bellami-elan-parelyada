import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import {
  getChatSession,
  listChatMessages,
  listChatSessions,
  updateChatSession,
} from "@/lib/chat.functions";

export const Route = createFileRoute("/_authenticated/admin/ai")({
  component: AiChatsPage,
});

const STATUS_LABELS: Record<string, string> = {
  active: "Активен",
  closed: "Закрыт",
};

interface Session {
  id: string;
  created_at: string;
  updated_at: string;
  locale: string;
  name: string;
  phone: string;
  status: string;
  summary: string | null;
  message_count: number;
  ticket: { id: string; number: string; status: string } | null;
}

interface SessionDetailData {
  id: string;
  created_at: string;
  updated_at: string;
  locale: string;
  name: string;
  phone: string;
  status: string;
  summary: string | null;
  tickets: { id: string; number: string; reason: string; status: string; summary: string | null }[];
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

function AiChatsPage() {
  const queryClient = useQueryClient();
  const fetchSessions = useServerFn(listChatSessions);
  const updateSession = useServerFn(updateChatSession);
  const [openId, setOpenId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [locale, setLocale] = useState("");
  const [status, setStatus] = useState("");
  const [hasTicket, setHasTicket] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "chat-sessions", search, locale, status, hasTicket],
    queryFn: () =>
      fetchSessions({
        data: { search: search.trim() || undefined, locale, status, hasTicket },
      }) as unknown as Promise<Session[]>,
  });

  const statusMutation = useMutation({
    mutationFn: (input: { sessionId: string; status: "active" | "closed"; summary?: string }) =>
      updateSession({ data: input }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "chat-sessions"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "chat-session", openId] });
    },
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Загружаем чаты…</p>;
  if (error) return <p className="text-sm text-destructive">{(error as Error).message}</p>;

  const rows = (data ?? []) as Session[];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold text-foreground">AI-чаты</h1>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по имени или телефону"
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
        />
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
        >
          <option value="">Все языки</option>
          <option value="ru">RU</option>
          <option value="en">EN</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
        >
          <option value="">Все статусы</option>
          <option value="active">Активен</option>
          <option value="closed">Закрыт</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={hasTicket}
            onChange={(e) => setHasTicket(e.target.checked)}
            className="rounded border-input"
          />
          С тикетом
        </label>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Чатов по этим условиям нет.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <p className="font-medium text-foreground">
                    {row.name} · {row.phone}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(row.updated_at).toLocaleString("ru-RU")} · {row.locale.toUpperCase()} ·{" "}
                    {row.message_count} сообщений
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  {row.ticket ? (
                    <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">
                      Тикет #{row.ticket.number}
                    </span>
                  ) : null}
                  <select
                    value={row.status}
                    onChange={(e) =>
                      statusMutation.mutate({
                        sessionId: row.id,
                        status: e.target.value as "active" | "closed",
                      })
                    }
                    className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setOpenId(openId === row.id ? null : row.id)}
                    className="rounded-md border border-input px-3 py-1.5 text-sm"
                  >
                    {openId === row.id ? "Свернуть" : "Подробнее"}
                  </button>
                </div>
              </div>

              {openId === row.id ? (
                <SessionDetail
                  sessionId={row.id}
                  initialSummary={row.summary ?? ""}
                  onUpdateSummary={(summary) =>
                    statusMutation.mutate({
                      sessionId: row.id,
                      status: row.status as "active" | "closed",
                      summary,
                    })
                  }
                />
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SessionDetail({
  sessionId,
  initialSummary,
  onUpdateSummary,
}: {
  sessionId: string;
  initialSummary: string;
  onUpdateSummary: (summary: string) => void;
}) {
  const fetchMessages = useServerFn(listChatMessages);
  const fetchSession = useServerFn(getChatSession);
  const [summary, setSummary] = useState(initialSummary);

  const sessionQuery = useQuery({
    queryKey: ["admin", "chat-session", sessionId],
    queryFn: () => fetchSession({ data: { sessionId } }) as unknown as Promise<SessionDetailData>,
  });

  const messagesQuery = useQuery({
    queryKey: ["admin", "chat-messages", sessionId],
    queryFn: () => fetchMessages({ data: { sessionId } }) as unknown as Promise<Message[]>,
  });

  const ticket = (sessionQuery.data as SessionDetailData | undefined)?.tickets?.[0];

  return (
    <div className="mt-4 space-y-4 border-t border-border pt-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Краткое резюме</label>
        <div className="flex gap-2">
          <input
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Резюме диалога"
            className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          />
          <button
            type="button"
            onClick={() => onUpdateSummary(summary)}
            className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
          >
            Сохранить
          </button>
        </div>
        {ticket ? (
          <p className="text-sm text-muted-foreground">
            Тикет: #{ticket.number} · {ticket.status}
          </p>
        ) : null}
      </div>

      <div className="max-h-96 overflow-y-auto rounded-lg border border-border bg-background p-3">
        {(messagesQuery.data ?? []).map((msg) => (
          <div
            key={msg.id}
            className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <p className="mt-1 text-[10px] opacity-70">
                {new Date(msg.created_at).toLocaleString("ru-RU")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
