# PRO Role Compendium

A visual, interactive list of which Pokémon fill each role in the PRO OU metagame (Ranked queue). Search by Pokémon, filter by category, and click any sprite to open a panel showing every role that Pokémon appears in.

Filtered down to what's actually available in PRO.

---

## Files

### The app — the 4 files that must travel together

| File | What it is | Do you edit it? |
|---|---|---|
| `roles-data.js` | Every Pokémon, role and category. | **Yes — this one only.** |
| `index.html` | The app. This is the filename GitHub Pages serves as the home page. | No |
| `Role Compendium.dc.html` | A **byte-identical copy** of `index.html`. This is the source file the visual editor opens; `index.html` is the published copy. The two always hold the same content. | No |
| `support.js` | The engine that makes the app run (tool-generated, don't edit). Without it the page loads blank. | No |

> When moving, publishing or sharing, keep all four **in the same folder**. If you edit
> `Role Compendium.dc.html`, copy it over `index.html` — otherwise the published site
> falls behind.

### Everything else

| File | What it is |
|---|---|
| `README.md` | This guide. |
| `CLAUDE.md` | Project context for the AI assistant. Does not affect the app. |
| `.gitignore` | Tells git what to leave untracked. Does not affect the app. |

---

## Running it

Sprites are fetched from the internet, so you need a connection. The app loads its data as a JavaScript module, which **does not work if you just double-click the file** (`file://` blocks it for security reasons). Use one of these instead:

### Locally (simple server)
Open a terminal in the folder and run any of:

- **Python:** `python -m http.server` → open `http://localhost:8000/`
- **VS Code:** the *Live Server* extension → right-click `index.html` → *Open with Live Server*
- **Node:** `npx serve`

### On GitHub Pages
1. Push `index.html`, `support.js` and `roles-data.js` (and, if you like, `Role Compendium.dc.html`) to the repository.
2. Under **Settings → Pages**, point it at the branch/folder.
3. Done — Pages serves over `https://`, so the app loads normally. Editing the data is just a commit to `roles-data.js`.

---

## Editing the data (`roles-data.js`)

Everything lives in two structures: `SECTIONS` (categories, roles and Pokémon) and `SPRITE_SLUGS` (only for forms whose sprite file is named differently).

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
Inside `roles: [ ... ]`, each role looks like:

```js
{ name: "Stealth Rock", move: "Stealth Rock", mons: ["Landorus-Therian", "Heatran", ...] }
```

- `name` — the role's title (shown on the card).
- `move` — the label to the right of the title (the general move/mechanic). Use `""` for none.
- `mons` — the list of Pokémon.

To **create a role**, copy an entire `{ name, move, mons }` block.

### Pokémon
In the `mons` list, each entry can be a plain name **or** an object with an annotation:

```js
mons: [
  "Ferrothorn",                                  // plain
  { name: "Kleavor", note: "Stone Axe" },        // shows HOW it fills the role
  { name: "Samurott-Hisui", note: "Ceaseless Edge" },
  "Skarmory"
]
```

- Use the **English name** (`"Rotom-Wash"`, `"Mega Mawile"`, `"Landorus-Therian"`).
- The `note` shows up in red under the sprite and in the detail panel (e.g. *Stealth Rock · Stone Axe*). Use it for the exceptions — when a Pokémon sets up or performs the role through one specific move or ability.
- You can mix plain strings and objects in the same list.

### Syntax rules (don't break these)
- Every `"name"` in quotes, commas between them, **no trailing comma** at the end of a list.
- Objects use `{ name: "...", note: "..." }` with exactly those keys.

---

## Sprites

The sprite is looked up automatically from the Pokémon's name. If one shows up as a **placeholder (⊘)**, that sprite's file is named differently — add a line to `SPRITE_SLUGS`:

```js
export const SPRITE_SLUGS = {
  "Mega Mawile": "mawile-mega",
  "Displayed name": "file-slug",
  ...
};
```

Regular forms **don't** need an entry here. The image base URL lives in `SPRITE_BASE` at the end of the file — change it there if the sprite source ever moves.

---

## Recommended workflow

1. Edit `roles-data.js` in any text editor (VS Code, Notepad++, etc.).
2. Save.
3. Reload the page (local server) or commit (GitHub Pages).

No build step, no install.
