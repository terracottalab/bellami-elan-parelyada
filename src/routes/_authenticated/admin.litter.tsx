import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";

import { getSiteSettings, saveLitter } from "@/lib/admin.functions";
import { LITTER_STATUSES } from "@/landing/overrides";

export const Route = createFileRoute("/_authenticated/admin/litter")({
  component: LitterPage,
});

const EMPTY = {
  id: "",
  name: "Bellami-Elan Parelyada × To Be Announced",
  planned_date: "",
  status: "planning",
  headline_ru: "",
  body_ru: "",
  headline_en: "",
  body_en: "",
  timing_label_ru: "",
  timing_label_en: "",
  notes: "",
  is_published: false,
};

function LitterPage() {
  const queryClient = useQueryClient();
  const fetchSettings = useServerFn(getSiteSettings);
  const save = useServerFn(saveLitter);
  const [form, setForm] = useState(EMPTY);
  const [saved, setSaved] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "site"],
    queryFn: () => fetchSettings(),
  });

  useEffect(() => {
    const litter = data?.litter as Record<string, unknown> | null | undefined;
    if (!litter) return;
    setForm({
      id: String(litter["id"] ?? ""),
      name: String(litter["name"] ?? ""),
      planned_date: String(litter["planned_date"] ?? ""),
      status: String(litter["status"] ?? "planning"),
      headline_ru: String(litter["headline_ru"] ?? ""),
      body_ru: String(litter["body_ru"] ?? ""),
      headline_en: String(litter["headline_en"] ?? ""),
      body_en: String(litter["body_en"] ?? ""),
      timing_label_ru: String(litter["timing_label_ru"] ?? ""),
      timing_label_en: String(litter["timing_label_en"] ?? ""),
      notes: String(litter["notes"] ?? ""),
      is_published: Boolean(litter["is_published"]),
    });
  }, [data]);

  const mutation = useMutation({
    mutationFn: () =>
      save({
        data: {
          ...(form.id ? { id: form.id } : {}),
          name: form.name,
          planned_date: form.planned_date,
          status: form.status as "planning",
          headline_ru: form.headline_ru,
          body_ru: form.body_ru,
          headline_en: form.headline_en,
          body_en: form.body_en,
          timing_label_ru: form.timing_label_ru,
          timing_label_en: form.timing_label_en,
          notes: form.notes,
          is_published: form.is_published,
        },
      }),
    onSuccess: () => {
      setSaved(true);
      void queryClient.invalidateQueries({ queryKey: ["admin", "site"] });
      setTimeout(() => setSaved(false), 2500);
    },
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Загружаем…</p>;
  if (error) return <p className="text-sm text-destructive">{(error as Error).message}</p>;

  const text = (key: keyof typeof EMPTY, label: string, area = false) => (
    <label className="block space-y-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      {area ? (
        <textarea
          rows={4}
          value={String(form[key])}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      ) : (
        <input
          value={String(form[key])}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      )}
    </label>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Будущий помёт</h1>
      <p className="text-sm text-muted-foreground">
        Заполните анонс и включите показ — блок «Планируемый помёт» на сайте обновится.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {text("name", "Название пары")}
        <label className="block space-y-1 text-sm">
          <span className="text-muted-foreground">Ожидаемая дата</span>
          <input
            type="date"
            value={form.planned_date}
            onChange={(e) => setForm({ ...form, planned_date: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="text-muted-foreground">Статус</span>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {LITTER_STATUSES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 self-end text-sm">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
          />
          <span>Показывать на сайте</span>
        </label>
        {text("headline_ru", "Заголовок (рус.)")}
        {text("headline_en", "Заголовок (англ.)")}
        {text("timing_label_ru", "Строка о сроках (рус.)")}
        {text("timing_label_en", "Строка о сроках (англ.)")}
        {text("body_ru", "Текст (рус.)", true)}
        {text("body_en", "Текст (англ.)", true)}
        {text("notes", "Внутренняя заметка (на сайте не видна)", true)}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={!form.name.trim() || mutation.isPending}
          onClick={() => mutation.mutate()}
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-60"
        >
          Сохранить
        </button>
        {saved ? <span className="text-sm text-muted-foreground">Сохранено</span> : null}
        {mutation.error ? (
          <span className="text-sm text-destructive">{(mutation.error as Error).message}</span>
        ) : null}
      </div>
    </div>
  );
}
