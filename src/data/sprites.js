/* =============================================================================
   SPRITES — utilitário compartilhado por todas as abas.
   Os retratos vêm em runtime do PMD Sprites Repository (sprites.pmdcollab.org),
   via a API pública do SpriteCollab, e ficam em cache no navegador — igual às
   velocidades. Nenhum mapeamento de nome→arquivo aqui: o parser de nomes é
   genérico. Só o que não cabe num parser genérico mora nestas duas listas.
   ========================================================================== */

export const SPRITE_API = "https://spriteserver.pmdcollab.org/graphql";

// Sufixo depois de um hífen que indica FORMA alternativa (ex.: "Landorus-Therian"
// -> busca "Landorus", pede a forma "Therian"). Se o sufixo não estiver aqui, o
// nome inteiro é tratado como uma espécie só (ver NO_SPLIT_HYPHEN abaixo).
export const FORM_SUFFIXES = ["Therian", "Alola", "Hisui", "Wash", "Unbound", "Black", "White", "Galar", "Paldea"];

// Espécies cujo hífen faz parte do nome, não separa uma forma (ex.: "Porygon-Z").
// Pra essas, buscamos o nome sem o hífen.
export const NO_SPLIT_HYPHEN = ["Kommo-o", "Porygon-Z"];
