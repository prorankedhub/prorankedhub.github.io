import SpriteImg from "./SpriteImg.jsx";
import { badgeFor, cornerFor } from "../../lib/viewStyles.js";

// Shared tile for the Roles grid and the VR tier grid. `note` (roles only,
// the red move/ability tag) and the tile-to-tile DnD handlers (VR only, for
// re-ranking within/between tiers) are optional.
export default function MonTile({
  name,
  note,
  status,
  dim,
  editMode,
  selected,
  isDragSource,
  draggable,
  size = 50,
  url,
  onClick,
  onDragStart,
  onDragEnd,
  onDragOverTile,
  onDropTile,
  onCornerClick,
}) {
  const badge = badgeFor(status);
  const corner = cornerFor(status);
  const classes = [
    "mon-tile",
    status && status !== "base" ? `mon-tile--${status}` : "",
    dim ? "mon-tile--dim" : "",
    selected ? "mon-tile--selected" : "",
    isDragSource ? "mon-tile--drag-source" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOverTile}
      onDrop={onDropTile}
      role="button"
      tabIndex={0}
      title={name}
    >
      {editMode && (
        <button
          className={corner.className}
          title={corner.title}
          onClick={(e) => {
            e.stopPropagation();
            onCornerClick?.();
          }}
        >
          {corner.label}
        </button>
      )}
      {badge && <span className={badge.className}>{badge.text}</span>}
      <SpriteImg src={url} alt={name} size={size} />
      <span className={"mon-tile__name" + (status === "removed" ? " mon-tile__name--removed" : "")}>{name}</span>
      {note && (
        <span className={"mon-tile__note" + (status === "added" ? " mon-tile__note--added" : status === "removed" ? " mon-tile__note--removed" : "")}>
          {note}
        </span>
      )}
    </div>
  );
}
