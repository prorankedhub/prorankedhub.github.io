/* =============================================================================
   PRO OU ROLE COMPENDIUM — DADOS
   -----------------------------------------------------------------------------
   Este é o ÚNICO arquivo que você precisa editar para mudar Pokémon e funções.
   Não é preciso mexer no "Role Compendium.dc.html".

   Como editar:
   • Adicionar/remover um Pokémon de uma função → edite a lista "mons: [...]".
     Nomes entre aspas, separados por vírgula. Use o nome em INGLÊS.
     Ex.: "Rotom-Wash", "Mega Mawile", "Landorus-Therian".
   • MOSTRAR COMO um Pokémon executa a função (move/ability específico) →
     troque o nome por um objeto: { name: "Nome", note: "Move" }.
     Aparece uma etiqueta embaixo do sprite e no painel de detalhe.
     Ex.: { name: "Kleavor", note: "Stone Axe" }  (setta SR com o ataque)
          { name: "Samurott-Hisui", note: "Ceaseless Edge" }
          { name: "Skarmory", note: "Roar" }
     Você pode misturar strings e objetos na mesma lista, sem problema.
   • Criar uma função nova → copie um bloco { name, move, mons } inteiro.
   • Criar uma categoria nova → copie um bloco { id, title, tag, roles: [...] }.
     O "id" precisa ser único (sem espaços). O número (01, 02...) é automático.
   • Reordenar → é só mover os blocos de lugar. A ordem aqui é a ordem na página.

   Cuidados:
   • Cada "nome" entre aspas; vírgula entre eles; SEM vírgula sobrando no fim.
   • O sprite é buscado automaticamente pelo nome. Se um Pokémon aparecer como
     placeholder (⊘), o slug do sprite é diferente do nome — adicione uma linha
     em SPRITE_SLUGS lá embaixo mapeando o nome para o slug correto.

   Depois de salvar, abra o "Role Compendium.dc.html" no navegador. Pronto.
   ========================================================================== */

export const SECTIONS = [
  { id: "hazards", title: "Entry Hazards", tag: "HAZARDS", roles: [
    { name: "Stealth Rock", move: "Stealth Rock", mons: ["Landorus-Therian", "Clefable", "Mega Diancie", "Ferrothorn", "Garchomp", "Gliscor", "Heatran", "Clodsire", "Excadrill", "Chansey", "Kommo-o", "Mega Tyranitar", "Hippowdon", "Jirachi", "Mew", "Mega Swampert", "Mega Garchomp", "Bronzong", "Mega Aggron", "Tinkaton", "Mamoswine", "Uxie", "Kleavor", "Seismitoad", "Registeel"] },
    { name: "Spikes", move: "Spikes", mons: ["Ferrothorn", "Samurott-Hisui", "Skarmory", "Greninja"] },
    { name: "Toxic Spikes", move: "Toxic Spikes", mons: ["Clodsire", "Gliscor", "Greninja", "Toxapex", "Gengar", "Cofagrigus"] },
    { name: "Sticky Web", move: "Sticky Web", mons: ["Ribombee", "Araquanid", "Shuckle", "Smeargle"] },
  ] },

  { id: "control", title: "Hazard Control", tag: "CONTROL", roles: [
    { name: "Defog", move: "Defog", mons: ["Landorus-Therian", "Tornadus-Therian", "Zapdos", "Corviknight", "Gliscor", "Serperior", "Skarmory", "Mega Scizor", "Rotom-Wash", "Moltres", "Hydreigon", "Latias", "Pelipper", "Mega Altaria", "Mew", "Mandibuzz", "Thundurus-Therian", "Mantine", "Latios"] },
    { name: "Rapid Spin", move: "Rapid Spin", mons: ["Excadrill", "Torkoal"] },
    { name: "Magic Bounce", move: "Ability", mons: ["Mega Diancie", "Hatterene", "Mega Sableye"] },
  ] },

  { id: "utility", title: "Utility & Support", tag: "UTILITY", roles: [
    { name: "Encore", move: "Encore", mons: ["Clefable", "Mega Lopunny", "Samurott-Hisui", "Tinkaton"] },
    { name: "Knock Off", move: "Knock Off", mons: ["Landorus-Therian", "Tornadus-Therian", "Clefable", "Ferrothorn", "Gliscor", "Mega Mawile", "Serperior", "Bisharp", "Tyranitar", "Samurott-Hisui", "Mega Scizor", "Weavile", "Azumarill", "Hoopa-Unbound", "Mega Tyranitar", "Mega Sableye", "Tangrowth", "Mega Gallade", "Mew", "Pelipper", "Crawdaunt", "Muk-Alola", "Toxapex", "Diggersby", "Mandibuzz", "Tinkaton"] },
    { name: "Taunt", move: "Taunt", mons: ["Landorus-Therian", "Tornadus-Therian", "Gliscor", "Heatran", "Serperior", "Skarmory", "Keldeo", "Mega Gyarados", "Kommo-o", "Mew", "Thundurus-Therian", "Gyarados", "Hawlucha", "Mega Aerodactyl", "Azelf"] },
    { name: "Trick / Switcheroo", move: "Trick", mons: ["Clefable", "Latios", "Victini", "Blacephalon", "Rotom-Wash", "Jirachi", "Greninja", "Latias", "Sneasler", "Togekiss"] },
    { name: "Endeavor", move: "Endeavor", mons: ["Diancie", "Mamoswine"] },
    { name: "Substitute", move: "Substitute", mons: ["Serperior", "Volcarona", "Diancie", "Garchomp"] },
  ] },

  { id: "attackers", title: "Attackers", tag: "ATTACKERS", roles: [
    { name: "Physical Attackers", move: "", mons: ["Landorus-Therian", "Dragonite", "Mega Lopunny", "Garchomp", "Gliscor", "Kyurem-Black", "Mega Mawile", "Bisharp", "Tyranitar", "Aegislash", "Excadrill", "Hoopa-Unbound", "Mega Scizor", "Victini", "Weavile", "Azumarill", "Annihilape", "Mega Charizard X", "Mega Gyarados", "Kommo-o", "Mega Tyranitar", "Greninja", "Mega Medicham", "Breloom", "Mega Heracross", "Mega Pinsir", "Mega Swampert", "Mega Gallade", "Arcanine-Hisui", "Crawdaunt", "Mamoswine", "Mega Garchomp", "Gyarados", "Mega Aerodactyl", "Dragapult", "Lilligant-Hisui"] },
    { name: "Special Attackers", move: "", mons: ["Tornadus-Therian", "Clefable", "Volcarona", "Zapdos", "Mega Diancie", "Heatran", "Kyurem", "Serperior", "Aegislash", "Latios", "Hoopa-Unbound", "Keldeo", "Manaphy", "Victini", "Blacephalon", "Mega Latios", "Mega Gardevoir", "Mega Charizard Y", "Mega Latias", "Kommo-o", "Greninja", "Volcanion", "Jirachi", "Hydreigon", "Magnezone", "Reuniclus", "Latias", "Thundurus-Therian", "Dragapult", "Primarina", "Goodra-Hisui"] },
    { name: "Mixed Attackers", move: "", mons: ["Mega Diancie", "Kyurem-Black", "Aegislash", "Mega Latios", "Kommo-o", "Greninja", "Mega Garchomp", "Dragapult"] },
  ] },

  { id: "setup", title: "Setup Sweepers", tag: "OFFENSE", roles: [
    { name: "Agility / Rock Polish", move: "", mons: ["Landorus-Therian", "Mega Diancie", "Mew", "Thundurus-Therian"] },
    { name: "Belly Drum", move: "", mons: ["Azumarill", "Kommo-o"] },
    { name: "Calm Mind", move: "", mons: ["Clefable", "Keldeo", "Blacephalon", "Hatterene", "Mega Sableye", "Suicune", "Cresselia", "Latias", "Reuniclus"] },
    { name: "Dragon Dance", move: "", mons: ["Dragonite", "Mega Charizard X", "Mega Gyarados", "Kommo-o", "Mega Tyranitar", "Mega Altaria", "Gyarados", "Dragapult"] },
    { name: "Hone Claws", move: "", mons: ["Kyurem-Black", "Mega Aerodactyl"] },
    { name: "Nasty Plot", move: "", mons: ["Hoopa-Unbound", "Mew", "Porygon-Z", "Thundurus-Therian"] },
    { name: "Power-Up Punch", move: "", mons: ["Mega Lopunny", "Mega Swampert"] },
    { name: "Quiver Dance", move: "", mons: ["Volcarona"] },
    { name: "Swords Dance", move: "", mons: ["Landorus-Therian", "Garchomp", "Gliscor", "Mega Mawile", "Bisharp", "Excadrill", "Mega Scizor", "Weavile", "Ursaluna", "Sneasler", "Mega Charizard X", "Kommo-o", "Breloom", "Mega Heracross", "Mega Pinsir", "Mega Gallade", "Crawdaunt", "Mega Garchomp", "Hawlucha", "Marowak-Alola", "Terrakion"] },
    { name: "Bulk Up", move: "", mons: ["Corviknight", "Annihilape"] },
    { name: "Other", move: "Signature Abilities", mons: [{ name: "Clefable", note: "Cosmic Power" }, { name: "Serperior", note: "Contrary" }, { name: "Blacephalon", note: "Beast Boost" }, { name: "Victini", note: "Z-Happy Hour" }, { name: "Manaphy", note: "Tail Glow" }, { name: "Sneasler", note: "Unburden" }, { name: "Kommo-o", note: "Clangorous Soulblaze / Clangorous Soul" }, { name: "Jirachi", note: "Happy Hour" }, { name: "Porygon-Z", note: "Z-Conversion" }, { name: "Reuniclus", note: "Acid Armor" }, { name: "Hawlucha", note: "Unburden" }, { name: "Cloyster", note: "Shell Smash" }] },
  ] },

  { id: "priority", title: "Priority", tag: "PRIORITY", roles: [
    { name: "Aqua Jet", move: "Aqua Jet", mons: ["Samurott-Hisui", "Azumarill", "Crawdaunt"] },
    { name: "Bullet Punch", move: "Bullet Punch", mons: ["Mega Scizor", "Mega Medicham"] },
    { name: "Fake Out", move: "Fake Out", mons: ["Mega Lopunny", "Mega Medicham", "Cloyster"] },
    { name: "Ice Shard", move: "Ice Shard", mons: ["Weavile", "Mamoswine"] },
    { name: "Quick Attack", move: "Quick Attack", mons: ["Mega Lopunny", "Mega Pinsir"] },
    { name: "Sucker Punch", move: "Sucker Punch", mons: ["Mega Mawile", "Bisharp", "Samurott-Hisui", "Dragapult"] },
    { name: "Extreme Speed", move: "Extreme Speed", mons: ["Dragonite", "Arcanine-Hisui"] },
    { name: "Mach Punch", move: "Mach Punch", mons: ["Breloom", "Conkeldurr"] },
    { name: "Vacuum Wave", move: "", mons: ["Mega Gardevoir", "Keldeo"] },
  ] },

  { id: "choice", title: "Choice Items", tag: "CHOICE", roles: [
    { name: "Choice Band", move: "Band", mons: ["Tyranitar", "Kyurem-Black", "Hoopa-Unbound", "Victini", "Weavile", "Sneasler", "Crawdaunt", "Diggersby", "Mamoswine", "Barraskewda"] },
    { name: "Choice Specs", move: "Specs", mons: ["Kyurem", "Latios", "Blacephalon", "Hoopa-Unbound", "Keldeo", "Greninja", "Magnezone", "Hydreigon", "Kingdra", "Dragapult", "Primarina"] },
    { name: "Choice Scarf", move: "Scarf", mons: ["Landorus-Therian", "Serperior", "Tyranitar", "Garchomp", "Samurott-Hisui", "Latios", "Victini", "Blacephalon", "Sneasler", "Rotom-Wash", "Jirachi", "Magnezone", "Latias", "Ditto"] },
  ] },

  { id: "walls", title: "Walls", tag: "DEFENSE", roles: [
    { name: "Physical Walls", move: "", mons: ["Landorus-Therian", "Clefable", "Zapdos", "Corviknight", "Skarmory", "Slowbro", "Rotom-Wash", "Mega Venusaur", "Hippowdon", "Mega Sableye", "Tangrowth", "Cresselia", "Reuniclus", "Alomomola", "Quagsire", "Mega Slowbro", "Toxapex", "Mega Aggron", "Pyukumuku"] },
    { name: "Specially Defensive", move: "", mons: ["Ferrothorn", "Gliscor", "Heatran", "Tyranitar", "Clodsire", "Mega Scizor", "Chansey", "Kommo-o", "Mega Tyranitar", "Jirachi", "Amoonguss", "Cresselia", "Muk-Alola", "Gastrodon", "Mantine", "Toxapex", "Goodra-Hisui"] },
    { name: "Mixed Walls", move: "", mons: ["Ferrothorn", "Gliscor", "Mega Scizor", "Chansey", "Kommo-o", "Mega Venusaur", "Hippowdon", "Amoonguss", "Cresselia", "Mega Altaria", "Alomomola", "Toxapex", "Mega Aggron", "Pyukumuku"] },
  ] },

  { id: "pivots", title: "Pivots", tag: "PIVOTS", roles: [
    { name: "U-turn", move: "", mons: ["Landorus-Therian", "Tornadus-Therian", "Zapdos", "Mega Lopunny", "Gliscor", "Corviknight", "Mega Scizor", "Victini", "Annihilape", "Sneasler", "Greninja", "Jirachi", "Moltres", "Pelipper", "Dragapult"] },
    { name: "Volt Switch", move: "", mons: ["Zapdos", "Rotom-Wash", "Magnezone", "Thundurus-Therian", "Mega Manectric"] },
    { name: "Flip Turn", move: "", mons: ["Latios", "Samurott-Hisui", "Keldeo", "Mega Swampert", "Primarina", "Barraskewda", "Basculegion-F"] },
    { name: "Teleport", move: "", mons: ["Clefable", "Slowbro", { name: "Slowking", note: "Chilly Reception" }, "Chansey", "Porygon2"] },
    { name: "Regenerator", move: "Ability", mons: ["Tornadus-Therian", "Slowbro", "Slowking", "Amoonguss", "Tangrowth", "Alomomola", "Toxapex"] },
    { name: "Eject Button", move: "Item", mons: ["Tornadus-Therian", "Hatterene", "Slowbro", "Cresselia", "Toxapex"] },
  ] },

  { id: "antisetup", title: "Anti-Setup", tag: "ANTI-SETUP", roles: [
    { name: "Clear Smog", move: "Clear Smog", mons: ["Amoonguss", "Gastrodon"] },
    { name: "Haze", move: "Haze", mons: ["Volcanion", "Mantine", "Toxapex"] },
    { name: "Unaware", move: "Ability", mons: ["Clefable", "Clodsire", "Quagsire", "Pyukumuku"] },
    { name: "Whirlwind / Roar", move: "Whirlwind / Roar", mons: ["Heatran", "Skarmory", "Kommo-o", "Hippowdon", "Mega Altaria"] },
    { name: "Dragon Tail", move: "Dragon Tail", mons: ["Garchomp", "Mega Aggron"] },
    { name: "Others", move: "", mons: [{ name: "Ditto", note: "Imposter" }] },
  ] },

  { id: "clerics", title: "Clerics", tag: "CLERICS", roles: [
    { name: "Heal Bell / Aromatherapy", move: "Heal Bell / Aromatherapy", mons: ["Clefable", "Chansey", "Mega Altaria"] },
    { name: "Healing Wish / Lunar Dance", move: "", mons: ["Mega Lopunny", "Hatterene", "Jirachi", "Cresselia", "Latias", "Ninetales"] },
    { name: "Wish", move: "Wish", mons: ["Clefable", "Chansey", "Jirachi", "Latias", "Alomomola"] },
  ] },

  { id: "screens", title: "Screeners", tag: "SCREENS", roles: [
    { name: "Screeners", move: "Reflect / Light Screen", mons: ["Serperior", { name: "Ninetales-Alola", note: "Aurora Veil" }, "Grimmsnarl"] },
  ] },

  { id: "leads", title: "Suicide Leads", tag: "LEADS", roles: [
    { name: "Suicide Leads", move: "", mons: ["Landorus-Therian", "Mega Diancie", "Excadrill", "Mew", "Ribombee", "Azelf", "Araquanid"] },
  ] },

  { id: "trappers", title: "Trappers", tag: "TRAPPERS", roles: [
    { name: "Pursuit", move: "Pursuit", mons: ["Tyranitar", "Bisharp", "Weavile", "Mega Scizor", "Mega Tyranitar", "Muk-Alola"] },
    { name: "Magnet Pull", move: "Ability", mons: ["Magnezone"] },
    { name: "Magma Storm / Whirlpool / Block", move: "", mons: ["Heatran", "Azumarill", "Toxapex", "Pyukumuku"] },
    { name: "Infestation", move: "Infestation", mons: ["Toxapex"] },
  ] },

  { id: "weather", title: "Weather", tag: "WEATHER", roles: [
    { name: "Snow", move: "Snow Warning", mons: [{ name: "Slowking", note: "Chilly Reception" }, { name: "Ninetales-Alola", note: "Snow Warning" }] },
    { name: "Snow Abusers", move: "", mons: [{ name: "Kyurem", note: "Blizzard" }, { name: "Arctozolt", note: "Slush Rush" }] },
    { name: "Sand Setters", move: "Sand Stream", mons: [{ name: "Tyranitar", note: "Sand Stream" }, { name: "Mega Tyranitar", note: "Sand Stream" }, { name: "Hippowdon", note: "Sand Stream" }] },
    { name: "Sand Abusers", move: "", mons: [{ name: "Garchomp", note: "Sand Veil" }, { name: "Excadrill", note: "Sand Rush" }, { name: "Mega Garchomp", note: "Sand Force" }, { name: "Dracozolt", note: "Sand Rush" }] },
    { name: "Sun Setters", move: "Drought", mons: [{ name: "Mega Charizard Y", note: "Drought" }, { name: "Torkoal", note: "Drought" }, { name: "Ninetales", note: "Drought" }] },
    { name: "Sun Abusers", move: "", mons: ["Heatran", "Victini", { name: "Cresselia", note: "Moonlight" }, { name: "Venusaur", note: "chlorophyll" }, "Lilligant-Hisui"] },
    { name: "Rain Setter", move: "Drizzle", mons: [{ name: "Pelipper", note: "Drizzle" }] },
    { name: "Rain Abusers", move: "", mons: [{ name: "Tornadus-Therian", note: "Hurricane" }, { name: "Zapdos", note: "Hurricane" }, "Ferrothorn", { name: "Manaphy", note: "Hydration" }, "Azumarill", { name: "Mega Swampert", note: "Swift Swim" }, { name: "Kingdra", note: "Swift Swim" }, { name: "Araquanid", note: "Water Bubble" }, { name: "Barraskewda", note: "Swift Swim" }] },
  ] },

  { id: "trickroom", title: "Trick Room", tag: "TRICK ROOM", roles: [
    { name: "Trick Room Setters", move: "Trick Room", mons: ["Cresselia", "Uxie", "Porygon2", "Cofagrigus", "Bronzong"] },
    { name: "Trick Room Abusers", move: "", mons: ["Mega Mawile", "Ursaluna", "Hoopa-Unbound", "Victini", "Mega Heracross", "Crawdaunt", "Marowak-Alola"] },
  ] },

  { id: "status", title: "Status", tag: "STATUS", roles: [
    { name: "Paralyze", move: "", mons: [{ name: "Clefable", note: "Thunder Wave" }, { name: "Zapdos", note: "Discharge / Static" }, { name: "Ferrothorn", note: "Thunder Wave" }, { name: "Serperior", note: "Glare" }, { name: "Slowbro", note: "Thunder Wave" }, { name: "Hatterene", note: "Nuzzle" }, { name: "Chansey", note: "Thunder Wave" }, { name: "Rotom-Wash", note: "Thunder Wave" }, { name: "Jirachi", note: "Thunder Wave" }, { name: "Cresselia", note: "Thunder Wave" }, { name: "Latias", note: "Thunder Wave" }, { name: "Mew", note: "Thunder Wave" }, { name: "Magnezone", note: "Thunder Wave" }, { name: "Mega Altaria", note: "Body Slam" }, { name: "Thundurus-Therian", note: "Thunder Wave" }] },
    { name: "Burn", move: "", mons: [{ name: "Volcarona", note: "Flame Body" }, { name: "Heatran", note: "Will-O-Wisp" }, { name: "Victini", note: "Will-O-Wisp / Searing Shot" }, { name: "Mega Gardevoir", note: "Will-O-Wisp" }, { name: "Keldeo", note: "Scald" }, { name: "Slowbro", note: "Scald" }, { name: "Rotom-Wash", note: "Will-O-Wisp" }, { name: "Mega Sableye", note: "Will-O-Wisp" }, { name: "Volcanion", note: "Steam Eruption" }, { name: "Moltres", note: "Flame Body" }, { name: "Mew", note: "Will-O-Wisp" }, { name: "Pelipper", note: "Scald" }, { name: "Alomomola", note: "Scald" }, { name: "Torkoal", note: "Lava Plume" }, { name: "Gastrodon", note: "Scald" }, { name: "Mantine", note: "Scald" }, { name: "Toxapex", note: "Scald" }, { name: "Primarina", note: "Scald" }, { name: "Shedinja", note: "Will-O-Wisp" }] },
    { name: "Poison", move: "", mons: [{ name: "Landorus-Therian", note: "Toxic" }, { name: "Garchomp", note: "Toxic" }, { name: "Gliscor", note: "Toxic" }, { name: "Heatran", note: "Toxic" }, { name: "Ferrothorn", note: "Toxic" }, { name: "Clodsire", note: "Toxic / Poison Jab" }, { name: "Excadrill", note: "Toxic" }, { name: "Slowbro", note: "Toxic" }, { name: "Chansey", note: "Toxic" }, { name: "Kommo-o", note: "Toxic" }, { name: "Mega Venusaur", note: "Toxic / Sludge Bomb" }, { name: "Hippowdon", note: "Toxic" }, { name: "Volcanion", note: "Toxic" }, { name: "Cresselia", note: "Toxic" }, { name: "Mega Swampert", note: "Toxic" }, { name: "Magnezone", note: "Toxic" }, { name: "Alomomola", note: "Toxic" }, { name: "Mega Slowbro", note: "Toxic" }, { name: "Gastrodon", note: "Toxic" }, { name: "Toxapex", note: "Toxic / Toxic Spikes / Baneful Bunker" }, { name: "Shedinja", note: "Toxic" }] },
    { name: "Sleep", move: "", mons: [{ name: "Mega Venusaur", note: "Sleep Powder" }, { name: "Tangrowth", note: "Sleep Powder" }, { name: "Amoonguss", note: "Spore" }, { name: "Breloom", note: "Spore" }] },
    { name: "Status Absorbers", move: "Ability", mons: [{ name: "Mega Diancie", note: "Magic Bounce" }, { name: "Clefable", note: "Magic Guard" }, { name: "Gliscor", note: "Poison Heal" }, { name: "Hatterene", note: "Magic Bounce" }, { name: "Manaphy", note: "Hydration" }, { name: "Ursaluna", note: "Guts" }, { name: "Chansey", note: "Natural Cure" }, { name: "Mega Sableye", note: "Magic Bounce" }, { name: "Reuniclus", note: "Magic Guard" }, { name: "Altaria", note: "Natural Cure" }] },
  ] },
];

/* -----------------------------------------------------------------------------
   SPRITE_SLUGS — só para formas cujo arquivo de sprite tem nome diferente.
   Pokémon normais NÃO precisam entrar aqui (o slug é gerado do próprio nome).
   Formato:  "Nome exibido": "slug-do-arquivo"
   Se um sprite aparecer como placeholder (⊘), adicione o nome aqui.
   -------------------------------------------------------------------------- */
export const SPRITE_SLUGS = {
  "Mega Charizard X": "charizard-mega-x",
  "Mega Charizard Y": "charizard-mega-y",
  "Mega Mawile": "mawile-mega",
  "Mega Scizor": "scizor-mega",
  "Mega Medicham": "medicham-mega",
  "Mega Latias": "latias-mega",
  "Mega Latios": "latios-mega",
  "Mega Sableye": "sableye-mega",
  "Mega Diancie": "diancie-mega",
  "Mega Gyarados": "gyarados-mega",
  "Mega Pinsir": "pinsir-mega",
  "Mega Gallade": "gallade-mega",
  "Mega Lopunny": "lopunny-mega",
  "Mega Tyranitar": "tyranitar-mega",
  "Mega Venusaur": "venusaur-mega",
  "Mega Absol": "absol-mega",
  "Mega Camerupt": "camerupt-mega",
  "Mega Slowbro": "slowbro-mega",
  "Mega Heracross": "heracross-mega",
  "Mega Beedrill": "beedrill-mega",
  "Mega Aggron": "aggron-mega",
  "Kyurem-Black": "kyurem-black",
  "Landorus-Therian": "landorus-therian",
  "Tornadus-Therian": "tornadus-therian",
  "Thundurus-Therian": "thundurus-therian",
  "Ninetales-Alola": "ninetales-alola",
  "Marowak-Alola": "marowak-alola",
  "Rotom-Wash": "rotom-wash",
  "Hoopa-Unbound": "hoopa-unbound",
  "Zygarde": "zygarde",
  "Mega Swampert": "swampert-mega",
  "Mega Garchomp": "garchomp-mega",
  "Mega Altaria": "altaria-mega",
  "Mega Aerodactyl": "aerodactyl-mega",
  "Mega Sharpedo": "sharpedo-mega",
  "Mega Manectric": "manectric-mega",
  "Mega Gardevoir": "gardevoir-mega",
};

/* Base URL dos sprites (Smogon Mystery Dungeon). Troque aqui se um dia mudar. */
export const SPRITE_BASE = "https://www.smogon.com/forums/media/pmd/";
