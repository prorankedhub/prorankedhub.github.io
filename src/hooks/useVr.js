import { useCallback, useMemo, useRef } from "react";
import { useLocalStorage } from "./useLocalStorage.js";
import {
  VR_KEY,
  VR_REMOVED_KEY,
  byVr as byVrLib,
  cloneVr,
  inRoster as inRosterLib,
  serializeViability,
  vrAdd as vrAddLib,
  vrBaseTierOf,
  vrChangeCount,
  vrDirty,
  vrMoveTo as vrMoveToLib,
  vrRank as vrRankLib,
  vrRemove as vrRemoveLib,
} from "../lib/vrLogic.js";
import { canonicalMonName } from "../lib/rolesLogic.js";

// `vr` is the confirmed VIABILITY data (from data/viability-data.js) — never
// mutated directly. `vrDraft` (persisted under VR_KEY) holds in-progress
// edits and only takes over what's shown when `editMode` is on.
//
// Roster membership (vrRank/inRoster/allMonNames) is derived from
// `vrWorking` (the draft while editing, the confirmed data otherwise) — not
// pinned to the confirmed `vr` — so that cutting a mon from VR immediately
// previews its removal from the Role Compendium and Speed Tiers tabs too,
// and an exported roles-data.js already comes out pruned regardless of
// whether viability-data.js was published first. Outside edit mode
// (vrWorking === vr) this is identical to reading the confirmed data.
export function useVr(vr, editMode, showToast) {
  const [vrDraft, setVrDraftRaw, clearVrDraft] = useLocalStorage(VR_KEY, null);
  const [removedNames, setRemovedNames, clearRemoved] = useLocalStorage(VR_REMOVED_KEY, []);
  const dragRef = useRef(null); // { fromIdx, name } — in-flight drag payload, not reactive state

  const vrWorking = editMode && vrDraft ? vrDraft : vr;
  const rank = useMemo(() => vrRankLib(vrWorking), [vrWorking]);
  const inRoster = useCallback((name) => inRosterLib(rank, name), [rank]);
  const byVr = useCallback((a, b) => byVrLib(rank, a, b), [rank]);
  const allMonNames = useMemo(() => [...rank.keys()].sort(), [rank]);
  const canonicalize = useCallback((name) => canonicalMonName(name, allMonNames), [allMonNames]);

  const moveTo = useCallback(
    (fromIdx, toIdx, name, insertBefore) => {
      const base = vrDraft || cloneVr(vr);
      const { draft, toast } = vrMoveToLib(base, fromIdx, toIdx, name, insertBefore);
      setVrDraftRaw(draft);
      if (toast) showToast(toast);
    },
    [vrDraft, vr, setVrDraftRaw, showToast],
  );

  // Free-text add: any name is accepted, not just ones already in the
  // roster — `canonicalize` only normalizes casing against known names, it
  // never rejects an unknown one. Sprite/species-name edge cases (Megas,
  // regional forms, etc.) get fixed case-by-case via FORM_SUFFIXES /
  // NO_SPLIT_HYPHEN / API_ALIAS in src/data/sprites.js and speedCalc.js.
  const add = useCallback(
    (toIdx, rawName) => {
      const base = vrDraft || cloneVr(vr);
      const { draft, toast } = vrAddLib(base, toIdx, rawName, canonicalize);
      setVrDraftRaw(draft);
      if (toast) showToast(toast);
    },
    [vrDraft, vr, canonicalize, setVrDraftRaw, showToast],
  );

  // A mon that exists in the confirmed ranking gets soft-removed: pulled out
  // of the active draft (so it no longer counts toward the roster / export)
  // but tracked in `removedNames` — along with the tier and index it was
  // pulled from — so it still renders as a "CUT" ghost tile right where it
  // was, with an undo, instead of jumping to the end of the tier. A mon that
  // only exists in the draft (never published) is a plain undo-less delete —
  // same as Roles tab canceling a pending add.
  const remove = useCallback(
    (toIdx, name) => {
      const base = vrDraft || cloneVr(vr);
      const index = base[toIdx].mons.indexOf(name);
      setVrDraftRaw(vrRemoveLib(base, toIdx, name));
      if (vrBaseTierOf(vr, name) != null) {
        setRemovedNames((prev) => (prev.some((r) => r.name === name) ? prev : [...prev, { name, tierIdx: toIdx, index }]));
      }
    },
    [vrDraft, vr, setVrDraftRaw, setRemovedNames],
  );

  const undoRemove = useCallback(
    (name) => {
      const entry = removedNames.find((r) => r.name === name);
      setRemovedNames((prev) => prev.filter((r) => r.name !== name));
      const tierIdx = entry ? entry.tierIdx : vrBaseTierOf(vr, name);
      if (tierIdx == null) return;
      const base = vrDraft || cloneVr(vr);
      if (base[tierIdx].mons.includes(name)) return;
      const next = cloneVr(base);
      const at = entry ? Math.min(entry.index, next[tierIdx].mons.length) : next[tierIdx].mons.length;
      next[tierIdx].mons.splice(at, 0, name);
      setVrDraftRaw(next);
    },
    [vr, vrDraft, removedNames, setRemovedNames, setVrDraftRaw],
  );

  const discardDraft = useCallback(() => {
    clearVrDraft();
    clearRemoved();
  }, [clearVrDraft, clearRemoved]);

  return {
    vr,
    vrDraft,
    vrWorking,
    dirty: vrDirty(vr, vrDraft),
    changeCount: vrChangeCount(vr, vrDraft),
    rank,
    inRoster,
    byVr,
    allMonNames,
    canonicalize,
    dragRef,
    removedNames,
    moveTo,
    add,
    remove,
    undoRemove,
    discardDraft,
    serialize: () => serializeViability(vrDraft || vr),
  };
}
