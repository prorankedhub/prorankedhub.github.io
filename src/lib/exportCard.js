/* =============================================================================
   EXPORT CARD — builds the offscreen HTML poster captured to PNG via
   html-to-image. No sprites go through the live <img> tags here: the sprite
   host isn't CORS-enabled, so export renders route through an image proxy
   instead (images.weserv.nl) — only for this feature, never on-screen.
   Pure functions; the useExport hook owns the actual DOM/canvas capture.
   ========================================================================== */

import { esc, printGroups } from "./changelog.js";

export function proxUrl(url) {
  return "https://images.weserv.nl/?url=" + encodeURIComponent(url.replace(/^https?:\/\//, ""));
}

export function spriteTile(name, note, sign, urlFor) {
  const s = sign
    ? `<span style="position:absolute;top:-7px;left:-7px;padding:1px 5px;font-family:'Space Mono',monospace;font-size:8px;font-weight:700;letter-spacing:.05em;color:#fff;background:${sign[1]};border:1.5px solid #f1ece1;line-height:1.4;">${sign[0]}</span>`
    : "";
  const nt = note
    ? `<span style="font-family:'Space Mono',monospace;font-size:7.5px;font-weight:700;text-transform:uppercase;color:#cf3a22;max-width:66px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1;">${esc(note)}</span>`
    : "";
  return `<div style="position:relative;display:flex;flex-direction:column;align-items:center;gap:4px;width:72px;padding:8px 4px 7px;background:#f7f3ea;border:1px solid #ded6c6;box-sizing:border-box;">${s}<img crossorigin="anonymous" src="${proxUrl(urlFor(name))}" style="width:46px;height:46px;object-fit:contain;image-rendering:pixelated;">
      <span style="font-family:'Space Mono',monospace;font-size:8px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:#7a7263;max-width:66px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1;">${esc(name)}</span>${nt}</div>`;
}

function wrap(inner, kicker, title) {
  return `
      <div style="width:760px;background:#f1ece1;color:#1b1917;font-family:'Space Grotesk',system-ui,sans-serif;padding:44px 48px;box-sizing:border-box;">
        <div style="border-top:7px solid #cf3a22;padding-top:16px;margin-bottom:26px;">
          <div style="font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#cf3a22;margin-bottom:9px;">${kicker}</div>
          <div style="font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:38px;line-height:.95;letter-spacing:-.03em;">${title}</div>
        </div>
        ${inner}
        <div style="margin-top:30px;padding-top:14px;border-top:1.5px solid #1b1917;font-family:'Space Mono',monospace;font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:#7a7263;display:flex;justify-content:space-between;">
          <span>Pokémon Revolution Online · Ranked</span><span>${esc(new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }))}</span>
        </div>
      </div>`;
}

// tab === "vr": renders the whole tier list. Otherwise: the pending-edits
// changelog grouped by section/role (same shape as the print sheet).
export function shareCardHTML({ tab, vrWorking, vrTierColorOf, pendingEdits, sections, urlFor }) {
  if (tab === "vr") {
    const tiers = vrWorking;
    const rows = tiers
      .map((t) => {
        const col = vrTierColorOf(t.tier);
        const tiles = t.mons.map((n) => spriteTile(n, "", null, urlFor)).join("");
        const emptyMark = `<span style="color:#7a7263;font-family:'Space Mono',monospace;font-size:12px;">—</span>`;
        return `<div style="display:flex;gap:14px;align-items:flex-start;padding:12px 0;border-bottom:1px solid #ded6c6;">
            <div style="flex-shrink:0;width:52px;font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:26px;line-height:1;letter-spacing:-.02em;color:${col.bg};padding-top:6px;">${esc(t.tier)}</div>
            <div style="flex:1;display:flex;flex-wrap:wrap;gap:6px;">${tiles || emptyMark}</div>
          </div>`;
      })
      .join("");
    return wrap(`<div>${rows}</div>`, "Pokémon Revolution Online · Ranked", "Viability Rankings");
  }

  const groups = printGroups(pendingEdits, sections, urlFor);
  if (!groups.length) {
    return wrap(`<p style="font-family:'Space Mono',monospace;font-size:13px;color:#7a7263;">No pending changes.</p>`, "Role Compendium", "Suggested Changes");
  }
  const sign = { add: ["+", "#2e7d32"], remove: ["−", "#cf3a22"], edit: ["~", "#1b1917"] };
  const secs = groups
    .map((g) => {
      const roles = g.roles
        .map((r) => {
          const items = r.mons.map((m) => spriteTile(m.name, m.note, sign[m.signClass] || sign.edit, urlFor)).join("");
          return `<div style="padding:9px 0;"><div style="font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#7a7263;margin-bottom:7px;">${esc(r.name)}</div><div style="display:flex;flex-wrap:wrap;gap:6px;">${items}</div></div>`;
        })
        .join("");
      return `<div style="margin-bottom:18px;"><div style="font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:20px;letter-spacing:-.02em;padding-bottom:7px;border-bottom:1.5px solid #1b1917;margin-bottom:4px;">${esc(g.title)}</div>${roles}</div>`;
    })
    .join("");
  return wrap(secs, "Role Compendium", "Suggested Changes");
}
