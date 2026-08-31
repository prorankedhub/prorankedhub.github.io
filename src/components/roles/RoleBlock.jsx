import MonTile from "../shared/MonTile.jsx";

export default function RoleBlock({
  section,
  role,
  mons, // [{ name, note, status, dim, isPendingAdd, url }]
  editMode,
  dragKey,
  dropKey,
  onDragStartTile,
  onDragEndTile,
  onDropRole,
  onTileClick,
  onCornerClick,
  sel,
  noteDraft,
  onNoteDraftChange,
  onSaveNote,
  onOpenCopyPicker,
  onRemoveSelected,
  onDeselect,
  isAdding,
  addName,
  addNote,
  onAddNoteChange,
  onAddConfirm,
  onAddCancel,
  onAddOpen,
  onAddChangeName,
}) {
  const roleKey = section.id + "|" + role.name;
  const isDrop = dropKey === roleKey;
  const dragging = !!dragKey;
  const hasSel = editMode && sel && sel.sectionId === section.id && sel.roleName === role.name;

  return (
    <div className="role-block">
      <div className="role-block__title-row">
        <h3 className="role-block__title">{role.name}</h3>
      </div>
      <div
        className={"mon-grid" + (isDrop ? " mon-grid--drop" : dragging ? " mon-grid--dragging" : "")}
        onDragOver={(e) => {
          if (!dragKey) return;
          e.preventDefault();
          try {
            e.dataTransfer.dropEffect = e.altKey || e.ctrlKey ? "copy" : "move";
          } catch {
            /* ignore */
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          onDropRole(section.id, role.name, e.altKey || e.ctrlKey);
        }}
      >
        {mons.map((mon) => {
          const key = section.id + "|" + role.name + "|" + mon.name;
          return (
            <MonTile
              key={mon.name}
              name={mon.name}
              note={mon.note}
              status={mon.status}
              dim={mon.dim}
              url={mon.url}
              editMode={editMode}
              draggable={editMode && mon.status !== "removed"}
              selected={hasSel && sel.name === mon.name}
              isDragSource={dragKey === key}
              onClick={() => onTileClick(section.id, role.name, mon.name, mon.isPendingAdd, mon.status)}
              onDragStart={(e) => {
                try {
                  e.dataTransfer.effectAllowed = "copyMove";
                  e.dataTransfer.setData("text/plain", mon.name);
                } catch {
                  /* ignore */
                }
                onDragStartTile(section.id, role.name, mon.name, mon.note, mon.isPendingAdd, key);
              }}
              onDragEnd={onDragEndTile}
              onCornerClick={() => onCornerClick(section.id, role.name, mon.name, mon.isPendingAdd, mon.status)}
            />
          );
        })}
        {editMode && (
          <button className="mon-grid__add" title="Add Pokémon" onClick={() => onAddOpen(roleKey)}>
            +
          </button>
        )}
      </div>

      {hasSel && (
        <div className="sel-panel">
          <span className="sel-panel__label">Selected · {sel.name}</span>
          <input
            value={noteDraft}
            onChange={(e) => onNoteDraftChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSaveNote();
              }
            }}
            placeholder="Note (e.g. Stone Axe)"
            spellCheck={false}
          />
          <button className="sel-panel__btn sel-panel__btn--save" onClick={onSaveNote}>
            Save note
          </button>
          <button className="sel-panel__btn sel-panel__btn--copy" onClick={onOpenCopyPicker}>
            Copy to…
          </button>
          <button className="sel-panel__btn sel-panel__btn--remove" onClick={onRemoveSelected}>
            Remove
          </button>
          <button className="sel-panel__btn sel-panel__btn--done" onClick={onDeselect}>
            Done
          </button>
          <span className="sel-panel__hint">Drag to move · Alt-drag to copy · "Copy to…" duplicates into another role · Del to remove</span>
        </div>
      )}

      {isAdding && (
        <div className="add-panel">
          <span className="add-panel__label">Add</span>
          <button type="button" className="add-panel__name" onClick={() => onAddChangeName(roleKey)} title="Pick a different Pokémon">
            {addName}
          </button>
          <input
            value={addNote}
            onChange={(e) => onAddNoteChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onAddConfirm(section.id, role.name);
              }
              if (e.key === "Escape") onAddCancel();
            }}
            placeholder="Note (optional)"
            spellCheck={false}
            autoFocus
          />
          <button className="add-panel__btn add-panel__btn--confirm" onClick={() => onAddConfirm(section.id, role.name)}>
            Add
          </button>
          <button className="add-panel__btn add-panel__btn--cancel" onClick={onAddCancel}>
            Done
          </button>
        </div>
      )}
    </div>
  );
}
