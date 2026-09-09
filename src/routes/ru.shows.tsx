import { createFileRoute } from "@tanstack/react-router";

import { LandingPage } from "@/landing/LandingPage";
import {
  buildShowsHtml,
  showsDescriptionRu,
  showsTitleRu,
  type PublicShow,
} from "@/landing/shows.page";
import { listPublicShows } from "@/lib/public.functions";

export const Route = createFileRoute("/ru/shows")({
  loader: () => listPublicShows(),
  head: () => ({
    meta: [
      { title: showsTitleRu },
      { name: "description", content: showsDescriptionRu },
      { property: "og:title", content: showsTitleRu },
      { property: "og:description", content: showsDescriptionRu },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShowsRu,
});

function ShowsRu() {
  const shows = Route.useLoaderData() as PublicShow[];
  return <LandingPage html={buildShowsHtml(shows, "ru")} locale="ru" />;
}
