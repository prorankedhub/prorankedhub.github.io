# PRO Ranked Hub

Uma caixa de ferramentas visual e interativa para o metagame de PRO OU (fila Ranked): compêndio de roles, speed tiers, viability ranking e um team builder. Busca por Pokémon, filtro por categoria e um painel que mostra todos os papéis de um Pokémon ao clicar nele.

Baseado no *SM OU Role Compendium* do Smogon, filtrado para a disponibilidade do PRO. Sprites do set Mystery Dungeon do Smogon (via SpriteCollab).

---

## Stack

Vite + React, sem TypeScript. Sem gerenciador de estado externo — o estado do app cabe em hooks simples (`src/hooks/`). Estilo em CSS puro, um arquivo por componente.

```
src/
  data/     dados que você edita (roles, viability, regras de sprite)
  lib/      lógica pura, sem estado — parsing, cálculo de speed, changelog...
  hooks/    estado + efeitos colaterais (localStorage, fetch, tema...)
  components/
    layout/   header, tabs, footer
    roles/    aba Role Compendium
    speed/    aba Speed Tiers
    vr/       aba Viability Ranking
    team/     aba Team Builder
    shared/   drawer de detalhe, modais, toast, export, print sheet
  styles/   tokens globais (cores/tema/print) + tiles.css (estados dos cards)
```

`legacy-dc/` guarda o `.dc.html` original (gerado pelo editor visual **Claude Design**) como registro histórico — não é mais editado nem servido; o projeto React em `src/` é a fonte de verdade.

---

## Como rodar

```bash
npm install
npm run dev       # servidor de desenvolvimento com hot-reload
npm run build     # build de produção em dist/
npm run preview   # serve o build de produção localmente, pra conferir antes do deploy
```

Os sprites e speeds vêm da internet (SpriteCollab e PokéAPI), então precisa de conexão.

---

## Deploy

Automático: todo push na `main` roda `.github/workflows/deploy.yml`, que builda e publica em GitHub Pages via GitHub Actions (**Settings → Pages → Source: GitHub Actions**, configurado uma vez só). Não precisa subir a pasta `dist/` manualmente.

O `vite.config.js` define `base: "/pro-role-compendium/"` (nome do repositório) — se o repositório for renomeado, atualize esse valor.

---

## Editando os dados (`src/data/roles-data.js`)

Tudo fica em `SECTIONS` (categorias, papéis e Pokémon). Mudou de pasta em relação à versão anterior, mas o formato é o mesmo.

### Categorias (tabs)
Cada bloco em `SECTIONS` vira uma tab, na ordem em que aparece no arquivo:

```js
{ id: "hazards", title: "Entry Hazards", tag: "HAZARDS", roles: [ ... ] }
```

- **Renomear a tab** → mude o `title`.
- **Reordenar** → mova o bloco de lugar (a numeração `01`, `02`… é automática).
- **Nova tab** → copie um bloco inteiro e dê um `id` único, sem espaços.
- **Remover** → apague o bloco.
- A tab **"All"** é gerada automaticamente e sempre fica em primeiro.

### Papéis
Dentro de `roles: [ ... ]`, cada papel é:

```js
{ name: "Stealth Rock", move: "Stealth Rock", mons: ["Landorus-Therian", "Heatran", ...] }
```

- `name` — título do papel (aparece no card).
- `move` — rótulo à direita do título (o move/mecânica geral). Deixe `""` para nenhum.
- `mons` — a lista de Pokémon.

Para **criar um papel**, copie um bloco `{ name, move, mons }` inteiro.

### Pokémon
Na lista `mons`, cada entrada pode ser um nome simples **ou** um objeto com anotação:

```js
mons: [
  "Ferrothorn",                                  // simples
  { name: "Kleavor", note: "Stone Axe" },        // mostra COMO ele executa o papel
  { name: "Samurott-Hisui", note: "Ceaseless Edge" },
  "Skarmory"
]
```

- Use o **nome em inglês** (`"Rotom-Wash"`, `"Mega Mawile"`, `"Landorus-Therian"`).
- O `note` aparece em vermelho embaixo do sprite e no painel de detalhe (ex.: *Stealth Rock · Stone Axe*). Use-o para casos de exceção — quando o Pokémon setta/executa a função com um move ou ability específico.
- Pode misturar strings e objetos na mesma lista.
- **Só aparece na tela quem está em `src/data/viability-data.js`** (`VIABILITY`) — um nome numa role que não esteja lá é ignorado. Adicione-o a um tier de lá primeiro.

### Regras de sintaxe (não quebre)
- Cada `"nome"` entre aspas; vírgula entre eles; **sem vírgula sobrando** no fim da lista.
- Objetos usam `{ name: "...", note: "..." }` com as chaves exatamente assim.

---

## Sprites

O sprite é buscado automaticamente a partir do nome do Pokémon (SpriteCollab, mesmo projeto PMD que a Smogon usa). Se algum aparecer como **placeholder (⊘)**, normalmente é uma forma alternativa (`Nome-Forma`) cujo sufixo o parser não reconhece — adicione o sufixo em `FORM_SUFFIXES` em `src/data/sprites.js`:

```js
export const FORM_SUFFIXES = ["Therian", "Alola", "Hisui", ...];
```

Espécies cujo hífen faz parte do nome (não separa uma forma, ex. `Porygon-Z`) entram em `NO_SPLIT_HYPHEN` no mesmo arquivo.

---

## Fluxo recomendado

1. `npm run dev`, edite `src/data/roles-data.js` num editor de texto.
2. Salve — o navegador atualiza sozinho (hot-reload).
3. Confirme visualmente, depois `git commit` e `git push` — o deploy é automático.
