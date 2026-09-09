import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getDashboard } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: DashboardPage,
});

function money(value: number, currency: string) {
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency, maximumFractionDigits: 0 })
    .format(value);
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function DashboardPage() {
  const fetchDashboard = useServerFn(getDashboard);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => fetchDashboard(),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Загружаем данные…</p>;
  if (error) return <p className="text-sm text-destructive">{(error as Error).message}</p>;
  if (!data) return null;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-foreground">Сводка</h1>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Заявки на щенка"
          value={String(data.enquiriesTotal)}
          hint={`Новых: ${data.enquiriesNew} · за 30 дней: ${data.enquiries30}`}
        />
        <Stat
          label="Просмотры за 30 дней"
          value={String(data.views30)}
          hint={`За 7 дней: ${data.views7} · уникальных: ${data.visitors30}`}
        />
        <Stat label="Выставки" value={String(data.showsTotal)} />
        <Stat
          label="Баланс"
          value={money(data.balance, data.currency)}
          hint={`Доходы ${money(data.income, data.currency)} · расходы ${money(data.expense, data.currency)}`}
        />
      </section>

      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-base font-semibold text-foreground">Посещаемость за 30 дней</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.trafficSeries}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v: string) => v.slice(5)} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={32} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="views"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.15}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-base font-semibold text-foreground">Популярные страницы</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {data.topPages.length === 0 ? (
            <li className="text-muted-foreground">Пока нет данных о посещениях.</li>
          ) : (
            data.topPages.map((page) => (
              <li key={page.path} className="flex justify-between gap-4">
                <span className="text-foreground">{page.path}</span>
                <span className="text-muted-foreground">{page.views}</span>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
