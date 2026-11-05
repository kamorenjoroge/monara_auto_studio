// Counts for the admin's dashboard: how many services, packages, products, photos and sellers exist.
// It asks the database only for the NUMBER of rows (not the rows themselves), so it is fast.

import type { SupabaseClient } from "@supabase/supabase-js";

export interface ContentCounts {
  services: number;
  packages: number;
  products: number;
  gallery: number;
  sellers: number;
}

// How many rows a table has (optionally only those with a given role)
async function countRows(supabase: SupabaseClient, table: string, role?: string): Promise<number> {
  let query = supabase.from(table).select("*", { count: "exact", head: true });
  if (role) query = query.eq("role", role);

  const { count } = await query;
  return count ?? 0;
}

// Returns a list with ONE item, so it works with the useSupabaseList hook
export async function fetchContentCounts(supabase: SupabaseClient): Promise<ContentCounts[]> {
  const [services, packages, products, gallery, sellers] = await Promise.all([
    countRows(supabase, "services"),
    countRows(supabase, "packages"),
    countRows(supabase, "products"),
    countRows(supabase, "gallery"),
    countRows(supabase, "profiles", "seller"),
  ]);

  return [{ services, packages, products, gallery, sellers }];
}