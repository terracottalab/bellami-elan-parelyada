import o0 from "@/assets/diploma-abruzzo-winner-2026.jpg.asset.json";
import p0 from "@/assets/diploma-abruzzo-winner-2026-600.webp.asset.json";
import o1 from "@/assets/diploma-alpensieger-2026.jpg.asset.json";
import p1 from "@/assets/diploma-alpensieger-2026-600.webp.asset.json";
import o2 from "@/assets/diploma-ch-slo-2026.jpg.asset.json";
import p2 from "@/assets/diploma-ch-slo-2026-600.webp.asset.json";
import o3 from "@/assets/diploma-cisj-winner-2026.jpg.asset.json";
import p3 from "@/assets/diploma-cisj-winner-2026-600.webp.asset.json";
import o4 from "@/assets/diploma-jch-arm-2026.jpg.asset.json";
import p4 from "@/assets/diploma-jch-arm-2026-600.webp.asset.json";
import o5 from "@/assets/diploma-jch-blr-2026.jpg.asset.json";
import p5 from "@/assets/diploma-jch-blr-2026-600.webp.asset.json";
import o6 from "@/assets/diploma-jch-hrv.jpg.asset.json";
import p6 from "@/assets/diploma-jch-hrv-600.webp.asset.json";
import o7 from "@/assets/diploma-jch-rus.jpg.asset.json";
import p7 from "@/assets/diploma-jch-rus-600.webp.asset.json";
import o8 from "@/assets/diploma-jgrch-arm-2026.jpg.asset.json";
import p8 from "@/assets/diploma-jgrch-arm-2026-600.webp.asset.json";
import o9 from "@/assets/diploma-jgrch-rus.jpg.asset.json";
import p9 from "@/assets/diploma-jgrch-rus-600.webp.asset.json";
import o10 from "@/assets/diploma-jshch-rus.jpg.asset.json";
import p10 from "@/assets/diploma-jshch-rus-600.webp.asset.json";
import o11 from "@/assets/diploma-show-ch-swiss-2026.jpg.asset.json";
import p11 from "@/assets/diploma-show-ch-swiss-2026-600.webp.asset.json";
import o12 from "@/assets/pari-hero.jpg.asset.json";
import p12 from "@/assets/pari-hero-600.webp.asset.json";
import o13 from "@/assets/pari-live-awards.jpg.asset.json";
import p13 from "@/assets/pari-live-awards-600.webp.asset.json";
import o14 from "@/assets/pari-live-log.jpg.asset.json";
import p14 from "@/assets/pari-live-log-600.webp.asset.json";
import o15 from "@/assets/pari-portrait-01.jpg.asset.json";
import p15 from "@/assets/pari-portrait-01-600.webp.asset.json";
import o16 from "@/assets/pari-show-career.jpg.asset.json";
import p16 from "@/assets/pari-show-career-600.webp.asset.json";
import o17 from "@/assets/pari-show-minsk-podium.jpg.asset.json";
import p17 from "@/assets/pari-show-minsk-podium-600.webp.asset.json";
const previews: Record<string, string> = {
  [o0.url]: p0.url,
  [o1.url]: p1.url,
  [o2.url]: p2.url,
  [o3.url]: p3.url,
  [o4.url]: p4.url,
  [o5.url]: p5.url,
  [o6.url]: p6.url,
  [o7.url]: p7.url,
  [o8.url]: p8.url,
  [o9.url]: p9.url,
  [o10.url]: p10.url,
  [o11.url]: p11.url,
  [o12.url]: p12.url,
  [o13.url]: p13.url,
  [o14.url]: p14.url,
  [o15.url]: p15.url,
  [o16.url]: p16.url,
  [o17.url]: p17.url,
};
export function previewFor(url: string | undefined) { return url ? previews[url] ?? url : ""; }
