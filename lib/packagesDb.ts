// Talks to the `packages` table in Supabase.
// Supabase columns use snake_case (original_price) and our code uses camelCase (originalPrice),
// so this file is the ONE place that translates between them.
// The pure helper rowToPackage is also used by the public pages (lib/api.ts).

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Package, PackageCategory } from "./types";

// A row exactly as it is stored in the database
export interface PackageRow {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  price: number;
  original_price: number | null;
  duration: string;
  features: string[] | null;
  popular: boolean;
}

// What the form gives us (everything except the id and the web address piece)
export type PackageInput = Omit<Package, "id" | "slug">;

// A database row → the shape our pages use
export function rowToPackage(row: PackageRow): Package {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category as PackageCategory,
    description: row.description,
    price: Number(row.price),
    originalPrice: row.original_price === null ? null : Number(row.original_price),
    duration: row.duration,
    features: row.features ?? [],
    popular: row.popular,
  };
}

// The shape our pages use → the columns to save
function inputToRow(input: PackageInput) {
  return {
    name: input.name,
    category: input.category,
    description: input.description,
    price: input.price,
    original_price: input.originalPrice,
    duration: input.duration,
    features: input.features,
    popular: input.popular,
  };
}

// Read all packages (oldest first, so the order matches how they were added)
export async function fetchPackages(supabase: SupabaseClient): Promise<Package[]> {
  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return ((data ?? []) as PackageRow[]).map(rowToPackage);
}

// Add a package. Returns null when it worked, or a message describing the problem.
export async function createPackage(
  supabase: SupabaseClient,
  slug: string,
  input: PackageInput,
): Promise<string | null> {
  const { error } = await supabase.from("packages").insert({ slug, ...inputToRow(input) });
  return error ? error.message : null;
}

// Change a package.
export async function updatePackage(
  supabase: SupabaseClient,
  id: string,
  input: PackageInput,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("packages")
    .update(inputToRow(input))
    .eq("id", id)
    .select(); // asks for the changed rows back, so we can tell if anything really changed

  if (error) return error.message;
  // A Row Level Security rule that blocks an update does NOT return an error: it changes zero rows
  if (!data || data.length === 0) return "Not saved. Your account may not have permission.";
  return null;
}

// The quick "popular" switch (changes only that one column)
export async function setPackagePopular(
  supabase: SupabaseClient,
  id: string,
  popular: boolean,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("packages")
    .update({ popular })
    .eq("id", id)
    .select();

  if (error) return error.message;
  if (!data || data.length === 0) return "Not saved. Your account may not have permission.";
  return null;
}

// Delete a package.
export async function deletePackage(supabase: SupabaseClient, id: string): Promise<string | null> {
  const { data, error } = await supabase.from("packages").delete().eq("id", id).select();

  if (error) return error.message;
  if (!data || data.length === 0) return "Not deleted. Your account may not have permission.";
  return null;
}
