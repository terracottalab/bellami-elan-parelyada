import { publicPageLinks } from "@/landing/public-site";
import { createFileRoute } from "@tanstack/react-router";

import { LandingPage } from "@/landing/LandingPage";
import { bodyHtml, description, title } from "@/landing/content.ru";
import { getSiteOverrides } from "@/lib/public.functions";

export const Route = createFileRoute("/ru/")({
  loader: () => getSiteOverrides(),
  head: () => ({
    links: publicPageLinks("ru", ""),
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: "https://norwichland.com/__l5e/assets-v1/9d18f977-ece8-4d46-b389-cd20de570fff/pari-hero.jpg" },
        { name: "twitter:image", content: "https://norwichland.com/__l5e/assets-v1/9d18f977-ece8-4d46-b389-cd20de570fff/pari-hero.jpg" },
        { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  errorComponent: () => <LandingPage html={bodyHtml} locale="ru" />,
  component: RuHomePage,
});

function RuHomePage() {
  const data = Route.useLoaderData();
  return (
    <LandingPage
      html={bodyHtml}
      locale="ru"
      overrides={{ content: data.ru, photos: data.photos, litter: data.litter }}
    />
  );
}
