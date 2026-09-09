import { createFileRoute } from "@tanstack/react-router";

import { LandingPage } from "@/landing/LandingPage";
import { bodyHtml, description, title } from "@/landing/content.ru";
import { getSiteOverrides } from "@/lib/public.functions";

export const Route = createFileRoute("/")({
  loader: () => getSiteOverrides(),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  errorComponent: () => <LandingPage html={bodyHtml} locale="ru" />,
  component: HomePage,
});

function HomePage() {
  const data = Route.useLoaderData();
  return (
    <LandingPage
      html={bodyHtml}
      locale="ru"
      overrides={{ content: data.ru, photos: data.photos, litter: data.litter }}
    />
  );
}
