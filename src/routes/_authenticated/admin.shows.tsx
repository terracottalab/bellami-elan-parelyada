import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { createShow, deleteShow, listShows } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/shows")({
  component: ShowsPage,
});

type Show = {
  id: string;
  show_date: string;
  title: string;
  country: string | null;
  city: string | null;
  dog_class: string | null;
  result: string | null;
  awarded_title: string | null;
  notes: string | null;
};

const EMPTY = {
  show_date: new Date().toISOString().slice(0, 10),
  title: "",
  country: "",
  city: "",
  dog_class: "",
  result: "",
  awarded_title: "",
  notes: "",
};

function ShowsPage() {
  const queryClient = useQueryClient();
  const fetchShows = useServerFn(listShows);
  const addShow = useServerFn(createShow);
  const removeShow = useServerFn(deleteShow);
  const [form, setForm] = useState(EMPTY);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "shows"],
    queryFn: () => fetchShows() as Promise<Show[]>,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "shows"] });
  const create = useMutation({
    mutationFn: () => addShow({ data: form }),
    onSuccess: () => {
      setForm(EMPTY);
      void invalidate();
    },
  });
  const remove = useMutation({
    mutationFn: (id: string) => removeShow({ data: { id } }),
    onSuccess: () => void invalidate(),
  });

  const field = (key: keyof typeof EMPTY, label: string, type = "text") => (
    <label className="space-y-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
      />
    </label>
  );

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-foreground">Выставки и титулы</h1>

      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-base font-semibold text-foreground">Добавить запись</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {field("show_date", "Дата", "date")}
          {field("title", "Название выставки")}
          {field("country", "Страна")}
          {field("city", "Город")}
          {field("dog_class", "Класс")}
          {field("result", "Результат")}
          {field("awarded_title", "Полученный титул")}
          {field("notes", "Заметка")}
        </div>
        <button
          type="button"
          disabled={!form.title.trim() || create.isPending}
          onClick={() => create.mutate()}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-60"
        >
          Добавить
        </button>
      </section>

      {isLoading ? <p className="text-sm text-muted-foreground">Загружаем…</p> : null}
      {error ? <p className="text-sm text-destructive">{(error as Error).message}</p> : null}

      <section className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-muted-foreground">
            <tr>
              <th className="p-3">Дата</th>
              <th className="p-3">Выставка</th>
              <th className="p-3">Место</th>
              <th className="p-3">Класс</th>
              <th className="p-3">Результат</th>
              <th className="p-3">Титул</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((show) => (
              <tr key={show.id} className="border-b border-border last:border-0">
                <td className="p-3">{show.show_date}</td>
                <td className="p-3">{show.title}</td>
                <td className="p-3">{[show.country, show.city].filter(Boolean).join(", ")}</td>
                <td className="p-3">{show.dog_class}</td>
                <td className="p-3">{show.result}</td>
                <td className="p-3">{show.awarded_title}</td>
                <td className="p-3 text-right">
                  <button
                    type="button"
                    onClick={() => remove.mutate(show.id)}
                    className="text-destructive hover:underline"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
            {(data ?? []).length === 0 && !isLoading ? (
              <tr>
                <td className="p-3 text-muted-foreground" colSpan={7}>
                  Записей пока нет.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </div>
  );
}
