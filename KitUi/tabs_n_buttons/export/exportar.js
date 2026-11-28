/* exportar.js — aplicação de exportação do Kit UI.
   Gera o catálogo completo (instruções, 39 componentes, 29 padrões, 473 ícones e
   tokens), o CSS, o JSON de tokens, o README e o pacote ZIP a partir do estado
   atual. O escritor ZIP fica em zipper.js; a folha e os downloads ficam aqui.
   Exposto em window.KIT_EXPORTAR para o orquestrador apenas delegar. */
(function () {
  'use strict';

  const CORE = window.KIT_CORE;
  const T = CORE.T, C = CORE.C, P = CORE.P, IC = CORE.IC, E = CORE.E;
  const KIT_CSS = CORE.KIT_CSS, UI = CORE.UI;
  const state = CORE.state, els = CORE.els;
  const resolvedTokens = CORE.resolvedTokens, embeddedFontCSS = CORE.embeddedFontCSS;
  const toast = CORE.toast;

  const slug = (s) => String(s).toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const escHTML = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  /* Descrições podem ter uma quebra explícita (<br>); preservá-la no catálogo. */
  const descHTML = (s) => escHTML(s).replace(/&lt;br&gt;/g, '<br>');

  function sheetSubject() {
    if (state.tab === 'icons') return 'ícone ' + state.icon;
    if (state.tab === 'emojis') return 'emoji ' + (emojiItemExport().name || state.emoji);
    if (state.tab === 'textures') return 'textura do palco';
    if (state.tab === 'stages') return 'fundo do palco';
    if (state.tab === 'tokens') return 'tokens do estilo';
    if (state.tab === 'fonts') return 'tipografia';
    return (currentEntry() || {}).title || 'item';
  }

  function currentEntry() {
    if (state.tab === 'components') return C.components.find((c) => c.id === state.comp);
    if (state.tab === 'patterns') return P.patterns.find((p) => p.id === state.pattern);
    return C.components.find((c) => c.id === state.comp);
  }

  function currentCode() {
    if (state.tab === 'icons') return currentSvg();
    if (state.tab === 'emojis') return currentEmojiHTML();
    if (state.tab === 'textures') {
      const tex = state.overrides.texture
        ? T.TEXTURES[state.overrides.texture] || {}
        : T.styleById(state.style).tokens;
      const img = String(tex['--k-texture'] || 'none').replace(/"/g, "'");
      const size = tex['--k-texture-size'] || 'auto';
      const op = state.overrides.textureOpacity === null || state.overrides.textureOpacity === undefined
        ? String(tex['--k-texture-opacity'] || 1)
        : state.overrides.textureOpacity;
      return (
        '<div class="kit" style="--k-texture: ' + img + '; --k-texture-size: ' + size + '; --k-texture-opacity: ' + op + '">\n' +
        '  <!-- conteúdo do kit -->\n' +
        '</div>'
      );
    }
    if (state.tab === 'stages') {
      const val = state.overrides.stageBg ||
        (state.overrides.stage && T.STAGE_PRESETS[state.overrides.stage]
          ? T.STAGE_PRESETS[state.overrides.stage].value
          : 'var(--k-stage-bg)');
      return (
        '<div class="kit" style="--k-stage-bg: ' + val + '">\n' +
        '  <!-- conteúdo do kit -->\n' +
        '</div>'
      );
    }
    const entry = currentEntry();
    if (!entry) return '';
    if (entry.id === 'overview' || entry.id === 'dashboard' || entry.id === 'login' || entry.id === 'settings') {
      return entry.demo();
    }
    return entry.code || '';
  }

  function currentSvg() {
    const icon = IC.icons.find((i) => i.id === state.icon) || IC.icons[0];
    return (
      '<svg class="k-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + icon.svg + '</svg>'
    );
  }

  function iconSVG(icon, cls) {
    return (
      '<svg class="k-icon' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      icon.svg + '</svg>'
    );
  }

  /* Biblioteca associada ao estilo atual — é ela que entra no kit exportado,
     independentemente da biblioteca em prévia na aba Emojis. */
  function emojiLibId() {
    return CORE.emojiLibForStyle
      ? CORE.emojiLibForStyle()
      : ((window.KIT_EMOJI_LIBS || {}).padrao || 'fluent-emoji');
  }

  function emojiItemExport() {
    const id = emojiLibId();
    const lista = (E.itemsFor ? E.itemsFor(id) : E.items) || [];
    return lista.find((i) => i.e === state.emoji) || lista[0] ||
      E.items.find((i) => i.e === state.emoji) || E.items[0] || {};
  }

  function emojiExportPath(emoji) {
    return 'emojis/' + emojiLibId() + '/' + (emoji && emoji.e ? emoji.e : state.emoji) + '.svg';
  }

  function currentEmojiHTML() {
    const emoji = emojiItemExport();
    /* Itens importados pelo usuário são caracteres Unicode, não SVGs locais. */
    if (!emoji.hex) {
      return '<span aria-label="' + escHTML(emoji.name || 'Emoji') + '">' +
        escHTML(emoji.e || '') + '</span>';
    }
    return '<img src="' + escHTML(emojiExportPath(emoji)) + '" width="32" height="32" alt="">';
  }

  function snippetCSS() {
    const html = currentCode();
    return baseVarsCSS() + '\n\n' + cssBlocksFor(html) + '\n\n/* Uso */\n.kit { padding: 24px; }';
  }

  async function activeFontCSS() {
    const fontId = state.overrides.font || T.styleById(state.style).font;
    return embeddedFontCSS(fontId);
  }

  async function buildSnippet() {
    const fonts = await activeFontCSS();
    return (
      '<style>\n' + (fonts ? fonts + '\n\n' : '') + baseVarsCSS() + '\n\n' + cssBlocksFor(currentCode()) +
      '\n</style>\n\n<div class="kit">\n' + currentCode() + '\n</div>'
    );
  }

  function baseVarsCSS() {
    const t = resolvedTokens();
    return ':root {\n' + Object.keys(t).map((k) => '  ' + k + ': ' + t[k] + ';').join('\n') + '\n}';
  }

  async function buildCSSFile() {
    const fonts = await activeFontCSS();
    return (
      '/* Kit UI — ' + T.styleById(state.style).name + ' · gerado em ' + new Date().toISOString().slice(0, 10) + ' */\n' +
      (fonts ? '/* fontes locais incorporadas */\n' + fonts + '\n\n' : '') +
      baseVarsCSS() + '\n\n' + KIT_CSS
    );
  }

  function cssBlocks() {
    const out = [];
    const re = /\/\* @c ([a-z0-9-]+) \*\/([\s\S]*?)\/\* @end \*\//g;
    let m;
    while ((m = re.exec(KIT_CSS))) {
      const classes = new Set((m[2].match(/\.k-[a-z0-9_-]+/g) || []).map((c) => c.slice(1)));
      out.push({ id: m[1], css: m[2].trim(), classes: classes });
    }
    const baseM = /\/\* @base \*\/([\s\S]*?)\/\* @c /.exec(KIT_CSS);
    if (baseM) out.unshift({ id: 'base', css: baseM[1].trim(), classes: new Set() });
    return out;
  }

  function cssBlocksFor(html) {
    const used = new Set((html.match(/k-[a-z0-9_-]+/g) || []).map((c) => c.slice(0)));
    const blocks = cssBlocks();
    return blocks
      .filter((b) => b.id === 'base' || Array.from(b.classes).some((c) => used.has(c)))
      .map((b) => '/* ' + b.id + ' */\n' + b.css)
      .join('\n\n');
  }

  function tokensJSON() {
    const t = resolvedTokens();
    const st = T.styleById(state.style);
    const pick = (pred) => {
      const o = {};
      Object.keys(t).filter(pred).forEach((k) => {
        o[k.replace('--k-', '')] = t[k];
      });
      return o;
    };
    return {
      name: st.name + ' — ajustado',
      base: st.id,
      generated: new Date().toISOString(),
      grid: 8,
      colors: pick((k) => /^--k-(bg|surface|surface-2|text|muted|border|primary|on-primary|accent|on-accent|danger|on-danger|success|on-success|focus)$/.test(k)),
      shape: pick((k) => /^--k-(radius|bw)/.test(k)),
      space: pick((k) => /^--k-(sp|gap|pad|control-h|card-pad|section-pad)/.test(k)),
      type: pick((k) => /^--k-(font|fs|lh|weight|track|transform)/.test(k)),
      effects: pick((k) => /^--k-(shadow|blur|saturate|btn|dur|ease)/.test(k)),
      backdrop: pick((k) => /^--k-(stage|texture)/.test(k)),
      cssVariables: t,
    };
  }

  /* ------------------------------------------------------------------ */
  /* Catálogo exportado (index.html)                                     */
  /* ------------------------------------------------------------------ */

  const COMBINACOES = [
    { nome: 'Painel de trabalho', receita: 'appbar + sidebar + search + table + pagination', uso: 'Listas densas com filtro no topo e navegação lateral.' },
    { nome: 'Cadastro em etapas', receita: 'field + choice + combobox + datetime + upload + progress', uso: 'Formulários longos divididos em blocos com progresso.' },
    { nome: 'Resumo de métricas', receita: 'stat + card + badge + chart + divider', uso: 'Dashboards e páginas de acompanhamento.' },
    { nome: 'Confirmação de ação', receita: 'modal + alert + button + toast', uso: 'Excluir, publicar ou salvar com feedback depois da ação.' },
    { nome: 'Conteúdo deslizante', receita: 'carousel + card + avatar + list', uso: 'Destaques, galerias e recomendações.' },
    { nome: 'Navegação em camadas', receita: 'breadcrumb + tabs + drawer + floatbar', uso: 'Produtos com várias seções e ações contextuais.' },
    { nome: 'Lista de pessoas', receita: 'avatar + list + badge + search + empty', uso: 'Diretórios, times e contatos com estado vazio.' },
    { nome: 'Carregamento e espera', receita: 'skeleton + spinner + progress + tooltip', uso: 'Estados transitórios sem quebrar o layout.' },
    { nome: 'Tela de login', receita: 'card + field + button + footer', uso: 'Acesso com branding e links secundários.' },
    { nome: 'Notificações contextuais', receita: 'toast + alert + badge + notifications', uso: 'Avisos curtos sem interromper a leitura.' },
  ];

  /* Regras universais de layout enviadas na exportação (Guia Kit.txt, Seção 6.3
     do documento de regras). Não são as notas da moldura do Kit UI. */
  const LAYOUT_RULES_ZIP = [
    'Grade de 8 pontos: espaçamentos, margens, paddings e dimensões em múltiplos de 8 (8, 16, 24, 32, 48, 64px). Reserve 4px só para microajustes, como a distância entre ícone e texto.',
    'Colunas responsivas: desktop 12 colunas (margens de 24 a 80px, gutter de 16 a 24px); tablet 8 (24 a 32px, gutter 16px); mobile 4 (16 a 20px, gutter 16px).',
    'Área mínima de toque: 44×44px no iOS e 48×48px no Android; deixe pelo menos 8px entre botões para evitar toques acidentais.',
    'Tipografia: corpo de 16px com entrelinha 1,5 (24px); títulos em escala 1,25× ou 1,333× — 20, 24, 32, 40px e assim por diante.',
    'Zona útil de 1280×600px, centralizada nos dois eixos. O que ultrapassar deve rolar dentro da própria caixa, com barra de rolagem estilizada, nunca expandir a interface.',
    'Parâmetros por estilo: Material (raio 8–16px, sem borda, sombra difusa, padding 16–24px); Flat (0–6px, sem sombra, padding 12–16px); Glass (16–24px, borda 1px translúcida, blur 12px, padding 20–32px); Neumorfismo (16–30px, sombra dupla, padding amplo); Neobrutalismo (0–4px, borda preta 2–4px, sombra dura); Bento (20–32px, borda fina, padding simétrico); Minimalismo (4–8px, sem sombra, padding 32–64px); Clay (24–40px, sombra externa suave e duas internas, padding 24–32px).',
  ];

  const GUIA_ITENS = [
    { titulo: 'Comece pelos padrões', texto: 'Escolha primeiro o padrão mais próximo da tela desejada. Cada padrão já vem com a lista de componentes que usa e dos componentes compatíveis para trocar peças sem perder a harmonia.' },
    { titulo: 'Sempre dentro de .kit', texto: 'Envolva a interface em <div class="kit">. É esse container que recebe as variáveis --k-* e as fontes do estilo.' },
    { titulo: 'Nunca fixe cor no componente', texto: 'Use as variáveis --k-bg, --k-surface, --k-text, --k-primary e --k-border. Para trocar o tema, basta substituir o bloco :root.' },
    { titulo: 'Hierarquia de texto', texto: '--k-fs-h1 para títulos de tela, --k-fs-h3 para seções, --k-fs para texto corrido e --k-fs-sm para metadados.' },
    { titulo: 'Espaçamento consistente', texto: 'Grid de 8 pontos. Use --k-sp-1 a --k-sp-7, --k-gap e --k-pad em vez de valores avulsos.' },
    { titulo: 'Forma e escala', texto: '--k-radius-* controla cantos; --k-bw controla traço de borda. Alterar só esses dois já muda bastante a aparência.' },
    { titulo: 'Ícones acessíveis', texto: 'Todos os SVGs são 24×24, traço 2 e currentColor. Eles são decorativos: ícone sozinho dentro de botão precisa de aria-label.' },
    { titulo: 'Estados são parte do kit', texto: 'empty, skeleton, spinner, progress, toast e alert devem ser previstos desde o início, não acrescentados depois.' },
    { titulo: 'Componentes são peças, não o produto final', texto: 'Componentes isolados podem não combinar entre si. Use-os para ajustar um padrão: troque botões, campos, menus e etiquetas mantendo o mesmo estilo.' },
    { titulo: 'Evite redundância descritiva', texto: 'O contexto já dado pela aba ou pelo painel não deve ser repetido logo abaixo: não escreva “Fontes” dentro da aba Fontes, nem repita o nome da fonte no título e no card seguinte, nem a mesma frase de exemplo em dois cards, nem “Propriedades” dentro do painel de propriedades. Não coloque um componente igual dentro de outro, como aba dentro de aba, salvo pedido explícito do projeto. Cada informação aparece uma vez, no lugar onde ajuda a decisão.' },
  ];

  /* Ligação padrão → componentes. Quando o padrão não declara "uses", a lista
     é deduzida das classes k-* presentes no HTML de demonstração. */
  function patternParts(p) {
    const byId = (id) => C.components.find((c) => c.id === id);
    if (Array.isArray(p.uses)) {
      return {
        used: p.uses.map(byId).filter(Boolean),
        compatible: Array.isArray(p.compatible) ? p.compatible.map(byId).filter(Boolean) : [],
      };
    }
    let html = '';
    try { html = p.demo ? p.demo() : ''; } catch (e) { html = ''; }
    const classes = new Set(String(html).match(/k-[a-z0-9_-]+/g) || []);
    const hits = [];
    C.components.forEach((c) => {
      const own = new Set(String(c.code || '').match(/k-[a-z0-9_-]+/g) || []);
      let n = 0;
      own.forEach((k) => { if (classes.has(k)) n += 1; });
      if (n) hits.push({ c, n });
    });
    hits.sort((a, b) => b.n - a.n);
    const used = hits.slice(0, 10).map((x) => x.c);
    const usedIds = used.map((c) => c.id);
    const groups = used.map((c) => c.group).filter((g, i, a) => a.indexOf(g) === i);
    const compatible = C.components.filter((c) => usedIds.indexOf(c.id) < 0 && groups.indexOf(c.group) >= 0).slice(0, 12);
    return { used, compatible };
  }

  const partsText = (list) => list.length ? list.map((c) => c.title).join(', ') : '—';

  function catalogCSS() {
    return [
      '/* Catálogo — navegação e apresentação. Usa apenas tokens --k-*. */',
      'body { margin: 0; background: var(--k-stage-bg); color: var(--k-text); font-family: var(--k-font); font-size: var(--k-fs); line-height: var(--k-lh); }',
      '.cat { display: grid; grid-template-columns: 232px minmax(0, 1fr); min-height: 100vh; }',
      '.cat-nav { position: sticky; top: 0; height: 100vh; overflow: auto; box-sizing: border-box; padding: 18px 14px 40px; background: var(--k-surface); border-right: var(--k-bw) solid var(--k-border); }',
      '.cat-brand { font-size: var(--k-fs-h3); font-weight: var(--k-weight-strong); letter-spacing: var(--k-track); padding: 0 8px 14px; }',
      '.cat-brand small { display: block; font-size: var(--k-fs-sm); font-weight: var(--k-weight); color: var(--k-muted); letter-spacing: 0; }',
      '.cat-nav a { display: block; padding: 5px 8px; border-radius: var(--k-radius-sm); color: var(--k-muted); text-decoration: none; font-size: var(--k-fs-sm); }',
      '.cat-nav a:hover { color: var(--k-primary); background: color-mix(in srgb, var(--k-primary) 10%, transparent); }',
      '.cat-nav a small { float: right; opacity: .65; }',
      '.cat-nav__group { margin: 16px 8px 5px; font-size: 9.5px; letter-spacing: .14em; text-transform: uppercase; color: var(--k-muted); font-weight: var(--k-weight-label); }',
      '.cat-main { min-width: 0; padding: 26px 32px 90px; max-width: 1240px; }',
      '.cat-hero { padding: 22px 24px; border: var(--k-bw) solid var(--k-border); border-radius: var(--k-radius-lg); background: var(--k-surface); }',
      '.cat-hero h1 { margin: 0 0 6px; font-size: var(--k-fs-h1); letter-spacing: var(--k-track); }',
      '.cat-hero p { margin: 0; color: var(--k-muted); max-width: 70ch; }',
      '.cat-hero__stats { display: flex; flex-wrap: wrap; gap: var(--k-sp-2); margin-top: 16px; }',
      '.cat-hero__stats span { padding: 5px 9px; border: var(--k-bw) solid var(--k-border); border-radius: var(--k-radius-pill); font-size: var(--k-fs-sm); }',
      '.cat-search { width: 100%; box-sizing: border-box; margin: 18px 0 4px; padding: 10px 12px; color: var(--k-text); background: var(--k-surface); border: var(--k-bw) solid var(--k-border); border-radius: var(--k-radius-md); font: inherit; }',
      '.cat-search::placeholder { color: var(--k-muted); }',
      '.cat-section { margin-top: 38px; scroll-margin-top: 14px; }',
      '.cat-section > h2 { margin: 0 0 4px; font-size: var(--k-fs-h2); letter-spacing: var(--k-track); }',
      '.cat-section > h2 small { font-size: var(--k-fs-sm); color: var(--k-muted); font-weight: var(--k-weight); }',
      '.cat-section__intro { margin: 0 0 16px; color: var(--k-muted); max-width: 78ch; }',
      '.cat-subgroup { margin: 26px 0 10px; font-size: var(--k-fs-h3); scroll-margin-top: 14px; }',
      '.guide-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--k-sp-3); }',
      '.guide-card { padding: 14px; border: var(--k-bw) solid var(--k-border); border-radius: var(--k-radius-md); background: var(--k-surface); }',
      '.guide-card b { display: block; margin-bottom: 5px; font-size: var(--k-fs); }',
      '.guide-card p { margin: 0; color: var(--k-muted); font-size: var(--k-fs-sm); }',
      '.cat-rules, .cat-combos { padding: 14px 18px; margin-top: 18px; border: var(--k-bw) solid var(--k-border); border-radius: var(--k-radius-md); background: var(--k-surface); }',
      '.cat-rules li, .cat-combos li { margin: 6px 0; font-size: var(--k-fs-sm); }',
      '.cat-item { margin: 14px 0; padding: 16px 18px; border: var(--k-bw) solid var(--k-border); border-radius: var(--k-radius-lg); background: var(--k-surface); scroll-margin-top: 14px; }',
      '.cat-item__head { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }',
      '.cat-item h4 { margin: 0; font-size: var(--k-fs-h3); }',
      '.cat-item__id { font-family: var(--k-font-mono); font-size: 10px; color: var(--k-muted); }',
      '.cat-item__desc { margin: 6px 0 12px; color: var(--k-muted); font-size: var(--k-fs-sm); max-width: 78ch; }',
      '.cat-code { margin-top: 12px; }',
      '.cat-code summary { cursor: pointer; color: var(--k-primary); font-size: var(--k-fs-sm); }',
      '.cat-code pre { overflow: auto; max-height: 420px; margin: 8px 0 0; padding: 12px; background: var(--k-bg); border: var(--k-bw) solid var(--k-border); border-radius: var(--k-radius-md); font-family: var(--k-font-mono); font-size: 10.5px; line-height: 1.5; }',
      '.spec-block { display: flex; flex-direction: column; gap: 7px; }',
      '.spec-label { font-size: 9.5px; letter-spacing: .14em; text-transform: uppercase; color: var(--k-muted); font-weight: var(--k-weight-label); }',
      '.spec-stage { padding: var(--k-pad) 12px; border: var(--k-bw) dashed color-mix(in srgb, var(--k-text) 18%, transparent); border-radius: var(--k-radius-md); background: color-mix(in srgb, var(--k-surface) 55%, transparent); overflow: visible; }',
      '.spec-stage--tall { min-height: 210px; display: flex; align-items: center; }',
      '.spec-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: var(--k-sp-4); }',
      '.spec-note { font-size: var(--k-fs-sm); color: var(--k-muted); }',
      '.spec-note code { font-family: var(--k-font-mono); font-size: .92em; }',
      '.login-wrap { display: grid; place-items: center; padding: var(--k-sp-5) 0; }',
      '.k-modal__meta { color: var(--k-muted); }',
      '.k-sidebar__brand { color: var(--k-muted); }',
      '.icon-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(168px, 1fr)); gap: 8px; }',
      '.icon-card { display: grid; grid-template-columns: 22px minmax(0, 1fr); align-items: center; gap: 8px; padding: 8px 10px; border: var(--k-bw) solid var(--k-border); border-radius: var(--k-radius-md); background: var(--k-surface); }',
      '.icon-card svg { width: 20px; height: 20px; color: var(--k-primary); }',
      '.icon-card b { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; font-weight: var(--k-weight-strong); }',
      '.icon-card code { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: var(--k-font-mono); font-size: 9.5px; color: var(--k-muted); }',
      '.tok-table { width: 100%; border-collapse: collapse; font-size: var(--k-fs-sm); }',
      '.tok-table td { padding: 5px 8px; border-bottom: var(--k-bw) solid var(--k-border); vertical-align: middle; }',
      '.tok-table td:first-child { width: 34%; font-family: var(--k-font-mono); font-size: 10.5px; color: var(--k-primary); }',
      '.tok-table td:last-child { font-family: var(--k-font-mono); font-size: 10.5px; color: var(--k-muted); word-break: break-all; }',
      '.sw { display: inline-block; width: 11px; height: 11px; margin-right: 7px; border: var(--k-bw) solid var(--k-border); border-radius: 3px; vertical-align: middle; }',
      '.cat-foot { margin-top: 44px; padding-top: 14px; border-top: var(--k-bw) solid var(--k-border); color: var(--k-muted); font-size: var(--k-fs-sm); }',
      '[hidden] { display: none !important; }',
      '@media (max-width: 820px) { .cat { grid-template-columns: 1fr; } .cat-nav { position: static; height: auto; border-right: 0; border-bottom: var(--k-bw) solid var(--k-border); } .cat-main { padding: 20px 16px 60px; } .spec-grid2 { grid-template-columns: 1fr; } }',
    ].join('\n');
  }

  const CAT_JS = [
    '<script>',
    '(function () {',
    '  var q = document.getElementById(\'catSearch\');',
    '  if (!q) return;',
    '  q.addEventListener(\'input\', function () {',
    '    var v = q.value.trim().toLowerCase();',
    '    var itens = document.querySelectorAll(\'[data-cat-item]\');',
    '    for (var i = 0; i < itens.length; i++) {',
    '      var el = itens[i];',
    '      el.hidden = !!v && String(el.getAttribute(\'data-search\') || \'\').indexOf(v) < 0;',
    '    }',
    '  });',
    '  document.addEventListener(\'click\', function (e) {',
    '    var b = e.target.closest && e.target.closest(\'[data-cp-variant]\');',
    '    if (b) {',
    '      var wrap = b.closest(\'[data-cp-variants]\');',
    '      if (!wrap) return;',
    '      var id = b.getAttribute(\'data-cp-variant\');',
    '      var bs = wrap.querySelectorAll(\'[data-cp-variant]\');',
    '      for (var i = 0; i < bs.length; i++) {',
    '        var on = bs[i] === b;',
    '        bs[i].classList.toggle(\'is-active\', on);',
    '        bs[i].setAttribute(\'aria-selected\', String(on));',
    '      }',
    '      var panes = wrap.querySelectorAll(\'[data-cp-pane]\');',
    '      for (var j = 0; j < panes.length; j++) {',
    '        var onPane = panes[j].getAttribute(\'data-cp-pane\') === id;',
    '        panes[j].hidden = !onPane;',
    '        var w = panes[j].querySelector(\'.k-cp\');',
    '        if (w) w.hidden = !onPane;',
    '      }',
    '      return;',
    '    }',
    '    /* Padrão operacional: reabrir mantém modo e cor configurados. */',
    '    var r = e.target.closest && e.target.closest(\'[data-cp-reopen]\');',
    '    if (r) {',
    '      var wrap = r.closest(\'[data-cp-variants]\');',
    '      var pane = wrap && wrap.querySelector(\'[data-cp-pane]:not([hidden])\');',
    '      var stage = (pane && pane.querySelector(\'[data-float-stage]\')) || r.closest(\'[data-float-stage]\');',
    '      if (!stage) return;',
    '      var w = stage.querySelector(\'.k-cp\');',
    '      if (w) { w.hidden = false; delete w.dataset.osClosed; return; }',
    '      return;',
    '    }',
    '    var s = e.target.closest && e.target.closest(\'[data-cp-shape]\');',
    '    if (!s) return;',
    '    var root = s.closest(\'.k-cp\');',
    '    if (!root) return;',
    '    var tri = root.getAttribute(\'data-cp-shape-mode\') !== \'tri\';',
    '    root.setAttribute(\'data-cp-shape-mode\', tri ? \'tri\' : \'square\');',
    '    root.classList.toggle(\'k-cp--tri\', tri);',
    '    var rect = root.querySelector(\'[data-cp-rect]\');',
    '    var wheel = root.querySelector(\'[data-cp-wheel]\');',
    '    if (rect) rect.hidden = tri;',
    '    if (wheel) wheel.hidden = !tri;',
    '    s.setAttribute(\'aria-pressed\', String(tri));',
    '    s.classList.toggle(\'is-active\', tri);',
    '    var label = tri ? \'Mudar para caixa quadrada\' : \'Mudar para caixa triangular\';',
    '    s.setAttribute(\'aria-label\', label);',
    '    s.title = label;',
    '  });',
    /* Equalizador gráfico: mesmo contrato data-eq-* do componente na aplicação.
       Sem audição e sem DSP: apenas interação e estado visual. */
    '  var eqMax = function (r) { return +r.getAttribute(\'data-eq-range\') || 12; };',
    '  var eqFmt = function (n) { return (Math.round(n * 10) / 10).toFixed(1).replace(\'.\', \',\'); };',
    '  var eqScaleFmt = function (n) { return n % 1 === 0 ? String(n) : eqFmt(n); };',
    '  var eqDb = function (t) { return +(t.getAttribute(\'data-eq-db\') || 0); };',
    '  var eqPaint = function (r, t) {',
    '    var m = eqMax(r), v = eqDb(t), p = ((m - v) / (m * 2)) * 100;',
    '    var th = t.querySelector(\'[data-eq-thumb]\'), fl = t.querySelector(\'[data-eq-fill]\'), out = t.parentNode.querySelector(\'[data-eq-dbout]\');',
    '    if (th) th.style.top = p + \'%\';',
    '    if (fl) { fl.style.top = Math.min(p, 50) + \'%\'; fl.style.height = Math.abs(p - 50) + \'%\'; }',
    '    if (out) out.textContent = (v > 0 ? \'+\' : \'\') + eqFmt(v);',
    '    t.setAttribute(\'aria-valuenow\', String(v));',
    '    t.setAttribute(\'aria-valuetext\', eqFmt(v) + \' dB\');',
    '  };',
    '  var eqSet = function (r, t, v) {',
    '    var m = eqMax(r); v = Math.round(v / 0.25) * 0.25;',
    '    v = Math.abs(v) < 0.35 ? 0 : Math.max(-m, Math.min(m, v));',
    '    t.setAttribute(\'data-eq-db\', String(v)); eqPaint(r, t);',
    '  };',
    '  var eqDrag = null;',
    '  document.addEventListener(\'pointerdown\', function (e) {',
    '    var t = e.target.closest && e.target.closest(\'[data-eq-track]\'); if (!t) return;',
    '    var r = t.closest(\'[data-eq-root]\'); if (!r) return;',
    '    e.preventDefault(); t.focus(); eqDrag = { r: r, t: t, rect: t.getBoundingClientRect() };',
    '    var y = Math.max(0, Math.min(eqDrag.rect.height, e.clientY - eqDrag.rect.top));',
    '    eqSet(r, t, eqMax(r) - (y / eqDrag.rect.height) * eqMax(r) * 2);',
    '  });',
    '  document.addEventListener(\'pointermove\', function (e) {',
    '    if (!eqDrag) return;',
    '    var y = Math.max(0, Math.min(eqDrag.rect.height, e.clientY - eqDrag.rect.top));',
    '    eqSet(eqDrag.r, eqDrag.t, eqMax(eqDrag.r) - (y / eqDrag.rect.height) * eqMax(eqDrag.r) * 2);',
    '  });',
    '  document.addEventListener(\'pointerup\', function () { eqDrag = null; });',
    '  document.addEventListener(\'pointercancel\', function () { eqDrag = null; });',
    '  document.addEventListener(\'keydown\', function (e) {',
    '    var t = e.target.closest && e.target.closest(\'[data-eq-track]\'); if (!t) return;',
    '    var r = t.closest(\'[data-eq-root]\'); if (!r) return;',
    '    var v = eqDb(t), next = v;',
    '    if (e.key === \'ArrowUp\') next = v + 0.5;',
    '    else if (e.key === \'ArrowDown\') next = v - 0.5;',
    '    else if (e.key === \'Home\') next = eqMax(r);',
    '    else if (e.key === \'End\') next = -eqMax(r);',
    '    else return;',
    '    e.preventDefault(); eqSet(r, t, next);',
    '  });',
    '  document.addEventListener(\'input\', function (e) {',
    '    var i = e.target.closest && e.target.closest(\'[data-eq-out-input]\'); if (!i) return;',
    '    var r = i.closest(\'[data-eq-root]\'); if (!r) return;',
    '    var v = parseFloat(i.value) || 0; v = Math.max(-12, Math.min(12, v));',
    '    r.setAttribute(\'data-eq-out\', String(v));',
    '    var o = r.querySelector(\'[data-eq-out-out]\'); if (o) o.textContent = (v > 0 ? \'+\' : \'\') + eqFmt(v) + \' dB\';',
    '  });',
    '  var eqAct = function (r, b) {',
    '    var act = b.getAttribute(\'data-eq-act\');',
    '    if (act === \'range\') {',
    '      var m = +b.getAttribute(\'data-eq-value\'); r.setAttribute(\'data-eq-range\', String(m));',
    '      var ts = r.querySelectorAll(\'[data-eq-track]\');',
    '      for (var i = 0; i < ts.length; i++) { var v = eqDb(ts[i]); if (Math.abs(v) > m) eqSet(r, ts[i], v); else eqPaint(r, ts[i]); }',
    '      var sc = r.querySelectorAll(\'[data-eq-scale] span\'), vals = [m, m / 2, 0, -m / 2, -m];',
    '      for (var j = 0; j < sc.length && j < vals.length; j++) sc[j].textContent = (vals[j] > 0 ? \'+\' : \'\') + eqScaleFmt(vals[j]);',
    '      var bs = r.querySelectorAll(\'[data-eq-act="range"]\');',
    '      for (var k = 0; k < bs.length; k++) bs[k].classList.toggle(\'is-active\', +bs[k].getAttribute(\'data-eq-value\') === m);',
    '    } else if (act === \'bypass\') {',
    '      var on = r.getAttribute(\'data-eq-bypass\') !== \'true\';',
    '      r.setAttribute(\'data-eq-bypass\', String(on)); r.classList.toggle(\'is-bypassed\', on);',
    '      b.setAttribute(\'aria-pressed\', String(on));',
    '    } else if (act === \'reset\') {',
    '      var tr = r.querySelectorAll(\'[data-eq-track]\');',
    '      for (var n = 0; n < tr.length; n++) { tr[n].setAttribute(\'data-eq-db\', \'0\'); eqPaint(r, tr[n]); }',
    '    }',
    '  };',
    '  document.addEventListener(\'click\', function (e) {',
    '    var b = e.target.closest && e.target.closest(\'[data-eq-act]\'); if (!b) return;',
    '    var r = b.closest(\'[data-eq-root]\'); if (!r) return; eqAct(r, b);',
    '  });',
    '  document.addEventListener(\'wheel\', function (e) {',
    '    var t = e.target.closest && e.target.closest(\'[data-eq-track]\');',
    '    var o = e.target.closest && e.target.closest(\'.k-eq__out\');',
    '    var i = o ? o.querySelector(\'[data-eq-out-input]\') : (e.target.closest && e.target.closest(\'[data-eq-out-input]\'));',
    '    var b = e.target.closest && e.target.closest(\'[data-eq-act]\');',
    '    var el = t || i || b; if (!el) return;',
    '    var r = el.closest(\'[data-eq-root]\'); if (!r) return;',
    '    e.preventDefault();',
    '    var d = e.deltaY < 0 ? 0.5 : -0.5;',
    '    if (t) { eqSet(r, t, eqDb(t) + d); }',
    '    else if (i) {',
    '      var v = Math.max(-12, Math.min(12, (parseFloat(i.value) || 0) + d)); i.value = String(v);',
    '      r.setAttribute(\'data-eq-out\', String(v));',
    '      var ob = r.querySelector(\'[data-eq-out-out]\'); if (ob) ob.textContent = (v > 0 ? \'+\' : \'\') + eqFmt(v) + \' dB\';',
    '    } else { eqAct(r, b); }',
    '  }, { passive: false });',
    '}());',
    '<\/script>',
  ].join('\n');

  function catalogNav() {
    const parts = [];
    parts.push('<nav class="cat-nav">');
    parts.push('<div class="cat-brand">Kit UI<small>' + escHTML(T.styleById(state.style).name) + '</small></div>');
    parts.push('<a href="#guias">Instruções de interface</a>');
    parts.push('<div class="cat-nav__group">Padrões · ' + P.patterns.length + '</div>');
    P.patternGroups.forEach((g) => {
      parts.push('<a href="#pat-' + slug(g) + '">' + escHTML(g) + '</a>');
    });
    parts.push('<div class="cat-nav__group">Componentes · ' + C.components.length + '</div>');
    C.groups.forEach((g) => {
      parts.push('<a href="#comp-' + slug(g) + '">' + escHTML(g) + '</a>');
    });
    parts.push('<a href="#tokens">Tokens do estilo</a>');
    parts.push('<div class="cat-nav__group">Ícones · ' + IC.icons.length + '</div>');
    IC.meta.categories.forEach((cat) => {
      const n = IC.icons.filter((i) => i.category === cat).length;
      parts.push('<a href="#icons-' + cat + '">' + escHTML(cat) + '<small>' + n + '</small></a>');
    });
    parts.push('</nav>');
    return parts.join('\n');
  }

  function guideSection() {
    const parts = [];
    parts.push('<section class="cat-section" id="guias">');
    parts.push('<h2>Instruções de interface</h2>');
    parts.push('<p class="cat-section__intro">Regras curtas para usar este kit em telas novas. Elas valem para qualquer estilo: só as variáveis <code>--k-*</code> mudam.</p>');
    parts.push('<div class="guide-grid">');
    GUIA_ITENS.forEach((g) => {
      parts.push('<div class="guide-card"><b>' + escHTML(g.titulo) + '</b><p>' + escHTML(g.texto) + '</p></div>');
    });
    parts.push('</div>');
    parts.push('<div class="cat-rules"><h3>Regras universais de layout</h3><ol>');
    LAYOUT_RULES_ZIP.forEach((r) => parts.push('<li>' + escHTML(r) + '</li>'));
    parts.push('</ol></div>');
    parts.push('<div class="cat-combos"><h3>Combinações sugeridas</h3><ul>');
    COMBINACOES.forEach((c) => {
      parts.push('<li><b>' + escHTML(c.nome) + ':</b> ' + escHTML(c.receita) + ' — ' + escHTML(c.uso) + '</li>');
    });
    parts.push('</ul></div>');
    parts.push('</section>');
    return parts.join('\n');
  }

  function tokenSection() {
    const t = resolvedTokens();
    const groups = [
      ['Cores', /^--k-(bg|surface|surface-2|text|muted|border|primary|on-primary|accent|on-accent|danger|on-danger|success|on-success|focus)$/, true],
      ['Forma', /^--k-(radius|bw)/, false],
      ['Espaço e medida', /^--k-(sp|gap|pad|control-h|card-pad|section-pad)/, false],
      ['Tipografia', /^--k-(font|fs|lh|weight|track|transform)/, false],
      ['Efeitos', /^--k-(shadow|blur|saturate|btn|dur|ease)/, false],
      ['Palco e textura', /^--k-(stage|texture)/, true],
    ];
    const parts = [];
    parts.push('<section class="cat-section" id="tokens">');
    parts.push('<h2>Tokens do estilo</h2>');
    parts.push('<p class="cat-section__intro">Valores resolvidos de <code>' + escHTML(T.styleById(state.style).name) + '</code> com os ajustes atuais. O mesmo mapa está em <code>tokens.json</code>.</p>');
    groups.forEach((g) => {
      const keys = Object.keys(t).filter((k) => g[1].test(k));
      if (!keys.length) return;
      parts.push('<h3 class="cat-subgroup">' + g[0] + ' <small>(' + keys.length + ')</small></h3>');
      parts.push('<table class="tok-table"><tbody>');
      keys.forEach((k) => {
        const v = String(t[k]);
        const sw = g[2] && /^(#|rgb|hsl|var\()/i.test(v)
          ? '<i class="sw" style="background:' + escHTML(v) + '"></i>'
          : '';
        parts.push('<tr><td>' + escHTML(k) + '</td><td>' + sw + escHTML(v) + '</td></tr>');
      });
      parts.push('</tbody></table>');
    });
    parts.push('</section>');
    return parts.join('\n');
  }

  function componentSection() {
    const parts = [];
    parts.push('<section class="cat-section" id="componentes">');
    parts.push('<h2>Componentes <small>' + C.components.length + '</small></h2>');
    parts.push('<p class="cat-section__intro">Cada bloco mostra a peça pronta para usar e, em <code>Ver markup</code>, o trecho canônico para copiar.</p>');
    C.groups.forEach((g) => {
      const itens = C.components.filter((c) => c.group === g);
      if (!itens.length) return;
      parts.push('<h3 class="cat-subgroup" id="comp-' + slug(g) + '">' + escHTML(g) + ' <small>(' + itens.length + ')</small></h3>');
      itens.forEach((c) => {
        const search = (c.title + ' ' + c.id + ' ' + c.desc + ' ' + c.group).toLowerCase();
        parts.push('<article class="cat-item" data-cat-item data-search="' + escHTML(search) + '" id="comp-' + c.id + '">');
        parts.push('<div class="cat-item__head"><h4>' + escHTML(c.title) + '</h4><code class="cat-item__id">' + c.id + '</code></div>');
        parts.push('<p class="cat-item__desc">' + descHTML(c.desc) + '</p>');
        parts.push('<div class="spec-stage">' + c.demo() + '</div>');
        parts.push('<details class="cat-code"><summary>Ver markup deste componente</summary><pre><code>' + escHTML(c.code) + '</code></pre></details>');
        parts.push('</article>');
      });
    });
    parts.push('</section>');
    return parts.join('\n');
  }

  function patternSection() {
    const parts = [];
    parts.push('<section class="cat-section" id="padroes">');
    parts.push('<h2>Padrões <small>' + P.patterns.length + '</small></h2>');
    parts.push('<p class="cat-section__intro">Comece por aqui. Cada padrão entra uma única vez e traz a lista de componentes que usa e dos componentes compatíveis — a IA destinatária cria as variantes.</p>');
    P.patternGroups.forEach((g) => {
      const itens = P.patterns.filter((p) => p.group === g);
      if (!itens.length) return;
      parts.push('<h3 class="cat-subgroup" id="pat-' + slug(g) + '">' + escHTML(g) + ' <small>(' + itens.length + ')</small></h3>');
      itens.forEach((p) => {
        const search = (p.title + ' ' + p.id + ' ' + p.desc + ' ' + p.group).toLowerCase();
        parts.push('<article class="cat-item" data-cat-item data-search="' + escHTML(search) + '" id="pat-' + p.id + '">');
        parts.push('<div class="cat-item__head"><h4>' + escHTML(p.title) + '</h4><code class="cat-item__id">' + p.id + '</code></div>');
        parts.push('<p class="cat-item__desc">' + descHTML(p.desc) + '</p>');
        const pp = patternParts(p);
        parts.push('<div style="margin:8px 0;font-size:var(--k-fs-sm);color:var(--k-muted);line-height:1.5">' +
          '<b>Componentes usados:</b> ' + escHTML(partsText(pp.used)) +
          '<br><b>Compatíveis:</b> ' + escHTML(partsText(pp.compatible)) + '</div>');
        parts.push('<div class="spec-stage">' + p.demo() + '</div>');
        parts.push('<details class="cat-code"><summary>Ver HTML desta tela</summary><pre><code>' + escHTML(p.demo()) + '</code></pre></details>');
        parts.push('</article>');
      });
    });
    parts.push('</section>');
    return parts.join('\n');
  }

  function iconSection() {
    const parts = [];
    parts.push('<section class="cat-section" id="icones">');
    parts.push('<h2>Ícones <small>' + IC.icons.length + ' em ' + IC.meta.categories.length + ' categorias</small></h2>');
    parts.push('<p class="cat-section__intro">SVGs autorais de 24×24, traço 2 e <code>currentColor</code>. Os mesmos arquivos estão em <code>icons/</code>, prontos para copiar.</p>');
    IC.meta.categories.forEach((cat) => {
      const itens = IC.icons.filter((i) => i.category === cat);
      if (!itens.length) return;
      parts.push('<h3 class="cat-subgroup" id="icons-' + cat + '">' + escHTML(cat) + ' <small>(' + itens.length + ')</small></h3>');
      parts.push('<div class="icon-grid">');
      itens.forEach((i) => {
        const search = (i.id + ' ' + i.label + ' ' + (i.aliases || []).join(' ') + ' ' + i.category).toLowerCase();
        parts.push('<div class="icon-card" data-cat-item data-search="' + escHTML(search) + '">' +
          iconSVG(i) + '<div><b>' + escHTML(i.label) + '</b><code>' + i.id + '</code></div></div>');
      });
      parts.push('</div>');
    });
    parts.push('</section>');
    return parts.join('\n');
  }

  async function buildStandalone() {
    const fonts = await activeFontCSS();
    const styleName = T.styleById(state.style).name;
    const data = new Date().toISOString().slice(0, 10);
    return (
      '<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
      '<title>Kit UI — ' + escHTML(styleName) + ' · catálogo completo</title>\n' +
      '<style>\n' + (fonts ? '/* fontes locais incorporadas */\n' + fonts + '\n\n' : '') +
      baseVarsCSS() + '\n\n' + KIT_CSS + '\n\n' + catalogCSS() + '\n</style>\n' +
      '</head>\n<body>\n<div class="cat">\n' + catalogNav() + '\n<main class="kit cat-main">\n' +
      '<header class="cat-hero"><h1>Kit UI — ' + escHTML(styleName) + '</h1>' +
      '<p>Pacote de instrução para criar interfaces: comece pelos padrões, ajuste com os componentes compatíveis e mantenha os tokens do estilo. Gerado em ' + data + '.</p>' +
      '<div class="cat-hero__stats"><span>' + C.components.length + ' componentes</span><span>' + P.patterns.length + ' padrões</span>' +
      '<span>' + IC.icons.length + ' ícones</span><span>' + Object.keys(resolvedTokens()).length + ' tokens</span></div></header>' +
      '<input class="cat-search" id="catSearch" type="search" placeholder="Buscar componente, padrão, ícone ou categoria…" aria-label="Buscar no catálogo">' +
      '\n' + guideSection() + '\n' + patternSection() + '\n' + componentSection() + '\n' +
      iconSection() + '\n' + tokenSection() + '\n' +
      '<footer class="cat-foot">Kit UI · arquivo único, sem hosts remotos. As fontes do acervo local e todos os SVGs estão incorporados nesta página.</footer>' +
      '\n</main>\n</div>\n' + CAT_JS + '\n</body>\n</html>\n'
    );
  }

  /* ------------------------------------------------------------------ */
  /* Arquivos separados do ZIP                                           */
  /* ------------------------------------------------------------------ */

  function iconFile(icon) {
    return '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="' +
      escHTML(icon.label) + '">\n  ' + icon.svg + '\n</svg>\n';
  }

  function buildIconsJSON() {
    return {
      meta: Object.assign({}, IC.meta, {
        generated: new Date().toISOString(),
        source: 'Kit UI — ' + T.styleById(state.style).name,
        envelope: 'viewBox 0 0 24 24, stroke currentColor, stroke-width 2',
      }),
      icons: IC.icons.map((i) => ({
        id: i.id,
        label: i.label,
        category: i.category,
        aliases: i.aliases || [],
        file: 'icons/' + i.id + '.svg',
      })),
    };
  }

  function buildReadme() {
    const st = T.styleById(state.style);
    const t = resolvedTokens();
    const libId = emojiLibId();
    const lib = ((window.KIT_EMOJI_LIBS || {}).bibliotecas || {})[libId] || {};
    const L = [];
    const add = (s) => L.push(s == null ? '' : String(s));
    const data = new Date().toISOString().slice(0, 10);

    add('# Kit UI — ' + st.name);
    add();
    add('Pacote de instrução gerado em ' + data + ' para criar interfaces com o estilo ' + st.name + '. Comece pelos padrões: cada um entra uma única vez e já diz quais componentes usa e quais são compatíveis. O estilo escolhido está aplicado no CSS, no HTML e nos tokens.');
    add();
    add('## O que vem no pacote');
    add();
    add('| Arquivo | Conteúdo |');
    add('| :--- | :--- |');
    add('| `index.html` | Catálogo completo: instruções e regras de layout, ' + P.patterns.length + ' padrões (cada um com componentes usados/compatíveis), ' + C.components.length + ' componentes de referência, ' + IC.icons.length + ' ícones e todos os tokens. Abra no navegador. |');
    add('| `kit.css` | CSS canônico com as fontes incorporadas e os tokens no topo. |');
    add('| `tokens.json` | Mapa completo das variáveis `--k-*` separadas por categoria. |');
    add('| `README.md` | Este guia: regras completas de layout, tabela de padrões com componentes usados/compatíveis, tabela de componentes, ícones e combinações. |');
    add('| `icons/icons.json` | Lista dos ' + IC.icons.length + ' ícones com id, nome, categoria, aliases e arquivo. |');
    add('| `icons/<id>.svg` | Cada um dos ' + IC.icons.length + ' ícones em arquivo próprio, pronto para copiar. |');
    add('| `emojis/' + libId + '/` | ' + (lib.total || 0) + ' SVGs da biblioteca ' + (lib.nome || libId) + ' associada a este estilo. |');
    add('| `emojis/' + libId + '/unicode-map.json` | Relação de cada SVG com seu Unicode, codepoint e categoria. |');
    add('| `LICENCAS.md` | Licenças e créditos obrigatórios das 9 bibliotecas de emoji. |');
    add();
    add('## Instruções de interface');
    add();
    add('1. Envolva a interface em `<div class="kit">`. As variáveis `--k-*` e as fontes vivem nesse container.');
    add('2. Copie `kit.css` para o projeto e mantenha o bloco `:root` do topo. Nunca fixe cor hexadecimal dentro de um componente.');
    add('3. Para trocar de tema, substitua apenas as variáveis `--k-*`. Para criar uma variante clara/escura, altere o bloco `:root` — o markup não muda.');
    add('4. Use a hierarquia de texto: `--k-fs-h1` (tela), `--k-fs-h3` (seção), `--k-fs` (corpo), `--k-fs-sm` (meta).');
    add('5. Respeite o grid de 8 pontos com `--k-sp-1` a `--k-sp-7`, `--k-gap` e `--k-pad`.');
    add('6. Ícones são decorativos (`aria-hidden`). Botão sem texto precisa de `aria-label`.');
    add('7. Preveja os estados vazio, carregando e erro desde o início: `empty`, `skeleton`, `spinner`, `alert` e `toast`.');
    add('8. Monte combinações, não ilhas: `card` com `badge`, `avatar` e uma ação resolve mais que um componente sozinho.');
    add('9. Evite redundância descritiva: o contexto já dado pela aba ou pelo painel não deve ser repetido logo abaixo (nome da aba, título do card, frase de exemplo, “Propriedades” dentro de propriedades). Não aninhe um componente igual dentro de outro, como aba dentro de aba, salvo exigência explícita do projeto.');
    add();
    add('### Regras universais de layout');
    add();
    LAYOUT_RULES_ZIP.forEach((r, i) => add((i + 1) + '. ' + r));
    add();
    add('### Papéis de cor');
    add();
    add('| Variável | Papel | Valor atual |');
    add('| :--- | :--- | :--- |');
    [
      ['--k-bg', 'Fundo da aplicação'],
      ['--k-surface', 'Superfície de cards e painéis'],
      ['--k-surface-2', 'Superfície secundária / hover'],
      ['--k-text', 'Texto principal'],
      ['--k-muted', 'Texto secundário e metadados'],
      ['--k-border', 'Bordas e divisórias'],
      ['--k-primary', 'Ação principal e foco'],
      ['--k-accent', 'Destaque'],
      ['--k-danger', 'Ação destrutiva / erro'],
      ['--k-success', 'Confirmação / sucesso'],
      ['--k-focus', 'Anel de foco'],
    ].forEach((r) => add('| `' + r[0] + '` | ' + r[1] + ' | `' + (t[r[0]] || '—') + '` |'));
    add();
    add('Os demais valores (forma, espaço, tipografia, efeitos, palco e textura) estão em `tokens.json` e na seção final do `index.html`.');
    add();

    add('## Como montar uma interface com este pacote');
    add();
    add('1. Escolha o padrão mais próximo da tela desejada — é o ponto de partida, não os componentes soltos.');
    add('2. Troque dados, números e textos por conteúdo real; mantenha o layout, os componentes e a estética.');
    add('3. Para variações, use apenas os componentes listados como compatíveis naquele padrão. Assim as peças continuam combinando entre si.');
    add('4. Crie as variantes de tema e as versões específicas no projeto de destino: este pacote traz uma forma principal de cada padrão.');
    add('5. Escolha os ícones dentro do pacote `icons/` e ajuste os tokens `--k-*` quando precisar de outro estilo visual.');
    add();

    add('## Padrões (' + P.patterns.length + ')');
    add();
    add('Cada padrão aparece uma única vez, na sua forma principal. As colunas abaixo descrevem o que ele usa e o que pode ser trocado; as variantes ficam a cargo da IA destinatária.');
    add();
    P.patternGroups.forEach((g) => {
      const itens = P.patterns.filter((p) => p.group === g);
      if (!itens.length) return;
      add('### ' + g);
      add();
      add('| ID | Tela | Uso | Componentes usados | Compatíveis |');
      add('| :--- | :--- | :--- | :--- | :--- |');
      itens.forEach((p) => {
        const pp = patternParts(p);
        const short = (list) => list.length ? list.slice(0, 6).map((c) => '`' + c.id + '`').join(', ') + (list.length > 6 ? ' …' : '') : '—';
        add('| `' + p.id + '` | ' + p.title + ' | ' + p.desc + ' | ' + short(pp.used) + ' | ' + short(pp.compatible) + ' |');
      });
      add();
    });

    add('## Componentes (' + C.components.length + ')');
    add();
    add('Todos têm demonstração pronta no `index.html` e o markup canônico em `Ver markup`.');
    add();
    C.groups.forEach((g) => {
      const itens = C.components.filter((c) => c.group === g);
      if (!itens.length) return;
      add('### ' + g);
      add();
      add('| ID | Componente | Uso | Classes-chave |');
      add('| :--- | :--- | :--- | :--- |');
      itens.forEach((c) => {
        const classes = Array.from(new Set((String(c.code || '').match(/k-[a-z0-9_-]+/g) || []))).slice(0, 6);
        add('| `' + c.id + '` | ' + c.title + ' | ' + c.desc + ' | ' + (classes.length ? classes.map((x) => '`' + x + '`').join(' ') : '—') + ' |');
      });
      add();
    });

    add('## Ícones (' + IC.icons.length + ')');
    add();
    add('Arquivos em `icons/<id>.svg`; metadados completos em `icons/icons.json`. Todos usam grade 24×24, traço 2 e `currentColor`.');
    add();
    IC.meta.categories.forEach((cat) => {
      const itens = IC.icons.filter((i) => i.category === cat);
      if (!itens.length) return;
      add('### ' + cat + ' (' + itens.length + ')');
      add();
      add(itens.map((i) => '`' + i.id + '` — ' + i.label).join(' · '));
      add();
    });

    add('## Combinações para interfaces novas');
    add();
    add('| Resultado | Receita | Quando usar |');
    add('| :--- | :--- | :--- |');
    COMBINACOES.forEach((c) => add('| ' + c.nome + ' | ' + c.receita + ' | ' + c.uso + ' |'));
    add();
    add('Regra geral: escolha primeiro o padrão mais próximo da tela desejada, troque os componentes internos e mantenha os tokens intactos. Assim o resultado continua coerente com o estilo ' + st.name + '.');
    add();
    add('## Observações');
    add();
    add('- Componentes soltos são material de ajuste: monte a interface a partir de um padrão.');
    add('- Nenhuma dependência externa: fontes do acervo local e SVGs estão dentro do pacote.');
    add('- O `index.html` tem um campo de busca que filtra componentes, padrões e ícones; funciona sem servidor.');
    add('- A variante visual Escuro/Claro da ferramenta não altera este pacote: ela muda só a apresentação no catálogo.');
    add('- Os ícones de interface são autorais; os emojis vêm da biblioteca **' + (lib.nome || libId) +
      '** (' + (lib.licenca || 'licença não informada') + '), em `emojis/' + libId + '/`.');
    add('- Respeite as condições descritas em `LICENCAS.md`. O `unicode-map.json` permite localizar o Unicode de cada SVG.');
    return L.join('\n');
  }

  const EMOJI_BASE = 'tabs_n_buttons/emojis/';

  /* O servidor local pode responder 502 sob rajadas de requisições; cada
     arquivo tenta algumas vezes antes de ser dado como ausente. */
  async function fetchTextAsset(path, attempts) {
    const tentativas = attempts || 3;
    let ultimo;
    for (let i = 0; i < tentativas; i++) {
      try {
        const res = await fetch(path, { cache: 'force-cache' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return await res.text();
      } catch (e) {
        ultimo = e;
        if (i < tentativas - 1) await new Promise((r) => setTimeout(r, 250 * (i + 1)));
      }
    }
    throw ultimo;
  }

  /* Traz para o ZIP os SVGs da biblioteca associada ao estilo, mais os
     marcadores de Unicode e os documentos de licença. */
  async function emojiZipFiles() {
    const id = emojiLibId();
    const lista = (E.itemsFor ? E.itemsFor(id) : E.items) || [];
    const out = [];
    const extras = [
      ['LICENCAS.md', EMOJI_BASE + 'LICENCAS.md'],
      ['emojis/' + id + '/README.md', EMOJI_BASE + id + '/README.md'],
      ['emojis/' + id + '/unicode-map.json', EMOJI_BASE + id + '/unicode-map.json'],
    ];
    for (const extra of extras) {
      try {
        out.push({ name: extra[0], data: await fetchTextAsset(extra[1]) });
      } catch (e) {
        console.warn('Kit UI — não foi possível incluir ' + extra[0] + ':', e.message);
      }
    }

    let cursor = 0;
    let done = 0;
    const total = lista.length;
    async function worker() {
      while (cursor < total) {
        const item = lista[cursor++];
        try {
          const data = await fetchTextAsset(EMOJI_BASE + id + '/' + item.e + '.svg');
          out.push({ name: 'emojis/' + id + '/' + item.e + '.svg', data: data });
        } catch (e) {
          console.warn('Kit UI — SVG ' + item.e + ' não incluído:', e.message);
        }
        done++;
        if (done % 250 === 0) toast('Empacotando emojis: ' + done + '/' + total);
      }
    }
    const workers = [];
    for (let i = 0; i < Math.min(8, Math.max(1, total)); i++) workers.push(worker());
    await Promise.all(workers);
    return out;
  }

  async function downloadZip() {
    const html = await buildStandalone();
    const kitCSS = await buildCSSFile();
    const readme = buildReadme();
    const files = [
      { name: 'index.html', data: html },
      { name: 'kit.css', data: kitCSS },
      { name: 'tokens.json', data: JSON.stringify(tokensJSON(), null, 2) },
      { name: 'README.md', data: readme },
      { name: 'icons/icons.json', data: JSON.stringify(buildIconsJSON(), null, 2) },
    ];
    IC.icons.forEach((icon) => files.push({ name: 'icons/' + icon.id + '.svg', data: iconFile(icon) }));
    (await emojiZipFiles()).forEach((file) => files.push(file));
    const bytes = window.KIT_ZIP_ASYNC
      ? await window.KIT_ZIP_ASYNC(files)
      : window.KIT_ZIP(files);
    download('kit-' + state.style + '.zip', bytes, 'application/zip');
    return files.length;
  }

  function download(name, data, type) {
    const blob = data instanceof Uint8Array ? new Blob([data], { type: type }) : new Blob([data], { type: type || 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    toast('Download: ' + name);
  }

  function copy(text, msg) {
    const done = () => toast(msg || 'Copiado');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
    } else {
      fallbackCopy(text, done);
    }
  }

  function fallbackCopy(text, done) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { toast('Não foi possível copiar'); }
    ta.remove();
  }

  function openSheet() {
    els.sheet.innerHTML =
      '<div class="sheet__card">' +
      '<div class="sheet__head"><div><div class="sheet__title">Exportar</div>' +
      '<div class="sheet__sub">' + T.styleById(state.style).name + ' · ' + sheetSubject() + '</div></div>' +
      '<button class="iconbtn iconbtn--sm" data-close-sheet aria-label="Fechar">' + UI.icon('close') + '</button></div>' +
      '<div class="sheet__body"><div class="expgrid">' +
      '<button class="expcard" data-act="copy-html"><b>' + UI.icon('copy') + 'Copiar HTML</b><span>Markup do item atual, pronto para colar.</span></button>' +
      '<button class="expcard" data-act="copy-htmlcss"><b>' + UI.icon('component') + 'Copiar HTML + CSS</b><span>Markup, tokens e apenas as regras usadas.</span></button>' +
      '<button class="expcard" data-act="copy-css"><b>' + UI.icon('text') + 'Copiar CSS do kit</b><span>Todos os componentes com os tokens no topo.</span></button>' +
      '<button class="expcard" data-act="dl-tokens"><b>' + UI.icon('color') + 'tokens.json</b><span>Cores, forma, espaço, tipo e efeitos.</span></button>' +
      '<button class="expcard" data-act="dl-html"><b>' + UI.icon('insert-svg') + 'Catálogo HTML</b><span>' + P.patterns.length + ' padrões primeiro, ' + C.components.length + ' componentes, ' + IC.icons.length + ' ícones e tokens.</span></button>' +
      '<button class="expcard" data-act="dl-zip"><b>' + UI.icon('archive') + 'Pacote ZIP completo</b><span>Catálogo, CSS, tokens, README e todos os SVGs separados.</span></button>' +
      '</div>' +
      '<div class="sec__hint" style="font-size:10.5px;color:var(--u-dim);line-height:1.5">O ZIP prioriza padrões: ' + P.patterns.length + ' padrões únicos, cada um com seus componentes usados e compatíveis, ' + C.components.length + ' componentes de referência, ' + IC.icons.length + ' ícones em <code>icons/</code>, regras de layout, tokens e estilo aplicado. Nada depende de host externo.</div>' +
      '</div>' +
      '<div class="sheet__foot"><button class="minibtn" data-close-sheet>Fechar</button><button class="minibtn minibtn--accent" data-act="dl-zip">' + UI.icon('download') + 'Exportar</button></div>' +
      '</div>';
    els.sheet.classList.add('is-on');
    els.scrim.classList.add('is-on');
  }

  function closeSheet() {
    els.sheet.classList.remove('is-on');
    els.scrim.classList.remove('is-on');
  }

  /* Ações da folha e dos inspetores. Devolve true quando tratou o nome,
     para o orquestrador não precisar conhecer nenhum data-act de exportação. */
  async function handleAction(name, el) {
    if (name === 'copy-html') { copy(currentCode(), 'HTML copiado'); return true; }
    if (name === 'copy-htmlcss') { copy(await buildSnippet(), 'HTML + CSS copiado'); return true; }
    if (name === 'copy-css') { copy(await buildCSSFile(), 'CSS do kit copiado'); return true; }
    if (name === 'copy-svg') { copy(currentSvg(), 'SVG copiado'); return true; }
    if (name === 'copy-emoji') {
      copy(emojiItemExport().unicode || state.emoji, 'Unicode do emoji copiado');
      return true;
    }
    if (name === 'copy-emoji-html') { copy(currentEmojiHTML(), 'HTML do emoji copiado'); return true; }
    if (name === 'copy-emoji-svg') {
      const emoji = emojiItemExport();
      if (!emoji.hex) {
        copy(emoji.e || '', 'Caractere do emoji copiado');
        return true;
      }
      copy(emojiExportPath(emoji), 'Caminho do SVG copiado');
      return true;
    }
    if (name === 'dl-tokens') {
      download('tokens-' + state.style + '.json', JSON.stringify(tokensJSON(), null, 2), 'application/json');
      return true;
    }
    if (name === 'dl-zip') { await downloadZip(); return true; }
    if (name === 'dl-html') {
      download('kit-' + state.style + '.html', await buildStandalone(), 'text/html');
      return true;
    }
    return false;
  }

  window.KIT_EXPORTAR = {
    openSheet, closeSheet, handleAction,
    sheetSubject, currentEntry, currentCode, currentSvg, currentEmojiHTML,
    emojiLibId, emojiItemExport, emojiExportPath, emojiZipFiles,
    snippetCSS, buildSnippet, buildCSSFile, buildStandalone, buildIconsJSON,
    buildReadme, iconFile, tokensJSON, downloadZip, download, copy,
  };
})();
