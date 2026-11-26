/* Servidor local mínimo para o Kit UI — sem dependências externas.
   Uso: dê duplo clique em servir.bat (ou rode `node servir.js`).
   O navegador é aberto automaticamente quando o servidor está pronto.
   Use NO_OPEN=1 para apenas iniciar o servidor.

   Além dos arquivos estáticos, expõe a API local de estilos:
     GET  /api/estilos                    -> { padroes: [], importados: [] }
     POST /api/estilos/importados         -> grava <id>_import.json
     POST /api/estilos/importados/remover -> apaga o arquivo do id informado
*/

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 8080;
const ESTILOS = path.join(ROOT, 'tabs_n_buttons', 'estilos');
const PADROES_DIR = path.join(ESTILOS, 'padroes');
const IMPORTADOS_DIR = path.join(ESTILOS, 'importados');
const MAX_BODY = 2 * 1024 * 1024;

fs.mkdirSync(PADROES_DIR, { recursive: true });
fs.mkdirSync(IMPORTADOS_DIR, { recursive: true });

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
};

function sendJSON(res, status, value) {
  const body = Buffer.from(JSON.stringify(value), 'utf8');
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': body.length,
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        reject(new Error('Corpo da requisição muito grande'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function slug(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 42) || 'estilo';
}

/* Mantém somente os campos que descrevem um estilo. Nenhum HTML ou script
   enviado pelo cliente chega ao arquivo gravado. */
function sanitizeStyle(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  const tokens = {};
  const src = input.tokens && typeof input.tokens === 'object' && !Array.isArray(input.tokens) ? input.tokens : {};
  Object.keys(src).forEach((key) => {
    if (!/^--k-[a-z0-9-]+$/i.test(key)) return;
    if (typeof src[key] !== 'string' && typeof src[key] !== 'number') return;
    const value = String(src[key]).trim();
    if (value && value.length <= 400) tokens[key] = value;
  });
  if (!Object.keys(tokens).length) return null;
  const text = (v, max) => String(v == null ? '' : v).replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
  const swatch = Array.isArray(input.swatch)
    ? input.swatch.slice(0, 3).map((c) => text(c, 60)).filter(Boolean)
    : [];
  const meta = input.meta && typeof input.meta === 'object' && !Array.isArray(input.meta) ? input.meta : {};
  return {
    id: slug(input.id || input.name),
    name: text(input.name || input.title || 'Estilo importado', 48) || 'Estilo importado',
    family: text(input.family, 40) || 'Importado',
    note: text(input.note, 160),
    swatch,
    font: typeof input.font === 'string' ? text(input.font, 80) : null,
    radius: ['sharp', 'soft', 'round', 'pill'].indexOf(input.radius) >= 0 ? input.radius : 'soft',
    density: ['compact', 'regular', 'comfortable'].indexOf(input.density) >= 0 ? input.density : 'regular',
    tokens,
    meta: {
      source: typeof meta.source === 'string' ? text(meta.source, 400) : '',
      importedAt: typeof meta.importedAt === 'string' ? text(meta.importedAt, 40) : new Date().toISOString(),
      elements: Number.isFinite(meta.elements) ? meta.elements : null,
    },
  };
}

function readStyles(dir, suffix) {
  const out = [];
  let files = [];
  try {
    files = fs.readdirSync(dir).filter((name) => name.endsWith(suffix)).sort();
  } catch (e) {
    return out;
  }
  files.forEach((name) => {
    try {
      const style = sanitizeStyle(JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8')));
      if (style) out.push(style);
    } catch (e) {
      console.warn('Estilo ignorado (' + name + '): ' + e.message);
    }
  });
  return out;
}

function writeStyle(style) {
  const file = path.join(IMPORTADOS_DIR, slug(style.id) + '_import.json');
  fs.writeFileSync(file, JSON.stringify(style, null, 2) + '\n', 'utf8');
  return path.basename(file);
}

async function handleAPI(req, res, pathname) {
  if (req.method === 'GET' && pathname === '/api/estilos') {
    return sendJSON(res, 200, {
      padroes: readStyles(PADROES_DIR, '_padrao.json'),
      importados: readStyles(IMPORTADOS_DIR, '_import.json'),
    });
  }

  if (req.method === 'POST' && pathname === '/api/estilos/importados') {
    let data;
    try {
      data = JSON.parse(await readBody(req));
    } catch (e) {
      return sendJSON(res, 400, { ok: false, error: 'JSON inválido: ' + e.message });
    }
    const style = sanitizeStyle(data);
    if (!style) return sendJSON(res, 400, { ok: false, error: 'Nenhum token --k-* válido encontrado.' });
    try {
      const file = writeStyle(style);
      return sendJSON(res, 200, { ok: true, file, style });
    } catch (e) {
      return sendJSON(res, 500, { ok: false, error: 'Falha ao gravar o arquivo: ' + e.message });
    }
  }

  if (req.method === 'POST' && pathname === '/api/estilos/importados/remover') {
    let data;
    try {
      data = JSON.parse(await readBody(req));
    } catch (e) {
      return sendJSON(res, 400, { ok: false, error: 'JSON inválido: ' + e.message });
    }
    const id = slug(data && data.id);
    const file = path.join(IMPORTADOS_DIR, id + '_import.json');
    try {
      if (!fs.existsSync(file)) return sendJSON(res, 404, { ok: false, error: 'Arquivo do estilo não encontrado.' });
      fs.unlinkSync(file);
      return sendJSON(res, 200, { ok: true, file: path.basename(file) });
    } catch (e) {
      return sendJSON(res, 500, { ok: false, error: 'Falha ao remover o arquivo: ' + e.message });
    }
  }

  return sendJSON(res, 404, { ok: false, error: 'Rota não encontrada.' });
}

http
  .createServer(async (req, res) => {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    } catch (e) {
      res.writeHead(400).end('Bad request');
      return;
    }

    if (pathname.indexOf('/api/') === 0) {
      try {
        await handleAPI(req, res, pathname);
      } catch (e) {
        if (!res.headersSent) sendJSON(res, 500, { ok: false, error: e.message });
      }
      return;
    }

    if (pathname === '/') pathname = '/index.html';

    const file = path.resolve(ROOT, '.' + pathname);
    if (!file.startsWith(ROOT + path.sep)) {
      res.writeHead(403).end('Forbidden');
      return;
    }

    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found: ' + pathname);
        return;
      }
      res.writeHead(200, {
        'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-cache',
      });
      res.end(data);
    });
  })
  .listen(PORT, '127.0.0.1', () => {
    const url = 'http://localhost:' + PORT + '/';
    console.log('Kit UI disponível em ' + url);

    if (process.env.NO_OPEN) return;
    const command =
      process.platform === 'win32'
        ? 'start "" "' + url + '"'
        : process.platform === 'darwin'
          ? 'open "' + url + '"'
          : 'xdg-open "' + url + '"';
    exec(command, () => {});
  });
