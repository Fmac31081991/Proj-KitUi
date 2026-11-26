// Ferramenta manual de build — fora da aplicação.
// Não é carregada pelo Kit UI em tempo de execução; rode apenas ao alterar o acervo de ícones.
// Gera KitUi/tabs_n_buttons/icones/icons-data.js e um arquivo .svg por ícone do acervo.
// Uso: node build-icons.mjs  (a partir da raiz de Proj KitUi)
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, 'KitUi');
const SRC = 'D:/Users/fimis/Documents/Projeto Icones Vetor OpenCode/entrega/icones-criados';
const ICON_DIR = path.join(ROOT, 'tabs_n_buttons/icones/padroes');
const OUT = path.join(ROOT, 'tabs_n_buttons/icones/icons-data.js');

const manifest = JSON.parse(fs.readFileSync(path.join(SRC, 'icons.json'), 'utf8'));
const missing = [];
const icons = [];
const svgIds = new Set();

fs.mkdirSync(ICON_DIR, { recursive: true });

for (const icon of manifest.icons) {
  const file = path.join(SRC, 'svg', `${icon.id}.svg`);
  if (!fs.existsSync(file)) {
    missing.push(icon.id);
    continue;
  }
  const raw = fs.readFileSync(file, 'utf8');

  // Cada ícone também existe como arquivo SVG independente dentro do acervo local.
  // O envelope original é preservado integralmente; apenas normaliza-se o fim de linha.
  fs.writeFileSync(path.join(ICON_DIR, `${icon.id}.svg`), raw.trim() + '\n', 'utf8');
  svgIds.add(icon.id);

  const inner = raw
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>[\s\S]*$/, '')
    .replace(/\s*\n\s*/g, '')
    .trim();
  icons.push({
    id: icon.id,
    label: icon.label,
    category: icon.category,
    aliases: icon.aliases || [],
    svg: inner,
  });
}

// Remove SVGs que não pertencem mais ao acervo.
for (const name of fs.readdirSync(ICON_DIR)) {
  if (name.endsWith('.svg') && !svgIds.has(name.slice(0, -4))) {
    fs.unlinkSync(path.join(ICON_DIR, name));
  }
}

const categories = [...new Set(icons.map((i) => i.category))].sort();
const payload = {
  meta: {
    name: manifest.meta.name,
    version: manifest.meta.version,
    updated: manifest.meta.updated,
    grid: manifest.meta.grid,
    stroke: manifest.meta.stroke,
    count: icons.length,
    categories,
  },
  icons,
};

fs.writeFileSync(
  OUT,
  `/* Gerado por ../build-icons.mjs — não editar à mão. */\n` +
    `window.KIT_ICONS = ${JSON.stringify(payload)};\n`,
  'utf8'
);

console.log(`icons-data.js: ${icons.length} ícones, ${(fs.statSync(OUT).size / 1024).toFixed(0)} KB`);
console.log(`SVGs locais: ${svgIds.size} arquivos em tabs_n_buttons/icones/padroes/`);
if (missing.length) console.warn('Sem arquivo SVG:', missing.join(', '));
