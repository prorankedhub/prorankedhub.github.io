# CLAUDE.md — PRO Role Compendium

Contexto persistente do projeto. Leia antes de editar.

## O que é
Lista visual/interativa de papéis do metagame de **PRO OU** (Pokémon Revolution Online, fila **Ranked**). Baseado no SM OU Role Compendium do Smogon, filtrado para a disponibilidade do PRO. Sprites do set Mystery Dungeon do Smogon (`https://www.smogon.com/forums/media/pmd/<slug>.png`).

## Arquivos
- `Role Compendium.dc.html` — o app (Design Component: template + lógica). Visual **editorial** (papel bege `#f1ece1`, tinta, vermelho tijolo `#cf3a22`; fontes Bricolage Grotesque / Space Grotesk / Space Mono).
- `index.html` — **cópia idêntica** do app para GitHub Pages. Sempre que editar o `.dc.html`, copie por cima do `index.html`.
- `roles-data.js` — **fonte única dos dados** (categorias, papéis, Pokémon, slugs). A lógica importa via `import("./roles-data.js")`.
- `README.md` — guia de uso para o usuário final.

## Regras importantes
- **Dados só no `roles-data.js`.** Nunca voltar a embutir a lista no `.dc.html` — o usuário edita os dados sozinho, sem gastar crédito.
- **Sempre sincronizar `index.html`** após qualquer mudança no `Role Compendium.dc.html` (`copy_files` src→dest).
- **Disponibilidade do PRO:** NÃO existem Tapus, Magearna nem Ultra Beasts (exceto **Blacephalon**). Não reintroduzir esses. Ao mexer em listas, respeitar o que existe no PRO.
- **Manter o visual editorial.** O usuário testou uma versão retro e descartou. Não redesenhar sem pedido.
- Idioma da UI: **inglês**. Comentários/docs para o usuário: **português**.

## Formato dos dados (`roles-data.js`)
- `SECTIONS`: array de `{ id, title, tag, roles: [...] }` — cada bloco é uma tab (ordem = ordem na tela; "All" é automática).
- Papel: `{ name, move, mons: [...] }`.
- Entrada de `mons`: `"Nome"` **ou** `{ name, note }` — o `note` mostra o move/ability específico com que aquele Pokémon executa o papel (etiqueta vermelha no tile + no drawer). Strings e objetos podem coexistir.
- `SPRITE_SLUGS`: só formas cujo arquivo de sprite tem nome diferente do nome exibido.

## Detalhes técnicos a preservar
- **Carregador de sprites** (`pump()` na lógica): concorrência limitada (16), retry com backoff, placeholder só em 404 real. Trata: aba escondida no meio do load (timeout 9s), cache descartado, e **reuso de `<img>` pelo React ao trocar de tab** (compara `src` com `data-url` e recarrega se divergir). Não simplificar sem manter esses casos.
- Rodar exige servidor `http(s)` (o `import()` do módulo falha em `file://`). Documentado no README.
