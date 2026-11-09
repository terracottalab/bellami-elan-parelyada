import { publicPageLinks } from "@/landing/public-site";
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
      links: publicPageLinks(loaderData?.locale ?? "ru", "", true),
      meta: [
        { title: c.title },
        { name: "description", content: c.description },
        { property: "og:title", content: c.title },
        { property: "og:description", content: c.description },
        { property: "og:image", content: "https://norwichland.com/__l5e/assets-v1/9d18f977-ece8-4d46-b389-cd20de570fff/pari-hero.jpg" },
        { name: "twitter:image", content: "https://norwichland.com/__l5e/assets-v1/9d18f977-ece8-4d46-b389-cd20de570fff/pari-hero.jpg" },
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
