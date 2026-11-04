// A REUSABLE MOCK DATABASE TABLE (design phase only).
// One function, createLocalStore, gives you add / update / remove / reset for ANY kind of item.
// Cars use it now. Services, packages and products will use the SAME function later.
// When we move to Supabase, only the inside of this file changes.

export interface LocalStore<T extends { id: string }> {
  getAll: () => T[];
  add: (item: T) => T[];
  update: (id: string, changes: Partial<T>) => T[];
  remove: (id: string) => T[];
  reset: () => T[];
}

// key     = the name the data is saved under in the browser
// getSeed = where the first list comes from (for example the JSON file)
export function createLocalStore<T extends { id: string }>(
  key: string,
  getSeed: () => T[],
): LocalStore<T> {
  const save = (items: T[]) => {
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch {
      // storage is blocked: changes just won't be remembered
    }
  };

  // Read the saved list. The very first time, build it from the seed and save it.
  const getAll = (): T[] => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved) as T[];
    } catch {
      // saved data was damaged: start fresh below
    }
    const seeded = getSeed();
    save(seeded);
    return seeded;
  };

  return {
    getAll,

    // CREATE: put the new item at the top of the list
    add: (item) => {
      const items = [item, ...getAll()];
      save(items);
      return items;
    },

    // UPDATE: change some fields of one item
    update: (id, changes) => {
      const items = getAll().map((item) => (item.id === id ? { ...item, ...changes } : item));
      save(items);
      return items;
    },

    // DELETE: remove one item
    remove: (id) => {
      const items = getAll().filter((item) => item.id !== id);
      save(items);
      return items;
    },

    // Throw away all changes and start again from the seed
    reset: () => {
      try {
        localStorage.removeItem(key);
      } catch {
        // nothing to remove
      }
      return getAll();
    },
  };
}