import { useCallback, useEffect, useRef } from "react";
import { useLocalStorage } from "./useLocalStorage.js";
import {
  PLACEHOLDER_SPRITE_URL,
  SPRITE_API,
  SPRITE_CACHE_KEY,
  buildSpriteQuery,
  extractSpriteUrls,
  groupByBase,
} from "../lib/spriteResolve.js";

const CHUNK = 12;

// Resolves a portrait URL per roster name from SpriteCollab, batched 12
// species per GraphQL call, sequentially (mirrors the original — SpriteCollab
// is a shared public API, not ours to hammer). Failures are blacklisted for
// the session so a name that can't be found isn't retried every render.
export function useSprites(names, parseOpts) {
  const [spriteUrls, setSpriteUrls] = useLocalStorage(SPRITE_CACHE_KEY, {});
  const missRef = useRef(new Set());

  useEffect(() => {
    let cancelled = false;
    const missing = names.filter((n) => !(n in spriteUrls) && !missRef.current.has(n));
    if (!missing.length) return;

    (async () => {
      const bases = groupByBase(missing, parseOpts);
      const found = {};
      for (let i = 0; i < bases.length && !cancelled; i += CHUNK) {
        const slice = bases.slice(i, i + CHUNK);
        try {
          const r = await fetch(SPRITE_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: buildSpriteQuery(slice) }),
          });
          const j = await r.json();
          const { found: batchFound, missed } = extractSpriteUrls(slice, j.data, parseOpts);
          Object.assign(found, batchFound);
          missed.forEach((n) => missRef.current.add(n));
        } catch {
          for (const b of slice) for (const n of b.names) missRef.current.add(n);
        }
      }
      if (!cancelled && Object.keys(found).length) {
        setSpriteUrls((prev) => ({ ...prev, ...found }));
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [names, spriteUrls, parseOpts]);

  const urlFor = useCallback((name) => spriteUrls[name] || PLACEHOLDER_SPRITE_URL, [spriteUrls]);

  return { spriteUrls, urlFor };
}
