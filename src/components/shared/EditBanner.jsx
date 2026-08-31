import "./Overlays.css";

export default function EditBanner({ tab, scopedPending, canExport, onDiscard, onExport, onExit }) {
  const editScopeLabel = tab === "vr" ? "Editing viability" : "Editing roles";
  const hasPending = scopedPending > 0;
  const pendingLabel = scopedPending === 0 ? "No changes yet" : `${scopedPending} pending change${scopedPending === 1 ? "" : "s"}`;

  return (
    <div className="edit-banner">
      <div className="edit-banner__row">
        <span style={{ fontWeight: 700 }}>{editScopeLabel}</span>
        <span className="edit-banner__sep" />
        <span>{pendingLabel}</span>
        <span className="edit-banner__sep" />
        <span className="edit-banner__note">Local draft — nothing is published; changes stay in your browser</span>
        <span className="edit-banner__spacer" />
        {hasPending && (
          <button className="edit-banner__btn" onClick={onDiscard}>
            Discard
          </button>
        )}
        {canExport && (
          <button className="edit-banner__btn edit-banner__btn--solid" onClick={onExport}>
            Review &amp; export
          </button>
        )}
        <button className="edit-banner__btn edit-banner__btn--exit" onClick={onExit}>
          Exit
        </button>
      </div>
    </div>
  );
}
