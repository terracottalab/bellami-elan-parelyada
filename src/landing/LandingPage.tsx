import { useEffect, useRef } from "react";

import { initLanding } from "./behavior";
import { applyOverrides, type SiteOverrides } from "./overrides";
import { CookieConsent } from "@/components/CookieConsent";
import { trackGoal } from "./analytics";
import { ChatWidget } from "@/components/ChatWidget";
import "./landing.css";
import "@/components/chat-widget.css";

export function LandingPage({
  html,
  locale,
  overrides,
}: {
  html: string;
  locale: "ru" | "en";
  overrides?: SiteOverrides | null;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    applyOverrides(root, overrides ?? null, locale);

    // On the English-first domain the home page is English, so "RU" must point to /ru.
    if (window.location.hostname.replace(/^www\./, "").includes("norwichland")) {
      root.querySelectorAll<HTMLAnchorElement>('a[href="/"]').forEach((a) => {
        if (a.textContent?.trim().toUpperCase() === "RU" || a.hreflang === "ru") {
          a.setAttribute("href", "/ru");
        }
      });
    }
    document.documentElement.lang = locale;
    const cleanup = initLanding(root);
    const goals = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>("a");
      if (!link) return;
      if (link.dataset["goal"] === "click_vk") trackGoal("click_vk");
      if (link.dataset["goal"] === "click_email") trackGoal("click_email");
      if (/\/(ru|en)\/shows$/.test(link.getAttribute("href") ?? "")) trackGoal("open_shows");
    };
    root.addEventListener("click", goals);
    return () => { cleanup(); root.removeEventListener("click", goals); };
  }, [html, locale, overrides]);

  return (
    <>
      <div className="landing" ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
      <ChatWidget initialLocale={locale} />
      <CookieConsent locale={locale} />
    </>
  );
}
