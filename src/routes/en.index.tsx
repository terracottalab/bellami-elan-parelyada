import { createFileRoute } from "@tanstack/react-router";

import { LandingPage } from "@/landing/LandingPage";
import { bodyHtml, description, title } from "@/landing/content.en";
import { getSiteOverrides } from "@/lib/public.functions";

export const Route = createFileRoute("/en/")({
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
  errorComponent: () => <LandingPage html={bodyHtml} locale="en" />,
  component: EnHomePage,
});

function EnHomePage() {
  const data = Route.useLoaderData();
  return (
    <LandingPage
      html={bodyHtml}
      locale="en"
      overrides={{ content: data.en, photos: data.photos, litter: data.litter }}
    />
  );
}
