import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CONSENT_KEY, METRICA_COUNTER } from "@/landing/public-site";
import { loadAnalytics } from "@/landing/analytics";

export function CookieConsent({ locale }: { locale: "ru" | "en" }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    // Do not claim cookies/Metrica are used while no counter is configured.
    if (METRICA_COUNTER === null) return;
    try {
      const value = localStorage.getItem(CONSENT_KEY);
      setVisible(value !== "accepted" && value !== "declined");
      if (value === "accepted") loadAnalytics();
    } catch { setVisible(true); }
  }, []);
  const choose = (value: "accepted" | "declined") => {
    try { localStorage.setItem(CONSENT_KEY, value); } catch { /* Keep tracking off if storage is unavailable. */ }
    setVisible(false);
    if (value === "accepted") loadAnalytics();
  };
  if (!visible) return null;
  const ru = locale === "ru";
  return <aside className="cookie-consent" aria-label={ru ? "Cookie" : "Cookies"}>
    <p>{ru ? "Сайт использует cookie и Яндекс Метрику, чтобы понимать, какие страницы читают." : "This site uses cookies and Yandex Metrica to see which pages are read."} <a href={`/${locale}/legal/privacy`}>{ru ? "Подробнее" : "Learn more"}</a></p>
    <div><Button onClick={() => choose("accepted")}>{ru ? "Принять" : "Accept"}</Button><Button variant="outline" onClick={() => choose("declined")}>{ru ? "Отказаться" : "Decline"}</Button></div>
  </aside>;
}