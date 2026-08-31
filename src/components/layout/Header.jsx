import "./Header.css";

// Team Builder isn't launched yet — no tab button for it (see useHashTab.js).
const TAB_DEFS = [
  { id: "roles", title: "Role Compendium", short: "Roles" },
  { id: "speed", title: "Speed Tiers", short: "Speed" },
  { id: "vr", title: "Viability", short: "Viability" },
];

const PAGE_COPY = {
  roles: {
    title: "Role Compendium",
    sub: "A census of the metagame's roles — who sets hazards, who sets up, who walls what. Search a Pokémon or browse by function.",
  },
  speed: {
    title: "Speed Tiers",
    sub: "Every OU pick with its Speed benchmarks side by side — base, max, neutral, min and Scarf, all at level 100. Tap Base to re-sort.",
  },
  vr: {
    title: "Viability Rankings",
    sub: "Where each Pokémon stands in the Ranked OU metagame, S down to C. Tap a Pokémon to see the roles it fills.",
  },
  team: {
    title: "Team Builder",
    sub: "Draft up to six Pokémon and see which roles your team covers — and which gaps it still has.",
  },
};

export default function Header({ tab, onTabChange, theme, onToggleTheme }) {
  const copy = PAGE_COPY[tab] || PAGE_COPY.roles;
  const themeIcon = theme === "dark" ? "○" : "●";
  const themeLabel = theme === "dark" ? "Light" : "Dark";
  const themeTitle = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <div className="header">
      <div className="header__kicker">
        <span className="header__kicker-accent">Pokémon Revolution Online</span>
        <span className="header__dot" />
        <span>Ranked</span>
        <span className="header__spacer" />
        <button className="header__theme-btn" onClick={onToggleTheme} title={themeTitle}>
          {themeIcon}
          <span>{themeLabel}</span>
        </button>
      </div>
      <h1 className="header__title">{copy.title}</h1>
      <p className="header__sub">{copy.sub}</p>
      <div className="tabbar">
        {TAB_DEFS.map((t) => (
          <button
            key={t.id}
            className={"tab-btn" + (tab === t.id ? " tab-btn--active" : "")}
            onClick={() => onTabChange(t.id)}
          >
            <span className="tab-full">{t.title}</span>
            <span className="tab-short">{t.short}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
