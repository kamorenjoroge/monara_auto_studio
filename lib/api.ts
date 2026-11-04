// DATA LAYER: the only place that reads data.
// Pages and components call these functions and never import JSON directly.
// Later we replace the bodies with Supabase calls (same function names and types).

import services from "@/lib/services.json"
import cars from "@/lib/cars.json"
import gallery from "@/lib/gallery.json"
import products from "@/lib/products.json"
import packages from "@/lib/packages.json"
import type { Car, GalleryItem, Package, Product, Service  } from "./types";


// DATA LAYER: pages call these functions to get data.
// Right now they read the mock JSON. Later we change ONLY the inside of
// each function to read from Supabase, and nothing else in the app changes.

export async function getServices(): Promise<Service[]> {
  return services as unknown as Service[];
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  const all = await getServices();
  return all.find((service) => service.slug === slug);
}

// ---------- Cars ----------
export async function getCars(): Promise<Car[]> {
  return cars as unknown as Car[];
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
        other.id !== car.id &&
        (other.bodyType === car.bodyType || other.make === car.make),
    )
    .slice(0, limit);
}

// ---------- Gallery ----------
export async function getGallery(): Promise<GalleryItem[]> {
  return gallery as unknown as GalleryItem[];
}

// ---------- Products ----------
export async function getProducts(): Promise<Product[]> {
  return products as unknown as Product[];
}
// ---------- Packages ----------
export async function getPackages(): Promise<Package[]> {
  return packages as unknown as Package[];
}
export async function getFeaturedCars(): Promise<Car[]> {
  const all = await getCars();
  return all.filter((car) => car.featured);
}