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
    let income = 0;
    let expense = 0;
    entries.forEach((entry) => {
      const value = Number(entry.amount) || 0;
      if (entry.direction === "income") income += value;
      else expense += value;
    });

    return {
      enquiriesTotal: enq.count ?? 0,
      enquiriesNew: enqNew.count ?? 0,
      enquiries30: enq30.count ?? 0,
      views30: rows.length,
      views7: views7.count ?? 0,
      visitors30: visitors.size,
      showsTotal: shows.count ?? 0,
      income,
      expense,
      balance: income - expense,
      currency: entries[0]?.currency ?? "EUR",
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
