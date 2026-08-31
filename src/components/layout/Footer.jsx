// Update this by hand whenever the underlying role/tier data changes.
const META_DATE = "August 2026";

export default function Footer({ tab, editMode, onEnterEdit }) {
  const showEditBtn = !editMode && (tab === "roles" || tab === "vr");
  const enterEditLabel = tab === "vr" ? "Propose ranking changes →" : "Propose your changes →";

  return (
    <footer style={{ maxWidth: 1180, margin: "20px auto 0", padding: "0 40px", fontFamily: "'Space Mono', monospace", color: "var(--muted)", fontSize: 11.5, lineHeight: 1.7, letterSpacing: ".02em" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, fontSize: 10.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", flexShrink: 0 }} />
        <span style={{ color: "var(--ink)" }}>Meta updated {META_DATE}</span>
      </div>
      <p style={{ margin: 0 }}>
        Adapted from several Smogon SM OU threads, filtered for PRO availability — adjust the lists as the metagame shifts. Sprites from the PMD Sprites Repository (sprites.pmdcollab.org). Click a Pokémon to see every role it fills.
      </p>
      {showEditBtn && (
        <>
          <button
            onClick={() => onEnterEdit(tab)}
            style={{ marginTop: 16, background: "none", border: "1.5px solid var(--accent)", color: "var(--accent)", padding: "8px 16px", fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", cursor: "pointer" }}
          >
            {enterEditLabel}
          </button>
          <p style={{ margin: "9px 0 0", fontSize: 11, color: "var(--muted)", letterSpacing: 0 }}>
            Edits stay in your browser — you'll get a file to send a maintainer. Nothing on the live site changes.
          </p>
        </>
      )}
    </footer>
  );
}
