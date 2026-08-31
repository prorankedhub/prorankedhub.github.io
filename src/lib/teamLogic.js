/* =============================================================================
   TEAM LOGIC — Team Builder: 6 slots, role-coverage checklist, speed list.
   Pure functions. The useTeam hook owns setState + the "pro-roles-team"
   localStorage key + toasts.
   ========================================================================== */

export const TEAM_KEY = "pro-roles-team";

export const TEAM_CHECKS = [
  { id: "hazards", label: "Entry hazards", tip: "A Pokémon that sets Stealth Rock or Spikes to chip the opponent's switch-ins." },
  { id: "control", label: "Hazard removal", tip: "Defog or Rapid Spin to clear hazards off your own side." },
  { id: "walls", label: "Defensive wall", tip: "A physical or special wall that can take hits and stall threats out." },
  { id: "setup", label: "Setup sweeper", tip: "A win condition that boosts its stats to sweep late-game." },
  { id: "priority", label: "Priority", tip: "A move that always moves first, to pick off faster or weakened threats." },
  { id: "pivots", label: "Pivot", tip: "U-turn, Volt Switch or Teleport to bring teammates in safely." },
  { id: "choice", label: "Speed control", tip: "Covered by a Choice Scarf user, a paralysis spreader, or a Pokémon with 111+ base Speed." },
  { id: "status", label: "Status", tip: "Spreads paralysis, burn or poison to cripple the opposing team." },
];

// Members: { name, roles: ["sectionId|roleName", ...] }. Back-compat with the
// old format (a plain array of names). Coverage only counts ASSIGNED roles —
// a Pokémon can fill many roles, but only the ones you tick actually run.
export function normTeam(list) {
  return (list || []).map((m) => (typeof m === "string" ? { name: m, roles: [] } : { name: m.name, roles: m.roles || [] }));
}

export function teamNames(team) {
  return team.map((m) => m.name);
}

// Returns { team, toast, openAssignIdx } — openAssignIdx is the index to
// open the role-assignment modal for, mirroring the original UX of chaining
// "add to team" straight into "assign roles".
export function addToTeam(team, name) {
  if (teamNames(team).includes(name)) return { team, toast: `${name} is already on the team`, openAssignIdx: null };
  if (team.length >= 6) return { team, toast: "Team is full (6)", openAssignIdx: null };
  const idx = team.length;
  return { team: [...team, { name, roles: [] }], toast: null, openAssignIdx: idx };
}

export function removeFromTeam(team, name) {
  return team.filter((m) => m.name !== name);
}

export function toggleTeamRole(team, idx, key) {
  const list = team.slice();
  const m = list[idx];
  if (!m) return team;
  const roles = m.roles.includes(key) ? m.roles.filter((k) => k !== key) : [...m.roles, key];
  list[idx] = { ...m, roles };
  return list;
}

// One row per TEAM_CHECKS entry: { ...check, covered, by (names covering it) }.
// "choice" (speed control) is special-cased: covered by an assigned Scarf
// role, an assigned paralysis-status role, OR any member with base Speed >= 111.
export function teamCoverage(team, speedsAll) {
  return TEAM_CHECKS.map((c) => {
    let by;
    if (c.id === "choice") {
      by = team
        .filter(
          (m) =>
            m.roles.some((k) => k.split("|")[0] === "choice" && /scarf/i.test(k)) ||
            m.roles.some((k) => k.split("|")[0] === "status" && /paralyz/i.test(k)) ||
            (speedsAll[m.name] != null && speedsAll[m.name] >= 111),
        )
        .map((m) => m.name);
    } else {
      by = team.filter((m) => m.roles.some((k) => k.split("|")[0] === c.id)).map((m) => m.name);
    }
    return { ...c, covered: by.length > 0, by };
  });
}

// Team members sorted by max Speed, descending — only those with a known base.
export function teamSpeedList(team, speedsAll, speedAt) {
  return team
    .filter((m) => speedsAll[m.name] != null)
    .map((m) => ({ name: m.name, base: speedsAll[m.name], spd: speedAt(speedsAll[m.name], "max") }))
    .sort((a, b) => b.spd - a.spd);
}
