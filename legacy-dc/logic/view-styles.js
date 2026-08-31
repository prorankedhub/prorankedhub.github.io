/* =============================================================================
   VIEW STYLES — geração de strings de CSS a partir de status/flags.
   Funções puras (sem estado): o mesmo input sempre produz o mesmo estilo.
   ========================================================================== */

// ---- estilos de tile por status (base / added / removed / edited) ----
export function tileStyle(status, dim) {
  const b = "position:relative;display:flex;flex-direction:column;align-items:center;gap:5px;width:72px;padding:9px 4px 8px;cursor:pointer;transition:transform .14s ease,border-color .14s,background .14s,opacity .18s;font-family:inherit;";
  const skin = {
    base: "background:var(--card);border:1px solid var(--line);",
    added: "background:var(--green-bg);border:1.5px solid var(--green);",
    removed: "background:var(--red-bg);border:1.5px solid var(--accent);opacity:.9;",
    edited: "background:var(--card);border:1.5px solid var(--ink);",
  }[status] || "background:var(--card);border:1px solid var(--line);";
  return b + skin + (dim ? "opacity:.16;pointer-events:none;" : "");
}

export function hoverFor(status) {
  if (status === "added") return "transform:translateY(-3px);border-color:var(--green);background:var(--field);";
  return "transform:translateY(-3px);border-color:var(--accent);background:var(--field);";
}

export function nameStyle(status) {
  const s = "font-family:'Space Mono',monospace;font-size:8px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;max-width:64px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1;";
  return s + (status === "removed" ? "color:var(--accent);text-decoration:line-through;" : "color:var(--muted);");
}

export function noteStyle(status) {
  const s = "font-family:'Space Mono',monospace;font-size:7.5px;font-weight:700;letter-spacing:.02em;text-transform:uppercase;max-width:66px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1;";
  return s + (status === "added" ? "color:var(--green);" : "color:var(--accent);") + (status === "removed" ? "text-decoration:line-through;" : "");
}

export function badgeFor(status) {
  const map = { added: ["NEW", "var(--green)"], removed: ["CUT", "var(--accent)"], edited: ["NOTE", "var(--ink)"], moved: ["MOVED", "var(--ink)"] };
  const b = map[status];
  if (!b) return null;
  return { text: b[0], style: `position:absolute;top:-8px;left:-8px;padding:1px 5px;font-family:'Space Mono',monospace;font-size:7.5px;font-weight:700;letter-spacing:.06em;color:#fff;background:${b[1]};border:1.5px solid var(--paper);line-height:1.35;` };
}

export function cornerFor(status) {
  const red = "position:absolute;top:-7px;right:-7px;width:18px;height:18px;border-radius:50%;background:var(--accent);color:var(--paper);border:1.5px solid var(--paper);font-family:'Space Mono',monospace;font-size:10px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;";
  if (status === "removed") return { label: "↺", title: "Undo remove", style: red.replace("var(--accent)", "var(--green)") };
  return { label: "✕", title: "Remove", style: red };
}

export function chipStyle(active) {
  return "font-family:'Space Mono',monospace;font-size:12px;font-weight:" + (active ? "700" : "400") +
    ";letter-spacing:.04em;text-transform:uppercase;padding:5px 1px;background:none;border:none;border-bottom:2px solid " +
    (active ? "var(--accent)" : "transparent") + ";cursor:pointer;transition:color .12s,border-color .12s;color:" +
    (active ? "var(--accent)" : "var(--muted)") + ";";
}

export function tabBtn(active) {
  return "font-family:'Space Mono',monospace;font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;white-space:nowrap;line-height:1;padding:11px 18px;cursor:pointer;transition:background .12s,color .12s,border-color .12s;border:1.5px solid var(--ink);" + (active ? "background:var(--ink);color:var(--paper);" : "background:transparent;color:var(--ink);");
}

export function vrTierColor(tier) {
  if (tier === "NEW") return { bg: "var(--green)", fg: "var(--paper)" };
  const L = tier[0];
  if (L === "S") return { bg: "var(--accent)", fg: "var(--paper)" };
  if (L === "A") return { bg: "var(--ink)", fg: "var(--paper)" };
  if (L === "B") return { bg: "var(--muted)", fg: "var(--paper)" };
  return { bg: "var(--tier-c)", fg: "var(--ink)" }; // C
}

export function catRow(active) {
  return "display:block;padding:6px 0 6px 12px;font-size:13.5px;font-weight:600;letter-spacing:-.01em;cursor:pointer;border-left:2px solid " + (active ? "var(--accent)" : "transparent") + ";color:" + (active ? "var(--ink)" : "var(--muted)") + ";transition:color .12s,border-color .12s;";
}
