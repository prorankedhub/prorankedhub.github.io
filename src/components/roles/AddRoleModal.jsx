import { useState } from "react";
import "../shared/Overlays.css";

export default function AddRoleModal({ sectionTitle, onAdd, onClose }) {
  const [name, setName] = useState("");
  const [move, setMove] = useState("");

  const submit = () => {
    if (!name.trim()) return;
    onAdd(name, move);
    onClose();
  };

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__body">
          <h3 className="modal__title">New role in {sectionTitle}</h3>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Role name (e.g. Trick Room Setters)"
            spellCheck={false}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
              if (e.key === "Escape") onClose();
            }}
            style={{ width: "100%", background: "var(--field)", border: "1px solid var(--line)", padding: "9px 10px", fontFamily: "'Space Mono', monospace", fontSize: 13, outline: "none", marginBottom: 8 }}
          />
          <input
            value={move}
            onChange={(e) => setMove(e.target.value)}
            placeholder="Move/mechanic label (optional)"
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
