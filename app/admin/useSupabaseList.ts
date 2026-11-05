import { useCallback, useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";

// A REUSABLE HOOK for admin list pages: it reads a list from Supabase when the page opens.
// You give it the function that fetches the list (for example fetchServices).
// You get back: the connection (supabase), the items, loading, an error message,
// and reload() to read the list again after you add, change or delete something.
// The function you pass must be defined OUTSIDE the component (a normal import is fine).
export function useSupabaseList<T>(fetcher: (supabase: SupabaseClient) => Promise<T[]>) {
  const [supabase] = useState(() => createClient());
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    try {
      setItems(await fetcher(supabase));
      setError("");
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : "The data could not be loaded.");
    }
    setLoading(false);
  }, [supabase, fetcher]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { supabase, items, loading, error, reload };
}