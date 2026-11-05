// Talks to the `gallery` table in Supabase.
// The pure helper rowToGalleryItem is also used by the public pages (lib/api.ts).

import type { SupabaseClient } from "@supabase/supabase-js";
import type { GalleryCategory, GalleryItem } from "./types";

// A row exactly as it is stored in the database
export interface GalleryRow {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
}

// What the form gives us (everything except the id)
export type GalleryInput = Omit<GalleryItem, "id">;

// A database row → the shape our pages use
export function rowToGalleryItem(row: GalleryRow): GalleryItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category as GalleryCategory,
    image: row.image,
    description: row.description,
  };
}

// Read all gallery photos (oldest first, so the order matches how they were added)
export async function fetchGallery(supabase: SupabaseClient): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return ((data ?? []) as GalleryRow[]).map(rowToGalleryItem);
}

// Add a photo. Returns null when it worked, or a message describing the problem.
export async function createGalleryItem(
  supabase: SupabaseClient,
  input: GalleryInput,
): Promise<string | null> {
  const { error } = await supabase.from("gallery").insert(input);
  return error ? error.message : null;
}

// Change a photo's details.
export async function updateGalleryItem(
  supabase: SupabaseClient,
  id: string,
  input: GalleryInput,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("gallery")
    .update(input)
    .eq("id", id)
    .select(); // asks for the changed rows back, so we can tell if anything really changed

  if (error) return error.message;
  // A Row Level Security rule that blocks an update does NOT return an error: it changes zero rows
  if (!data || data.length === 0) return "Not saved. Your account may not have permission.";
  return null;
}

// Delete a photo.
export async function deleteGalleryItem(
  supabase: SupabaseClient,
  id: string,
): Promise<string | null> {
  const { data, error } = await supabase.from("gallery").delete().eq("id", id).select();

  if (error) return error.message;
  if (!data || data.length === 0) return "Not deleted. Your account may not have permission.";
  return null;
}

