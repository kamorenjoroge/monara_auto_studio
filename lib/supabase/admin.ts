import { createClient } from "@supabase/supabase-js";

// A Supabase connection with FULL POWER: it ignores all the Row Level Security rules.
// It can create and delete login accounts. That is why it must ONLY be used on the server
// (inside server actions), and why its key is never given a NEXT_PUBLIC_ name.
// Save this file as lib/supabase/admin.ts
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    throw new Error("The Supabase secret key is not set (SUPABASE_SECRET_KEY in .env.local).");
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}