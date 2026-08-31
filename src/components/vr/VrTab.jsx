import { useState } from "react";
import "./VrTab.css";
import "../shared/TopBar.css";
import "../shared/SectionLayout.css";
import SearchBox from "../shared/SearchBox.jsx";
import AddToTierModal from "./AddToTierModal.jsx";
import MonTile from "../shared/MonTile.jsx";
import { useScrollSpy } from "../../hooks/useScrollSpy.js";
import { useDragAutoScroll } from "../../hooks/useDragAutoScroll.js";
import { tierColorClass } from "../../lib/viewStyles.js";
import { vrBaseTierOf } from "../../lib/vrLogic.js";

const VR_DESC = {
  NEW: "Recently released",
  S: "Metagame-defining",
  "S-": "Premier threat",
  "A+": "Top-tier",
  A: "Excellent",
  "A-": "Very strong",
  "B+": "Strong",
  B: "Solid",
  "B-": "Reliable",
  "C+": "Situational",
  C: "Niche",
  "C-": "Fringe",
};

export default function VrTab({ vr, editMode, urlFor, onOpenMon }) {
  const [vq, setVq] = useState("");
  const [vrDragKey, setVrDragKey] = useState(null);
  const [vrDropKey, setVrDropKey] = useState(null);
  const [dragPayload, setDragPayload] = useState(null); // { fromIdx, name }
  const [pickerIdx, setPickerIdx] = useState(null);

  const spy = useScrollSpy(
    vr.vr.map((_, i) => i),
    "vrt-",
  );

  const query = vq.trim().toLowerCase();
  const working = vr.vrWorking;
  const dragging = !!vrDragKey;
  useDragAutoScroll(dragging);

  let shown = 0;
  let total = 0;
  const tiers = working
    .map((t, idx) => {
      let tierHasMatch = false;
      const items = t.mons.map((name) => {
        total++;
        const dim = query && !name.toLowerCase().includes(query);
        if (!dim) {
          shown++;
          tierHasMatch = true;
        }
        let status = "base";
        if (editMode) {
          const b = vrBaseTierOf(vr.vr, name);
          status = b == null ? "added" : b !== idx ? "edited" : "base";
        }
        const key = idx + "|" + name;
        return { name, dim, status, isDragSource: vrDragKey === key, key, isGhost: false };
      });
      // Mons cut from this tier during this edit — spliced back in at the
      // index they were removed from (not appended at the end), struck
      // through with an undo corner, mirroring the Roles tab's removed
      // status. Not counted in the "X ranked" stat line.
      if (editMode) {
        const ghostEntries = vr.removedNames.filter((r) => r.tierIdx === idx).sort((a, b) => a.index - b.index);
        ghostEntries.forEach((g, i) => {
          const dim = query && !g.name.toLowerCase().includes(query);
          if (!dim) tierHasMatch = true;
          const insertAt = Math.min(g.index + i, items.length);
          items.splice(insertAt, 0, { name: g.name, dim, status: "removed", isGhost: true });
        });
      }
      return {
        tier: t.tier,
        idx,
        items,
        hidden: query && !tierHasMatch,
        count: (query ? items.filter((m) => !m.isGhost && !m.dim).length : t.mons.length) + (t.mons.length === 1 ? " mon" : " mons"),
      };
    })
    .filter((t) => !t.hidden);

  const activeVr = spy.active || 0;

  return (
    <>
      <div className="topbar">
        <div className="topbar-row">
          <SearchBox value={vq} onChange={setVq} statLine={query ? `${shown} shown` : `${total} ranked`} />
        </div>
      </div>

      {editMode && (
        <div className="edit-legend">
          <div className="edit-legend__inner">
            <span className="edit-legend__title">You're editing</span>
            <span className="edit-legend__item">
              <i className="edit-legend__swatch edit-legend__swatch--added" />Added
            </span>
            <span className="edit-legend__item">
              <i className="edit-legend__swatch edit-legend__swatch--removed" />Removed
            </span>
            <span className="edit-legend__item">
              <i className="edit-legend__swatch edit-legend__swatch--note" />Moved tier
            </span>
            <span className="edit-legend__spacer" />
            <span className="edit-legend__hint">Drag between tiers to re-rank · + adds to a tier · ✕ removes</span>
          </div>
        </div>
      )}

      <div className="roles-wrap">
        <aside className="cat-rail cat-rail__panel">
          <div className="cat-rail__label">Tiers</div>
          {vr.vr.map((t, i) => (
            <a
              key={t.tier}
              className={"vr-nav-row" + (activeVr === i ? " vr-nav-row--active" : "")}
              onClick={() => spy.scrollTo(i)}
            >
              <span className={"vr-nav-row__label " + tierColorClass(t.tier)}>{t.tier}</span>
              <span className="vr-nav-row__desc">{VR_DESC[t.tier] || ""}</span>
              <span className="vr-nav-row__count">{t.mons.length}</span>
            </a>
          ))}
        </aside>

        <div className="roles-content">
          {tiers.map((t) => (
            <section key={t.idx} id={"vrt-" + t.idx} style={{ padding: "12px 0 4px", scrollMarginTop: 68 }}>
              <div className="vr-tier-head">
                <span className={"vr-tier-head__label " + tierColorClass(t.tier)} style={{ fontSize: t.tier === "NEW" ? 16 : 26 }}>
                  {t.tier}
                </span>
                <span className="vr-tier-head__title">Rank</span>
                <span className="vr-tier-head__spacer" />
                <span className="vr-tier-head__count">{t.count}</span>
              </div>
              <div
                className={"mon-grid" + (vrDropKey === t.idx ? " mon-grid--drop" : dragging ? " mon-grid--dragging" : "")}
                onDragOver={(e) => {
                  if (!vrDragKey) return;
                  e.preventDefault();
                  if (vrDropKey !== t.idx) setVrDropKey(t.idx);
                }}
                onDrop={(e) => {
                  if (!vrDragKey) return;
                  e.preventDefault();
                  const d = dragPayload;
                  setDragPayload(null);
                  setVrDragKey(null);
                  setVrDropKey(null);
                  if (d) vr.moveTo(d.fromIdx, t.idx, d.name, null);
                }}
              >
                {t.items.map((mon) =>
                  mon.isGhost ? (
                    <MonTile
                      key={"ghost-" + mon.name}
                      name={mon.name}
                      status="removed"
                      dim={mon.dim}
                      url={urlFor(mon.name)}
                      size={44}
                      editMode={editMode}
                      draggable={false}
                      onClick={() => vr.undoRemove(mon.name)}
                      onCornerClick={() => vr.undoRemove(mon.name)}
                    />
                  ) : (
                    <MonTile
                      key={mon.name}
                      name={mon.name}
                      status={mon.status}
                      dim={mon.dim}
                      url={urlFor(mon.name)}
                      size={44}
                      editMode={editMode}
                      draggable={editMode}
                      isDragSource={mon.isDragSource}
                      onClick={() => onOpenMon(mon.name)}
                      onDragStart={(e) => {
                        try {
                          e.dataTransfer.effectAllowed = "move";
                          e.dataTransfer.setData("text/plain", mon.name);
                        } catch {
                          /* ignore */
                        }
                        setDragPayload({ fromIdx: t.idx, name: mon.name });
                        setVrDragKey(mon.key);
                      }}
                      onDragEnd={() => {
                        setDragPayload(null);
                        setVrDragKey(null);
                        setVrDropKey(null);
                      }}
                      onDragOverTile={(e) => {
                        if (!vrDragKey) return;
                        e.preventDefault();
                        e.stopPropagation();
                        if (vrDropKey !== t.idx) setVrDropKey(t.idx);
                      }}
                      onDropTile={(e) => {
                        if (!vrDragKey) return;
                        e.preventDefault();
                        e.stopPropagation();
                        const d = dragPayload;
                        setDragPayload(null);
                        setVrDragKey(null);
                        setVrDropKey(null);
                        if (d) vr.moveTo(d.fromIdx, t.idx, d.name, mon.name);
                      }}
                      onCornerClick={() => vr.remove(t.idx, mon.name)}
                    />
                  ),
                )}
                {editMode && (
                  <button className="mon-grid__add" title="Add Pokémon" onClick={() => setPickerIdx(t.idx)}>
                    +
                  </button>
                )}
              </div>
            </section>
          ))}

          {query && shown === 0 && (
            <div className="roles-empty">
              <p className="roles-empty__title">Nothing found</p>
              <p className="roles-empty__sub">No Pokémon matches "{vq}"</p>
            </div>
          )}
        </div>
      </div>

      {editMode && pickerIdx != null && working[pickerIdx] && (
        <AddToTierModal
          tierLabel={working[pickerIdx].tier}
          onAdd={(name) => vr.add(pickerIdx, name)}
          onClose={() => setPickerIdx(null)}
        />
      )}
    </>
  );
}
