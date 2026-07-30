/* =============================================================================
   roles-to-forum.js
   -----------------------------------------------------------------------------
   Converte roles-data.js em texto pronto pra colar num post de fórum
   (BBCode) ou em texto simples fácil de ler pra discussão.

   Uso:
     node roles-to-forum.js                 → BBCode, imprime no terminal
     node roles-to-forum.js -o post.txt      → BBCode, salva em post.txt
     node roles-to-forum.js --plain          → texto simples, imprime no terminal
     node roles-to-forum.js --plain -o x.txt → texto simples, salva em x.txt

   Não precisa de nada instalado além do Node (sem dependências, sem build).
   ========================================================================== */

const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "roles-data.js");

function loadData() {
  const src = fs.readFileSync(DATA_FILE, "utf8");
  // roles-data.js é um módulo ES ("export const ..."); aqui rodamos o mesmo
  // código como script comum, só trocando "export " por nada, e devolvemos
  // as constantes no final. Evita precisar de package.json com "type": "module".
  const body = src.replace(/export\s+const/g, "const");
  const fn = new Function(`${body}\nreturn { SECTIONS, SPRITE_SLUGS, SPRITE_BASE };`);
  return fn();
}

function monToText(mon) {
  if (typeof mon === "string") return mon;
  return mon.note ? `${mon.name} (${mon.note})` : mon.name;
}

/* ---------- BBCode (pra postar no fórum) ---------- */

function formatSectionBBCode(sec, index) {
  const num = String(index + 1).padStart(2, "0");
  const lines = [`[SIZE=5][B]${num} — ${sec.title.toUpperCase()}[/B][/SIZE]`, ""];

  sec.roles.forEach((role) => {
    const showMove = role.move && role.move !== role.name;
    const header = showMove ? `[B]${role.name}[/B] (${role.move})` : `[B]${role.name}[/B]`;
    const mons = role.mons.map(monToText).join(", ");
    lines.push(header, mons, "");
  });

  return lines.join("\n").trimEnd();
}

function buildBBCode({ SECTIONS }) {
  return SECTIONS.map(formatSectionBBCode).join("\n\n\n") + "\n";
}

/* ---------- Texto simples (pra ler/discutir) ---------- */

function formatSectionPlain(sec, index) {
  const num = String(index + 1).padStart(2, "0");
  const title = `${num} — ${sec.title.toUpperCase()}`;
  const lines = [title, "-".repeat(title.length), ""];

  sec.roles.forEach((role) => {
    const showMove = role.move && role.move !== role.name;
    const header = showMove ? `${role.name} (${role.move})` : role.name;
    const mons = role.mons.map(monToText).join(", ");
    lines.push(header, `  ${mons}`, "");
  });

  return lines.join("\n").trimEnd();
}

function buildPlain({ SECTIONS }) {
  return SECTIONS.map(formatSectionPlain).join("\n\n\n") + "\n";
}

function main() {
  const args = process.argv.slice(2);
  const outIndex = args.indexOf("-o");
  const outPath = outIndex !== -1 ? args[outIndex + 1] : null;
  const plain = args.includes("--plain");

  const data = loadData();
  const text = plain ? buildPlain(data) : buildBBCode(data);

  if (outPath) {
    fs.writeFileSync(outPath, text, "utf8");
    console.log(`Salvo em ${outPath}`);
  } else {
    console.log(text);
  }
}

main();
