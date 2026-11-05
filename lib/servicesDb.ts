// Talks to the `services` table in Supabase.
// Supabase columns use snake_case (price_from) and our code uses camelCase (priceFrom),
// so this file is the ONE place that translates between them.
// The pure helper rowToService is also used by the public pages (lib/api.ts).

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Service } from "./types";

// A row exactly as it is stored in the database
export interface ServiceRow {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  icon: string;
  features: string[] | null;
  price_from: number | null;
  duration: string | null;
}

// What the form gives us (everything except the id and the web address piece)
export type ServiceInput = Omit<Service, "id" | "slug">;

// A database row → the shape our pages use
export function rowToService(row: ServiceRow): Service {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tagline: row.tagline,
    description: row.description,
    image: row.image,
    icon: row.icon,
    features: row.features ?? [],
    priceFrom: row.price_from,
    duration: row.duration,
  };
}

// The shape our pages use → the columns to save
function inputToRow(input: ServiceInput) {
  return {
    title: input.title,
    tagline: input.tagline,
    description: input.description,
    image: input.image,
    icon: input.icon,
    features: input.features,
    price_from: input.priceFrom,
    duration: input.duration,
  };
}

// Read all services (oldest first, so the order matches how they were added)
export async function fetchServices(supabase: SupabaseClient): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return ((data ?? []) as ServiceRow[]).map(rowToService);
}

// Add a service. Returns null when it worked, or a message describing the problem.
export async function createService(
  supabase: SupabaseClient,
  slug: string,
  input: ServiceInput,
): Promise<string | null> {
  const { error } = await supabase.from("services").insert({ slug, ...inputToRow(input) });
  return error ? error.message : null;
}

// Change a service.
export async function updateService(
  supabase: SupabaseClient,
  id: string,
  input: ServiceInput,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("services")
    .update(inputToRow(input))
    .eq("id", id)
    .select(); // asks for the changed rows back, so we can tell if anything really changed

  if (error) return error.message;
  // A Row Level Security rule that blocks an update does NOT return an error: it changes zero rows
  if (!data || data.length === 0) return "Not saved. Your account may not have permission.";
  return null;
}

// Delete a service.
export async function deleteService(supabase: SupabaseClient, id: string): Promise<string | null> {
  const { data, error } = await supabase.from("services").delete().eq("id", id).select();

  if (error) return error.message;
  if (!data || data.length === 0) return "Not deleted. Your account may not have permission.";
  return null;
}

