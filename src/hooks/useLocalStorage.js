import { useCallback, useState } from "react";

// Generic localStorage-backed state. Reads once on mount; every set both
// updates React state and persists to localStorage. Swallows storage errors
// (private browsing, quota) the same way the original app did — the app
// still works in-memory for that session, it just won't persist.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const set = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? next(prev) : next;
        try {
          localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          /* ignore quota/private-mode errors, same as the original app */
        }
        return resolved;
      });
    },
    [key],
  );

  const remove = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    setValue(initialValue);
  }, [key, initialValue]);

  return [value, set, remove];
}
