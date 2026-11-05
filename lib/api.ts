import { cacheLife, cacheTag } from "next/cache";
import { createClient } from "@supabase/supabase-js";

import {rowToCar} from "./carsDb";
import { rowToPackage } from "./packagesDb";
import { rowToGalleryItem } from "./galleryDb";
import { rowToProduct } from "./productsDb";
import { rowToService } from "./servicesDb";
import type { Car, GalleryItem, Package, Product, Service } from "./types";

// ============================================================
// THE DATA LAYER for the PUBLIC website.
// Pages call these functions to get data; they never read JSON or Supabase directly.
//   - Services, Products and Gallery come from Supabase (remembered for about a minute).
//   - Cars and Packages still come from the sample JSON files. We convert them next.
// ============================================================

// A connection that only uses the public key (it can read only what the database rules allow)
function publicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false } },
  );
}

// ---------- Services (read from Supabase, remembered for a minute) ----------
export async function getServices(): Promise<Service[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("services");

  const { data, error } = await publicClient()
    .from("services")
    .select("*")
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data.map(rowToService);
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  const all = await getServices();
  return all.find((service) => service.slug === slug);
}

// ---------- Products (read from Supabase, remembered for a minute) ----------
export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");

  const { data, error } = await publicClient()
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data.map(rowToProduct);
}

// ---------- Gallery (read from Supabase, remembered for a minute) ----------
export async function getGallery(): Promise<GalleryItem[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("gallery");

  const { data, error } = await publicClient()
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data.map(rowToGalleryItem);
}

// ---------- Packages (read from Supabase, remembered for a minute) ----------
export async function getPackages(): Promise<Package[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("packages");

  const { data, error } = await publicClient()
    .from("packages")
    .select("*")
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data.map(rowToPackage);
}

// ---------- Cars (read from Supabase, remembered for a minute) ----------
// The database rules show visitors APPROVED cars only, and we ask for approved ones explicitly too.
export async function getCars(): Promise<Car[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("cars");

  const { data, error } = await publicClient()
    .from("cars")
    .select("*")
    .eq("approval_status", "approved")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(rowToCar);
}

export async function getFeaturedCars(): Promise<Car[]> {
  const all = await getCars();
  return all.filter((car) => car.featured);
}

export async function getCarBySlug(slug: string): Promise<Car | undefined> {
  const all = await getCars();
  return all.find((car) => car.slug === slug);
}

// Cars with the same body type or make (not including the car itself)
export async function getSimilarCars(car: Car, limit = 3): Promise<Car[]> {
  const all = await getCars();
  return all
    .filter(
      (other) =>
        other.id !== car.id && (other.bodyType === car.bodyType || other.make === car.make),
    )
    .slice(0, limit);
}