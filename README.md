# PRO Ranked Hub

A visual, interactive toolkit for the PRO OU metagame (Ranked queue): role compendium, speed tiers, viability ranking, and a team builder. Search by Pokémon, filter by category, and a panel that shows every role a Pokémon fills when you click it.

Based on several Smogon threads about the SM OU metagame, filtered for PRO availability. Sprites from the [PMD Sprites Repository](https://sprites.pmdcollab.org/), via the SpriteCollab API.

---

## Stack

Vite + React, no TypeScript. No external state manager — app state fits in plain hooks (`src/hooks/`). Plain CSS, one file per component.

```
src/
  data/     data you edit (roles, viability, sprite rules)
  lib/      pure, stateless logic — parsing, speed math, changelog...
  hooks/    state + side effects (localStorage, fetch, theme...)
  components/
    layout/   header, tabs, footer
    roles/    Role Compendium tab
    speed/    Speed Tiers tab
    vr/       Viability Ranking tab
    team/     Team Builder tab
    shared/   detail drawer, modals, toast, export, print sheet
  styles/   global tokens (color/theme/print) + tiles.css (card states)
```

## Running it

```bash
npm install
npm run dev       # dev server with hot-reload
npm run build     # production build into dist/
npm run preview   # serve the production build locally, to check before deploying
```

Sprites and speeds come from the internet (SpriteCollab and PokéAPI), so you'll need a connection.

---

## Deploy

Automatic: every push to `main` runs `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages via GitHub Actions (**Settings → Pages → Source: GitHub Actions**, a one-time setup). No need to manually upload the `dist/` folder.

The repo is `prorankedhub/prorankedhub.github.io` — that special name makes GitHub Pages serve it at the domain root (`prorankedhub.github.io`, no repo-name path), so `vite.config.js` sets `base: "/"`.

---

## Editing the data (`src/data/roles-data.js`)

Everything lives in `SECTIONS` (categories, roles, and Pokémon). It moved folders since the previous version, but the format is the same.

### Categories (tabs)
Each block in `SECTIONS` becomes a tab, in the order it appears in the file:

```js
{ id: "hazards", title: "Entry Hazards", tag: "HAZARDS", roles: [ ... ] }
```

- **Rename a tab** → change `title`.
- **Reorder** → move the block (the `01`, `02`… numbering is automatic).
- **New tab** → copy a whole block and give it a unique `id`, no spaces.
- **Remove** → delete the block.
- The **"All"** tab is generated automatically and always comes first.

### Roles
Inside `roles: [ ... ]`, each role is:

```js
{ name: "Stealth Rock", move: "Stealth Rock", mons: ["Landorus-Therian", "Heatran", ...] }
```

- `name` — the role's title (shown on the card).
- `move` — the label to the right of the title (the move/general mechanic). Leave `""` for none.
- `mons` — the list of Pokémon.

To **create a role**, copy a whole `{ name, move, mons }` block.

### Pokémon
In the `mons` list, each entry can be a plain name **or** an object with a note:

```js
mons: [
  "Ferrothorn",                                  // plain
  { name: "Kleavor", note: "Stone Axe" },        // shows HOW it fills the role
  { name: "Samurott-Hisui", note: "Ceaseless Edge" },
  "Skarmory"
]
```

- Use the **English name** (`"Rotom-Wash"`, `"Mega Mawile"`, `"Landorus-Therian"`).
- `note` shows up in red under the sprite and in the detail panel (e.g. *Stealth Rock · Stone Axe*). Use it for exception cases — when the Pokémon sets up/fills the role via a specific move or ability.
- Strings and objects can be mixed in the same list.
- **Only Pokémon listed in `src/data/viability-data.js`** (`VIABILITY`) show up on screen — a name in a role that isn't there is ignored. Add it to a tier there first.

### Syntax rules (don't break these)
- Each `"name"` in quotes, comma-separated; **no trailing comma** at the end of the list.
- Objects use `{ name: "...", note: "..." }` with exactly those keys.

---

## Sprites

The sprite is fetched automatically from the Pokémon's name ([PMD Sprites Repository](https://sprites.pmdcollab.org/), via the SpriteCollab API). If one shows up as a **placeholder (⊘)**, it's usually an alternate form (`Name-Form`) whose suffix the parser doesn't recognize — add the suffix to `FORM_SUFFIXES` in `src/data/sprites.js`:

```js
export const FORM_SUFFIXES = ["Therian", "Alola", "Hisui", ...];
```

Species whose hyphen is part of the name (not a form separator, e.g. `Porygon-Z`) go in `NO_SPLIT_HYPHEN` in the same file.

---

## Recommended workflow

1. `npm run dev`, edit `src/data/roles-data.js` in a text editor.
2. Save — the browser updates on its own (hot-reload).
3. Check it visually, then `git commit` and `git push` — deploy happens automatically.
