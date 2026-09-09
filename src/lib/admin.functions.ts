import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const FORBIDDEN = "Нет доступа к кабинету";

async function assertStaff(context: { supabase: any; userId: string }) {
  const [{ data: isAdmin }, { data: isAccountant }] = await Promise.all([
    context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" }),
    context.supabase.rpc("has_role", { _user_id: context.userId, _role: "accountant" }),
  ]);
  if (!isAdmin && !isAccountant) throw new Error(FORBIDDEN);
  return { isAdmin: Boolean(isAdmin), isAccountant: Boolean(isAccountant) };
}

export const getMyAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [{ data: isAdmin }, { data: isAccountant }] = await Promise.all([
      context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" }),
      context.supabase.rpc("has_role", { _user_id: context.userId, _role: "accountant" }),
    ]);
    return {
      userId: context.userId,
      email: (context.claims as { email?: string } | null)?.email ?? null,
      isAdmin: Boolean(isAdmin),
      isAccountant: Boolean(isAccountant),
    };
  });

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context);
    const supabase = context.supabase;
    const since30 = new Date(Date.now() - 30 * 864e5).toISOString();
    const since7 = new Date(Date.now() - 7 * 864e5).toISOString();

    const [enq, enqNew, enq30, views30, views7, finance, shows] = await Promise.all([
      supabase.from("enquiries").select("id", { count: "exact", head: true }),
      supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase
        .from("enquiries")
        .select("id", { count: "exact", head: true })
        .gte("created_at", since30),
      supabase.from("page_views").select("created_at, path, visitor_hash").gte("created_at", since30),
      supabase.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", since7),
      supabase.from("finance_entries").select("direction, amount, currency, entry_date"),
      supabase.from("shows").select("id", { count: "exact", head: true }),
    ]);

    const rows = (views30.data ?? []) as Array<{
      created_at: string;
      path: string;
      visitor_hash: string | null;
    }>;
    const byDay = new Map<string, number>();
    for (let i = 29; i >= 0; i -= 1) {
      const d = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
      byDay.set(d, 0);
    }
    const byPath = new Map<string, number>();
    const visitors = new Set<string>();
    rows.forEach((row) => {
      const day = row.created_at.slice(0, 10);
      if (byDay.has(day)) byDay.set(day, (byDay.get(day) ?? 0) + 1);
      byPath.set(row.path, (byPath.get(row.path) ?? 0) + 1);
      if (row.visitor_hash) visitors.add(row.visitor_hash);
    });

    const entries = (finance.data ?? []) as Array<{
      direction: "income" | "expense";
      amount: number | string;
      currency: string;
    }>;
    const totals = new Map<string, { income: number; expense: number }>();
    entries.forEach((entry) => {
      const value = Number(entry.amount) || 0;
      const code = entry.currency || "EUR";
      const bucket = totals.get(code) ?? { income: 0, expense: 0 };
      if (entry.direction === "income") bucket.income += value;
      else bucket.expense += value;
      totals.set(code, bucket);
    });
    const byCurrency = [...totals.entries()].map(([currency, t]) => ({
      currency,
      income: t.income,
      expense: t.expense,
      balance: t.income - t.expense,
    }));
    const primary = byCurrency[0] ?? { currency: "EUR", income: 0, expense: 0, balance: 0 };

    return {
      enquiriesTotal: enq.count ?? 0,
      enquiriesNew: enqNew.count ?? 0,
      enquiries30: enq30.count ?? 0,
      views30: rows.length,
      views7: views7.count ?? 0,
      visitors30: visitors.size,
      showsTotal: shows.count ?? 0,
      income: primary.income,
      expense: primary.expense,
      balance: primary.balance,
      currency: primary.currency,
      byCurrency,

      trafficSeries: [...byDay.entries()].map(([date, views]) => ({ date, views })),
      topPages: [...byPath.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([path, views]) => ({ path, views })),
    };
  });

export const listEnquiries = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context);
    const { data, error } = await context.supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getEnquiryNotes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ enquiryId: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { data: notes, error } = await context.supabase
      .from("enquiry_notes")
      .select("*")
      .eq("enquiry_id", data.enquiryId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return notes ?? [];
  });

export const addEnquiryNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ enquiryId: z.string().uuid(), body: z.string().trim().min(1).max(4000) }).parse(input),
  )
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { error } = await context.supabase
      .from("enquiry_notes")
      .insert({ enquiry_id: data.enquiryId, body: data.body, author_id: context.userId });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const setEnquiryStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        enquiryId: z.string().uuid(),
        status: z.enum(["new", "in_progress", "approved", "declined"]),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { error } = await context.supabase
      .from("enquiries")
      .update({ status: data.status, updated_at: new Date().toISOString() })
      .eq("id", data.enquiryId);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const listShows = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context);
    const { data, error } = await context.supabase
      .from("shows")
      .select("*")
      .order("show_date", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const showSchema = z.object({
  show_date: z.string().min(4),
  title: z.string().trim().min(1).max(200),
  country: z.string().trim().max(100).optional().default(""),
  city: z.string().trim().max(100).optional().default(""),
  dog_class: z.string().trim().max(100).optional().default(""),
  result: z.string().trim().max(200).optional().default(""),
  awarded_title: z.string().trim().max(200).optional().default(""),
  notes: z.string().trim().max(2000).optional().default(""),
});

export const createShow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => showSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { error } = await context.supabase.from("shows").insert({
      show_date: data.show_date,
      title: data.title,
      country: data.country || null,
      city: data.city || null,
      dog_class: data.dog_class || null,
      result: data.result || null,
      awarded_title: data.awarded_title || null,
      notes: data.notes || null,
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deleteShow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { error } = await context.supabase.from("shows").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const listFinance = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context);
    const { data, error } = await context.supabase
      .from("finance_entries")
      .select("*")
      .order("entry_date", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const financeSchema = z.object({
  entry_date: z.string().min(4),
  direction: z.enum(["income", "expense"]),
  category: z.string().trim().min(1).max(100),
  amount: z.number().nonnegative(),
  currency: z.string().trim().min(1).max(8).default("EUR"),
  description: z.string().trim().max(2000).optional().default(""),
});

export const createFinanceEntry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => financeSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { error } = await context.supabase.from("finance_entries").insert({
      entry_date: data.entry_date,
      direction: data.direction,
      category: data.category,
      amount: data.amount,
      currency: data.currency,
      description: data.description || null,
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deleteFinanceEntry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { error } = await context.supabase.from("finance_entries").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

// ---------- Сайт: тексты, фото, помёт ----------

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data: isAdmin } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (!isAdmin) throw new Error(FORBIDDEN);
}

export const getSiteSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context);
    const [content, photos, litter] = await Promise.all([
      context.supabase.from("site_content").select("key, locale, value"),
      context.supabase
        .from("site_photos")
        .select("id, slot, url, caption, alt, sort_order")
        .order("sort_order", { ascending: true }),
      context.supabase
        .from("litters")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);
    return {
      content: (content.data ?? []) as Array<{ key: string; locale: string; value: string }>,
      photos: (photos.data ?? []) as Array<{
        id: string;
        slot: string;
        url: string;
        caption: string | null;
        alt: string | null;
        sort_order: number;
      }>,
      litter: litter.data ?? null,
    };
  });

export const saveSiteContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        items: z
          .array(
            z.object({
              locale: z.enum(["ru", "en"]),
              key: z.string().trim().min(1).max(80),
              value: z.string().max(8000),
            }),
          )
          .max(100),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const rows = data.items.map((item) => ({
      locale: item.locale,
      key: item.key,
      value: item.value,
      updated_at: new Date().toISOString(),
    }));
    const { error } = await context.supabase
      .from("site_content")
      .upsert(rows, { onConflict: "locale,key" });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const addSitePhoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        slot: z.enum(["hero", "about", "show_career", "contacts", "gallery", "diploma"]),
        url: z.string().trim().min(1).max(500),
        caption: z.string().trim().max(200).optional().default(""),
        alt: z.string().trim().max(200).optional().default(""),
        replace: z.boolean().optional().default(false),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    if (data.replace) {
      await context.supabase.from("site_photos").delete().eq("slot", data.slot);
    }
    const { data: last } = await context.supabase
      .from("site_photos")
      .select("sort_order")
      .eq("slot", data.slot)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const { error } = await context.supabase.from("site_photos").insert({
      slot: data.slot,
      url: data.url,
      caption: data.caption || null,
      alt: data.alt || data.caption || null,
      sort_order: ((last?.sort_order as number | undefined) ?? 0) + 1,
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const updateSitePhoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        caption: z.string().trim().max(200).optional(),
        sort_order: z.number().int().optional(),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const patch: { caption?: string | null; alt?: string | null; sort_order?: number } = {};
    if (data.caption !== undefined) {
      patch.caption = data.caption || null;
      patch.alt = data.caption || null;
    }
    if (data.sort_order !== undefined) patch.sort_order = data.sort_order;
    const { error } = await context.supabase.from("site_photos").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deleteSitePhoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("site_photos").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

const litterSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(200),
  planned_date: z.string().trim().max(20).optional().default(""),
  status: z.enum(["planning", "expected", "born", "reserved"]),
  headline_ru: z.string().trim().max(300).optional().default(""),
  body_ru: z.string().trim().max(4000).optional().default(""),
  headline_en: z.string().trim().max(300).optional().default(""),
  body_en: z.string().trim().max(4000).optional().default(""),
  timing_label_ru: z.string().trim().max(200).optional().default(""),
  timing_label_en: z.string().trim().max(200).optional().default(""),
  notes: z.string().trim().max(4000).optional().default(""),
  is_published: z.boolean().optional().default(false),
});

export const saveLitter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => litterSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const row = {
      name: data.name,
      planned_date: data.planned_date || null,
      status: data.status,
      headline_ru: data.headline_ru || null,
      body_ru: data.body_ru || null,
      headline_en: data.headline_en || null,
      body_en: data.body_en || null,
      timing_label_ru: data.timing_label_ru || null,
      timing_label_en: data.timing_label_en || null,
      notes: data.notes || null,
      is_published: data.is_published,
      updated_at: new Date().toISOString(),
    };
    if (data.is_published) {
      await context.supabase
        .from("litters")
        .update({ is_published: false })
        .eq("is_published", true);
    }
    const { error } = data.id
      ? await context.supabase.from("litters").update(row).eq("id", data.id)
      : await context.supabase.from("litters").insert(row);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
