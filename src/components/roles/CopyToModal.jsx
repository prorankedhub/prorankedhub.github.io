import { useState } from "react";
import "../shared/Overlays.css";

export default function CopyToModal({ copyPicker, sections, onClose, onPick, roleHasMon }) {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  const groups = sections
    .map((s) => {
      const roles = s.roles
        .filter((r) => !query || r.name.toLowerCase().includes(query) || s.title.toLowerCase().includes(query))
        .map((r) => {
          const hasIt = roleHasMon(s.id, r.name, copyPicker.name);
          const isFrom = s.id === copyPicker.fromSection && r.name === copyPicker.fromRole;
          return { name: r.name, hasIt, disabled: hasIt || isFrom };
        });
      return { title: s.title, roles };
    })
    .filter((g) => g.roles.length);
  const empty = groups.every((g) => g.roles.length === 0);

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" style={{ width: 460, maxHeight: "82vh", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: "22px 24px 16px", borderBottom: "1.5px solid var(--ink)" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 10 }}>
            Copy {copyPicker.name} to
          </div>
          <div style={{ display: "flex", alignItems: "center", borderBottom: "1.5px solid var(--ink)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.4">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter roles…"
              spellCheck={false}
              style={{ flex: 1, background: "transparent", border: "none", fontFamily: "'Space Mono', monospace", fontSize: 13, padding: "8px 4px 8px 9px", outline: "none", color: "var(--ink)" }}
            />
          </div>
        </div>
        <div style={{ overflowY: "auto", padding: "8px 0" }}>
          {groups.map((g) => (
            <div key={g.title}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9.5, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--muted)", padding: "10px 24px 5px" }}>
                {g.title}
              </div>
              {g.roles.map((r) => (
                <button
                  key={r.name}
                  disabled={r.disabled}
                  onClick={() => !r.disabled && onPick(sections.find((s) => s.title === g.title).id, r.name)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    width: "100%",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    padding: "9px 24px",
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    fontSize: 14,
                    cursor: r.disabled ? "default" : "pointer",
                    color: r.disabled ? "var(--faint)" : "var(--ink)",
                  }}
                >
                  <span>{r.name}</span>
                  {r.hasIt && (
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".04em" }}>
                      already here
                    </span>
                  )}
                </button>
              ))}
            </div>
          ))}
          {empty && (
            <div style={{ padding: 24, textAlign: "center", fontFamily: "'Space Mono', monospace", fontSize: 12, color: "var(--muted)" }}>
              No role matches "{q}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
