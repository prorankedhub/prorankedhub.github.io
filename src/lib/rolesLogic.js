/* =============================================================================
   ROLES LOGIC — role editing (add/remove/move/copy/note) as pending edits.
   Pure functions operating on `sections` (from data/roles-data.js) and a
   `pendingEdits` array. The useRoles hook owns setState + the
   "pro-roles-pending-edits" localStorage key + toasts.
   ========================================================================== */

export const EDIT_STORAGE_KEY = "pro-roles-pending-edits";

export function monName(m) {
  return typeof m === "string" ? m : m.name;
}

export function monNote(m) {
  return typeof m === "string" ? "" : m.note || "";
}

export function allMonNames(rank) {
  return [...rank.keys()].sort();
}

// { monName: { sectionId: { title, roles: [{ role, note }] } } } — built from
// the "clean" (pending-merged) sections, used by the detail drawer and the
// team-assignment modal.
export function monRoleMap(cleanSections) {
  const map = {};
  for (const sec of cleanSections) {
    for (const role of sec.roles) {
      for (const entry of role.mons) {
        const name = monName(entry);
        const note = monNote(entry);
        if (!map[name]) map[name] = {};
        if (!map[name][sec.id]) map[name][sec.id] = { title: sec.title, roles: [] };
        const list = map[name][sec.id].roles;
        if (!list.some((x) => x.role === role.name)) list.push({ role: role.name, note });
      }
    }
  }
  return map;
}

export function canonicalMonName(name, names) {
  const lower = name.toLowerCase();
  for (const n of names) if (n.toLowerCase() === lower) return n;
  return name;
}

// "Clean" result: removed mons drop out, added mons appear, notes applied.
// Used for export, counters and the detail drawer. The on-screen grid uses
// the status-aware model built in the Roles tab component, so removed mons
// can still render struck-through.
export function data(sections, pendingEdits, editMode) {
  if (!editMode || !pendingEdits.length) return sections;
  return sections.map((sec) => ({
    ...sec,
    roles: sec.roles.map((role) => {
      const key = sec.id + "|" + role.name;
      const removes = new Set(
        pendingEdits.filter((e) => e.type === "remove" && e.sectionId + "|" + e.roleName === key).map((e) => e.name),
      );
      const notes = {};
      pendingEdits
        .filter((e) => e.type === "note" && e.sectionId + "|" + e.roleName === key)
        .forEach((e) => {
          notes[e.name] = e.note;
        });
      const adds = pendingEdits.filter((e) => e.type === "add" && e.sectionId + "|" + e.roleName === key);
      if (!removes.size && !adds.length && !Object.keys(notes).length) return role;
      const mons = role.mons
        .filter((m) => !removes.has(monName(m)))
        .map((m) => {
          const name = monName(m);
          if (name in notes) return notes[name] ? { name, note: notes[name] } : name;
          return m;
        })
        .concat(adds.map((e) => (e.note ? { name: e.name, note: e.note } : e.name)));
      return { ...role, mons };
    }),
  }));
}

export function roleHasMon(sections, list, sectionId, roleName, name) {
  const lower = (name || "").toLowerCase();
  const baseRole = sections.find((s) => s.id === sectionId)?.roles.find((r) => r.name === roleName);
  const removed = list.some(
    (e) => e.type === "remove" && e.sectionId === sectionId && e.roleName === roleName && e.name.toLowerCase() === lower,
  );
  const baseHas = !!(baseRole && baseRole.mons.some((m) => monName(m).toLowerCase() === lower)) && !removed;
  const addHas = list.some(
    (e) => e.type === "add" && e.sectionId === sectionId && e.roleName === roleName && e.name.toLowerCase() === lower,
  );
  return baseHas || addHas;
}

export function isPendingAddFor(pendingEdits, sectionId, roleName, name) {
  return pendingEdits.some((e) => e.type === "add" && e.sectionId === sectionId && e.roleName === roleName && e.name === name);
}

export function currentNote(sections, pendingEdits, sectionId, roleName, name) {
  const ne = pendingEdits.find((e) => e.type === "note" && e.sectionId === sectionId && e.roleName === roleName && e.name === name);
  if (ne) return ne.note;
  const ad = pendingEdits.find((e) => e.type === "add" && e.sectionId === sectionId && e.roleName === roleName && e.name === name);
  if (ad) return ad.note || "";
  const baseRole = sections.find((s) => s.id === sectionId)?.roles.find((r) => r.name === roleName);
  const entry = baseRole?.mons.find((m) => monName(m) === name);
  return entry ? monNote(entry) : "";
}

function applyAdd(list, sectionId, roleName, name, note, canonicalize) {
  const canonical = canonicalize((name || "").trim());
  return [...list, { type: "add", sectionId, roleName, name: canonical, note: (note || "").trim() }];
}

function applyRemove(list, sectionId, roleName, name, isPendingAdd) {
  if (isPendingAdd) {
    return list.filter((e) => !(e.type === "add" && e.sectionId === sectionId && e.roleName === roleName && e.name === name));
  }
  const withoutNote = list.filter(
    (e) => !(e.type === "note" && e.sectionId === sectionId && e.roleName === roleName && e.name === name),
  );
  return [...withoutNote, { type: "remove", sectionId, roleName, name }];
}

// Below: each editing action returns { pendingEdits, toast } (toast is null
// when nothing needs announcing) so the hook can setState + persist + toast
// in one place, without duplicating the "already in this role" checks.

export function addMon(sections, pendingEdits, sectionId, roleName, rawName, note, canonicalize) {
  const name = (rawName || "").trim();
  if (!name) return { pendingEdits, toast: null };
  const canonical = canonicalize(name);
  if (roleHasMon(sections, pendingEdits, sectionId, roleName, canonical)) {
    return { pendingEdits, toast: `${canonical} is already in this role` };
  }
  return {
    pendingEdits: applyAdd(pendingEdits, sectionId, roleName, canonical, note, canonicalize),
    toast: null,
  };
}

export function removeMon(pendingEdits, sectionId, roleName, name, isPendingAdd) {
  return applyRemove(pendingEdits, sectionId, roleName, name, isPendingAdd);
}

export function undoRemove(pendingEdits, sectionId, roleName, name) {
  return pendingEdits.filter((e) => !(e.type === "remove" && e.sectionId === sectionId && e.roleName === roleName && e.name === name));
}

export function moveMon(sections, pendingEdits, src, name, note, isPendingAdd, dst, canonicalize) {
  if (src.sectionId === dst.sectionId && src.roleName === dst.roleName) {
    return { pendingEdits, toast: null };
  }
  const has = roleHasMon(sections, pendingEdits, dst.sectionId, dst.roleName, name);
  let list = pendingEdits;
  if (!has) list = applyAdd(list, dst.sectionId, dst.roleName, name, note, canonicalize);
  list = applyRemove(list, src.sectionId, src.roleName, name, isPendingAdd);
  const toast = has
    ? `${name} already in ${dst.roleName} — removed from ${src.roleName}`
    : `Moved ${name} → ${dst.roleName}`;
  return { pendingEdits: list, toast };
}

export function copyToRole(sections, pendingEdits, name, note, dst, canonicalize) {
  if (roleHasMon(sections, pendingEdits, dst.sectionId, dst.roleName, name)) {
    return { pendingEdits, toast: `${name} is already in ${dst.roleName}` };
  }
  return {
    pendingEdits: applyAdd(pendingEdits, dst.sectionId, dst.roleName, name, note, canonicalize),
    toast: `Copied ${name} → ${dst.roleName}`,
  };
}

// If it's a pending add, edits the add itself; if it's a base mon, stacks/
// updates a "note" edit (or drops it if the note goes back to the file's).
export function setMonNote(sections, pendingEdits, sectionId, roleName, name, rawNote) {
  const note = (rawNote || "").trim();
  const addIdx = pendingEdits.findIndex(
    (e) => e.type === "add" && e.sectionId === sectionId && e.roleName === roleName && e.name === name,
  );
  if (addIdx >= 0) {
    const next = pendingEdits.slice();
    next[addIdx] = { ...next[addIdx], note };
    return next;
  }
  const baseRole = sections.find((s) => s.id === sectionId)?.roles.find((r) => r.name === roleName);
  const entry = baseRole?.mons.find((m) => monName(m) === name);
  const baseNote = entry ? monNote(entry) : "";
  let next = pendingEdits.filter((e) => !(e.type === "note" && e.sectionId === sectionId && e.roleName === roleName && e.name === name));
  if (note !== baseNote) next = [...next, { type: "note", sectionId, roleName, name, note }];
  return next;
}
