// Topbar half: mobile-only <select> (hidden ≤860px via .cat-select's own
// display toggle) — takes no layout space on desktop, so the search box's
// flex:1 fills the row on its own instead of splitting it with a spacer.
// The "+ New category" button in CategoryRail lives inside .cat-rail, which
// is hidden on mobile too — so it needs its own mobile-only equivalent here,
// next to the <select>, or there'd be no way to add a category on mobile.
export function CategoryTopbarNav({ cats, activeCat, onSelect, editMode, onAddSection }) {
  return (
    <>
      <select className="cat-select" value={activeCat} onChange={(e) => onSelect(e.target.value)}>
        {cats.map((c) => (
          <option key={c.id} value={c.id}>
            {c.num} · {c.title}
          </option>
        ))}
      </select>
      {editMode && (
        <button type="button" className="cat-select-add" onClick={onAddSection} title="New category">
          +
        </button>
      )}
    </>
  );
}

// Desktop sidebar rail, rendered inside the main content row.
export function CategoryRail({ cats, activeCat, onSelect, editMode, onAddSection }) {
  return (
    <aside className="cat-rail cat-rail__panel">
      <div className="cat-rail__label">Categories</div>
      {cats.map((c) => (
        <a key={c.id} className={"cat-row" + (activeCat === c.id ? " cat-row--active" : "")} onClick={() => onSelect(c.id)}>
          <span className="cat-rail__num">{c.num}</span> {c.title}
        </a>
      ))}
      {editMode && (
        <a className="cat-row cat-row--add" onClick={onAddSection}>
          + New category
        </a>
      )}
    </aside>
  );
}
