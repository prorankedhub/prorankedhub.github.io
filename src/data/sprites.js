/* =============================================================================
   SPRITES — a utility shared by every tab.
   Portraits are fetched at runtime from the PMD Sprites Repository
   (sprites.pmdcollab.org) via SpriteCollab's public API, and cached in the
   browser — same as speeds. No name→file mapping here: the name parser is
   generic. Only what a generic parser can't handle lives in these two lists.

   The endpoint itself is not here: it's SPRITE_API in lib/spriteResolve.js,
   next to the code that calls it. These two lists are data because they're
   edited as the roster grows; the URL is not.
   ========================================================================== */

// A suffix after a hyphen marking an alternate FORM (e.g. "Landorus-Therian"
// -> searches "Landorus", asks for the "Therian" form). If the suffix isn't
// listed here, the whole name is treated as a single species (see
// NO_SPLIT_HYPHEN below).
export const FORM_SUFFIXES = ["Therian", "Alola", "Hisui", "Wash", "Unbound", "Black", "White", "Galar", "Paldea"];

// Species whose hyphen is part of the name rather than separating a form
// (e.g. "Porygon-Z"). For those, we search the name without the hyphen.
export const NO_SPLIT_HYPHEN = ["Kommo-o", "Porygon-Z"];
