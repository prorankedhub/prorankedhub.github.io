import "./ExportDrawer.css";

export default function ExportDrawer({ open, onClose, tab, pendingLabel, printSummary, exportApi }) {
  if (!open) return null;
  const isVr = tab === "vr";
  const shareBlurb = isVr
    ? "Download a clean image of the full tier list — with your changes baked in — to drop into Discord or the forums, or copy it as a text list."
    : "Download a shareable image of what changed — drop it into Discord or the forums — or copy it as a plain text list.";

  return (
    <>
      <div className="export-scrim" onClick={onClose} />
      <aside className="export-drawer">
        <div className="export-drawer__head">
          <button className="export-drawer__close" onClick={onClose}>
            ✕
          </button>
          <div className="export-drawer__kicker">Propose changes</div>
          <h2 className="export-drawer__title">{pendingLabel}</h2>
          <p className="export-drawer__sub">{printSummary}</p>
        </div>
        <div className="export-drawer__body">
          <div className="export-step">
            <div className="export-step__head">
              <span className="export-step__num">1</span>
              <span className="export-step__title">Update the data file</span>
            </div>
            <p>
              Copy the file below, paste it over the file in the repo and commit. Role edits live in <b>roles-data.js</b>; tier changes live in <b>viability-data.js</b>.
            </p>
            <div className="export-step__actions">
              {!isVr && (
                <button className="export-btn export-btn--accent" onClick={exportApi.copyFileClick}>
                  Copy roles-data.js
                </button>
              )}
              {isVr && (
                <button className="export-btn export-btn--ink" onClick={exportApi.copyVrFileClick}>
                  Copy viability-data.js
                </button>
              )}
            </div>
          </div>

          <div className="export-step">
            <div className="export-step__head">
              <span className="export-step__num">2</span>
              <span className="export-step__title">
                Share a summary <span className="export-step__optional">(optional)</span>
              </span>
            </div>
            <p>{shareBlurb}</p>
            <div className="export-step__actions">
              <button className="export-btn export-btn--outline-accent" onClick={exportApi.downloadImageClick}>
                Download image
              </button>
              <button className="export-btn export-btn--outline-ink" onClick={exportApi.copyChangelogClick}>
                Copy text list
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span className="export-preview-label">Preview</span>
            <textarea readOnly className="export-preview" value={exportApi.changelog} />
          </div>
        </div>
      </aside>
    </>
  );
}
