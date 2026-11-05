import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// The Supabase connection for code that runs ON THE SERVER (server actions, server components).
// It reads the login from the cookies of the request, so the server knows WHO is asking.
// Save this file as lib/supabase/server.ts
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a place where cookies cannot be changed: safe to ignore
          }
        },
      },
    },
  );
}