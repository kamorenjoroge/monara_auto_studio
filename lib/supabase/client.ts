import { createBrowserClient } from "@supabase/ssr";

// The Supabase connection for code that runs IN THE BROWSER (client components).
// The URL and the publishable key are safe to use here: they are meant to be public,
// and the Row Level Security rules in the database decide what each person may do.
// NEVER put the secret key here.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}