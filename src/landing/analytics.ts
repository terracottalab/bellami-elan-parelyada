import { CONSENT_KEY, METRICA_COUNTER } from "./public-site";

export function analyticsAllowed(value: string | null, counter: number | null): boolean {
  return value === "accepted" && counter !== null && Number.isSafeInteger(counter) && counter > 0;
}

type MetricaWindow = Window & { ym?: ((...args: unknown[]) => void) & { a?: unknown[][]; l?: number } };

export function loadAnalytics() {
  let consent: string | null = null;
  try { consent = localStorage.getItem(CONSENT_KEY); } catch { return; }
  if (!analyticsAllowed(consent, METRICA_COUNTER) || document.getElementById("norwich-metrica")) return;
  const win = window as MetricaWindow;
  const queue = Object.assign((...args: unknown[]) => { queue.a.push(args); }, { a: [] as unknown[][], l: Date.now() });
  win.ym = win.ym ?? queue;
  const script = document.createElement("script");
  script.id = "norwich-metrica";
  script.async = true;
  script.src = "https://mc.yandex.ru/metrika/tag.js";
  document.head.appendChild(script);
  win.ym(METRICA_COUNTER, "init", { clickmap: false, trackLinks: false, accurateTrackBounce: true, webvisor: false });
}

export function trackGoal(goal: "click_email" | "copy_email" | "click_vk" | "open_shows") {
  try {
    if (analyticsAllowed(localStorage.getItem(CONSENT_KEY), METRICA_COUNTER)) {
      (window as MetricaWindow).ym?.(METRICA_COUNTER, "reachGoal", goal);
    }
  } catch { /* Storage may be disabled. */ }
}