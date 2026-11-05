'use client';

import { createContext, useContext, useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";
import type { AuthUser, Role } from "@/lib/auth";

// What every admin page can ask for
interface AuthContextValue {
  user: AuthUser | null; // the logged-in user, or null
  loading: boolean; // true until we have checked for a saved login
  login: (email: string, password: string) => Promise<string | null>; // null = worked, text = the problem
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Looks up the person's profile (name, role, active) in the database.
// Returns null if there is no profile or the account is disabled.
async function fetchUser(
  supabase: SupabaseClient,
  id: string,
  email: string,
): Promise<AuthUser | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("name, role, active")
    .eq("id", id)
    .single();

  if (error || !data || !data.active) return null;

  return { id, email, name: data.name, role: data.role as Role };
}

// Wraps the whole admin area. It remembers who is logged in.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // When the page opens, check whether someone is already logged in
    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session;
      const found = session
        ? await fetchUser(supabase, session.user.id, session.user.email ?? "")
        : null;

      // Logged in, but no valid profile (or disabled): log them out
      if (session && !found) await supabase.auth.signOut();

      if (!cancelled) {
        setUser(found);
        setLoading(false);
      }
    });

    // If the login ends (logout, or in another tab), clear the user here too
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") setUser(null);
    });

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      if (error?.message.toLowerCase().includes("not confirmed")) {
        return "This email has not been confirmed yet.";
      }
      return "Wrong email or password.";
    }

    const found = await fetchUser(supabase, data.user.id, data.user.email ?? email);
    if (!found) {
      await supabase.auth.signOut();
      return "This account is not active. Please contact Monara.";
    }

    setUser(found);
    return null;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Any admin component calls this to get the user, login and logout
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}