import "./TopBar.css";

export default function SearchBox({ value, onChange, statLine }) {
  return (
    <div className="search-box">
      <div className="search-box__field">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.4" style={{ flexShrink: 0 }}>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search a Pokémon"
          spellCheck={false}
        />
      </div>
      <div className="search-box__stat">{statLine}</div>
    </div>
  );
}
