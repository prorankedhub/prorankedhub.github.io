/* =============================================================================
   VIEW STYLES — small pure helpers that pick a CSS class/label from a mon
   status or tier letter. The actual rules live in src/styles/tiles.css;
   these just decide *which* class applies, so components can write
   `className={cx("mon-tile", statusClass(status))}` instead of duplicating
   this branching in every tile component.
   ========================================================================== */

export function badgeFor(status) {
  const map = { added: "NEW", removed: "CUT", edited: "NOTE", moved: "MOVED" };
  const text = map[status];
  if (!text) return null;
  return { text, className: `mon-badge mon-badge--${status}` };
}

export function cornerFor(status) {
  if (status === "removed") return { label: "↺", title: "Undo remove", className: "mon-corner mon-corner--undo" };
  return { label: "✕", title: "Remove", className: "mon-corner" };
}

export function tierColorClass(tier) {
  if (tier === "NEW") return "tier-color--new";
  const L = tier[0];
  if (L === "S") return "tier-color--s";
  if (L === "A") return "tier-color--a";
  if (L === "B") return "tier-color--b";
  return "tier-color--c";
}
