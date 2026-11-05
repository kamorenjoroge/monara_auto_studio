// Talks to the `settings` table in Supabase.
// Supabase columns use snake_case (hours_weekdays) and our code uses camelCase (hoursWeekdays),
// so this file is the ONE place that translates between them.

import type { SupabaseClient } from "@supabase/supabase-js";

import type { SiteSettings } from "./adminStore";

// A row from the database → the shape our pages use
function rowToSettings(row: Record<string, string>): SiteSettings {
  return {
    id: row.id,
    phone: row.phone,
    whatsapp: row.whatsapp,
    email: row.email,
    address: row.address,
    hoursWeekdays: row.hours_weekdays,
    hoursSaturday: row.hours_saturday,
    hoursSunday: row.hours_sunday,
    instagram: row.instagram,
    facebook: row.facebook,
    tiktok: row.tiktok,
  };
}

// Read the one settings row. Returns null if it cannot be read.
export async function fetchSettings(supabase: SupabaseClient): Promise<SiteSettings | null> {
  const { data, error } = await supabase.from("settings").select("*").eq("id", "site").single();

  if (error || !data) return null;
  return rowToSettings(data);
}

// Save changes to the settings row.
// Returns null when it worked, or a message describing the problem.
export async function saveSettings(
  supabase: SupabaseClient,
  changes: Omit<SiteSettings, "id">,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("settings")
    .update({
      phone: changes.phone,
      whatsapp: changes.whatsapp,
      email: changes.email,
      address: changes.address,
      hours_weekdays: changes.hoursWeekdays,
      hours_saturday: changes.hoursSaturday,
      hours_sunday: changes.hoursSunday,
      instagram: changes.instagram,
      facebook: changes.facebook,
      tiktok: changes.tiktok,
      updated_at: new Date().toISOString(),
    })
    .eq("id", "site")
    .select(); // asks for the changed rows back, so we can tell if anything really changed

  if (error) return error.message;

  // When a Row Level Security rule blocks an update, Supabase does NOT return an error:
  // it just changes zero rows. So we check for that.
  if (!data || data.length === 0) {
    return "The settings were not saved. Your account may not have permission to change them.";
  }

  return null;
}