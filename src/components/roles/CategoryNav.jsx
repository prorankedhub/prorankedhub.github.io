// Topbar half: mobile-only <select> (hidden ≤860px via .cat-select's own
// display toggle) — takes no layout space on desktop, so the search box's
// flex:1 fills the row on its own instead of splitting it with a spacer.
export function CategoryTopbarNav({ cats, activeCat, onSelect }) {
  return (
    <select className="cat-select" value={activeCat} onChange={(e) => onSelect(e.target.value)}>
      {cats.map((c) => (
        <option key={c.id} value={c.id}>
          {c.num} · {c.title}
        </option>
      ))}
    </select>
  );
}

// Desktop sidebar rail, rendered inside the main content row.
export function CategoryRail({ cats, activeCat, onSelect }) {
  return (
    <aside className="cat-rail cat-rail__panel">
      <div className="cat-rail__label">Categories</div>
      {cats.map((c) => (
        <a key={c.id} className={"cat-row" + (activeCat === c.id ? " cat-row--active" : "")} onClick={() => onSelect(c.id)}>
          <span className="cat-rail__num">{c.num}</span> {c.title}
        </a>
      ))}
    </aside>
  );
}
