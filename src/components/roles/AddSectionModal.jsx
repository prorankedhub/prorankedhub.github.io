import { useState } from "react";
import "../shared/Overlays.css";

export default function AddSectionModal({ onAdd, onClose }) {
  const [title, setTitle] = useState("");

  const submit = () => {
    if (!title.trim()) return;
    onAdd(title);
    onClose();
  };

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__body">
          <h3 className="modal__title">New category</h3>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Category name (e.g. Screeners)"
            spellCheck={false}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
              if (e.key === "Escape") onClose();
            }}
            style={{ width: "100%", background: "var(--field)", border: "1px solid var(--line)", padding: "9px 10px", fontFamily: "'Space Mono', monospace", fontSize: 13, outline: "none" }}
          />
        </div>
        <div className="modal__actions">
          <button className="modal__btn modal__btn--cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="modal__btn modal__btn--confirm" onClick={submit}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
