/* =============================================================================
   CHANGELOG — builds the human-readable diff (edit-bar text, print sheet,
   share card) and the serializers that turn edited data back into the
   literal roles-data.js / viability-data.js source format.
   Pure functions.
   ========================================================================== */

import { monName } from "./rolesLogic.js";
import { vrBaseTierOf } from "./vrLogic.js";

export function buildChangelog(scope, { sections, pendingEdits, vr, vrDraft }) {
  const titleFor = (id) => (sections.find((s) => s.id === id) || {}).title || id;
  const roleLines = (scope === "vr" ? [] : pendingEdits).map((e) => {
    const where = `${e.roleName} (${titleFor(e.sectionId)})`;
    if (e.type === "add") return `+ ${e.note ? `${e.name} (${e.note})` : e.name} -> ${where}`;
    if (e.type === "remove") return `- ${e.name} -> ${where}`;
    return `~ ${e.name} note: ${e.note ? `"${e.note}"` : "(cleared)"} -> ${where}`;
  });

  const vrLines = [];
  if (scope !== "roles" && vrDraft) {
    for (let ti = 0; ti < vrDraft.length; ti++) {
      for (const name of vrDraft[ti].mons) {
        const b = vrBaseTierOf(vr, name);
        if (b == null) vrLines.push(`[VR] + ${name} -> ${vrDraft[ti].tier}`);
        else if (b !== ti) vrLines.push(`[VR] ~ ${name}: ${vr[b].tier} -> ${vrDraft[ti].tier}`);
      }
    }
    for (const bt of vr) {
      for (const name of bt.mons) {
        if (!vrDraft.some((t) => t.mons.includes(name))) vrLines.push(`[VR] - ${name} (was ${bt.tier})`);
      }
    }
  }

  const all = [...roleLines, ...vrLines];
  return all.length ? all.join("\n") : "No pending changes.";
}

export function changeCounts(pendingEdits) {
  const c = { add: 0, remove: 0, note: 0 };
  for (const e of pendingEdits) c[e.type === "add" ? "add" : e.type === "remove" ? "remove" : "note"]++;
  return c;
}

// Groups pendingEdits by section -> role, with a sprite URL and a +/-/~
// sign per mon, for the print sheet and the PNG share card.
export function printGroups(pendingEdits, sections, urlFor) {
  if (!pendingEdits.length) return [];
  const bySection = new Map();
  for (const e of pendingEdits) {
    const secTitle = (sections.find((s) => s.id === e.sectionId) || {}).title || e.sectionId;
    if (!bySection.has(e.sectionId)) bySection.set(e.sectionId, { title: secTitle, roles: new Map() });
    const roles = bySection.get(e.sectionId).roles;
    if (!roles.has(e.roleName)) roles.set(e.roleName, []);
    roles.get(e.roleName).push(e);
  }
  return [...bySection.values()].map((sec) => ({
    title: sec.title,
    roles: [...sec.roles.entries()].map(([roleName, edits]) => ({
      name: roleName,
      mons: edits.map((e) => ({
        name: e.name,
        url: urlFor(e.name),
        sign: e.type === "add" ? "+" : e.type === "remove" ? "−" : "~",
        signClass: e.type === "add" ? "add" : e.type === "remove" ? "remove" : "edit",
        note: e.type === "remove" ? "" : e.note || "",
      })),
    })),
  }));
}

export function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function serializeMon(m) {
  if (typeof m === "string") return JSON.stringify(m);
  return m.note ? `{ name: ${JSON.stringify(m.name)}, note: ${JSON.stringify(m.note)} }` : JSON.stringify(m.name);
}

function serializeRole(r) {
  const mons = r.mons.map((m) => serializeMon(m)).join(", ");
  return `    { name: ${JSON.stringify(r.name)}, move: ${JSON.stringify(r.move)}, mons: [${mons}] },`;
}

function serializeSection(s) {
  const roles = s.roles.map((r) => serializeRole(r)).join("\n");
  return `  { id: ${JSON.stringify(s.id)}, title: ${JSON.stringify(s.title)}, tag: ${JSON.stringify(s.tag)}, roles: [\n${roles}\n  ] },`;
}

// Prunes names not currently in the roster: removing a Pokémon from
// Viability already removes it from every role export too — no need to
// edit two files by hand.
export function serializeSections(sections, inRoster) {
  const pruned = sections.map((s) => ({
    ...s,
    roles: s.roles.map((r) => ({ ...r, mons: r.mons.filter((m) => inRoster(monName(m))) })),
  }));
  return "export const SECTIONS = [\n" + pruned.map((s) => serializeSection(s)).join("\n\n") + "\n];";
}

// Splices a freshly-serialized array between the `export const X = [ ... ];`
// markers of a raw source-file string, keeping everything else (comments,
// header) byte-identical. Used for both roles-data.js and viability-data.js.
export function spliceSourceArray(rawSource, exportName, serialized) {
  const startMarker = `export const ${exportName} = [`;
  const startIdx = rawSource.indexOf(startMarker);
  const endIdx = rawSource.indexOf("\n];", startIdx) + 3;
  return rawSource.slice(0, startIdx) + serialized + rawSource.slice(endIdx);
}
