'use server';

import { createAdminClient } from "./supabase/admin";
import { createClient as createServerClient } from "./supabase/server";

// These functions run ON THE SERVER. They are the only place that can create or delete
// seller login accounts, because that needs the secret key.
// Every one of them first checks that the person calling is a logged-in, active ADMIN.
// Save this file as lib/sellerActions.ts

interface Result {
  error: string | null; // null = it worked
}

export interface SellerInput {
  name: string;
  phone: string;
  email: string;
  password: string; // when editing, an empty password means "keep the current one"
  active: boolean;
}

// ---------- checks ----------

// Is the person calling this an active admin? Returns a message if not, otherwise null.
async function checkAdmin(): Promise<string | null> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return "Please log in again.";

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, active")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin" || !profile.active) {
    return "Only the admin can manage sellers.";
  }
  return null;
}

// The server never trusts the browser: it checks the values again.
function checkInput(input: SellerInput, passwordRequired: boolean): string | null {
  if (input.name.trim().length < 2) return "Please enter the seller's name.";
  if (!/^0\d{9}$/.test(input.phone.replace(/\s/g, ""))) return "The phone number is not valid.";
  if (!/^\S+@\S+\.\S+$/.test(input.email)) return "The email address is not valid.";
  if ((passwordRequired || input.password) && input.password.length < 8) {
    return "The password must have at least 8 characters.";
  }
  return null;
}

// Turns Supabase's technical messages into friendly ones
function friendly(message: string): string {
  const text = message.toLowerCase();
  if (text.includes("already") && (text.includes("registered") || text.includes("exists"))) {
    return "A user with this email already exists.";
  }
  return message;
}

// A seller can only be changed or deleted if the target really is a seller (never the admin)
async function isSeller(id: string): Promise<boolean> {
  const admin = createAdminClient();
  const { data } = await admin.from("profiles").select("role").eq("id", id).single();
  return data?.role === "seller";
}

// ---------- the actions ----------

// Create a seller: a login account (email + password) AND a profile row with role "seller"
export async function createSeller(input: SellerInput): Promise<Result> {
  try {
    const denied = await checkAdmin();
    if (denied) return { error: denied };

    const invalid = checkInput(input, true);
    if (invalid) return { error: invalid };

    const admin = createAdminClient();
    const email = input.email.trim().toLowerCase();

    // 1. The login account (already confirmed, so the seller can log in at once)
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password: input.password,
      email_confirm: true,
    });
    if (error || !data.user) return { error: friendly(error?.message ?? "The account was not created.") };

    // 2. The profile row, linked by the same id
    const { error: profileError } = await admin.from("profiles").insert({
      id: data.user.id,
      name: input.name.trim(),
      phone: input.phone.replace(/\s/g, ""),
      email,
      role: "seller",
      active: input.active,
    });

    // If the profile failed, undo the login account so nothing half-made is left behind
    if (profileError) {
      await admin.auth.admin.deleteUser(data.user.id);
      return { error: profileError.message };
    }

    return { error: null };
  } catch (problem) {
    return { error: problem instanceof Error ? problem.message : "Something went wrong." };
  }
}

// Change a seller's details. An empty password keeps the current one.
export async function updateSeller(id: string, input: SellerInput): Promise<Result> {
  try {
    const denied = await checkAdmin();
    if (denied) return { error: denied };

    const invalid = checkInput(input, false);
    if (invalid) return { error: invalid };

    if (!(await isSeller(id))) return { error: "This account is not a seller." };

    const admin = createAdminClient();
    const email = input.email.trim().toLowerCase();

    // The login account: email and (only if a new one was typed) password
    const { error: authError } = await admin.auth.admin.updateUserById(id, {
      email,
      email_confirm: true,
      ...(input.password ? { password: input.password } : {}),
    });
    if (authError) return { error: friendly(authError.message) };

    // The profile row
    const { error: profileError } = await admin
      .from("profiles")
      .update({
        name: input.name.trim(),
        phone: input.phone.replace(/\s/g, ""),
        email,
        active: input.active,
      })
      .eq("id", id);
    if (profileError) return { error: profileError.message };

    return { error: null };
  } catch (problem) {
    return { error: problem instanceof Error ? problem.message : "Something went wrong." };
  }
}

// The quick Disable / Enable switch
export async function setSellerActive(id: string, active: boolean): Promise<Result> {
  try {
    const denied = await checkAdmin();
    if (denied) return { error: denied };
    if (!(await isSeller(id))) return { error: "This account is not a seller." };

    const admin = createAdminClient();
    const { error } = await admin.from("profiles").update({ active }).eq("id", id);
    return { error: error ? error.message : null };
  } catch (problem) {
    return { error: problem instanceof Error ? problem.message : "Something went wrong." };
  }
}

// Delete a seller: removes the login account (the profile goes with it).
// Their cars stay in the system, with no owner.
export async function deleteSeller(id: string): Promise<Result> {
  try {
    const denied = await checkAdmin();
    if (denied) return { error: denied };
    if (!(await isSeller(id))) return { error: "This account is not a seller." };

    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(id);
    return { error: error ? error.message : null };
  } catch (problem) {
    return { error: problem instanceof Error ? problem.message : "Something went wrong." };
  }
}