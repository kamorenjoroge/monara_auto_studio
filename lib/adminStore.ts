// THE ADMIN'S MOCK DATABASE (design phase only).
// Each store starts from the same JSON as the website, then keeps every change
// (new cars, approvals...) in the browser's localStorage.
// Later we replace createLocalStore with Supabase calls.

import carsData from "./cars.json";
import servicesData from "./services.json";
import packagesData from "./packages.json";
import productsData from "./products.json";
import { createLocalStore } from "./localStore";
import type { Car } from "./types";

const ADMIN_ID = "usr-admin";
const DEMO_SELLER_ID = "usr-seller-demo";

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

// How many services, packages and products exist (for the admin's dashboard)
export function getContentCounts() {
  return {
    services: (servicesData as unknown[]).length,
    packages: (packagesData as unknown[]).length,
    products: (productsData as unknown[]).length,
  };
}