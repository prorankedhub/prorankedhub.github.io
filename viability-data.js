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
  { tier: "NEW", mons: ["Cinderace", "Rillaboom", "Primarina", "Toxapex", "Dragapult", "Grimmsnarl", "Araquanid", "Indeedee", "Arctozolt", "Dracozolt"] },
  { tier: "S",  mons: ["Landorus-Therian"] },
  { tier: "S-", mons: ["Tornadus-Therian"] },
  { tier: "A+", mons: ["Clefable", "Mega Diancie", "Dragonite", "Mega Lopunny", "Volcarona", "Zapdos"] },
  { tier: "A",  mons: ["Aegislash", "Bisharp", "Clodsire", "Corviknight", "Ferrothorn", "Garchomp", "Gliscor", "Heatran", "Kyurem", "Kyurem-Black", "Latios", "Mega Mawile", "Mega Metagross", "Samurott-Hisui", "Serperior", "Tyranitar"] },
  { tier: "A-", mons: ["Mega Alakazam", "Annihilape", "Azumarill", "Blacephalon", "Excadrill", "Mega Gardevoir", "Hatterene", "Hoopa-Unbound", "Keldeo", "Mega Latios", "Manaphy", "Mega Scizor", "Skarmory", "Slowbro", "Slowking", "Sneasler", "Ursaluna", "Victini", "Weavile"] },
  { tier: "B+", mons: ["Chansey", "Mega Charizard X", "Mega Charizard Y", "Mega Gyarados", "Kommo-o", "Mega Latias", "Ninetales-Alola", "Rotom-Wash", "Mega Tyranitar", "Mega Venusaur"] },
  { tier: "B",  mons: ["Amoonguss", "Breloom", "Greninja", "Hippowdon", "Jirachi", "Mega Medicham", "Moltres", "Mega Sableye", "Suicune", "Tangrowth", "Thundurus", "Tinkaton", "Volcanion"] },
  { tier: "B-", mons: ["Arcanine-Hisui", "Mega Altaria", "Cresselia", "Mega Gallade", "Mega Heracross", "Hydreigon", "Latias", "Magnezone", "Mandibuzz", "Mew", "Pelipper", "Mega Pinsir", "Porygon-Z", "Reuniclus", "Mega Swampert"] },
  { tier: "C+", mons: ["Aerodactyl", "Alakazam", "Alomomola", "Blissey", "Crawdaunt", "Diggersby", "Ditto", "Gengar", "Mamoswine", "Porygon2", "Quagsire", "Ribombee", "Scizor", "Thundurus-Therian", "Togekiss", "Uxie"] },
  { tier: "C",  mons: ["Cloyster", "Conkeldurr", "Mega Garchomp", "Gyarados", "Hawlucha", "Kingdra", "Kleavor", "Mega Manectric", "Marowak-Alola", "Mimikyu", "Muk-Alola", "Mega Slowbro", "Terrakion", "Torkoal", "Venusaur"] },
  { tier: "C-", mons: ["Mega Aerodactyl", "Azelf", "Mega Beedrill", "Blastoise", "Cofagrigus", "Gallade", "Gastrodon", "Infernape", "Klefki", "Mantine", "Nidoking", "Mega Pidgeot", "Registeel", "Seismitoad", "Starmie", "Tentacruel"] },
];
