import { useEffect, useRef } from "react";

import { initLanding } from "./behavior";
import { applyOverrides, type SiteOverrides } from "./overrides";
import { submitEnquiry, trackPageView } from "@/lib/public.functions";
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
    const cleanup = initLanding(root, {
      onSubmit: async (values) =>
        submitEnquiry({
          data: {
            locale,
            name: values["name"] ?? "",
            place: values["place"] ?? "",
            email: values["email"] ?? "",
            preferredContact: values["preferredContact"] ?? "",
            handle: values["handle"] ?? "",
            timing: values["timing"] ?? "",
            purpose: values["purpose"] ?? "",
            experience: values["experience"] ?? "",
            whyNorwich: values["whyNorwich"] ?? "",
            message: values["message"] ?? "",
            consent: values["consent"] ?? "",
            website: values["website"] ?? "",
            fax_leave_empty: values["fax_leave_empty"] ?? "",
          },
        }),
    });
    return cleanup;
  }, [html, locale]);

  useEffect(() => {
    void trackPageView({
      data: {
        path: window.location.pathname,
        locale,
        referrer: document.referrer.slice(0, 500),
      },
    }).catch(() => undefined);
  }, [locale]);

  return <div className="landing" ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
}
