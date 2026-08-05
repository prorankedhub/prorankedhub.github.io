# CLAUDE.md — PRO Role Compendium

Persistent project context. Read before editing.

## What it is
A visual/interactive list of roles in the **PRO OU** metagame (Pokémon Revolution Online, **Ranked** queue). Based on Smogon's SM OU Role Compendium, filtered down to what's available in PRO. Sprites come from Smogon's Mystery Dungeon set (`https://www.smogon.com/forums/media/pmd/<slug>.png`).

## Files
- `Role Compendium.dc.html` — the app (Design Component: template + logic). **Editorial** look (beige paper `#f1ece1`, ink, brick red `#cf3a22`; Bricolage Grotesque / Space Grotesk / Space Mono).
- `index.html` — a **byte-identical copy** of the app, for GitHub Pages. Whenever you edit the `.dc.html`, copy it over `index.html`.
  > The two are redundant on purpose: the user **works in the visual Design Component
  > editor**, which only picks up `*.dc.html` files. Do not propose deleting the `.dc.html`.
- `roles-data.js` — **the single source of data** (categories, roles, Pokémon, slugs). The logic pulls it in via `import("./roles-data.js")`.
- `support.js` — tool-generated dc runtime (`<script src="./support.js">` in both HTML files). **Do not edit**; it isn't part of the app.
- `README.md` — end-user guide.

That's all of it. The repo is deliberately lean: the source PDF and the `.thumbnail` preview were removed (the PDF is still recoverable from git history). Don't recreate them.

## Important rules
- **Data lives only in `roles-data.js`.** Never inline the list back into the `.dc.html` — the user edits the data on their own, without spending credit.
- **Always sync `index.html`** after any change to `Role Compendium.dc.html` (`copy_files` src→dest).
- **PRO availability:** there are NO Tapus, no Magearna and no Ultra Beasts (except **Blacephalon**). Don't reintroduce them. When touching lists, respect what actually exists in PRO.
- **Keep the editorial look.** The user tried a retro version and rejected it. Don't redesign unprompted.
- Everything written in this repo — UI, docs, code comments, commit messages — is in **English**. Conversation with the user stays in Portuguese.

## Data format (`roles-data.js`)
- `SECTIONS`: array of `{ id, title, tag, roles: [...] }` — each block is a tab (order = on-screen order; "All" is automatic).
- Role: `{ name, move, mons: [...] }`.
- `mons` entry: `"Name"` **or** `{ name, note }` — `note` shows the specific move/ability that Pokémon uses to fill the role (red tag on the tile + in the drawer). Strings and objects can coexist.
- `SPRITE_SLUGS`: only forms whose sprite file is named differently from the displayed name.

## Technical details to preserve
- **Sprite loader** (`pump()` in the logic): capped concurrency (16), retry with backoff, placeholder only on a real 404. It handles: the tab being hidden mid-load (9s timeout), discarded cache, and **React reusing an `<img>` when switching tabs** (compares `src` against `data-url` and reloads if they diverge). Don't simplify without keeping those cases covered.
- Running it requires an `http(s)` server (the module `import()` fails under `file://`). Documented in the README.
