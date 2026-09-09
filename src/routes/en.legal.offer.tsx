import { createFileRoute } from "@tanstack/react-router";

import { LandingPage } from "@/landing/LandingPage";
import { bodyHtml, description, title } from "@/landing/legal.offer.en";

export const Route = createFileRoute("/en/legal/offer")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <LandingPage html={bodyHtml} locale="en" />,
});
