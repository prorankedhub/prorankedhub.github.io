# PRO Role Compendium

Uma lista visual e interativa de quais Pokémon cumprem cada papel no metagame de PRO OU (fila Ranked). Busca por Pokémon, filtro por categoria e um painel que mostra todos os papéis de um Pokémon ao clicar nele.

Baseado no *SM OU Role Compendium* do Smogon, filtrado para a disponibilidade do PRO. Sprites do set Mystery Dungeon do Smogon.

---

## Arquivos

| Arquivo | O que é |
|---|---|
| `Role Compendium.dc.html` | O app (visual + lógica). Não precisa editar para mudar dados. |
| `index.html` | Cópia idêntica do app, com o nome que o GitHub Pages usa como página inicial. |
| `roles-data.js` | **O único arquivo que você edita** — todos os Pokémon, papéis e categorias. |

> Ao mover, publicar ou enviar, mantenha o `.html` e o `roles-data.js` **na mesma pasta**.

---

## Como rodar

Os sprites vêm da internet, então precisa de conexão. O app carrega os dados via módulo JavaScript, o que **não funciona abrindo o arquivo com duplo-clique** (`file://` bloqueia por segurança). Use uma destas opções:

### Localmente (servidor simples)
Abra o terminal na pasta dos arquivos e rode uma das opções:

- **Python:** `python -m http.server` → acesse `http://localhost:8000/`
- **VS Code:** extensão *Live Server* → clique direito no `index.html` → *Open with Live Server*
- **Node:** `npx serve`

### No GitHub Pages
1. Suba `index.html` e `roles-data.js` (e, se quiser, o `Role Compendium.dc.html`) no repositório.
2. Em **Settings → Pages**, aponte para a branch/pasta.
3. Pronto — o Pages serve via `https://`, então o app carrega normalmente. Editar os dados = commit no `roles-data.js`.

---

## Editando os dados (`roles-data.js`)

Tudo fica em duas estruturas: `SECTIONS` (categorias, papéis e Pokémon) e `SPRITE_SLUGS` (só para formas com sprite de nome diferente).

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

### Regras de sintaxe (não quebre)
- Cada `"nome"` entre aspas; vírgula entre eles; **sem vírgula sobrando** no fim da lista.
- Objetos usam `{ name: "...", note: "..." }` com as chaves exatamente assim.

---

## Sprites

O sprite é buscado automaticamente a partir do nome do Pokémon. Se algum aparecer como **placeholder (⊘)**, o arquivo do sprite tem um nome diferente do Pokémon — adicione uma linha em `SPRITE_SLUGS`:

```js
export const SPRITE_SLUGS = {
  "Mega Mawile": "mawile-mega",
  "Nome exibido": "slug-do-arquivo",
  ...
};
```

Formas normais **não** precisam entrar aqui. A base das imagens fica em `SPRITE_BASE`, no fim do arquivo — troque ali se um dia a fonte dos sprites mudar.

---

## Fluxo recomendado

1. Edite `roles-data.js` num editor de texto (VS Code, Notepad++, etc.).
2. Salve.
3. Recarregue a página (servidor local) ou dê commit (GitHub Pages).

Nenhum passo de build ou instalação é necessário.
