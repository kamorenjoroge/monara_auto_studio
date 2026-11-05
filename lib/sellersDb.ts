// READS the sellers from Supabase (the profiles table, where role = 'seller').
// Creating, changing and deleting sellers is in lib/sellerActions.ts, because those need the
// server and the secret key. Reading works from the browser: the database rules let only the
// admin read every profile.

import type { SupabaseClient } from "@supabase/supabase-js";

export interface SellerAccount {
  id: string;
  name: string;
  phone: string;
  email: string;
  active: boolean;
  createdAt: string;
}

interface ProfileRow {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  active: boolean;
  created_at: string;
}

// Read all sellers, newest first
export async function fetchSellers(supabase: SupabaseClient): Promise<SellerAccount[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, phone, email, active, created_at")
    .eq("role", "seller")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return ((data ?? []) as ProfileRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email ?? "",
    active: row.active,
    createdAt: row.created_at.slice(0, 10),
  }));
}