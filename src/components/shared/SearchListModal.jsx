import "./Overlays.css";
import SpriteImg from "./SpriteImg.jsx";

// Generic "search a Pokémon, pick one" modal — used for the VR "add to tier"
// picker and the Team "add to team" picker (same shape, different data).
export default function SearchListModal({ title, q, onQChange, items, onClose, disabledLabel = "here" }) {
  const empty = items.length === 0;
  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" style={{ width: 440, maxHeight: "82vh", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: "22px 24px 16px", borderBottom: "1.5px solid var(--ink)" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 10 }}>
            {title}
          </div>
          <div style={{ display: "flex", alignItems: "center", borderBottom: "1.5px solid var(--ink)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.4">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              autoFocus
              value={q}
              onChange={(e) => onQChange(e.target.value)}
              placeholder="Search a Pokémon…"
              spellCheck={false}
              style={{ flex: 1, background: "transparent", border: "none", fontFamily: "'Space Mono', monospace", fontSize: 13, padding: "8px 4px 8px 9px", outline: "none", color: "var(--ink)" }}
            />
          </div>
        </div>
        <div style={{ overflowY: "auto", padding: "8px 0" }}>
          {items.map((r) => (
            <button
              key={r.name}
              disabled={r.disabled}
              onClick={() => !r.disabled && r.onClick()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                padding: "8px 24px",
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontSize: 14,
                cursor: r.disabled ? "default" : "pointer",
                color: r.disabled ? "var(--faint)" : "var(--ink)",
              }}
            >
              <SpriteImg src={r.url} alt={r.name} size={30} />
              <span style={{ flex: 1 }}>{r.name}</span>
              {r.disabled && (
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".04em" }}>
                  {disabledLabel}
                </span>
              )}
            </button>
          ))}
          {empty && (
            <div style={{ padding: 24, textAlign: "center", fontFamily: "'Space Mono', monospace", fontSize: 12, color: "var(--muted)" }}>
              No Pokémon matches "{q}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
