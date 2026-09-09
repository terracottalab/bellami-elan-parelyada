import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { createFinanceEntry, deleteFinanceEntry, listFinance } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/finance")({
  component: FinancePage,
});

type Entry = {
  id: string;
  entry_date: string;
  direction: "income" | "expense";
  category: string;
  amount: number | string;
  currency: string;
  description: string | null;
};

const CURRENCIES = [
  { code: "EUR", label: "Евро (€)" },
  { code: "USD", label: "Доллары ($)" },
  { code: "RUB", label: "Рубли (₽)" },
] as const;

const EMPTY = {

  entry_date: new Date().toISOString().slice(0, 10),
  direction: "income" as "income" | "expense",
  category: "",
  amount: "",
  currency: "EUR",
  description: "",
};

function FinancePage() {
  const queryClient = useQueryClient();
  const fetchEntries = useServerFn(listFinance);
  const addEntry = useServerFn(createFinanceEntry);
  const removeEntry = useServerFn(deleteFinanceEntry);
  const [form, setForm] = useState(EMPTY);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "finance"],
    queryFn: () => fetchEntries() as Promise<Entry[]>,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "finance"] });
  const create = useMutation({
    mutationFn: () =>
      addEntry({
        data: {
          entry_date: form.entry_date,
          direction: form.direction,
          category: form.category,
          amount: Number(form.amount) || 0,
          currency: form.currency,
          description: form.description,
        },
      }),
    onSuccess: () => {
      setForm({ ...EMPTY, currency: form.currency });
      void invalidate();
    },
  });
  const remove = useMutation({
    mutationFn: (id: string) => removeEntry({ data: { id } }),
    onSuccess: () => void invalidate(),
  });

  const entries = data ?? [];
  const view = form.currency;
  const scoped = entries.filter((e) => e.currency === view);
  const income = scoped
    .filter((e) => e.direction === "income")
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const expense = scoped
    .filter((e) => e.direction === "expense")
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const fmt = (value: number) =>
    new Intl.NumberFormat("ru-RU", { style: "currency", currency: view, maximumFractionDigits: 0 })
      .format(value);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-foreground">Финансы</h1>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Итоги в валюте</span>
          <select
            value={view}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Доходы</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{fmt(income)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Расходы</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{fmt(expense)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Баланс</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{fmt(income - expense)}</p>
        </div>
      </section>


      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-base font-semibold text-foreground">Новая операция</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Дата</span>
            <input
              type="date"
              value={form.entry_date}
              onChange={(e) => setForm({ ...form, entry_date: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Тип</span>
            <select
              value={form.direction}
              onChange={(e) =>
                setForm({ ...form, direction: e.target.value as "income" | "expense" })
              }
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
            >
              <option value="income">Доход</option>
              <option value="expense">Расход</option>
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Категория</span>
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Выставка, вязка, ветеринар…"
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Сумма</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Валюта</span>
            <select
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}

            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Описание</span>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
            />
          </label>
        </div>
        <button
          type="button"
          disabled={!form.category.trim() || !form.amount || create.isPending}
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
              <th className="p-3">Тип</th>
              <th className="p-3">Категория</th>
              <th className="p-3">Сумма</th>
              <th className="p-3">Описание</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-border last:border-0">
                <td className="p-3">{entry.entry_date}</td>
                <td className="p-3">{entry.direction === "income" ? "Доход" : "Расход"}</td>
                <td className="p-3">{entry.category}</td>
                <td className="p-3">
                  {Number(entry.amount).toLocaleString("ru-RU")} {entry.currency}
                </td>
                <td className="p-3">{entry.description}</td>
                <td className="p-3 text-right">
                  <button
                    type="button"
                    onClick={() => remove.mutate(entry.id)}
                    className="text-destructive hover:underline"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
            {entries.length === 0 && !isLoading ? (
              <tr>
                <td className="p-3 text-muted-foreground" colSpan={6}>
                  Операций пока нет.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </div>
  );
}
