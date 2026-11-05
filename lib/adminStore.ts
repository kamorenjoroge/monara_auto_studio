// THE ADMIN'S MOCK DATABASE (design phase only).
// Each store starts from the same JSON as the website, then keeps every change
// (new cars, approvals...) in the browser's localStorage.
// Later we replace createLocalStore with Supabase calls.

import carsData from "./cars.json";
import servicesData from "./services.json";
import packagesData from "./packages.json";
import productsData from "./products.json";
import galleryData from "./gallery.json";
import { createLocalStore } from "./localStore";
import { SITE } from "./site";
import type { Car, GalleryItem, Package, Product, Service } from "./types";

const ADMIN_ID = "usr-admin";
const DEMO_SELLER_ID = "usr-seller-demo";

// ---------- SELLERS ----------
// A seller is a customer who sells their cars through Monara. The admin creates the account.
// NOTE: the password is stored as plain text ONLY because this is a design mock.
// With Supabase Auth, passwords are never stored or readable like this.
export interface Seller {
  id: string;
  username: string;
  password: string;
  name: string;
  phone: string;
  active: boolean; // a disabled seller cannot log in
  createdAt: string;
}

// The first seller is the demo seller (their id matches the demo cars below)
function seedSellers(): Seller[] {
  return [
    {
      id: DEMO_SELLER_ID,
      username: "seller",
      password: "seller123",
      name: "Demo Seller",
      phone: "0700000000",
      active: true,
      createdAt: "2026-10-01",
    },
  ];
}

export const sellersStore = createLocalStore<Seller>("monara_admin_sellers", seedSellers);

// The name to show for the owner of a car ("Admin", the seller's name, or "Removed seller")
// Call this only in the browser (inside a page that has already loaded its data).
export function getOwnerName(sellerId: string | undefined): string {
  if (!sellerId || sellerId === ADMIN_ID) return "Admin";
  const seller = sellersStore.getAll().find((item) => item.id === sellerId);
  return seller ? seller.name : "Removed seller";
}

// ---------- CARS ----------
// The first time, build the admin's list from cars.json.
// A few cars are given to the demo seller with different statuses,
// so the dashboard and the approvals page have something to show.
function seedCars(): Car[] {
  const base = carsData as unknown as Car[];

  return base.map((car, index): Car => {
    const fromEnd = base.length - 1 - index; // 0 = the last car in the file

    if (fromEnd === 0 || fromEnd === 1) {
      return { ...car, sellerId: DEMO_SELLER_ID, approvalStatus: "pending" };
    }
    if (fromEnd === 2) {
      return { ...car, sellerId: DEMO_SELLER_ID, approvalStatus: "approved" };
    }
    if (fromEnd === 3) {
      return {
        ...car,
        sellerId: DEMO_SELLER_ID,
        approvalStatus: "rejected",
        rejectionReason: "Photos are too dark. Please upload clearer pictures.",
      };
    }
    // Everything else belongs to the admin and is already live
    return { ...car, sellerId: ADMIN_ID, approvalStatus: "approved" };
  });
}

// THE CARS "TABLE": carsStore.add(...), carsStore.update(...), carsStore.remove(...)
export const carsStore = createLocalStore<Car>("monara_admin_cars", seedCars);

// THE SERVICES "TABLE": same idea, one line. It starts from services.json.
export const servicesStore = createLocalStore<Service>(
  "monara_admin_services",
  () => servicesData as unknown as Service[],
);

// THE PACKAGES "TABLE": one line again. It starts from packages.json.
export const packagesStore = createLocalStore<Package>(
  "monara_admin_packages",
  () => packagesData as unknown as Package[],
);

// THE PRODUCTS "TABLE": one line again. It starts from products.json.
export const productsStore = createLocalStore<Product>(
  "monara_admin_products",
  () => productsData as unknown as Product[],
);

// THE GALLERY "TABLE": one line again. It starts from gallery.json.
export const galleryStore = createLocalStore<GalleryItem>(
  "monara_admin_gallery",
  () => galleryData as unknown as GalleryItem[],
);

// ---------- SITE SETTINGS ----------
// Settings are ONE record, so we keep them as a list with a single item (id "site").
// That way the same store and hook work for them too.
export interface SiteSettings {
  id: string;
  phone: string; // local format, e.g. 0745093837 (for the Call buttons)
  whatsapp: string; // with country code, no plus, e.g. 254745093837 (for WhatsApp links)
  email: string;
  address: string;
  hoursWeekdays: string;
  hoursSaturday: string;
  hoursSunday: string;
  instagram: string;
  facebook: string;
  tiktok: string;
}

export const SETTINGS_ID = "site";

// The first values come from lib/site.ts (the numbers the website uses today)
function seedSettings(): SiteSettings[] {
  return [
    {
      id: SETTINGS_ID,
      phone: SITE.phone,
      whatsapp: SITE.whatsapp,
      email: SITE.email,
      address: SITE.address,
      hoursWeekdays: "8:00 AM – 6:00 PM",
      hoursSaturday: "9:00 AM – 5:00 PM",
      hoursSunday: "10:00 AM – 3:00 PM",
      instagram: "",
      facebook: "",
      tiktok: "",
    },
  ];
}

export const settingsStore = createLocalStore<SiteSettings>("monara_admin_settings", seedSettings);

// How many services, packages and products exist (for the admin's dashboard)
export function getContentCounts() {
  return {
    services: (servicesData as unknown[]).length,
    packages: (packagesData as unknown[]).length,
    products: (productsData as unknown[]).length,
  };
}