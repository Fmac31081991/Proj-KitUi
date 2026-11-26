/* Aplicação de importação — aba Estilos.
   Toda a lógica específica desta aba vive aqui: prompt, dicas, normalização e
   gravação dos JSON em tabs_n_buttons/estilos/importados/. O app.js apenas abre a
   janela, repassa o texto digitado e aplica o resultado na memória.

   Contrato dos módulos de importação (um por aba):
     id        -> identificador da aba (ex.: "styles")
     label     -> nome exibido
     hint      -> { label, placeholder, html } para a janela de importação
     steps     -> HTML do passo a passo (opcional)
     prompt    -> prompt da IA (opcional; habilita o botão "Copiar prompt")
     normalize(input, opts) -> estilo validado ou null
     listar()               -> resposta de GET /api/estilos
     importar(texto, ids)   -> { ok, style, file, error }
     remover(id)            -> resposta de POST /api/estilos/importados/remover
*/
(function () {
  'use strict';

  const T = window.KIT_TOKENS;

  const AI_PROMPT = `COMO USAR ESTE PROMPT
 1. Abra o site no Chrome e pressione F12 → aba Console.
 2. Cole todo o conteúdo de tabs_n_buttons/import/extract-style.js e pressione Enter.
 3. Copie o JSON gerado ou rode: copy(JSON.stringify(window.__kitStyle, null, 2))
 4. Abra a IA do Chrome, cole este texto e, no final, cole o JSON extraído.
 5. Volte ao Kit UI → botão Importar no cabeçalho e cole a resposta da IA.

PROMPT PARA A IA
Você é engenheiro de design systems. Vou colar um JSON de estilo extraído de um
site pelo script tabs_n_buttons/import/extract-style.js. Normalize o estilo sem alterar os
valores de token já existentes.

Regras:
 1. Responda apenas com JSON válido, sem markdown, comentários ou texto fora.
 2. Preserve todas as chaves --k-* e seus valores exatamente como estão.
    Não invente cores, medidas, fontes ou sombras.
 3. Ajuste somente os campos descritivos:
    - id: slug minúsculo (até 42 caracteres);
    - name: nome curto do site/sistema (até 48 caracteres);
    - family: sempre "Importado";
    - note: uma frase objetiva sobre a aparência;
    - swatch: exatamente 3 cores [primária, superfície, texto];
    - font: null;
    - radius: "sharp" | "soft" | "round" | "pill";
    - density: "compact" | "regular" | "comfortable".
 4. Use meta.source (domínio) para nomear se o nome estiver genérico.
 5. Mantenha tokens como objeto de variáveis CSS. Não acrescente tokens que não
    estejam no JSON; se algo essencial faltar, não invente.
 6. Não inclua meta, URLs completas, dados pessoais ou texto da página.

Schema de saída:
{
  "id": "slug",
  "name": "Nome",
  "family": "Importado",
  "note": "Descrição curta.",
  "swatch": ["#RRGGBB", "#RRGGBB", "#RRGGBB"],
  "font": null,
  "radius": "soft",
  "density": "regular",
  "tokens": { "--k-bg": "...", "--k-text": "..." }
}

JSON extraído:
<cole aqui>`;

  const HINT = {
    label: 'JSON do estilo',
    placeholder: '{ &quot;name&quot;: &quot;Site&quot;, &quot;tokens&quot;: { &quot;--k-primary&quot;: &quot;#...&quot; } }',
    html: 'Aceita o objeto do extrator, um <b>tokens.json</b> (com <code>cssVariables</code>) ou um mapa de variáveis <code>--k-*</code>. O resultado é gravado como <code>tabs_n_buttons/estilos/importados/&lt;id&gt;_import.json</code>. Use <b>Copiar prompt p/ IA</b> para revisar o JSON antes de importar.',
  };

  const STEPS =
    '<ol>' +
    '<li>Abra o site no Chrome, pressione <code>F12</code> → <b>Console</b> e cole o conteúdo de <code>tabs_n_buttons/import/extract-style.js</code>.</li>' +
    '<li>Copie o JSON gerado — ou rode <code>copy(JSON.stringify(window.__kitStyle, null, 2))</code>.</li>' +
    '<li>Cole abaixo e clique em <b>Importar</b>. O estilo é aplicado e salvo automaticamente.</li>' +
    '</ol>';

  /* ------------------------------------------------------------------ */
  /* normalização                                                        */
  /* ------------------------------------------------------------------ */

  function slug(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 42);
  }

  function styleHost(source) {
    try {
      return new URL(source).hostname.replace(/^www\./, '');
    } catch (e) {
      return '';
    }
  }

  function uniqueStyleId(base, existingIds) {
    const list = Array.isArray(existingIds) ? existingIds : [];
    const root = slug(base) || 'importado';
    let id = root;
    let n = 2;
    while (list.indexOf(id) >= 0) {
      id = root + '-' + n;
      n++;
    }
    return id;
  }

  /* opts.preserveId mantém o id gravado no arquivo (leitura do acervo).
     Sem essa opção, um id repetido recebe sufixo -2, -3 etc. */
  function normalize(input, opts) {
    const options = opts || {};
    if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
    const tokens = {};
    const addToken = (key, value) => {
      if (key === undefined || key === null) return;
      const raw = String(key).trim();
      if (!raw) return;
      let k = /^--k-/.test(raw) ? raw : '--k-' + raw.replace(/^k-/, '').replace(/_/g, '-');
      if (!/^--k-[a-z0-9-]+$/i.test(k)) return;
      if (!/^--k-/.test(raw) && !Object.prototype.hasOwnProperty.call(T.BASE, k)) return;
      if (typeof value !== 'string' && typeof value !== 'number') return;
      const val = String(value).trim();
      if (!val || val.length > 400) return;
      tokens[k] = val;
    };
    const obj = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : null);
    const srcTokens = (obj(input.tokens) && Object.keys(input.tokens).length ? input.tokens : null) ||
      (obj(input.cssVariables) && Object.keys(input.cssVariables).length ? input.cssVariables : null) ||
      input;
    Object.keys(srcTokens).forEach((k) => addToken(k, srcTokens[k]));
    if (!Object.keys(tokens).length) {
      ['colors', 'shape', 'space', 'type', 'effects', 'backdrop'].forEach((section) => {
        const group = obj(input[section]);
        if (!group) return;
        Object.keys(group).forEach((k) => addToken(k, group[k]));
      });
    }
    if (!Object.keys(tokens).length) return null;

    const text = (v, max) => String(v || '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
    const source = obj(input.meta) && typeof input.meta.source === 'string' ? input.meta.source : '';
    const host = styleHost(source);
    const name = text(input.name || input.title || host || 'Estilo importado', 48) || 'Estilo importado';
    const fileId = String(input.id || '');
    const id = options.preserveId && /^[a-z0-9-]{1,42}$/.test(fileId)
      ? fileId
      : uniqueStyleId(input.id || name, options.existingIds);
    const pickSwatch = (v) => String(v || '').replace(/[^#a-z0-9(),.%\s/-]/gi, '').trim().slice(0, 60);
    const swatch = Array.isArray(input.swatch) && input.swatch.length >= 3
      ? input.swatch.slice(0, 3).map(pickSwatch)
      : [
          pickSwatch(tokens['--k-primary'] || T.BASE['--k-primary']),
          pickSwatch(tokens['--k-surface'] || T.BASE['--k-surface']),
          pickSwatch(tokens['--k-text'] || T.BASE['--k-text']),
        ];

    return {
      id,
      name,
      family: input.family === 'Padrão' || input.family === 'Padrao' ? 'Padrão' : 'Importado',
      note: text(input.note || (host ? 'Extraído de ' + host : 'Estilo importado'), 160),
      swatch,
      font: T.FONTS.some((f) => f.id === input.font) ? input.font : null,
      radius: ['sharp', 'soft', 'round', 'pill'].indexOf(input.radius) >= 0 ? input.radius : 'soft',
      density: ['compact', 'regular', 'comfortable'].indexOf(input.density) >= 0 ? input.density : 'regular',
      tokens,
      meta: {
        source,
        importedAt: obj(input.meta) && input.meta.importedAt ? text(input.meta.importedAt, 40) : new Date().toISOString(),
        elements: obj(input.meta) && input.meta.elements ? input.meta.elements : null,
      },
    };
  }

  /* ------------------------------------------------------------------ */
  /* API local (servir.js / servir.py)                                    */
  /* ------------------------------------------------------------------ */

  async function request(url, body) {
    try {
      const res = await fetch(url, body === undefined
        ? { cache: 'no-store' }
        : {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });
      let data = null;
      try {
        data = await res.json();
      } catch (e) {}
      return { ok: res.ok, data };
    } catch (e) {
      return { ok: false, data: null };
    }
  }

  function listar() {
    return request('/api/estilos');
  }

  function gravar(style) {
    return request('/api/estilos/importados', style);
  }

  function remover(id) {
    return request('/api/estilos/importados/remover', { id });
  }

  async function importar(texto, existingIds) {
    let data;
    try {
      data = JSON.parse(texto);
    } catch (e) {
      return { ok: false, error: 'JSON inválido: ' + e.message };
    }
    const style = normalize(data, { existingIds });
    if (!style) {
      return { ok: false, error: 'Nenhum token --k-* encontrado. Use o JSON completo do extrator ou um tokens.json.' };
    }
    /* O disco é a fonte da verdade: se a API falhar, nada muda na memória. */
    const saved = await gravar(style);
    if (!saved.ok) {
      const why = saved.data && saved.data.error ? saved.data.error : 'o servidor local não respondeu';
      return { ok: false, error: 'Não foi possível gravar o arquivo do estilo: ' + why + '. Inicie com servir.js ou servir.py.' };
    }
    return {
      ok: true,
      style: saved.data && saved.data.style ? saved.data.style : style,
      file: saved.data && saved.data.file ? saved.data.file : '',
    };
  }

  window.KIT_IMPORT_ESTILOS = {
    id: 'styles',
    label: 'Estilos',
    hint: HINT,
    steps: STEPS,
    prompt: AI_PROMPT,
    normalize,
    listar,
    gravar,
    remover,
    importar,
  };
})();
