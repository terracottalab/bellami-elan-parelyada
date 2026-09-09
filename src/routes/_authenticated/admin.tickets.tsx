import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { listTickets, updateTicket } from "@/lib/chat.functions";

export const Route = createFileRoute("/_authenticated/admin/tickets")({
  component: TicketsPage,
});

const STATUS_LABELS: Record<string, string> = {
  new: "Новый",
  in_progress: "В работе",
  resolved: "Решён",
  closed: "Закрыт",
};

interface Ticket {
  id: string;
  created_at: string;
  updated_at: string;
  number: string;
  reason: string;
  status: string;
  summary: string | null;
  chat_sessions: {
    id: string;
    name: string;
    phone: string;
    locale: string;
  } | null;
}

function TicketsPage() {
  const queryClient = useQueryClient();
  const fetchTickets = useServerFn(listTickets);
  const saveTicket = useServerFn(updateTicket);
  const [openId, setOpenId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "tickets", search, status],
    queryFn: () =>
      fetchTickets({ data: { search: search.trim() || undefined, status } }) as unknown as Promise<Ticket[]>,
  });

  const statusMutation = useMutation({
    mutationFn: (input: { ticketId: string; status: "new" | "in_progress" | "resolved" | "closed" }) =>
      saveTicket({ data: input }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "tickets"] });
    },
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Загружаем тикеты…</p>;
  if (error) return <p className="text-sm text-destructive">{(error as Error).message}</p>;

  const rows = (data ?? []) as Ticket[];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold text-foreground">Тикеты</h1>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по номеру или причине"
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
        >
          <option value="">Все статусы</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Тикетов по этим условиям нет.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <p className="font-medium text-foreground">
                    #{row.number} · {row.chat_sessions?.name ?? "—"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(row.created_at).toLocaleString("ru-RU")} ·{" "}
                    {row.chat_sessions ? `${row.chat_sessions.phone} · ${row.chat_sessions.locale.toUpperCase()}` : "—"}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <select
                    value={row.status}
                    onChange={(e) =>
                      statusMutation.mutate({
                        ticketId: row.id,
                        status: e.target.value as "new" | "in_progress" | "resolved" | "closed",
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
                <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                  <p>
                    <b>Причина обращения:</b> {row.reason}
                  </p>
                  {row.summary ? (
                    <p>
                      <b>Резюме:</b> {row.summary}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
