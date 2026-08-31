/* =============================================================================
   SPEED CALC — Speed Tiers math and the PokéAPI slug resolver.
   Pure functions. Fetching/caching lives in the useSpeeds hook.
   ========================================================================== */

export const SPEED_CACHE_KEY = "pro-roles-speed-cache";

export const SPEED_COLS = [
  { id: "base", label: "Base", hint: "Species base Speed stat" },
  { id: "max", label: "+Spe Max", hint: "252 EV · +Speed nature · 31 IV" },
  { id: "neutral", label: "Neutral", hint: "252 EV · neutral nature · 31 IV" },
  { id: "min", label: "Min", hint: "0 EV · −Speed nature · 0 IV — Trick Room" },
  { id: "scarf", label: "1.5× Max", hint: "+Speed Max × 1.5 — Choice Scarf or +1 boost" },
  { id: "scarfN", label: "1.5× Neu", hint: "Neutral Max × 1.5 — Choice Scarf or +1 boost" },
];

// Level 100: inner = 2*base + IV + floor(EV/4); stat = floor((inner + 5) * nature);
// Scarf/+1 = floor(stat * 1.5).
export function speedAt(base, col) {
  const maxN = Math.floor((2 * base + 99) * 1.1);
  const neu = 2 * base + 99;
  if (col === "base") return base;
  if (col === "max") return maxN;
  if (col === "neutral") return neu;
  if (col === "min") return Math.floor((2 * base + 5) * 0.9);
  if (col === "scarf") return Math.floor(maxN * 1.5);
  if (col === "scarfN") return Math.floor(neu * 1.5);
  return maxN;
}

// PokéAPI slug. Independent from spriteParse: here we always want the exact
// form, never an art fallback. Species whose default form needs a PokéAPI
// suffix:
export const API_ALIAS = {
  Aegislash: "aegislash-shield",
  Keldeo: "keldeo-ordinary",
  Thundurus: "thundurus-incarnate",
  Tornadus: "tornadus-incarnate",
  Landorus: "landorus-incarnate",
  Enamorus: "enamorus-incarnate",
  Mimikyu: "mimikyu-disguised",
  Meowstic: "meowstic-male",
  Basculegion: "basculegion-male",
  Indeedee: "indeedee-male",
  Oinkologne: "oinkologne-male",
  Urshifu: "urshifu-single-strike",
  Toxtricity: "toxtricity-amped",
  Eiscue: "eiscue-ice",
  Morpeko: "morpeko-full-belly",
  Wishiwashi: "wishiwashi-solo",
  Lycanroc: "lycanroc-midday",
  Darmanitan: "darmanitan-standard",
  Zacian: "zacian-hero",
  Zamazenta: "zamazenta-hero",
  Giratina: "giratina-altered",
  Shaymin: "shaymin-land",
  Deoxys: "deoxys-normal",
  Wormadam: "wormadam-plant",
  Zygarde: "zygarde-50",
};

// "Mega Charizard X" -> "charizard-mega-x" · "Mega Scizor" -> "scizor-mega"
// "Landorus-Therian" -> "landorus-therian"
export function apiSlug(name) {
  if (API_ALIAS[name]) return API_ALIAS[name];
  const clean = name.replace(/[.'’:]/g, "").trim();
  const mega = clean.match(/^Mega\s+(.+)$/i);
  if (mega) {
    const rest = mega[1].trim().split(/\s+/);
    const suffix = rest.length > 1 && /^[XY]$/i.test(rest[rest.length - 1]) ? "-" + rest.pop().toLowerCase() : "";
    return rest.join("-").toLowerCase() + "-mega" + suffix;
  }
  return clean.toLowerCase().replace(/\s+/g, "-");
}
