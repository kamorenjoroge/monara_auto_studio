// Talks to the `cars` table in Supabase.
// Supabase columns use snake_case (body_type) and our code uses camelCase (bodyType),
// so this file is the ONE place that translates between them.
//
// WHO MAY DO WHAT is decided by the Row Level Security rules in the database, not here:
//   - the public sees approved cars only
//   - a seller sees, adds, edits and deletes only their own cars (always as "pending")
//   - the admin can do everything, including approving and rejecting

import type { SupabaseClient } from "@supabase/supabase-js";

import type { ApprovalStatus, Car, CarCondition, CarStatus } from "./types";

// A row exactly as it is stored in the database
export interface CarRow {
  id: string;
  slug: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  body_type: string;
  engine: string;
  drive: string;
  color: string;
  condition: string;
  status: string;
  featured: boolean;
  images: string[] | null;
  features: string[] | null;
  description: string;
  seller_id: string | null;
  approval_status: string;
  rejection_reason: string | null;
  created_at: string;
  owner?: { name: string } | null; // the owner's profile, when we ask for it
}

// The fields the car form gives us
export type CarInput = Omit<
  Car,
  "id" | "slug" | "createdAt" | "sellerId" | "approvalStatus" | "rejectionReason"
>;

// A car plus the name of the person who added it (for the admin's lists)
export interface AdminCar extends Car {
  ownerName: string;
}

// A database row → the shape our pages use
export function rowToCar(row: CarRow): Car {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    make: row.make,
    model: row.model,
    year: row.year,
    price: Number(row.price),
    mileage: row.mileage,
    fuel: row.fuel,
    transmission: row.transmission,
    bodyType: row.body_type,
    engine: row.engine,
    drive: row.drive,
    color: row.color,
    condition: row.condition as CarCondition,
    status: row.status as CarStatus,
    featured: row.featured,
    images: row.images ?? [],
    features: row.features ?? [],
    description: row.description,
    createdAt: row.created_at.slice(0, 10),
    sellerId: row.seller_id ?? undefined,
    approvalStatus: row.approval_status as ApprovalStatus,
    rejectionReason: row.rejection_reason ?? undefined,
  };
}

// The form's fields → the columns to save
function inputToRow(input: CarInput) {
  return {
    title: input.title,
    make: input.make,
    model: input.model,
    year: input.year,
    price: input.price,
    mileage: input.mileage,
    fuel: input.fuel,
    transmission: input.transmission,
    body_type: input.bodyType,
    engine: input.engine,
    drive: input.drive,
    color: input.color,
    condition: input.condition,
    status: input.status,
    featured: input.featured,
    images: input.images,
    features: input.features,
    description: input.description,
  };
}

// Read the cars for the ADMIN AREA:
//   - the admin gets every car
//   - a seller gets only their own cars
// (A seller could technically read approved cars from others too, so we filter by owner here.)
export async function fetchAdminCars(supabase: SupabaseClient): Promise<AdminCar[]> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error("Please log in again.");

  const userId = session.user.id;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).single();

  let query = supabase
    .from("cars")
    .select("*, owner:profiles(name)")
    .order("created_at", { ascending: false });

  if (profile?.role !== "admin") query = query.eq("seller_id", userId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return ((data ?? []) as unknown as CarRow[]).map((row) => ({
    ...rowToCar(row),
    ownerName: row.seller_id ? (row.owner?.name ?? "Unknown") : "No owner",
  }));
}

// Add a car. The admin's cars are approved at once; a seller's cars are pending.
// Returns null when it worked, or a message describing the problem.
export async function createCar(
  supabase: SupabaseClient,
  options: { baseSlug: string; input: CarInput; ownerId: string; isAdmin: boolean },
): Promise<string | null> {
  const { baseSlug, input, ownerId, isAdmin } = options;

  const row = {
    ...inputToRow(input),
    featured: isAdmin ? input.featured : false, // only the admin can feature a car
    seller_id: ownerId,
    approval_status: isAdmin ? "approved" : "pending",
  };

  // The web address piece must be unique. If it is taken, try again with a short ending.
  let { error } = await supabase.from("cars").insert({ slug: baseSlug, ...row });
  if (error && error.message.toLowerCase().includes("duplicate")) {
    const ending = Math.random().toString(36).slice(2, 6);
    ({ error } = await supabase.from("cars").insert({ slug: `${baseSlug}-${ending}`, ...row }));
  }

  return error ? error.message : null;
}

// Change a car.
// `sendBackToApproval` is true when a SELLER edits: the car goes back to "pending",
// is no longer featured, and any old rejection reason is cleared. (The database rules require it.)
export async function updateCar(
  supabase: SupabaseClient,
  id: string,
  input: CarInput,
  sendBackToApproval: boolean,
): Promise<string | null> {
  const changes = sendBackToApproval
    ? {
        ...inputToRow(input),
        featured: false,
        approval_status: "pending",
        rejection_reason: null,
      }
    : inputToRow(input);

  const { data, error } = await supabase.from("cars").update(changes).eq("id", id).select();

  if (error) return error.message;
  // A Row Level Security rule that blocks an update does NOT return an error: it changes zero rows
  if (!data || data.length === 0) return "Not saved. This car may not be yours, or the account may not have permission.";
  return null;
}

// The admin approves or rejects a car (a rejection needs a reason)
export async function setCarApproval(
  supabase: SupabaseClient,
  id: string,
  status: "approved" | "rejected",
  reason?: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("cars")
    .update({
      approval_status: status,
      rejection_reason: status === "rejected" ? (reason ?? "") : null,
    })
    .eq("id", id)
    .select();

  if (error) return error.message;
  if (!data || data.length === 0) return "Not saved. Only the admin can approve or reject cars.";
  return null;
}

// Delete a car.
export async function deleteCar(supabase: SupabaseClient, id: string): Promise<string | null> {
  const { data, error } = await supabase.from("cars").delete().eq("id", id).select();

  if (error) return error.message;
  if (!data || data.length === 0) return "Not deleted. This car may not be yours, or the account may not have permission.";
  return null;
}

