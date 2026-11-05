// Talks to the `products` table in Supabase.
// Supabase columns use snake_case (in_stock) and our code uses camelCase (inStock),
// so this file is the ONE place that translates between them.
// The pure helper rowToProduct is also used by the public pages (lib/api.ts).

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Product, ProductCategory } from "./types";

// A row exactly as it is stored in the database
export interface ProductRow {
  id: string;
  slug: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  image: string;
  description: string;
  in_stock: boolean;
  rating: number;
}

// What the form gives us (everything except the id and the web address piece)
export type ProductInput = Omit<Product, "id" | "slug">;

// A database row → the shape our pages use
export function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category as ProductCategory,
    brand: row.brand,
    price: Number(row.price),
    image: row.image,
    description: row.description,
    inStock: row.in_stock,
    rating: Number(row.rating),
  };
}

// The shape our pages use → the columns to save
function inputToRow(input: ProductInput) {
  return {
    name: input.name,
    category: input.category,
    brand: input.brand,
    price: input.price,
    image: input.image,
    description: input.description,
    in_stock: input.inStock,
    rating: input.rating,
  };
}

// Read all products (oldest first, so the order matches how they were added)
export async function fetchProducts(supabase: SupabaseClient): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return ((data ?? []) as ProductRow[]).map(rowToProduct);
}

// Add a product. Returns null when it worked, or a message describing the problem.
export async function createProduct(
  supabase: SupabaseClient,
  slug: string,
  input: ProductInput,
): Promise<string | null> {
  const { error } = await supabase.from("products").insert({ slug, ...inputToRow(input) });
  return error ? error.message : null;
}

// Change a product.
export async function updateProduct(
  supabase: SupabaseClient,
  id: string,
  input: ProductInput,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("products")
    .update(inputToRow(input))
    .eq("id", id)
    .select(); // asks for the changed rows back, so we can tell if anything really changed

  if (error) return error.message;
  // A Row Level Security rule that blocks an update does NOT return an error: it changes zero rows
  if (!data || data.length === 0) return "Not saved. Your account may not have permission.";
  return null;
}

// The quick "in stock / out of stock" switch (changes only that one column)
export async function setProductStock(
  supabase: SupabaseClient,
  id: string,
  inStock: boolean,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("products")
    .update({ in_stock: inStock })
    .eq("id", id)
    .select();

  if (error) return error.message;
  if (!data || data.length === 0) return "Not saved. Your account may not have permission.";
  return null;
}

// Delete a product.
export async function deleteProduct(supabase: SupabaseClient, id: string): Promise<string | null> {
  const { data, error } = await supabase.from("products").delete().eq("id", id).select();

  if (error) return error.message;
  if (!data || data.length === 0) return "Not deleted. Your account may not have permission.";
  return null;
}
