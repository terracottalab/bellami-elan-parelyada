import { createFileRoute } from "@tanstack/react-router";

import { LandingPage } from "@/landing/LandingPage";
import {
  buildShowsHtml,
  showsDescriptionEn,
  showsTitleEn,
  type PublicShow,
} from "@/landing/shows.page";
import { listPublicShows } from "@/lib/public.functions";

export const Route = createFileRoute("/en/shows")({
  loader: () => listPublicShows(),
  head: () => ({
    meta: [
      { title: showsTitleEn },
      { name: "description", content: showsDescriptionEn },
      { property: "og:title", content: showsTitleEn },
      { property: "og:description", content: showsDescriptionEn },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShowsEn,
});

function ShowsEn() {
  const shows = Route.useLoaderData() as PublicShow[];
  return <LandingPage html={buildShowsHtml(shows, "en")} locale="en" />;
}
