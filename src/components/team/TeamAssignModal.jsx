import "../shared/Overlays.css";
import SpriteImg from "../shared/SpriteImg.jsx";
import { monRoleMap } from "../../lib/rolesLogic.js";

export default function TeamAssignModal({ idx, member, data, urlFor, onToggle, onClose }) {
  const map = monRoleMap(data);
  const secs = map[member.name] || {};
  const groups = Object.keys(secs).map((sid) => ({
    title: secs[sid].title.toUpperCase(),
    roles: secs[sid].roles.map((r) => {
      const key = sid + "|" + r.role;
      const on = member.roles.includes(key);
      return { key, label: r.role, on };
    }),
  }));
  const empty = groups.every((g) => g.roles.length === 0);

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" style={{ width: 440, maxHeight: "82vh", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ position: "relative", padding: "22px 24px 18px", borderBottom: "1.5px solid var(--ink)", display: "flex", alignItems: "center", gap: 14 }}>
          <SpriteImg src={urlFor(member.name)} alt={member.name} size={48} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--accent)" }}>Roles it runs</div>
            <h3 style={{ margin: "3px 0 0", fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 21, letterSpacing: "-.02em" }}>{member.name}</h3>
          </div>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10.5, color: "var(--muted)" }}>{member.roles.length} assigned</span>
        </div>
        <div style={{ overflowY: "auto", padding: "8px 0 12px" }}>
          {groups.map((g) => (
            <div key={g.title}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9.5, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--muted)", padding: "10px 24px 5px" }}>
                {g.title}
              </div>
              {g.roles.map((r) => (
                <button
                  key={r.key}
                  onClick={() => onToggle(idx, r.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    width: "100%",
                    textAlign: "left",
                    padding: "9px 24px",
                    background: r.on ? "var(--green-bg)" : "none",
                    border: "none",
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    fontSize: 14,
                    fontWeight: r.on ? 600 : 400,
                    cursor: "pointer",
                    color: "var(--ink)",
                  }}
                >
                  <span>{r.label}</span>
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 11,
                      fontWeight: 700,
                      color: r.on ? "var(--paper)" : "var(--muted)",
                      background: r.on ? "var(--green)" : "transparent",
                      border: `1px solid ${r.on ? "var(--green)" : "var(--rule)"}`,
                    }}
                  >
                    {r.on ? "✓" : "+"}
                  </span>
                </button>
              ))}
            </div>
          ))}
          {empty && (
            <div style={{ padding: 24, textAlign: "center", fontFamily: "'Space Mono', monospace", fontSize: 12, color: "var(--muted)" }}>
              This Pokémon isn't listed in any role yet.
            </div>
          )}
        </div>
        <div style={{ padding: "12px 24px 18px", borderTop: "1px solid var(--rule)", display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{ background: "var(--ink)", color: "var(--paper)", border: "none", padding: "9px 18px", fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em", cursor: "pointer" }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
