/* =============================================================================
   VR LOGIC — Viability Ranking: draft editing, roster membership, ordering.
   Pure functions only. The corresponding React hook (useVr) owns the
   localStorage sync ("pro-roles-vr-draft") and setState calls.
   ========================================================================== */

export const VR_KEY = "pro-roles-vr-draft";
// Names explicitly cut from the ranking during this edit session, kept
// separately so they can still render as a "removed" ghost tile (with an
// undo corner) at their original tier — mirrors the Roles tab's pending
// "remove" edits. Not part of `vrDraft` itself: a cut mon is already absent
// from every tier's `mons` there, same as before.
export const VR_REMOVED_KEY = "pro-roles-vr-removed";

export function cloneVr(tiers) {
  return tiers.map((t) => ({ tier: t.tier, mons: t.mons.slice() }));
}

export function vrBaseTierOf(vr, name) {
  const i = vr.findIndex((t) => t.mons.includes(name));
  return i < 0 ? null : i;
}

export function vrDirty(vr, vrDraft) {
  if (!vrDraft) return false;
  return JSON.stringify(vrDraft) !== JSON.stringify(vr);
}

export function vrChangeCount(vr, vrDraft) {
  if (!vrDraft) return 0;
  let n = 0;
  for (let ti = 0; ti < vrDraft.length; ti++) {
    for (const name of vrDraft[ti].mons) {
      const b = vrBaseTierOf(vr, name);
      if (b == null || b !== ti) n++;
    }
  }
  for (const bt of vr) {
    for (const name of bt.mons) {
      if (!vrDraft.some((t) => t.mons.includes(name))) n++;
    }
  }
  return n;
}

// Moves `name` from `fromIdx` to `toIdx` (optionally before `insertBefore`).
// Returns { draft, toast } — draft is unchanged and toast explains why when
// the mon is already in the target tier.
export function vrMoveTo(draft, fromIdx, toIdx, name, insertBefore) {
  if (fromIdx !== toIdx && draft[toIdx].mons.includes(name)) {
    return { draft, toast: `${name} is already in ${draft[toIdx].tier}` };
  }
  const next = cloneVr(draft);
  const sameTier = fromIdx === toIdx;
  const fromArr = next[fromIdx].mons;
  const origIndex = fromArr.indexOf(name);
  // Only meaningful within the same tier, and only before removal below —
  // used to tell a forward drag from a backward one (see note further down).
  const origTargetIndex = sameTier && insertBefore != null ? fromArr.indexOf(insertBefore) : -1;

  fromArr.splice(origIndex, 1);

  const target = next[toIdx].mons; // same array as fromArr when sameTier
  let at = target.length;
  if (insertBefore != null) {
    const p = target.indexOf(insertBefore);
    if (p >= 0) {
      at = p;
      // Reordering within the same tier: dragging an item PAST a later one
      // (forward/right) and dropping it there should land it right AFTER
      // that tile. Inserting "before" (the default) would put it right
      // back where it started, since removing it already shifted the drop
      // target's index back by one — a silent no-op on every rightward
      // single-step drag. A backward/left drag isn't affected (the target
      // sat before the dragged item, so removal doesn't shift it), which is
      // why only rightward drags looked broken.
      if (sameTier && origIndex < origTargetIndex) at += 1;
    }
  }
  target.splice(at, 0, name);
  return { draft: next, toast: fromIdx !== toIdx ? `Moved ${name} → ${next[toIdx].tier}` : null };
}

// Adds/moves `name` into tier `toIdx` by search (the "add to tier" picker).
export function vrAdd(draft, toIdx, rawName, canonicalize) {
  const name = canonicalize((rawName || "").trim());
  if (!name) return { draft, toast: null };
  const cur = draft.findIndex((t) => t.mons.includes(name));
  if (cur === toIdx) return { draft, toast: `${name} is already in ${draft[toIdx].tier}` };
  const next = cloneVr(draft);
  if (cur >= 0) next[cur].mons = next[cur].mons.filter((n) => n !== name);
  next[toIdx].mons.push(name);
  return { draft: next, toast: `${cur >= 0 ? "Moved " : "Added "}${name} → ${next[toIdx].tier}` };
}

export function vrRemove(draft, toIdx, name) {
  const next = cloneVr(draft);
  next[toIdx].mons = next[toIdx].mons.filter((n) => n !== name);
  return next;
}

export function serializeViability(tiers) {
  const body = tiers
    .map((t) => `  { tier: ${JSON.stringify(t.tier)}, mons: [${t.mons.map((m) => JSON.stringify(m)).join(", ")}] },`)
    .join("\n");
  return "export const VIABILITY = [\n" + body + "\n];";
}

// ---- Roster: only Pokémon listed in VIABILITY appear on the site ----
// vrRank: name -> global index (tier, then position within tier). Used to
// (a) know who's viable and (b) order mons within each role.
export function vrRank(vr) {
  const map = new Map();
  let i = 0;
  for (const t of vr) for (const name of t.mons) if (!map.has(name)) map.set(name, i++);
  return map;
}

export function inRoster(rank, name) {
  return rank.has(name);
}

export function byVr(rank, a, b) {
  const ra = rank.has(a) ? rank.get(a) : 1e9;
  const rb = rank.has(b) ? rank.get(b) : 1e9;
  return ra - rb || a.localeCompare(b);
}

// Fixed light-paper hex values for the tier letter — used by the PNG export
// and print sheet, which (like the rest of print/export) always render on
// the light theme regardless of the on-screen dark/light toggle. On-screen
// tier coloring uses the `tier-color--*` CSS classes instead (viewStyles.js).
export function tierColorValue(tier) {
  if (tier === "NEW") return { bg: "#2e7d32", fg: "#f1ece1" };
  const L = tier[0];
  if (L === "S") return { bg: "#cf3a22", fg: "#f1ece1" };
  if (L === "A") return { bg: "#1b1917", fg: "#f1ece1" };
  if (L === "B") return { bg: "#7a7263", fg: "#f1ece1" };
  return { bg: "#9c8f78", fg: "#1b1917" }; // C
}
