import { createFileRoute } from "@tanstack/react-router";

import { LandingPage } from "@/landing/LandingPage";
import * as en from "@/landing/content.en";
import * as ru from "@/landing/content.ru";
import { getSiteOverrides } from "@/lib/public.functions";
import { getRequestHost, localeForHost } from "@/lib/host.functions";

export const Route = createFileRoute("/")({
  ssr: true,
  loader: async () => {
    const [overrides, host] = await Promise.all([
      getSiteOverrides(),
      getRequestHost().catch(() => ""),
    ]);
    return { overrides, locale: localeForHost(host ?? "") };
  },
  head: ({ loaderData }) => {
    const c = loaderData?.locale === "en" ? en : ru;
    return {
      meta: [
        { title: c.title },
        { name: "description", content: c.description },
        { property: "og:title", content: c.title },
        { property: "og:description", content: c.description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  errorComponent: () => <LandingPage html={ru.bodyHtml} locale="ru" />,
  component: HomePage,
});

function HomePage() {
  const { overrides, locale } = Route.useLoaderData();
  const c = locale === "en" ? en : ru;
  return (
    <LandingPage
      html={c.bodyHtml}
      locale={locale}
      overrides={{
        content: locale === "en" ? overrides.en : overrides.ru,
        photos: overrides.photos,
        litter: overrides.litter,
      }}
    />
  );
}
