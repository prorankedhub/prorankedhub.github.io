/* =============================================================================
   VIABILITY — LISTA-MESTRE do PRO OU (fila Ranked).
   -----------------------------------------------------------------------------
   Esta é a fonte da verdade de QUEM é viável. Só Pokémon listados aqui
   aparecem no site — nas abas Roles, Speed Tiers e Team Builder. Um Pokémon
   considerado inviável simplesmente não entra em lugar nenhum até alguém
   colocá-lo num tier aqui. Isso mantém o debate onde importa: ele MERECE
   estar no ranking, e em que tier?

   Ordem = ordem na tela (topo → fundo). Cada bloco é um tier; "mons" é a
   lista de nomes (em inglês). Para re-rankear, mova o nome entre as listas.
   A ordem dentro do tier também vale como ordenação (o Role Compendium usa
   o VR pra ordenar os Pokémon dentro de cada função).
   ========================================================================== */

export const VIABILITY = [
  { tier: "NEW", mons: [] },
  { tier: "S", mons: ["Landorus-Therian"] },
  { tier: "S-", mons: ["Corviknight", "Clefable", "Toxapex", "Dragapult"] },
  { tier: "A+", mons: ["Zapdos", "Tyranitar", "Heatran", "Mega Lopunny", "Ferrothorn", "Mega Diancie", "Clodsire"] },
  { tier: "A", mons: ["Samurott-Hisui", "Tornadus-Therian", "Garchomp", "Annihilape", "Gliscor", "Cinderace", "Kyurem-Black"] },
  { tier: "A-", mons: ["Mega Gardevoir", "Chansey", "Slowbro", "Ursaluna", "Weavile", "Mega Scizor", "Victini", "Hatterene", "Kommo-o", "Mega Tyranitar", "Kyurem", "Mega Mawile", "Dragonite", "Volcarona", "Serperior", "Sneasler", "Keldeo", "Manaphy", "Azumarill", "Mega Latios", "Rillaboom"] },
  { tier: "B+", mons: ["Mega Charizard Y", "Mega Charizard X", "Mega Gyarados", "Mega Latias", "Ninetales-Alola", "Rotom-Wash", "Mega Venusaur", "Hoopa-Unbound", "Aegislash", "Bisharp", "Skarmory", "Latios", "Slowking", "Grimmsnarl"] },
  { tier: "B", mons: ["Greninja", "Hippowdon", "Jirachi", "Mega Medicham", "Moltres", "Mega Sableye", "Suicune", "Pelipper", "Mega Swampert", "Excadrill", "Primarina"] },
  { tier: "B-", mons: ["Arcanine-Hisui", "Mandibuzz", "Cresselia", "Blacephalon", "Dracozolt"] },
  { tier: "C+", mons: ["Blissey", "Breloom", "Amoonguss", "Hydreigon", "Latias", "Magnezone", "Ribombee", "Araquanid", "Thundurus-Therian", "Mega Heracross", "Mega Pinsir", "Mega Gallade", "Tinkaton", "Gengar", "Scizor", "Arctozolt"] },
  { tier: "C", mons: ["Kleavor", "Tangrowth", "Nidoking", "Porygon2", "Marowak-Alola", "Kingdra", "Muk-Alola", "Torkoal", "Venusaur", "Mew", "Togekiss", "Hawlucha", "Cloyster", "Gyarados"] },
  { tier: "C-", mons: ["Mega Aerodactyl", "Gallade", "Mega Garchomp", "Mamoswine", "Porygon-Z", "Cofagrigus", "Alomomola", "Quagsire", "Ditto", "Reuniclus", "Crawdaunt", "Thundurus", "Indeedee", "Mega Altaria", "Mimikyu", "Volcanion"] },
];
