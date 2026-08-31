/* =============================================================================
   SPRITE RESOLVE — name -> SpriteCollab GraphQL lookup helpers.
   Pure functions. Fetching/caching/retry lives in the useSprites hook.
   Different name-cleaning rules from speedCalc's apiSlug — don't merge them.
   ========================================================================== */

export const SPRITE_API = "https://spriteserver.pmdcollab.org/graphql";
// Bumped to -v2 to invalidate sprite URLs cached before the exact-match fix
// in extractSpriteUrls (fuzzy species search could pick the wrong Pokémon,
// e.g. Mew resolving to Mewtwo's portrait) — old wrong entries would
// otherwise never get refetched, since a cached name is treated as resolved.
export const SPRITE_CACHE_KEY = "pro-roles-sprite-cache-v2";

export const PLACEHOLDER_SPRITE_URL =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56"><circle cx="28" cy="28" r="17" fill="none" stroke="var(--dash)" stroke-width="3"/><line x1="11" y1="28" x2="45" y2="28" stroke="var(--dash)" stroke-width="3"/><circle cx="28" cy="28" r="5.5" fill="var(--dash)"/></svg>',
  );

// Splits a display name into { base, hint } for the SpriteCollab search:
// base = species to search for, hint = form name to disambiguate within results.
export function spriteParse(name, { spriteNoSplit, spriteFormSuffixes }) {
  const clean = name.replace(/[.'’:]/g, "").trim();
  if ((spriteNoSplit || []).includes(name)) {
    return { base: clean.replace(/-/g, ""), hint: "" };
  }
  const mega = clean.match(/^Mega\s+(.+)$/i);
  if (mega) {
    const rest = mega[1].trim().split(/\s+/);
    if (rest.length > 1 && /^[XY]$/i.test(rest[rest.length - 1])) {
      const letter = rest.pop().toUpperCase();
      return { base: rest.join(" "), hint: "Mega_" + letter };
    }
    return { base: rest.join(" "), hint: "Mega" };
  }
  const dash = clean.match(/^(.+?)-(.+)$/);
  if (dash && (spriteFormSuffixes || []).some((s) => s.toLowerCase() === dash[2].toLowerCase())) {
    return { base: dash[1], hint: dash[2].replace(/\s+/g, "_") };
  }
  return { base: clean, hint: "" };
}

export function pickSpriteForm(forms, hint) {
  if (!hint) return forms.find((f) => f.path === "") || forms[0];
  const norm = hint.toLowerCase();
  return (
    forms.find((f) => f.canon && f.fullName.toLowerCase() === norm) ||
    forms.find((f) => f.fullName.toLowerCase() === norm) ||
    forms.find((f) => f.path === "") ||
    forms[0]
  );
}

// Groups display names sharing the same search base (e.g. "Landorus" and
// "Landorus-Therian" both search for "Landorus") so one GraphQL call covers
// several names.
export function groupByBase(names, parseOpts) {
  const byBase = new Map();
  for (const n of names) {
    const { base } = spriteParse(n, parseOpts);
    const key = base.toLowerCase();
    if (!byBase.has(key)) byBase.set(key, { base, names: [] });
    byBase.get(key).names.push(n);
  }
  return [...byBase.values()];
}

export function buildSpriteQuery(basesSlice) {
  return (
    "{ " +
    basesSlice
      .map(
        (b, idx) =>
          `m${idx}: searchMonster(monsterName: ${JSON.stringify(b.base)}) { forms { path fullName canon portraits { emotions { emotion url } } } }`,
      )
      .join(" ") +
    " }"
  );
}

// SpriteCollab's search is fuzzy, not exact — searching "Mew" also matches
// Mewtwo, Meowth, Meowstic, Meowscarada, Glameow, even Alcremie, in no
// guaranteed order. Picking the species whose default-form name matches the
// query exactly (case-insensitive) avoids grabbing an unrelated species —
// falls back to the first result only when nothing matches exactly.
function pickExactSpecies(speciesList, base) {
  const norm = base.toLowerCase();
  return (
    speciesList.find((sp) => {
      const def = sp.forms.find((f) => f.path === "") || sp.forms[0];
      return def && def.fullName.toLowerCase() === norm;
    }) || speciesList[0]
  );
}

// Extracts { name -> portrait URL } for one batch response, and the set of
// names that couldn't be resolved (permanent per-session miss).
export function extractSpriteUrls(basesSlice, graphqlData, parseOpts) {
  const found = {};
  const missed = [];
  basesSlice.forEach((b, idx) => {
    const speciesList = (graphqlData && graphqlData["m" + idx]) || [];
    const monster = speciesList.length ? pickExactSpecies(speciesList, b.base) : null;
    for (const n of b.names) {
      if (!monster) {
        missed.push(n);
        continue;
      }
      const { hint } = spriteParse(n, parseOpts);
      const form = pickSpriteForm(monster.forms, hint);
      const normal = form && form.portraits.emotions.find((e) => e.emotion === "Normal");
      if (normal) found[n] = normal.url;
      else missed.push(n);
    }
  });
  return { found, missed };
}
