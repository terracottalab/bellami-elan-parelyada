import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const listPublicShows = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("shows")
    .select("id, show_date, title, country, city, dog_class, result, awarded_title, notes")
    .order("show_date", { ascending: false });
  if (error) {
    console.error("shows read failed", error.message);
    return [] as NonNullable<typeof data>;
  }
  return data ?? [];
});

export const getSiteOverrides = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const [content, photos, litter] = await Promise.all([
    supabase.from("site_content").select("key, locale, value"),
    supabase
      .from("site_photos")
      .select("id, slot, url, caption, alt, sort_order")
      .order("sort_order", { ascending: true }),
    supabase
      .from("litters")
      .select(
        "id, name, planned_date, status, headline_ru, body_ru, headline_en, body_en, timing_label_ru, timing_label_en, is_published",
      )
      .eq("is_published", true)
      .order("planned_date", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  const rows = (content.data ?? []) as Array<{ key: string; locale: string; value: string }>;
  const ru: Record<string, string> = {};
  const en: Record<string, string> = {};
  rows.forEach((row) => {
    if (row.locale === "en") en[row.key] = row.value;
    else ru[row.key] = row.value;
  });

  return {
    ru,
    en,
    photos: photos.data ?? [],
    litter: litter.data ?? null,
  };
});
