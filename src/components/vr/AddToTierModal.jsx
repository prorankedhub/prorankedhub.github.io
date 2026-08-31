import { useState } from "react";
import "../shared/Overlays.css";

// Free-text add — any name is accepted, not just Pokémon already ranked
// somewhere else. `list="mon-names"` (the global datalist in App.jsx) offers
// browser-native autocomplete against the known roster.
export default function AddToTierModal({ tierLabel, onAdd, onClose }) {
  const [name, setName] = useState("");

  const submit = () => {
    if (!name.trim()) return;
    onAdd(name);
    onClose();
  };

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__body">
          <h3 className="modal__title">Add to {tierLabel} rank</h3>
          <input
            autoFocus
            list="mon-names"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Pokémon name"
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
