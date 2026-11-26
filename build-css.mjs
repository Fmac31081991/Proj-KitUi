// Ferramenta manual de build — fora da aplicação.
// Não é carregada pelo Kit UI em tempo de execução; rode apenas ao alterar kit.css.
// Gera KitUi/tabs_n_buttons/componentes/padroes/kit-css.js com o texto de kit.css embutido.
// Necessário porque o app roda via file://, onde fetch() de arquivos locais é bloqueado.
// Uso: node build-css.mjs  (a partir da raiz de Proj KitUi)
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, 'KitUi');
const SRC = path.join(ROOT, 'tabs_n_buttons/componentes/padroes/kit.css');
const OUT = path.join(ROOT, 'tabs_n_buttons/componentes/padroes/kit-css.js');

const css = fs.readFileSync(SRC, 'utf8');

const blocks = [...css.matchAll(/\/\* @c ([a-z0-9-]+) \*\//g)].map((m) => m[1]);
const ends = [...css.matchAll(/\/\* @end \*\//g)].length;
const hasBase = /\/\* @base \*\//.test(css);

if (!hasBase) throw new Error('kit.css sem marcador /* @base */');
if (blocks.length !== ends) {
  throw new Error(`Marcadores desbalanceados: ${blocks.length} @c, ${ends} @end`);
}
const dupes = blocks.filter((b, i) => blocks.indexOf(b) !== i);
if (dupes.length) throw new Error('Blocos @c duplicados: ' + [...new Set(dupes)].join(', '));

fs.writeFileSync(
  OUT,
  `/* Gerado por ../build-css.mjs — não editar à mão. */\n` +
    `window.KIT_CSS = ${JSON.stringify(css)};\n`,
  'utf8'
);

console.log(
  `kit-css.js: ${(fs.statSync(OUT).size / 1024).toFixed(1)} KB · ` +
    `${blocks.length} blocos (@base + ${blocks.length}) · ${ends} fechamentos`
);
