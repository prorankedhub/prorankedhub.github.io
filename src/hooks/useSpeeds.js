import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "./useLocalStorage.js";
import { SPEED_CACHE_KEY, apiSlug } from "../lib/speedCalc.js";

const CONCURRENCY = 6;

// Fetches base Speed for every roster name not already cached, from the
// PokéAPI, with a 6-worker pool. Failures are blacklisted for the session
// (`missRef`) so a mon that 404s isn't refetched on every render.
export function useSpeeds(names) {
  const [speeds, setSpeeds] = useLocalStorage(SPEED_CACHE_KEY, {});
  const missRef = useRef(new Set());
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const missing = names.filter((n) => speeds[n] == null && !missRef.current.has(n));
    if (!missing.length) return;

    setBusy(true);
    const found = {};
    let i = 0;
    const worker = async () => {
      while (i < missing.length) {
        const name = missing[i++];
        try {
          const r = await fetch("https://pokeapi.co/api/v2/pokemon/" + apiSlug(name));
          if (!r.ok) {
            missRef.current.add(name);
            continue;
          }
          const j = await r.json();
          const st = (j.stats || []).find((s) => s.stat && s.stat.name === "speed");
          if (st) found[name] = st.base_stat;
          else missRef.current.add(name);
        } catch {
          missRef.current.add(name);
        }
      }
    };

    Promise.all(Array.from({ length: Math.min(CONCURRENCY, missing.length) }, worker)).then(() => {
      if (cancelled) return;
      setBusy(false);
      if (Object.keys(found).length) setSpeeds((prev) => ({ ...prev, ...found }));
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [names, speeds]);

  return { speeds, busy };
}
