import { useEffect, useState } from "react";

import type { LocalStore } from "@/lib/localStore";

// A REUSABLE HOOK: gives an admin page the list from ANY store, plus add / update / remove / reset.
// The list is read from the browser, so it is empty for a moment while `loading` is true.
export function useLocalStore<T extends { id: string }>(store: LocalStore<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setItems(store.getAll());
    setLoading(false);
  }, [store]);

  return {
    items,
    loading,
    add: (item: T) => setItems(store.add(item)),
    update: (id: string, changes: Partial<T>) => setItems(store.update(id, changes)),
    remove: (id: string) => setItems(store.remove(id)),
    reset: () => setItems(store.reset()),
  };
}