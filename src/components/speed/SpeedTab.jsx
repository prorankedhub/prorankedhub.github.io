import { useMemo, useState } from "react";
import "./SpeedTab.css";
import "../shared/TopBar.css";
import SearchBox from "../shared/SearchBox.jsx";
import SpriteImg from "../shared/SpriteImg.jsx";
import { SPEED_COLS, speedAt } from "../../lib/speedCalc.js";

export default function SpeedTab({ speeds, speedBusy, inRoster, urlFor, onOpenMon }) {
  const [sq, setSq] = useState("");
  const [sortDir, setSortDir] = useState(-1);
  // Only "base" is sortable — the other columns are all monotonic
  // multipliers of it, so sorting by them would just reproduce the same
  // order as sorting by base (modulo rounding noise).
  const sortKey = "base";

  const query = sq.trim().toLowerCase();

  const rows = useMemo(() => {
    const list = Object.keys(speeds)
      .filter((name) => inRoster(name))
      .map((name) => {
        const base = speeds[name];
        const vals = {};
        for (const c of SPEED_COLS) vals[c.id] = speedAt(base, c.id);
        return { name, base, url: urlFor(name), vals };
      });
    list.sort((a, b) => (a.vals[sortKey] - b.vals[sortKey]) * sortDir || b.vals.max - a.vals.max || a.name.localeCompare(b.name));
    return list;
  }, [speeds, inRoster, urlFor, sortKey, sortDir]);

  const shown = rows.filter((r) => !query || r.name.toLowerCase().includes(query)).length;
  const statLine = speedBusy ? "loading…" : query ? `${shown} shown` : `${rows.length} Pokémon`;
  const arrow = sortDir < 0 ? "▼" : "▲";

  const toggleSortDir = () => setSortDir((prevDir) => -prevDir);

  return (
    <>
      <div className="topbar">
        <div className="topbar-row">
          <nav className="cat-nav">
            <span className="cat-nav__label">Speed tiers</span>
          </nav>
          <SearchBox value={sq} onChange={setSq} statLine={statLine} />
        </div>
      </div>

      <div style={{ padding: "26px 0 6px" }}>
        <div className="speed-scroll">
          <div className="speed-inner">
            <div className="speed-head">
              <span className="speed-head__spacer" />
              <span className="speed-head__label">Pokémon</span>
              {SPEED_COLS.map((c) => {
                const sortable = c.id === "base";
                const active = sortKey === c.id;
                return (
                  <span
                    key={c.id}
                    className={"speed-col-head" + (active ? " speed-col-head--active" : "") + (sortable ? "" : " speed-col-head--static")}
                    title={c.hint}
                    onClick={sortable ? toggleSortDir : undefined}
                  >
                    {c.label} {active ? arrow : ""}
                  </span>
                );
              })}
            </div>
            <div className="speed-rows">
              {rows.map((r) => {
                const dim = query && !r.name.toLowerCase().includes(query);
                return (
                  <div key={r.name} className={"speed-row" + (dim ? " speed-row--dim" : "")} title={r.name} onClick={() => onOpenMon(r.name)}>
                    <SpriteImg src={r.url} alt={r.name} size={40} />
                    <span className="speed-name">{r.name}</span>
                    {SPEED_COLS.map((c) => (
                      <span key={c.id} className={"speed-cell" + (c.id === sortKey ? " speed-cell--active" : c.id === "base" ? " speed-cell--base" : "")}>
                        <i className="cell-lbl">{c.label}</i>
                        {r.vals[c.id]}
                      </span>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="speed-legend">
          <span>All values calculated at level 100</span>
          <span className="sl-long" style={{ textTransform: "none", letterSpacing: 0 }}>
            +Spe Max = 252 EV, +nature · Min = 0 IV/−nature (Trick Room) · 1.5× = Choice Scarf or +1 boost
          </span>
          <span style={{ flex: 1 }} />
          <span style={{ textTransform: "none", letterSpacing: 0 }}>Tap a Pokémon to see every role it fills.</span>
        </div>

        {query && shown === 0 && (
          <div style={{ padding: "70px 20px", textAlign: "center" }}>
            <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 26, margin: "0 0 6px", letterSpacing: "-.02em" }}>Nothing found</p>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "var(--muted)", margin: 0 }}>No Pokémon matches "{sq}"</p>
          </div>
        )}
      </div>
    </>
  );
}
