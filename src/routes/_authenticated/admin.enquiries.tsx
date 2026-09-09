import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import {
  addEnquiryNote,
  getEnquiryNotes,
  listEnquiries,
  setEnquiryStatus,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/enquiries")({
  component: EnquiriesPage,
});

const STATUS: Record<string, string> = {
  new: "Новая",
  in_progress: "В работе",
  approved: "Одобрена",
  declined: "Отклонена",
};

type Enquiry = {
  id: string;
  created_at: string;
  locale: string;
  name: string;
  place: string;
  email: string;
  preferred_contact: string;
  handle: string | null;
  timing: string;
  purpose: string;
  experience: string;
  why_norwich: string;
  message: string | null;
  status: string;
};

function csvEscape(value: unknown) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function EnquiriesPage() {
  const queryClient = useQueryClient();
  const fetchList = useServerFn(listEnquiries);
  const updateStatus = useServerFn(setEnquiryStatus);
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "enquiries"],
    queryFn: () => fetchList() as Promise<Enquiry[]>,
  });

  const statusMutation = useMutation({
    mutationFn: (input: { enquiryId: string; status: string }) =>
      updateStatus({ data: input as never }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "enquiries"] }),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Загружаем заявки…</p>;
  if (error) return <p className="text-sm text-destructive">{(error as Error).message}</p>;

  const term = search.trim().toLowerCase();
  const rows = (data ?? []).filter((row) => {
    if (filter !== "all" && row.status !== filter) return false;
    const day = row.created_at.slice(0, 10);
    if (from && day < from) return false;
    if (to && day > to) return false;
    if (!term) return true;
    return [row.name, row.email, row.place, row.handle ?? ""].some((value) =>
      value.toLowerCase().includes(term),
    );
  });

  function exportCsv() {
    const header = [
      "Дата",
      "Имя",
      "Город",
      "Email",
      "Связь",
      "Контакт",
      "Сроки",
      "Цель",
      "Опыт",
      "Почему норвич",
      "Сообщение",
      "Статус",
    ];
    const lines = [header.map(csvEscape).join(",")].concat(
      rows.map((row) =>
        [
          new Date(row.created_at).toLocaleString("ru-RU"),
          row.name,
          row.place,
          row.email,
          row.preferred_contact,
          row.handle,
          row.timing,
          row.purpose,
          row.experience,
          row.why_norwich,
          row.message,
          STATUS[row.status] ?? row.status,
        ]
          .map(csvEscape)
          .join(","),
      ),
    );
    const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "zayavki.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold text-foreground">Заявки</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
        >
          <option value="all">Все статусы</option>
          {Object.entries(STATUS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={exportCsv}
          className="ml-auto rounded-md border border-input px-3 py-1.5 text-sm"
        >
          Скачать CSV
        </button>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Заявок пока нет.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <p className="font-medium text-foreground">
                    {row.name} · {row.place}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(row.created_at).toLocaleString("ru-RU")} · {row.email} ·{" "}
                    {row.locale.toUpperCase()}
                  </p>
                </div>
                <select
                  value={row.status}
                  onChange={(e) =>
                    statusMutation.mutate({ enquiryId: row.id, status: e.target.value })
                  }
                  className="ml-auto rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                >
                  {Object.entries(STATUS).map(([value, label]) => (
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

              {openId === row.id ? (
                <div className="mt-4 space-y-3 border-t border-border pt-4 text-sm">
                  <p>
                    <b>Способ связи:</b> {row.preferred_contact} {row.handle ?? ""}
                  </p>
                  <p>
                    <b>Сроки:</b> {row.timing} · <b>Цель:</b> {row.purpose} · <b>Опыт:</b>{" "}
                    {row.experience}
                  </p>
                  <p>
                    <b>Почему норвич:</b> {row.why_norwich}
                  </p>
                  {row.message ? (
                    <p>
                      <b>Сообщение:</b> {row.message}
                    </p>
                  ) : null}
                  <Notes enquiryId={row.id} />
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Notes({ enquiryId }: { enquiryId: string }) {
  const queryClient = useQueryClient();
  const fetchNotes = useServerFn(getEnquiryNotes);
  const saveNote = useServerFn(addEnquiryNote);
  const [body, setBody] = useState("");

  const { data } = useQuery({
    queryKey: ["admin", "notes", enquiryId],
    queryFn: () =>
      fetchNotes({ data: { enquiryId } }) as Promise<
        Array<{ id: string; body: string; created_at: string }>
      >,
  });

  const mutation = useMutation({
    mutationFn: () => saveNote({ data: { enquiryId, body } }),
    onSuccess: () => {
      setBody("");
      void queryClient.invalidateQueries({ queryKey: ["admin", "notes", enquiryId] });
    },
  });

  return (
    <div className="space-y-2">
      <p className="font-medium text-foreground">Заметки</p>
      <ul className="space-y-1 text-muted-foreground">
        {(data ?? []).map((note) => (
          <li key={note.id}>
            {new Date(note.created_at).toLocaleString("ru-RU")} — {note.body}
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Добавить заметку"
          className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm"
        />
        <button
          type="button"
          disabled={!body.trim() || mutation.isPending}
          onClick={() => mutation.mutate()}
          className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground disabled:opacity-60"
        >
          Сохранить
        </button>
      </div>
    </div>
  );
}
