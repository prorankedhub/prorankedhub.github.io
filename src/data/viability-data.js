/* =============================================================================
   VIABILITY — the MASTER LIST for PRO OU (Ranked queue).
   -----------------------------------------------------------------------------
   This is the source of truth for WHO is viable. Only Pokémon listed here
   show up on the site — in the Roles, Speed Tiers and Team Builder tabs. A
   Pokémon considered unviable simply doesn't appear anywhere until someone
   puts it in a tier here. That keeps the debate where it matters: does it
   DESERVE a spot in the ranking, and in which tier?

   Order = on-screen order (top → bottom). Each block is a tier; "mons" is
   the list of names (in English). To re-rank, move the name between lists.
   Order within a tier counts as ordering too (the Role Compendium uses the
   VR to sort Pokémon within each role).
   ========================================================================== */

export const VIABILITY = [
  { tier: "NEW", mons: [] },
  { tier: "S", mons: ["Landorus-Therian"] },
  { tier: "S-", mons: ["Corviknight", "Clefable", "Toxapex", "Dragapult"] },
  { tier: "A+", mons: ["Zapdos", "Tyranitar", "Heatran", "Mega Lopunny", "Ferrothorn", "Mega Diancie", "Clodsire"] },
  { tier: "A", mons: ["Samurott-Hisui", "Tornadus-Therian", "Garchomp", "Annihilape", "Gliscor", "Cinderace", "Kyurem-Black"] },
  { tier: "A-", mons: ["Mega Gardevoir", "Chansey", "Slowbro", "Ursaluna", "Weavile", "Mega Scizor", "Victini", "Hatterene", "Kommo-o", "Mega Tyranitar", "Kyurem", "Mega Mawile", "Dragonite", "Volcarona", "Serperior", "Sneasler", "Keldeo", "Manaphy", "Azumarill", "Mega Latios"] },
  { tier: "B+", mons: ["Mega Charizard Y", "Mega Charizard X", "Mega Gyarados", "Mega Latias", "Ninetales-Alola", "Rotom-Wash", "Mega Venusaur", "Hoopa-Unbound", "Aegislash", "Bisharp", "Skarmory", "Latios", "Slowking", "Grimmsnarl"] },
  { tier: "B", mons: ["Greninja", "Hippowdon", "Jirachi", "Mega Medicham", "Moltres", "Mega Sableye", "Suicune", "Pelipper", "Mega Swampert", "Excadrill", "Primarina"] },
  { tier: "B-", mons: ["Arcanine-Hisui", "Mandibuzz", "Cresselia", "Blacephalon", "Dracozolt"] },
  { tier: "C+", mons: ["Blissey", "Breloom", "Amoonguss", "Hydreigon", "Latias", "Magnezone", "Ribombee", "Araquanid", "Thundurus-Therian", "Mega Heracross", "Mega Pinsir", "Mega Gallade", "Tinkaton", "Gengar", "Scizor", "Arctozolt"] },
  { tier: "C", mons: ["Kleavor", "Tangrowth", "Nidoking", "Porygon2", "Marowak-Alola", "Kingdra", "Muk-Alola", "Torkoal", "Venusaur", "Mew", "Togekiss", "Hawlucha", "Cloyster", "Gyarados", "Rillaboom"] },
  { tier: "C-", mons: ["Mega Aerodactyl", "Gallade", "Mega Garchomp", "Mamoswine", "Porygon-Z", "Cofagrigus", "Alomomola", "Quagsire", "Ditto", "Reuniclus", "Crawdaunt", "Thundurus", "Indeedee", "Mega Altaria", "Mimikyu", "Volcanion"] },
];
