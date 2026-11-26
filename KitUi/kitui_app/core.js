/* core.js — núcleo compartilhado do Kit UI.
   Estado, storage, estilos, tokens, fontes e acervos importados.
   Não renderiza nada: a moldura e as abas consomem window.KIT_CORE. */
(function () {
  'use strict';

  const T = window.KIT_TOKENS;
  /* Módulos de importação ficam na pasta de cada aba. Hoje: estilos. */
  const IMP = window.KIT_IMPORT_ESTILOS;
  const IMPORT_MODULES = { styles: IMP };
  const C = window.KIT_COMPONENTS;
  const P = window.KIT_PATTERNS || { patterns: [], patternGroups: [] };
  const UI_ICONS = window.KIT_UI_ICONS || { icons: [] };
  const UI_BY_ID = new Map(UI_ICONS.icons.map((i) => [i.id, i]));
  const UI = {
    icon: (id, cls) => {
      const item = UI_BY_ID.get(id);
      if (!item) return '';
      return '<svg class="k-icon' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + item.svg + '</svg>';
    },
  };
  const IC = window.KIT_ICONS;
  const E = window.KIT_EMOJIS;
  const KIT_CSS = window.KIT_CSS || '';

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const STORE = 'kitui.state.v2';
  const STYLE_STORE = 'kitui.styles.v1';
  const ASSET_STORE = 'kitui.assets.v1';
  const SEED_STORE = 'kitui.seeds.v1';
  const SEED_VER_STORE = 'kitui.seedver.v1';

  const IMPORT_KINDS = [
    { id: 'styles', label: 'Estilos' },
    { id: 'icons', label: 'Ícones' },
    { id: 'fonts', label: 'Fontes' },
    { id: 'emojis', label: 'Emojis' },
    { id: 'textures', label: 'Texturas' },
    { id: 'stages', label: 'Fundos' },
  ];

  /* Regras fixas extraídas de README.md (seções “Área de trabalho” e “Como os
     estilos funcionam”). Ficam como nota somente leitura no rodapé do
     visualizador de tokens: nunca são editáveis e não acompanham o estilo. */
  const LAYOUT_RULES_NOTE = [
    'Regras universais de layout — o quadro é centralizado em 1280 × 600 (ou 600 × 1280 em retrato) e escalado para caber na janela, sem barras de rolagem. O palco preenche o restante da tela.',
    'Parâmetros técnicos por estilo — os tokens --k-* são aplicados apenas em #kit; a moldura usa --u-* com o tema Lemon Crispy e não muda com o estilo. resolvedTokens() combina o estilo base com os ajustes feitos em Propriedades; applyTokens() grava os tokens de palco e textura no .stage.',
  ];
  const esc = C.esc;

  /* Cópia dos acervos originais: permite reconstruir a lista quando um ativo
     importado é removido, sem precisar recarregar a página. */
  const BASE_ASSETS = {
    icons: IC.icons.slice(),
    fonts: T.FONTS.slice(),
    emojis: E.items.slice(),
    textures: T.TEXTURE_LIST.slice(),
    stages: T.STAGE_LIST.slice(),
    textureMap: Object.assign({}, T.TEXTURES),
    stageMap: Object.assign({}, T.STAGE_PRESETS),
    emojiCats: E.categories.slice(),
  };
  const customAssets = { icons: [], fonts: [], emojis: [], textures: [], stages: [] };

  const DEFAULTS = {
    tab: 'styles',
    style: 'material',
    orient: 'landscape',
    zoom: 1,
    themeMode: 'auto',
    previewZoom: 1,
    grid: false,
    uiHidden: false,
    comp: 'button',
    pattern: 'overview',
    icon: 'component',
    emoji: '😀',
    emojiCat: 'all',
    font: null,
    fontPreview: null,
    queries: {},
    iconCat: 'all',
    texCat: 'all',
    overrides: {
      colors: {},
      radius: null,
      bw: null,
      density: 'auto',
      shadows: true,
      blur: null,
      font: null,
      fsScale: 1,
      minFont: null,
      weight: null,
      track: null,
      upper: null,
      texture: null,
      textureOpacity: null,
      stage: null,
      stageBg: null,
    },
  };

  /* Controles numéricos do inspetor: valores em unidades de exibição. */
  const NUM_CFG = {
    bw: { min: 0, max: 8, step: 1, unit: 'px', decimals: 0 },
    fsScale: { min: 85, max: 120, step: 1, unit: '%', decimals: 0 },
    minFont: { min: 6, max: 24, step: 0.5, unit: 'px', decimals: 1 },
    track: { min: -0.04, max: 0.08, step: 0.005, unit: 'em', decimals: 3 },
    blur: { min: 0, max: 28, step: 1, unit: 'px', decimals: 0 },
    textureOpacity: { min: 0, max: 100, step: 5, unit: '%', decimals: 0 },
  };

  /* Estado aberto/fechado de cada seção do inspetor, por aba. */
  const secOpen = new Map();

  const state = load();
  const customStyles = [];
  loadCustomAssets();

  /* Preenchido pela moldura em init(); usado por applyTokens() e toast(). */
  const els = {};

  /* ------------------------------------------------------------------ */
  /* estado                                                              */
  /* ------------------------------------------------------------------ */

  function load() {
    const base = JSON.parse(JSON.stringify(DEFAULTS));
    try {
      const raw = localStorage.getItem(STORE);
      if (!raw) return base;
      const saved = JSON.parse(raw);
      const merged = Object.assign(base, saved);
      merged.overrides = Object.assign(base.overrides, saved.overrides || {});
      merged.overrides.colors = Object.assign({}, (saved.overrides || {}).colors || {});
      merged.queries = Object.assign({}, saved.queries || {});
      if (!merged.emoji) merged.emoji = base.emoji;
      if (!merged.emojiCat) merged.emojiCat = base.emojiCat;
      if (!merged.texCat) merged.texCat = base.texCat;
      return merged;
    } catch (e) {
      return base;
    }
  }

  function save() {
    try {
      /* fontPreview é prévia de leitura: nunca deve voltar do localStorage. */
      const persisted = Object.assign({}, state);
      delete persisted.fontPreview;
      localStorage.setItem(STORE, JSON.stringify(persisted));
    } catch (e) {}
  }

  /* ------------------------------------------------------------------ */
  /* estilos importados                                                  */
  /* ------------------------------------------------------------------ */

  function slugify(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 42);
  }

  function loadCustomStyles() {
    let list = [];
    try {
      const raw = localStorage.getItem(STYLE_STORE);
      if (raw) list = JSON.parse(raw);
    } catch (e) {
      list = [];
    }
    if (!Array.isArray(list)) return;
    list.forEach((item) => {
      const st = IMP.normalize(item, { preserveId: true });
      if (!st) return;
      customStyles.push(st);
      if (!T.STYLES.some((s) => s.id === st.id)) T.STYLES.push(st);
    });
  }

  function saveCustomStyles() {
    try {
      localStorage.setItem(STYLE_STORE, JSON.stringify(customStyles));
    } catch (e) {}
  }

  /* Instala os estilos de exemplo uma única vez. O id fica registrado em
     SEED_STORE, então remover o estilo não o traz de volta no próximo load.
     previousIds permitem trocar id/nome (ex.: laby → pixel-lab) sem duplicar.
     version permite atualizar os tokens de um seed já instalado. */
  function seedStyles() {
    const seeds = Array.isArray(window.KIT_SEED_STYLES) ? window.KIT_SEED_STYLES : [];
    if (!seeds.length) return;
    const readJSON = (store, fallback) => {
      try {
        const raw = localStorage.getItem(store);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) {
        return fallback;
      }
    };
    const writeJSON = (store, value) => {
      try {
        localStorage.setItem(store, JSON.stringify(value));
      } catch (e) {}
    };
    let applied = readJSON(SEED_STORE, []);
    if (!Array.isArray(applied)) applied = [];
    let versions = readJSON(SEED_VER_STORE, {});
    if (!versions || typeof versions !== 'object' || Array.isArray(versions)) versions = {};
    const marked = (id) => applied.indexOf(id) >= 0;
    const mark = (id) => {
      if (!id || marked(id)) return false;
      applied.push(id);
      return true;
    };
    let changed = false;
    let dirty = false;
    let stateDirty = false;
    let verDirty = false;
    seeds.forEach((seed) => {
      if (!seed || typeof seed !== 'object') return;
      const key = String(seed.id || '').trim();
      if (!key) return;
      const version = Number(seed.version) || 1;
      const prev = (Array.isArray(seed.previousIds) ? seed.previousIds : []).map(String);
      const installed = customStyles.findIndex((s) => s.id === key);
      if (installed >= 0) {
        /* Mesmo id: aplica a versão nova dos tokens no lugar. */
        if ((Number(versions[key]) || 0) < version) {
          const st = IMP.normalize(seed, { preserveId: true });
          if (st) {
            st.id = key;
            const ti = T.STYLES.findIndex((s) => s.id === key);
            customStyles[installed] = st;
            if (ti >= 0) T.STYLES[ti] = st;
            dirty = true;
          }
        }
        if (mark(key)) changed = true;
        versions[key] = version;
        verDirty = true;
        return;
      }
      /* Já marcado e sem estilo: o usuário removeu — não reinstala. */
      if (marked(key)) {
        versions[key] = version;
        verDirty = true;
        return;
      }
      /* Seed antigo instalado: migra para o id novo, preservando posição/ativo. */
      const oldIndex = customStyles.findIndex((s) => prev.indexOf(s.id) >= 0);
      if (oldIndex >= 0) {
        const st = IMP.normalize(seed, { preserveId: true });
        if (st && !T.STYLES.some((s) => s.id === st.id)) {
          const old = customStyles[oldIndex];
          const ti = T.STYLES.findIndex((s) => s.id === old.id);
          customStyles[oldIndex] = st;
          if (ti >= 0) T.STYLES[ti] = st;
          if (state.style === old.id) {
            state.style = st.id;
            stateDirty = true;
          }
          dirty = true;
        }
        if (mark(key)) changed = true;
        prev.forEach((id) => {
          if (mark(id)) changed = true;
        });
        versions[key] = version;
        verDirty = true;
        return;
      }
      /* Seed antigo já removido pelo usuário: não reinstala com nome novo. */
      if (prev.some(marked)) {
        if (mark(key)) changed = true;
        versions[key] = version;
        verDirty = true;
        return;
      }
      if (T.STYLES.some((s) => s.id === key)) {
        if (mark(key)) changed = true;
        versions[key] = version;
        verDirty = true;
        return;
      }
      const st = IMP.normalize(seed, { preserveId: true });
      if (st) {
        customStyles.push(st);
        T.STYLES.push(st);
        dirty = true;
      }
      if (mark(key)) changed = true;
      versions[key] = version;
      verDirty = true;
    });
    if (dirty) saveCustomStyles();
    if (stateDirty) save();
    if (changed) writeJSON(SEED_STORE, applied);
    if (verDirty) writeJSON(SEED_VER_STORE, versions);
    sortStyles();
  }

  /* Mantém a lista de estilos em ordem alfabética por nome, incluindo os
     estilos importados e as sementes adicionadas depois do carregamento. */
  function sortStyles() {
    T.STYLES.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }));
  }

  function isCustomStyle(id) {
    return customStyles.some((s) => s.id === id);
  }

  function swatchHTML(s) {
    return (
      '<span class="pitem__swatch">' +
      (s.swatch || []).slice(0, 3)
        .map((c) => '<i style="background:' + String(c || '').replace(/[^#a-z0-9(),.%\s/-]/gi, '') + '"></i>')
        .join('') +
      '</span>'
    );
  }

  /* ------------------------------------------------------------------ */
  /* tamanho mínimo da fonte e sequência proporcional de tamanhos        */
  /* ------------------------------------------------------------------ */

  const FONT_DEFAULT_MIN = T.DEFAULT_MIN || 11.5;
  const FONT_STEP_MEDIUM = 1.09;
  const FONT_STEP_LARGE = 1.3;
  const FONT_SCALE_KEYS = ['--k-fs-sm', '--k-fs', '--k-fs-lg', '--k-fs-h1', '--k-fs-h2', '--k-fs-h3'];

  /* O mínimo padrão vem do acervo; o valor configurado no estilo prevalece. */
  function fontMinPx() {
    const t = resolvedTokens();
    return parseFloat(t['--k-fs-compact']) || FONT_DEFAULT_MIN;
  }

  function fontScaleSteps(min) {
    const base = +min || FONT_DEFAULT_MIN;
    const r = (n) => +n.toFixed(1);
    return { min: r(base), medium: r(base * FONT_STEP_MEDIUM), large: r(base * FONT_STEP_LARGE) };
  }

  /* ------------------------------------------------------------------ */
  /* tokens                                                              */
  /* ------------------------------------------------------------------ */

  function resolvedTokens() {
    const st = T.styleById(state.style);
    const o = state.overrides;
    const t = Object.assign({}, T.BASE, st.tokens);
    const fontBase = Object.assign({}, T.BASE, st.tokens);
    if (o.radius && T.RADIUS_SETS[o.radius]) Object.assign(t, T.RADIUS_SETS[o.radius]);
    if (o.density && o.density !== 'auto' && T.DENSITIES[o.density]) Object.assign(t, T.DENSITIES[o.density]);
    if (o.bw !== null && o.bw !== undefined) t['--k-bw'] = o.bw + 'px';
    if (!o.shadows) {
      t['--k-shadow-sm'] = 'none';
      t['--k-shadow-md'] = 'none';
      t['--k-btn-shadow'] = 'none';
      t['--k-btn-shadow-hover'] = 'none';
    }
    if (o.blur !== null && o.blur !== undefined) t['--k-blur'] = o.blur + 'px';
    if (o.font) t['--k-font'] = T.fontById(o.font).stack;
    else if (st.font) t['--k-font'] = T.fontById(st.font).stack;
    if (o.weight) {
      t['--k-weight-strong'] = o.weight;
    }
    if (o.track !== null && o.track !== undefined) t['--k-track'] = o.track + 'em';
    if (o.upper !== null && o.upper !== undefined) t['--k-transform'] = o.upper ? 'uppercase' : 'none';

    /* Tamanho mínimo visível: quando redefinido, a sequência pequena/média/
       grande é escalada proporcionalmente (×1,09 e ×1,30). */
    const fontId = o.font || st.font;
    const appliedFont = fontId ? T.fontById(fontId) : null;
    const fontDefault = appliedFont && appliedFont.min ? +appliedFont.min : null;
    const scaledMin =
      o.minFont !== null && o.minFont !== undefined
        ? +o.minFont
        : fontDefault !== null && Math.abs(fontDefault - FONT_DEFAULT_MIN) > 0.001
          ? fontDefault
          : null;
    if (scaledMin) {
      const baseMin = parseFloat(fontBase['--k-fs-sm']) - 1 || FONT_DEFAULT_MIN;
      const factor = scaledMin / baseMin;
      FONT_SCALE_KEYS.forEach((k) => {
        const n = parseFloat(fontBase[k]);
        if (!isNaN(n)) t[k] = +(n * factor).toFixed(1) + 'px';
      });
    }
    t['--k-fs-compact'] =
      +(scaledMin !== null ? scaledMin : parseFloat(t['--k-fs-sm']) - 1 || FONT_DEFAULT_MIN).toFixed(1) + 'px';

    if (o.texture && T.TEXTURES[o.texture]) Object.assign(t, T.TEXTURES[o.texture]);
    if (o.textureOpacity !== null && o.textureOpacity !== undefined) t['--k-texture-opacity'] = o.textureOpacity;
    if (o.stage && T.STAGE_PRESETS[o.stage]) t['--k-stage-bg'] = T.STAGE_PRESETS[o.stage].value;
    if (o.stageBg) t['--k-stage-bg'] = o.stageBg;
    if (o.fsScale && o.fsScale !== 1) {
      ['--k-fs-compact', '--k-fs', '--k-fs-sm', '--k-fs-lg', '--k-fs-h1', '--k-fs-h2', '--k-fs-h3'].forEach((k) => {
        const n = parseFloat(t[k]);
        if (!isNaN(n)) t[k] = +(n * o.fsScale).toFixed(2) + 'px';
      });
    }
    t['--k-type-1'] = t['--k-fs-compact'];
    t['--k-type-2'] = t['--k-fs-sm'];
    t['--k-type-3'] = t['--k-fs'];
    Object.keys(o.colors || {}).forEach((k) => {
      t[k] = o.colors[k];
    });
    return t;
  }

  /* Modo visual da prévia. É só visual: deriva os tokens ativos sem alterar
     os JSONs e sem entrar na exportação (que usa resolvedTokens).
     Estilo claro recebe variante escura; estilo escuro recebe variante clara.
     "auto" mantém o estilo original, seja ele claro ou escuro. */
  const TEXT_KEYS = { '--k-text': 1, '--k-muted': 1, '--k-on-primary': 1, '--k-on-accent': 1 };
  const SURFACE_KEYS = { '--k-bg': 1, '--k-surface': 1, '--k-surface-2': 1, '--k-border': 1, '--k-stage-bg': 1 };
  const ACCENT_KEYS = { '--k-primary': 1, '--k-accent': 1, '--k-focus': 1 };

  function parseColor(v) {
    const s = String(v == null ? '' : v).trim();
    if (/^#[0-9a-f]{3}$/i.test(s)) {
      return [parseInt(s[1] + s[1], 16), parseInt(s[2] + s[2], 16), parseInt(s[3] + s[3], 16), 1];
    }
    if (/^#[0-9a-f]{6}$/i.test(s)) {
      return [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16), 1];
    }
    if (/^#[0-9a-f]{8}$/i.test(s)) {
      return [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16), parseInt(s.slice(7, 9), 16) / 255];
    }
    const m = s.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?/i);
    if (!m) return null;
    const a = m[4] === undefined ? 1 : (m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]));
    return [+m[1], +m[2], +m[3], isNaN(a) ? 1 : a];
  }

  function darkenColor(v, target, amount) {
    const c = parseColor(v);
    if (!c) return v;
    const rgb = c.slice(0, 3).map((n) => Math.round(n + (target - n) * amount));
    const h = (n) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, '0');
    let out = '#' + h(rgb[0]) + h(rgb[1]) + h(rgb[2]);
    if (c[3] < 1) out += Math.round(c[3] * 255).toString(16).padStart(2, '0');
    return out.toUpperCase();
  }

  function invertTexture(value, toLight) {
    const s = String(value == null ? '' : value);
    return s.replace(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)/gi, (m, r, g, b, a) => {
      const c = parseColor(m);
      if (!c) return m;
      const lum = (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255;
      const dark = lum < 0.5;
      if (toLight && dark) return 'rgba(255,255,255,' + (c[3] == null ? 1 : c[3]) + ')';
      if (!toLight && !dark) return 'rgba(15,23,42,' + (c[3] == null ? 1 : c[3]) + ')';
      return m;
    });
  }

  function darkVariant(key, value) {
    if (key === '--k-stage-bg' && /gradient/i.test(String(value))) {
      return 'linear-gradient(rgba(9,11,17,.88), rgba(9,11,17,.88)), ' + value;
    }
    if (key === '--k-texture') return invertTexture(value, true);
    if (TEXT_KEYS[key]) return darkenColor(value, 255, 0.88);
    if (SURFACE_KEYS[key]) return darkenColor(value, 0, 0.88);
    if (ACCENT_KEYS[key]) return darkenColor(value, 255, 0.3);
    return value;
  }

  function lightVariant(key, value) {
    if (key === '--k-stage-bg' && /gradient/i.test(String(value))) {
      return 'linear-gradient(rgba(255,255,255,.88), rgba(255,255,255,.88)), ' + value;
    }
    if (key === '--k-texture') return invertTexture(value, false);
    if (TEXT_KEYS[key]) return darkenColor(value, 0, 0.88);
    if (SURFACE_KEYS[key]) return darkenColor(value, 255, 0.88);
    if (ACCENT_KEYS[key]) return darkenColor(value, 0, 0.3);
    return value;
  }

  /* Luminosidade objetiva: média de --k-bg e --k-surface na escala 0–1.
     Abaixo de 0,45 o estilo é considerado escuro. Não é um julgamento
     artístico — é a mesma conta para os 20 estilos e para estilos
     importados. Gradientes são avaliados pela média das cores hex. */
  function tokensAreDark(t) {
    function lum(v) {
      const c = parseColor(v);
      if (c) return (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255;
      const hexes = String(v == null ? '' : v).match(/#[0-9a-f]{6}/gi);
      if (!hexes || !hexes.length) return 0.5;
      return hexes.map((h) => {
        const k = parseColor(h);
        return (0.2126 * k[0] + 0.7152 * k[1] + 0.0722 * k[2]) / 255;
      }).reduce((a, b) => a + b, 0) / hexes.length;
    }
    return ((lum(t['--k-bg']) + lum(t['--k-surface'])) / 2) < 0.45;
  }

  function styleIsDark() { return tokensAreDark(resolvedTokens()); }

  /* Contorno de cards e linhas: a borda não é empurrada para o mesmo extremo
     do fundo (isso fazia os cards desaparecerem). Ela é derivada do fundo já
     convertido com 33% de afastamento na direção oposta: fundo escuro ganha
     linha mais clara; fundo claro ganha linha mais escura. */
  const BORDER_SHIFT = 0.33;

  function displayTokens() {
    const t = resolvedTokens();
    const escuro = tokensAreDark(t);
    let fn = null;
    if (state.themeMode === 'dark' && !escuro) fn = darkVariant;
    if (state.themeMode === 'light' && escuro) fn = lightVariant;
    if (!fn) return t;
    const out = {};
    Object.keys(t).forEach((k) => { out[k] = fn(k, t[k]); });
    const fundo = out['--k-surface'] || out['--k-bg'];
    out['--k-border'] = darkenColor(fundo, fn === darkVariant ? 255 : 0, BORDER_SHIFT);
    return out;
  }

  /* A moldura do catálogo (cabeçalho, rodapé, lista de assets e
     propriedades) é imutável: usa sempre estes tokens, do "Lemon Crispy".
     O palco fica atrás dela e acompanha estilo/fundo/textura; a caixa
     central (#kit) recebe os tokens completos do estilo ativo.
     Os estilos chegam pela API em bootstrap(), então os tokens da moldura
     são resolvidos na primeira aplicação, não no carregamento do script. */
  let SHELL_TOKENS = null;
  function shellTokens() {
    if (!SHELL_TOKENS) {
      const lemon = T.STYLES.find((s) => s.id === 'kitui');
      SHELL_TOKENS = Object.assign({}, T.BASE, lemon ? lemon.tokens : {});
    }
    return SHELL_TOKENS;
  }

  function clearCustom(el, keep) {
    for (let i = el.style.length - 1; i >= 0; i--) {
      const k = el.style[i];
      if (k.indexOf('--k-') === 0 && (!keep || !Object.prototype.hasOwnProperty.call(keep, k))) {
        el.style.removeProperty(k);
      }
    }
  }

  function applyTokens() {
    const t = displayTokens();
    const root = document.documentElement;

    /* Raiz e moldura: apenas os valores fixos. Remove qualquer --k-* dinâmico
       deixado por chamadas anteriores (inclusive estilos importados). */
    const shell = shellTokens();
    clearCustom(root, shell);
    Object.keys(shell).forEach((k) => root.style.setProperty(k, shell[k]));

    /* Palco: fica atrás da moldura e volta a acompanhar o estilo ativo, os
       fundos e as texturas. Não muda os quatro blocos da aplicação. */
    if (els.stage) {
      clearCustom(els.stage);
      ['--k-stage-bg', '--k-stage-vignette', '--k-texture', '--k-texture-size', '--k-texture-opacity', '--k-text']
        .forEach((k) => { if (t[k] !== undefined) els.stage.style.setProperty(k, t[k]); });
    }

    /* Caixa central: tokens do estilo ativo e dos ajustes do inspetor. */
    if (els.kit) {
      clearCustom(els.kit);
      Object.keys(t).forEach((k) => els.kit.style.setProperty(k, t[k]));
    }

    document.body.dataset.kitStyle = state.style;
  }

  /* As fontes são servidas pelo próprio projeto (tabs_n_buttons/fontes/fonts.css e
     tabs_n_buttons/fontes/padroes/). A aplicação não faz nenhuma requisição externa. */
  let fontsCSSPromise = null;
  function localFontsCSS() {
    if (!fontsCSSPromise) {
      fontsCSSPromise = fetch('tabs_n_buttons/fontes/fonts.css')
        .then((r) => (r.ok ? r.text() : ''))
        .catch(() => '');
    }
    return fontsCSSPromise;
  }

  function bytesToBase64(bytes) {
    let bin = '';
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    return btoa(bin);
  }

  /* Devolve os @font-face da fonte ativa com os arquivos incorporados, para
     que o HTML/CSS exportado continue autocontido e sem links externos. */
  async function embeddedFontCSS(fontId) {
    const font = T.fontById(fontId);
    if (!font) return '';
    const css = await localFontsCSS();
    if (!css) return '';
    const blocks = css.match(/\/\*[\s\S]*?\*\/\s*@font-face\s*\{[\s\S]*?\}/g) || [];
    const pattern = new RegExp("font-family:\\s*['\"]" + font.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "['\"]");
    const out = [];
    for (const block of blocks) {
      if (!pattern.test(block)) continue;
      const m = block.match(/url\(['"]?\.\/([^)'"]+)['"]?\)/);
      if (!m) continue;
      try {
        const res = await fetch('tabs_n_buttons/fontes/' + m[1]);
        if (!res.ok) continue;
        const data = await res.arrayBuffer();
        out.push(block.replace(/url\(['"]?\.\/[^)'"]+['"]?\)/, 'url(data:font/woff2;base64,' + bytesToBase64(new Uint8Array(data)) + ')'));
      } catch (e) {
        /* fonte indisponível: mantém o fallback da stack CSS */
      }
    }
    return out.join('\n');
  }

  /* ------------------------------------------------------------------ */
  /* acervos importados                                                   */
  /* ------------------------------------------------------------------ */

  function sanitizeSVG(svg) {
    return String(svg || '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '')
      .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, '')
      .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, '')
      .replace(/javascript:/gi, '')
      .trim()
      .slice(0, 20000);
  }

  function normalizeAsset(kind, raw) {
    if (!raw || typeof raw !== 'object') return null;
    if (kind === 'icons') {
      const id = slugify(raw.id || raw.label);
      const svg = sanitizeSVG(raw.svg || raw.path);
      if (!id || !svg) return null;
      return {
        id,
        label: String(raw.label || id).slice(0, 60),
        category: String(raw.category || 'edit'),
        aliases: Array.isArray(raw.aliases) ? raw.aliases.map(String).slice(0, 8) : [],
        svg,
      };
    }
    if (kind === 'fonts') {
      const name = String(raw.name || raw.id || '').trim().slice(0, 60);
      if (!name) return null;
      const data = typeof raw.data === 'string' && /^data:font\//.test(raw.data) ? raw.data : null;
      return {
        id: String(raw.id || name),
        name,
        stack: String(raw.stack || name + ', ui-sans-serif, system-ui, sans-serif'),
        cat: String(raw.cat || 'Sans'),
        ...(data ? { data } : {}),
      };
    }
    if (kind === 'emojis') {
      const e = String(raw.e || raw.char || '').slice(0, 8);
      const name = String(raw.name || '').trim().slice(0, 60);
      if (!e || !name) return null;
      return {
        id: slugify(name) || String(e.codePointAt(0)).slice(0, 12),
        e,
        name,
        cat: String(raw.cat || 'Símbolos'),
        keys: String(raw.keys || ''),
      };
    }
    if (kind === 'textures') {
      const id = slugify(raw.id || raw.name);
      const tokens = raw.tokens && typeof raw.tokens === 'object' ? raw.tokens : null;
      if (!id || !tokens || !tokens['--k-texture']) return null;
      return {
        id,
        name: String(raw.name || id).slice(0, 60),
        cat: String(raw.cat || 'Importada'),
        desc: String(raw.desc || '').slice(0, 200),
        tokens,
      };
    }
    if (kind === 'stages') {
      const id = slugify(raw.id || raw.name);
      const value = String(raw.value || '');
      if (!id || !/^(#|rgb|linear-gradient|radial-gradient|conic-gradient|data:image)/i.test(value)) return null;
      return {
        id,
        name: String(raw.name || id).slice(0, 60),
        desc: String(raw.desc || '').slice(0, 200),
        tone: raw.tone === 'escuro' ? 'escuro' : 'claro',
        value: value.slice(0, 2000),
      };
    }
    return null;
  }

  function rebuildCustomAssets() {
    document.querySelectorAll('style[data-kitui-font]').forEach((el) => el.remove());
    IC.icons = BASE_ASSETS.icons.concat(customAssets.icons);
    if (IC.meta) IC.meta.count = IC.icons.length;
    T.FONTS = BASE_ASSETS.fonts.concat(customAssets.fonts);
    E.items = BASE_ASSETS.emojis.concat(customAssets.emojis);
    E.meta.count = E.items.length;
    E.categories = BASE_ASSETS.emojiCats
      .concat(customAssets.emojis.map((x) => x.cat).filter((c) => c && BASE_ASSETS.emojiCats.indexOf(c) < 0))
      .filter((c, i, a) => a.indexOf(c) === i);
    T.TEXTURE_LIST = BASE_ASSETS.textures.concat(customAssets.textures);
    T.TEXTURES = Object.assign({}, BASE_ASSETS.textureMap);
    customAssets.textures.forEach((t) => { T.TEXTURES[t.id] = t.tokens; });
    T.STAGE_LIST = BASE_ASSETS.stages.concat(customAssets.stages);
    T.STAGE_PRESETS = Object.assign({}, BASE_ASSETS.stageMap);
    customAssets.stages.forEach((s) => { T.STAGE_PRESETS[s.id] = s; });
    customAssets.fonts.forEach((font) => {
      if (!font.data) return;
      const el = document.createElement('style');
      el.setAttribute('data-kitui-font', font.id);
      const family = String(font.name).replace(/["\\]/g, '\\$&');
      el.textContent = '@font-face { font-family: "' + family + '"; font-style: normal; font-weight: 100 900; font-display: swap; src: url("' + font.data + '") format("woff2"); }';
      document.head.appendChild(el);
    });
  }

  function loadCustomAssets() {
    try {
      const raw = localStorage.getItem(ASSET_STORE);
      if (raw) {
        const saved = JSON.parse(raw);
        Object.keys(customAssets).forEach((k) => {
          if (Array.isArray(saved[k])) customAssets[k] = saved[k];
        });
      }
    } catch (e) {}
    rebuildCustomAssets();
  }

  function saveCustomAssets() {
    try {
      localStorage.setItem(ASSET_STORE, JSON.stringify(customAssets));
      return true;
    } catch (e) {
      return false;
    }
  }

  function assetName(kind, item) {
    if (kind === 'emojis') return item.name + ' ' + item.e;
    return item.name || item.label || item.id || '';
  }

  /* ------------------------------------------------------------------ */
  /* helpers de renderização compartilhados pelas abas                   */
  /* ------------------------------------------------------------------ */

  function currentQuery() {
    return (state.queries[state.tab] || '').trim().toLowerCase();
  }

  function matchesQuery(q, fields) {
    if (!q) return true;
    return fields.join(' ').toLowerCase().indexOf(q) > -1;
  }

  function emptyPanel(q) {
    return '<div class="panel-empty">Nenhum resultado para “' + esc(q) + '”.</div>';
  }

  function specHead(title, kicker, desc) {
    return (
      '<div class="spec-head"><div><div class="spec-head__title"><h2 class="spec-title">' + title + '</h2>' +
      (kicker ? '<span class="spec-kicker">' + kicker + '</span>' : '') + '</div>' +
      (desc ? '<p class="spec-desc">' + desc + '</p>' : '') + '</div></div>'
    );
  }

  function sec(title, body, open) {
    const key = state.tab + '|' + title;
    const isOpen = secOpen.has(key) ? secOpen.get(key) : true;
    return '<details class="sec"' + (isOpen ? ' open' : '') + ' data-sec="' + title + '"><summary>' + title + '<span class="caret"></span></summary><div class="sec__body">' + body + '</div></details>';
  }

  function numRow(label, key, value) {
    const cfg = NUM_CFG[key];
    const v = (+value).toFixed(cfg.decimals);
    return (
      '<div class="rowk"><label>' + label + '</label>' +
      '<div class="stepper">' +
      '<button type="button" data-step="dec" data-num="' + key + '" aria-label="Diminuir ' + label + '">−</button>' +
      '<input class="num" type="number" data-set="num" data-num="' + key + '" min="' + cfg.min + '" max="' + cfg.max + '" step="' + cfg.step + '" value="' + v + '" aria-label="' + label + '">' +
      '<button type="button" data-step="inc" data-num="' + key + '" aria-label="Aumentar ' + label + '">+</button>' +
      '</div><span class="val">' + cfg.unit + '</span></div>'
    );
  }

  function numValue(key) {
    const o = state.overrides;
    const t = resolvedTokens();
    if (key === 'bw') return o.bw === null || o.bw === undefined ? parseFloat(t['--k-bw']) : o.bw;
    if (key === 'blur') return o.blur === null || o.blur === undefined ? parseFloat(t['--k-blur']) : o.blur;
    if (key === 'fsScale') return Math.round((o.fsScale || 1) * 100);
    if (key === 'minFont') return fontMinPx();
    if (key === 'track') return o.track === null || o.track === undefined ? 0 : o.track;
    if (key === 'textureOpacity') {
      return o.textureOpacity === null || o.textureOpacity === undefined ? 100 : Math.round(o.textureOpacity * 100);
    }
    return 0;
  }

  function applyNum(key, displayValue) {
    const cfg = NUM_CFG[key];
    let v = Math.min(cfg.max, Math.max(cfg.min, displayValue));
    v = +(Math.round(v / cfg.step) * cfg.step).toFixed(4);
    if (key === 'fsScale') state.overrides.fsScale = v / 100;
    else if (key === 'textureOpacity') state.overrides.textureOpacity = v / 100;
    else state.overrides[key] = v;
    applyTokens();
    save();
    return v;
  }

  function styleFontName() {
    const st = T.styleById(state.style);
    return st.font ? T.fontById(st.font).name : 'Personalizado';
  }

  /* ------------------------------------------------------------------ */
  /* conversões de cor — usadas pelo inspetor e pelo seletor             */
  /* ------------------------------------------------------------------ */

  const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

  function isSolidHex(v) { return HEX_RE.test(String(v || '').trim()); }

  function colorToHex(v) {
    const s = String(v || '').trim();
    if (isSolidHex(s)) return hex6(s).slice(0, 7).toUpperCase();
    const m = s.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
    return m ? rgbToHex(+m[1], +m[2], +m[3]) : null;
  }

  /* Texto dos campos de cor: converte rgb/rgba para hexadecimal e mantém
     o canal alfa quando existe. Ex.: rgba(255,255,255,.78) -> #FFFFFFC7. */
  function colorToText(v) {
    const s = String(v == null ? '' : v).trim();
    if (isSolidHex(s)) return (s.length === 4 ? hex6(s) : s).toUpperCase();
    const m = s.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?/i);
    if (!m) return s.replace(/"/g, '');
    let out = rgbToHex(+m[1], +m[2], +m[3]);
    if (m[4] !== undefined) {
      const a = m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
      if (!isNaN(a)) out += Math.round(Math.min(1, Math.max(0, a)) * 255).toString(16).padStart(2, '0').toUpperCase();
    }
    return out;
  }

  function hex6(v) {
    const s = String(v || '').trim();
    return s.length === 4 ? '#' + s[1] + s[1] + s[2] + s[2] + s[3] + s[3] : s;
  }

  function hexToRgb(v) {
    const s = hex6(v).slice(1);
    return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
  }

  function rgbToHex(r, g, b) {
    const h = (n) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, '0');
    return ('#' + h(r) + h(g) + h(b)).toUpperCase();
  }

  function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    let h = 0;
    if (d) {
      if (max === r) h = ((g - b) / d) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
      if (h < 0) h += 360;
    }
    return { h: h / 360, s: max ? d / max : 0, v: max };
  }

  function hsvToRgb(h, s, v) {
    const c = v * s, x = c * (1 - Math.abs(((h * 6) % 2) - 1)), m = v - c;
    const seg = Math.floor(h * 6) % 6;
    let rgb;
    if (seg === 0) rgb = [c, x, 0];
    else if (seg === 1) rgb = [x, c, 0];
    else if (seg === 2) rgb = [0, c, x];
    else if (seg === 3) rgb = [0, x, c];
    else if (seg === 4) rgb = [x, 0, c];
    else rgb = [c, 0, x];
    return [(rgb[0] + m) * 255, (rgb[1] + m) * 255, (rgb[2] + m) * 255];
  }

  /* helpers compartilhados por mais de uma aba                          */

  function fontPreviewInfo() {
    if (!state.fontPreview) return null;
    return T.fontById(state.fontPreview) || null;
  }

  function fontInfo() {
    const st = T.styleById(state.style);
    if (state.overrides.font) return T.fontById(state.overrides.font);
    if (st.font) return T.fontById(st.font);
    return {
      id: null,
      name: 'Personalizado',
      cat: 'Do site',
      stack: st.tokens['--k-font'] || T.BASE['--k-font'],
      gf: null,
    };
  }

  function textureActive() { return state.overrides.texture || ''; }

  /* Valor de CSS injetado dentro de um atributo style="...": as aspas
     duplas do url("data:...") precisam virar entidades para o navegador
     decodificar de volta ao CSS válido. */
  function cssAttr(v) {
    return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  }

  function texStyle(id) {
    const tex = T.TEXTURES[id] || {};
    const img = tex['--k-texture'] || 'none';
    const size = tex['--k-texture-size'] || 'auto';
    return 'background-image:' + cssAttr(img) + ';background-size:' + cssAttr(size);
  }

  function styleTexStyle() {
    const st = T.styleById(state.style);
    const img = String(st.tokens['--k-texture'] || 'none');
    const size = st.tokens['--k-texture-size'] || 'auto';
    return 'background-image:' + cssAttr(img) + ';background-size:' + cssAttr(size);
  }

  function codeBox(id, label, text) {
    return (
      '<div class="codetabs">' +
      '<button class="' + (id === 'html' ? 'is-active' : '') + '" data-code-tab="html">HTML</button>' +
      '<button class="' + (id === 'css' ? 'is-active' : '') + '" data-code-tab="css">CSS</button>' +
      '</div>' +
      '<pre class="codeblock" data-code-pane="html">' + esc(text) + '</pre>'
    );
  }

  function inspCode(entry, kind) {
    return (
      sec('Sobre', '<div class="sec__hint">' + entry.desc + '</div>', true) +
      sec('Código', codeBox('html', 'HTML', entry.code || '') +
        '<div class="minibtns" style="margin-top:8px"><button class="minibtn minibtn--accent" data-act="copy-html">' + UI.icon('copy') + 'Copiar HTML</button>' +
        '<button class="minibtn" data-act="copy-htmlcss">' + UI.icon('component') + 'HTML + CSS</button></div>' +
        '<div class="sec__hint" style="margin-top:8px">O bloco HTML + CSS traz os tokens e só as regras usadas por este ' + kind + '.</div>', true) +
      sec('Acessibilidade', '<div class="sec__hint">Foco visível com <span class="k-mono" style="color:#B9C4D6">outline</span> em <span class="k-mono" style="color:#B9C4D6">:focus-visible</span>; rótulos ligados aos campos; contraste suficiente nos 8 estilos.</div>')
    );
  }

  function pvStyle() { return '--pv:' + state.previewZoom; }

  function pvControls() {
    const z = state.previewZoom;
    return '<div class="pvctl" role="group" aria-label="Zoom da prévia">' +
      '<button type="button" data-pv="-" title="Reduzir prévia">−</button>' +
      '<button type="button" class="pvctl__val" data-pv="reset" title="Restaurar 100%">' + Math.round(z * 100) + '%</button>' +
      '<button type="button" data-pv="+" title="Ampliar prévia">+</button></div>';
  }

  /* ------------------------------------------------------------------ */
  /* feedback                                                            */
  /* ------------------------------------------------------------------ */

  let toastTimer = 0;
  function toast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove('is-on'), 1900);
  }

  window.KIT_CORE = {
    T, IMP, IMPORT_MODULES, C, P, UI, IC, E, KIT_CSS,
    $, $$, esc,
    STORE, STYLE_STORE, ASSET_STORE, SEED_STORE, SEED_VER_STORE,
    IMPORT_KINDS, LAYOUT_RULES_NOTE, BASE_ASSETS, customAssets,
    DEFAULTS, NUM_CFG, secOpen, state, customStyles, els,

    load, save,
    slugify, loadCustomStyles, saveCustomStyles, seedStyles, sortStyles,
    isCustomStyle, swatchHTML,
    resolvedTokens, displayTokens, styleIsDark, tokensAreDark,
    darkVariant, lightVariant, shellTokens, clearCustom, applyTokens,
    localFontsCSS, bytesToBase64, embeddedFontCSS,
    sanitizeSVG, normalizeAsset, rebuildCustomAssets,
    loadCustomAssets, saveCustomAssets, assetName, toast,

    currentQuery, matchesQuery, emptyPanel, specHead,
    sec, numRow, numValue, applyNum, styleFontName,
    HEX_RE, isSolidHex, colorToHex, colorToText, hex6, hexToRgb, rgbToHex, rgbToHsv, hsvToRgb,

    fontInfo, fontPreviewInfo, fontMinPx, fontScaleSteps, textureActive, cssAttr, texStyle, styleTexStyle,
    codeBox, inspCode, pvStyle, pvControls,
  };
})();
