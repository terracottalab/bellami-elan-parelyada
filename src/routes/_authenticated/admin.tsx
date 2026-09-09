import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Кабинет питомника" },
      { name: "description", content: "Закрытый кабинет владельца питомника." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Кабинет питомника" },
      { property: "og:description", content: "Закрытый кабинет владельца питомника." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Сводка", exact: true },
  { to: "/admin/enquiries", label: "Заявки" },
  { to: "/admin/ai", label: "AI-чаты" },
  { to: "/admin/tickets", label: "Тикеты" },
  { to: "/admin/litter", label: "Помёт" },
  { to: "/admin/photos", label: "Фотографии" },
  { to: "/admin/content", label: "Тексты сайта" },
  { to: "/admin/shows", label: "Выставки и титулы" },
  { to: "/admin/finance", label: "Финансы" },
] as const;

function AdminLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-4">
          <span className="text-base font-semibold text-foreground">Кабинет питомника</span>
          <nav className="flex flex-wrap gap-1 text-sm">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: Boolean((item as { exact?: boolean }).exact) }}
                activeProps={{ className: "bg-accent text-accent-foreground" }}
                className="rounded-md px-3 py-1.5 text-muted-foreground hover:bg-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <a href="/" className="text-muted-foreground hover:underline">
              Сайт
            </a>
            <button
              type="button"
              onClick={() => void signOut()}
              className="rounded-md border border-input px-3 py-1.5 text-foreground"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
