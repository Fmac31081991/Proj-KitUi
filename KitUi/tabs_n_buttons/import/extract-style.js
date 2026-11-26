/* Kit UI — extrator de estilo de sites
   ------------------------------------------------------------------
   COMO USAR
   1. Abra o site alvo no Chrome (desktop).
   2. Abra o DevTools (F12) → Console.
   3. Cole TODO este arquivo e pressione Enter.
   4. O JSON é copiado para a área de transferência (quando o DevTools
      permite) e também fica em window.__kitStyle.
   5. No Kit UI: clique em "Importar" no cabeçalho → cole o JSON → Importar.

   O script só LÊ estilos computados da página. Não envia nada, não
   altera a página e não acessa outros sites/iframes.

   Para sites com tema claro/escuro, rode uma vez em cada tema.
   ------------------------------------------------------------------ */
(() => {
  'use strict';

  const MAX_ELEMENTS = 8000;
  const vw = Math.max(1, window.innerWidth);
  const vh = Math.max(1, window.innerHeight);

  /* ---------- utilidades numéricas ---------- */
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const round = (v, d) => {
    const m = Math.pow(10, d || 0);
    return Math.round(v * m) / m;
  };
  const num = (v, fallback) => {
    const n = parseFloat(v);
    return isNaN(n) ? fallback : n;
  };
  const median = (arr, fallback) => {
    const a = arr.filter((n) => typeof n === 'number' && isFinite(n)).sort((x, y) => x - y);
    if (!a.length) return fallback;
    const m = Math.floor(a.length / 2);
    return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
  };
  const weightedMedian = (pairs, fallback) => {
    const a = pairs.filter((p) => typeof p.v === 'number' && isFinite(p.v)).sort((x, y) => x.v - y.v);
    if (!a.length) return fallback;
    const total = a.reduce((s, p) => s + (p.w || 1), 0);
    let acc = 0;
    for (let i = 0; i < a.length; i++) {
      acc += a[i].w || 1;
      if (acc >= total / 2) return a[i].v;
    }
    return a[a.length - 1].v;
  };
  const mode = (arr, fallback) => {
    const map = new Map();
    arr.forEach((v) => {
      if (v !== undefined && v !== null && v !== '') map.set(v, (map.get(v) || 0) + 1);
    });
    let best = null;
    let n = 0;
    map.forEach((count, v) => {
      if (count > n) { n = count; best = v; }
    });
    return best === null ? fallback : best;
  };

  /* ---------- cores ---------- */
  const cvs = document.createElement('canvas');
  cvs.width = cvs.height = 1;
  const ctx = cvs.getContext('2d', { willReadFrequently: true });

  function parseColor(str) {
    if (!str) return null;
    const s = String(str).trim();
    let m = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)$/i.exec(s);
    if (m) {
      return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
    }
    m = /^#([0-9a-f]{3,8})$/i.exec(s);
    if (m) {
      let hex = m[1];
      if (hex.length === 3 || hex.length === 4) hex = hex.split('').map((c) => c + c).join('');
      if (hex.length !== 6 && hex.length !== 8) return null;
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1,
      };
    }
    if (s === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
    /* Cores em oklch()/color(display-p3 …): resolve via canvas. */
    if (!ctx) return null;
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = '#010203';
    ctx.fillStyle = s;
    if (ctx.fillStyle === '#010203' && s.toLowerCase() !== '#010203') return null;
    ctx.fillStyle = s;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return { r: d[0], g: d[1], b: d[2], a: d[3] / 255 };
  }

  function over(fg, bg) {
    const a = fg.a + bg.a * (1 - fg.a);
    if (a <= 0) return { r: 0, g: 0, b: 0, a: 0 };
    return {
      r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a,
      g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a,
      b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a,
      a,
    };
  }

  const mix = (a, b, t) => ({
    r: a.r * (1 - t) + b.r * t,
    g: a.g * (1 - t) + b.g * t,
    b: a.b * (1 - t) + b.b * t,
    a: a.a,
  });

  const dist = (a, b) => Math.sqrt(
    (a.r - b.r) * (a.r - b.r) +
    (a.g - b.g) * (a.g - b.g) +
    (a.b - b.b) * (a.b - b.b)
  );

  const lin = (v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const luminance = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  const contrast = (a, b) => {
    const l1 = luminance(a);
    const l2 = luminance(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };
  const chroma = (c) => Math.max(c.r, c.g, c.b) - Math.min(c.r, c.g, c.b);
  const sat = (c) => {
    const mx = Math.max(c.r, c.g, c.b);
    const mn = Math.min(c.r, c.g, c.b);
    return mx <= 0 ? 0 : (mx - mn) / mx;
  };
  const hue = (c) => {
    const r = c.r / 255, g = c.g / 255, b = c.b / 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    if (!d) return 0;
    let h;
    if (mx === r) h = ((g - b) / d) % 6;
    else if (mx === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    return h < 0 ? h + 360 : h;
  };
  const hueDiff = (a, b) => {
    const d = Math.abs(a - b) % 360;
    return d > 180 ? 360 - d : d;
  };
  const toHex = (v) => ('0' + Math.round(clamp(v, 0, 255)).toString(16)).slice(-2).toUpperCase();
  const toCss = (c) => {
    if (!c) return '#000000';
    if (c.a >= 0.999) return '#' + toHex(c.r) + toHex(c.g) + toHex(c.b);
    return 'rgba(' + Math.round(c.r) + ', ' + Math.round(c.g) + ', ' + Math.round(c.b) + ', ' + round(c.a, 2) + ')';
  };
  const bestInk = (bg) => (contrast({ r: 255, g: 255, b: 255, a: 1 }, bg) >= contrast({ r: 17, g: 17, b: 17, a: 1 }, bg)
    ? { r: 255, g: 255, b: 255, a: 1 }
    : { r: 17, g: 17, b: 17, a: 1 });

  /* ---------- paleta ponderada ---------- */
  function Palette() {
    const map = new Map();
    return {
      add(str, weight, kind, hint) {
        if (!str || weight <= 0) return;
        const c = parseColor(str);
        if (!c || c.a < 0.04) return;
        const key = [c.r, c.g, c.b].map((v) => Math.round(v / 9)).join(',');
        let e = map.get(key);
        if (!e) {
          e = { r: 0, g: 0, b: 0, a: 0, w: 0, kinds: {}, hints: {} };
          map.set(key, e);
        }
        const total = e.w + weight;
        e.r = (e.r * e.w + c.r * weight) / total;
        e.g = (e.g * e.w + c.g * weight) / total;
        e.b = (e.b * e.w + c.b * weight) / total;
        e.a = total > 0 ? (e.a * e.w + c.a * weight) / total : c.a;
        e.w = total;
        if (kind) e.kinds[kind] = (e.kinds[kind] || 0) + weight;
        if (hint) e.hints[hint] = (e.hints[hint] || 0) + weight;
      },
      list() {
        return Array.from(map.values());
      },
      top(fn) {
        return Array.from(map.values())
          .filter((c) => !fn || fn(c))
          .sort((a, b) => b.w - a.w);
      },
      best(fn) {
        const list = this.top(fn);
        return list.length ? list[0] : null;
      },
      empty() { return map.size === 0; },
    };
  }

  /* ---------- coleta de elementos ---------- */
  const elements = [];
  const seen = new Set();
  function push(el) {
    if (!el || seen.has(el) || elements.length >= MAX_ELEMENTS) return;
    seen.add(el);
    elements.push(el);
  }

  function walk(root) {
    if (elements.length >= MAX_ELEMENTS) return;
    const list = root.querySelectorAll ? root.querySelectorAll('*') : [];
    for (let i = 0; i < list.length; i++) {
      const el = list[i];
      push(el);
      if (el.shadowRoot) walk(el.shadowRoot);
      if (elements.length >= MAX_ELEMENTS) return;
    }
  }

  push(document.documentElement);
  push(document.body);
  walk(document);

  const bgPalette = Palette();
  const textPalette = Palette();
  const borderPalette = Palette();
  const hintPalette = Palette();

  const radii = [];
  const controlHeights = [];
  const controlPadsX = [];
  const controlPadsY = [];
  const cardPads = [];
  const gaps = [];
  const borderWidths = [];
  const buttonShadows = [];
  const cardShadows = [];
  const inputShadows = [];
  const blurs = [];
  const saturates = [];
  const fontSizes = [];
  const headingSizes = { h1: [], h2: [], h3: [] };
  const controlFontSizes = [];
  const controlWeights = [];
  const headingWeights = [];
  const transitionsDur = [];
  const transitionsEase = [];
  const monoFonts = [];
  const buttonTransforms = [];
  let truncated = false;
  let sampled = 0;

  const bodyEl = document.body || document.documentElement;
  const bodyCs = getComputedStyle(bodyEl);
  const htmlCs = getComputedStyle(document.documentElement);
  const vwArea = vw * vh;

  /* Fundo provisório para compor textos sobre superfícies translúcidas. */
  const provisionalBg = (() => {
    const b = parseColor(bodyCs.backgroundColor);
    const h = parseColor(htmlCs.backgroundColor);
    let c = b && b.a >= 0.5 ? b : (h && h.a >= 0.5 ? h : { r: 255, g: 255, b: 255, a: 1 });
    if (c.a < 1) c = over(c, { r: 255, g: 255, b: 255, a: 1 });
    return c;
  })();

  /* Fundo efetivo: sobe a árvore até achar camadas opacas. */
  const bgCache = new WeakMap();
  function effectiveBg(el) {
    const chain = [];
    let node = el;
    let depth = 0;
    while (node && node.nodeType === 1 && depth < 16) {
      const cached = bgCache.get(node);
      if (cached) {
        chain.push(cached);
        break;
      }
      const c = parseColor(getComputedStyle(node).backgroundColor);
      if (c && c.a > 0.004) {
        chain.push(c);
        if (c.a >= 0.999) break;
      }
      node = node.parentElement;
      depth++;
    }
    let base = { r: provisionalBg.r, g: provisionalBg.g, b: provisionalBg.b, a: 1 };
    for (let i = chain.length - 1; i >= 0; i--) base = over(chain[i], base);
    base.a = 1;
    if (el && el.nodeType === 1) bgCache.set(el, base);
    return base;
  }

  for (let idx = 0; idx < elements.length; idx++) {
    const el = elements[idx];
    if (el === document.documentElement || el === document.body) { sampled++; }
    const rect = el.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.visibility === 'collapse') continue;
    if (num(cs.opacity, 1) < 0.06) continue;

    sampled++;
    const tag = (el.tagName || '').toLowerCase();
    const cls = typeof el.className === 'string' ? el.className : '';
    const id = el.id || '';
    const role = el.getAttribute('role') || '';
    const type = (el.getAttribute('type') || '').toLowerCase();
    const area = (rect.width * rect.height) / vwArea;
    const directText = (() => {
      let t = '';
      for (let n = el.firstChild; n; n = n.nextSibling) {
        if (n.nodeType === 3) t += n.nodeValue;
      }
      return t.replace(/\s+/g, ' ').trim();
    })();
    const hint = /danger|error|invalid|destructive|delete|remove|alert/i.test(cls + ' ' + id + ' ' + role)
      ? 'danger'
      : (/success|valid|positive|confirm|approved|ok/i.test(cls + ' ' + id + ' ' + role) ? 'success' : '');

    const isButton = tag === 'button' ||
      role === 'button' ||
      (tag === 'input' && /^(button|submit|reset)$/.test(type)) ||
      (tag === 'a' && (role === 'button' || /(^|[\s_-])(btn|button|cta)([\s_-]|$)/i.test(cls)));
    const isInput = ['input', 'select', 'textarea'].indexOf(tag) >= 0 &&
      !/^(button|submit|reset|checkbox|radio|range|color|file|hidden)$/.test(type);
    const isControl = isButton || isInput;
    const isLink = tag === 'a' && !!el.getAttribute('href') && !isButton;
    const isHeading = /^h[1-6]$/.test(tag);
    const isCard = !isControl && (
      ['article', 'section', 'aside', 'dialog', 'form', 'header', 'footer', 'nav', 'main', 'li', 'td', 'div', 'ul', 'ol'].indexOf(tag) >= 0
    ) && area > 0.004 && area < 0.92 && (
      num(cs.borderTopWidth, 0) > 0 ||
      num(cs.borderTopLeftRadius, 0) > 0 ||
      (cs.boxShadow && cs.boxShadow !== 'none') ||
      num(cs.paddingTop, 0) >= 10
    );
    const isBadge = !isControl && num(cs.borderTopLeftRadius, 0) >= 12 && rect.height <= 40 && rect.width <= 260 && !!directText;
    const isCode = ['code', 'pre', 'kbd', 'samp'].indexOf(tag) >= 0;

    /* fundos */
    if (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)') {
      let w = Math.max(0.05, Math.min(area, 0.5) * 10);
      if (el === bodyEl || el === document.documentElement) w += 2;
      if (isControl) w *= 3;
      if (isCard) w *= 1.5;
      bgPalette.add(cs.backgroundColor, w, isControl ? 'control' : (isCard ? 'card' : 'other'), hint);
      if (hint) hintPalette.add(cs.backgroundColor, w, 'bg', hint);
    }

    /* texto */
    if (directText && directText.length >= 1) {
      let w = clamp(directText.length, 1, 140) / 12;
      if (isHeading) w *= 3;
      if (isControl || isLink) w *= 1.6;
      const bgText = effectiveBg(el);
      const col = over(parseColor(cs.color) || { r: 0, g: 0, b: 0, a: 1 }, bgText);
      textPalette.add('rgb(' + Math.round(col.r) + ',' + Math.round(col.g) + ',' + Math.round(col.b) + ')', w, isControl ? 'control' : (isHeading ? 'heading' : 'body'), hint);
      if (hint) hintPalette.add(cs.color, w, 'text', hint);

      const fs = num(cs.fontSize, 0);
      if (fs > 0) {
        fontSizes.push({ v: fs, w });
        if (isControl && directText.length >= 2) controlFontSizes.push({ v: fs, w });
        if (isHeading) {
          const level = tag === 'h1' ? 'h1' : tag === 'h2' ? 'h2' : 'h3';
          headingSizes[level].push({ v: fs, w });
        }
      }
      if (isHeading) headingWeights.push(cs.fontWeight);
      if (isControl && directText.length >= 2) {
        controlWeights.push(cs.fontWeight);
        buttonTransforms.push(cs.textTransform);
      }
    }

    /* bordas */
    const bw = num(cs.borderTopWidth, 0);
    const bstyle = cs.borderTopStyle;
    if (bw > 0 && bstyle && bstyle !== 'none' && cs.borderTopColor && cs.borderTopColor !== 'rgba(0, 0, 0, 0)') {
      borderPalette.add(cs.borderTopColor, isControl || isCard ? 1.4 : 0.5, isControl ? 'control' : 'other', hint);
      if (hint) hintPalette.add(cs.borderTopColor, 1, 'border', hint);
      if (isControl || isCard) borderWidths.push({ v: bw, w: isControl ? 2 : 1 });
    }

    /* geometria */
    const hasControlLabel = isControl && directText.length >= 2 && rect.width >= 36;
    if (isCard || isBadge || hasControlLabel) {
      const r = num(cs.borderTopLeftRadius, 0);
      if (r >= 0 && r < 400) radii.push({ v: r, w: hasControlLabel ? 2 : 1 });
    }
    if (hasControlLabel && rect.height >= 24 && rect.height <= 90) {
      controlHeights.push({ v: rect.height, w: 1 });
      const px = (num(cs.paddingLeft, 0) + num(cs.paddingRight, 0)) / 2;
      const py = (num(cs.paddingTop, 0) + num(cs.paddingBottom, 0)) / 2;
      if (px > 0) controlPadsX.push({ v: px, w: 1 });
      if (py >= 0) controlPadsY.push({ v: py, w: 1 });
    }
    if (isCard) {
      cardPads.push({ v: (num(cs.paddingTop, 0) + num(cs.paddingBottom, 0)) / 2, w: 1 });
    }
    if ((cs.display === 'flex' || cs.display === 'inline-flex' || cs.display === 'grid' || cs.display === 'inline-grid') && cs.gap && cs.gap !== 'normal') {
      const parts = cs.gap.split(/\s+/).map((v) => num(v, 0));
      const g = Math.min.apply(null, parts);
      if (g > 0 && g <= 64) gaps.push({ v: g, w: 1 });
    }

    /* sombras */
    if (cs.boxShadow && cs.boxShadow !== 'none') {
      if (isControl) buttonShadows.push(cs.boxShadow);
      else if (isCard) cardShadows.push(cs.boxShadow);
      if (isInput) inputShadows.push(cs.boxShadow);
    }

    /* efeitos */
    if (cs.backdropFilter && cs.backdropFilter !== 'none') {
      const bm = /blur\(([\d.]+)px\)/.exec(cs.backdropFilter);
      const sm = /saturate\(([\d.]+)\)/.exec(cs.backdropFilter);
      if (bm) blurs.push({ v: +bm[1], w: 1 });
      if (sm) saturates.push({ v: +sm[1], w: 1 });
    }

    /* transições */
    if (cs.transitionDuration) {
      const d = cs.transitionDuration.split(',')[0].trim();
      const ms = /ms$/.test(d) ? num(d, 0) : num(d, 0) * 1000;
      if (ms > 0 && ms <= 600) transitionsDur.push({ v: ms, w: 1 });
    }
    if (cs.transitionTimingFunction) transitionsEase.push(cs.transitionTimingFunction.split(',')[0].trim());

    /* fontes monoespaçadas */
    if (isCode || /mono/i.test(cs.fontFamily)) monoFonts.push(cs.fontFamily);
  }

  truncated = elements.length >= MAX_ELEMENTS;

  /* ---------- decisões ---------- */
  const parseSafe = (v, fb) => {
    const c = parseColor(v);
    return c && c.a > 0.03 ? c : fb;
  };
  const pageBgRaw = parseColor(bodyCs.backgroundColor);
  const htmlBgRaw = parseColor(htmlCs.backgroundColor);
  let pageBg = pageBgRaw && pageBgRaw.a >= 0.5
    ? pageBgRaw
    : (htmlBgRaw && htmlBgRaw.a >= 0.5 ? htmlBgRaw : { r: 255, g: 255, b: 255, a: 1 });
  if (pageBg.a < 1) pageBg = over(pageBg, { r: 255, g: 255, b: 255, a: 1 });

  /* superfícies: prioriza fundos de cards, depois controles */
  const surfaceCandidates = bgPalette
    .top((c) => dist(c, pageBg) > 10 && c.a >= 0.35)
    .map((c) => ({ c, s: c.w + (c.kinds.card || 0) * 2 - (c.kinds.control || 0) * 0.6 }))
    .sort((a, b) => b.s - a.s)
    .map((x) => x.c);
  const surfaceA = surfaceCandidates[0] || mix(pageBg, luminance(pageBg) > 0.5 ? { r: 0, g: 0, b: 0, a: 1 } : { r: 255, g: 255, b: 255, a: 1 }, 0.05);
  let surfaceB = surfaceCandidates.find((c) => dist(c, surfaceA) > 10 && dist(c, pageBg) > 12);
  if (!surfaceB) surfaceB = mix(surfaceA, luminance(pageBg) > 0.5 ? { r: 0, g: 0, b: 0, a: 1 } : { r: 255, g: 255, b: 255, a: 1 }, 0.06);
  if (dist(surfaceB, surfaceA) < 6) surfaceB = mix(surfaceA, pageBg, 0.5);

  /* texto: cor do body quando legível; senão peso × contraste */
  const textScored = textPalette
    .top()
    .map((c) => ({ c, s: c.w * clamp(contrast(over(c, pageBg), pageBg), 1, 14) }))
    .sort((a, b) => b.s - a.s);
  const bodyInk = (() => {
    const c = parseColor(bodyCs.color);
    return c ? over(c, pageBg) : null;
  })();
  const text = (bodyInk && contrast(bodyInk, pageBg) >= 4.5)
    ? bodyInk
    : ((textScored[0] && textScored[0].c) || (luminance(pageBg) > 0.5 ? { r: 17, g: 17, b: 17, a: 1 } : { r: 245, g: 245, b: 245, a: 1 }));
  const mutedTarget = mix(text, pageBg, 0.38);
  const mutedCand = textScored
    .map((x) => x.c)
    .find((c) => {
      const cr = contrast(over(c, pageBg), pageBg);
      return cr >= 2.6 && cr <= 8 && dist(c, mutedTarget) < 42;
    });
  const muted = mutedCand || mutedTarget;

  /* borda */
  const borderCandidates = borderPalette.top((c) => contrast(over(c, pageBg), pageBg) >= 1.08);
  const border = borderCandidates[0] || mix(text, pageBg, 0.16);

  /* cor de marca */
  const isBrandColor = (c) => chroma(c) >= 20 && sat(c) >= 0.18 && c.a >= 0.5 &&
    luminance(c) > 0.02 && luminance(c) < 0.95 &&
    dist(c, pageBg) > 18 && dist(c, text) > 18;
  let primary = bgPalette.top((c) => (c.kinds.control || 0) > 0 && isBrandColor(c))[0];
  if (!primary) {
    /* sites monocromáticos: usa o fundo de controle com maior contraste */
    primary = bgPalette.top((c) => (c.kinds.control || 0) > 0 && c.a >= 0.5 &&
      contrast(over(c, pageBg), pageBg) >= 3 && dist(c, pageBg) > 14)[0];
  }
  if (!primary) {
    primary = bgPalette.top((c) => chroma(c) >= 22 && sat(c) >= 0.3 && c.a >= 0.5 &&
      luminance(c) > 0.02 && luminance(c) < 0.95 && dist(c, pageBg) > 18)[0];
  }
  if (!primary) {
    primary = textPalette.top((c) => chroma(c) >= 20 && sat(c) >= 0.28 && dist(c, pageBg) > 18)[0];
  }
  if (!primary) primary = { r: 47, g: 111, b: 237, a: 1 };
  if (dist(primary, pageBg) < 12) primary = { r: 47, g: 111, b: 237, a: 1 };

  const primaryHue = hue(primary);
  let accent = bgPalette.top((c) => chroma(c) >= 20 && sat(c) >= 0.24 && c.a >= 0.5 &&
    hueDiff(hue(c), primaryHue) >= 28 && dist(c, primary) > 24 && dist(c, pageBg) > 18)[0];
  if (!accent) {
    accent = textPalette.top((c) => chroma(c) >= 20 && sat(c) >= 0.24 &&
      hueDiff(hue(c), primaryHue) >= 28 && dist(c, primary) > 24)[0];
  }
  if (!accent) accent = mix(primary, pageBg, 0.55);

  const onPrimaryCand = textPalette.top((c) => (c.kinds.control || 0) > 0 && contrast(over(c, primary), primary) >= 4)[0];
  const onPrimaryDetected = onPrimaryCand ? over(onPrimaryCand, primary) : null;
  const onPrimaryInk = bestInk(primary);
  const onPrimary = onPrimaryDetected && contrast(onPrimaryDetected, primary) >= contrast(onPrimaryInk, primary) * 0.8
    ? onPrimaryDetected
    : onPrimaryInk;
  const onAccent = bestInk(accent);

  /* semânticas */
  const isSignal = (c) => c.a >= 0.5 && sat(c) >= 0.5 && luminance(c) >= 0.05 && luminance(c) <= 0.72;
  const dangerHint = hintPalette.best((c) => (c.hints.danger || 0) > 0 && isSignal(c));
  const successHint = hintPalette.best((c) => (c.hints.success || 0) > 0 && isSignal(c));
  const dangerHue = bgPalette.top((c) => {
    const h = hue(c);
    return isSignal(c) && sat(c) >= 0.6 && (h >= 344 || h <= 14) && contrast(over(c, pageBg), pageBg) >= 1.6;
  })[0];
  const successHue = bgPalette.top((c) => {
    const h = hue(c);
    return isSignal(c) && sat(c) >= 0.4 && h >= 96 && h <= 168 && contrast(over(c, pageBg), pageBg) >= 1.4;
  })[0];
  const danger = dangerHint || dangerHue || { r: 217, g: 45, b: 32, a: 1 };
  const success = successHint || successHue || { r: 18, g: 128, b: 92, a: 1 };
  const onDanger = bestInk(danger);
  const onSuccess = bestInk(success);
  const focus = primary;

  /* formas */
  const controlsH = weightedMedian(controlHeights, 38);
  const radiusVals = radii.map((p) => p.v).filter((v) => v >= 0 && v < 100);
  let rxs, rsm, rmd, rlg;
  if (radiusVals.length) {
    const sortedR = radiusVals.slice().sort((a, b) => a - b);
    const pct = (p) => sortedR[Math.min(sortedR.length - 1, Math.floor((sortedR.length - 1) * p))];
    rxs = round(pct(0.2), 1);
    rsm = round(pct(0.45), 1);
    rmd = round(weightedMedian(radii.filter((p) => p.v < 100), 8), 1);
    rlg = round(pct(0.85), 1);
    if (rmd < rsm) rmd = rsm;
    if (rmd < rxs) rmd = rxs;
    if (rlg < rmd) rlg = round(rmd * 1.35, 1);
    if (rxs > rsm) rxs = rsm;
  } else {
    rxs = 0; rsm = 0; rmd = 0; rlg = 0;
  }
  const radiusName = rmd <= 5 ? 'sharp' : (rmd <= 13 ? 'soft' : (rmd <= 22 ? 'round' : 'pill'));

  const bw = round(weightedMedian(borderWidths, 0), 1);

  /* espaçamento */
  const gap = clamp(round(weightedMedian(gaps, 16)), 0, 48);
  const padX = clamp(round(weightedMedian(controlPadsX, 16)), 4, 40);
  const padY = clamp(round(weightedMedian(controlPadsY, 9)), 2, 24);
  const cardPad = clamp(round(weightedMedian(cardPads, 20)), 8, 48);
  const sectionPad = clamp(round(Math.max(cardPad * 1.25, gap * 1.4)), 12, 56);
  const controlH = clamp(round(controlsH), 28, 56);
  const density = controlH <= 36 && gap <= 14 ? 'compact' : (controlH >= 46 || gap >= 22 ? 'comfortable' : 'regular');

  /* sombras */
  const shadowLayers = (s) => {
    const out = [];
    let depth = 0;
    let cur = '';
    const str = String(s || '');
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (ch === '(') depth++;
      else if (ch === ')') depth = Math.max(0, depth - 1);
      if (ch === ',' && depth === 0) {
        if (cur.trim()) out.push(cur.trim());
        cur = '';
      } else {
        cur += ch;
      }
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  };
  const shadowKey = (s) => shadowLayers(s)
    .filter((layer) => !/\binset\b/i.test(layer))
    .join(', ')
    .replace(/\s+/g, ' ')
    .trim();
  const shadowScale = (s) => {
    const px = String(s).match(/-?\d+(?:\.\d+)?px/g) || [];
    return Math.max.apply(null, [0].concat(px.map(parseFloat)));
  };
  const pickShadow = (arr) => {
    const clean = arr.map(shadowKey).filter((s) => s && s !== 'none');
    return mode(clean, 'none');
  };
  const btnShadow = pickShadow(buttonShadows);
  const inputShadow = mode(
    inputShadows
      .map((s) => shadowLayers(s).filter((l) => /\binset\b/i.test(l)).join(', ').replace(/\s+/g, ' ').trim())
      .filter((s) => s),
    'none'
  );
  const cardDistinct = Array.from(new Set(cardShadows.map(shadowKey)))
    .filter((s) => s && s !== 'none')
    .sort((a, b) => shadowScale(a) - shadowScale(b));
  const shadowSm = cardDistinct[0] || (btnShadow !== 'none' ? btnShadow : 'none');
  const shadowMd = cardDistinct.length ? cardDistinct[cardDistinct.length - 1] : shadowSm;

  /* tipografia */
  const bodyFont = bodyCs.fontFamily || 'Inter, ui-sans-serif, system-ui, sans-serif';
  const monoFont = mode(monoFonts, '"JetBrains Mono", ui-monospace, "Cascadia Code", Consolas, monospace');
  const fs = clamp(round(num(bodyCs.fontSize, 16)), 12, 20);
  const fsSmall = clamp(round(weightedMedian(controlFontSizes, fs * 0.84)), 10, fs - 0.5);
  const fsLg = clamp(round(fs * 1.13), fs + 1, fs + 6);
  const h1 = clamp(round(weightedMedian(headingSizes.h1, fs * 2.1)), 24, 48);
  const h2 = clamp(round(weightedMedian(headingSizes.h2, fs * 1.55)), 18, Math.max(20, Math.min(36, h1 - 2)));
  const h3 = clamp(round(weightedMedian(headingSizes.h3, fs * 1.18)), Math.max(14, fs + 1), Math.max(16, Math.min(26, h2 - 1)));
  const lhRaw = num(bodyCs.lineHeight, 0);
  const lh = clamp(round(lhRaw > 0 ? lhRaw / fs : 1.55, 2), 1.25, 2);
  const weight = String(num(bodyCs.fontWeight, 400));
  const weightStrong = String(num(mode(headingWeights, bodyCs.fontWeight), 600));
  const weightLabel = String(num(mode(controlWeights, bodyCs.fontWeight), 600));
  const trackPx = num(bodyCs.letterSpacing, 0);
  const track = round(trackPx / fs, 3);
  const upperCount = buttonTransforms.filter((t) => t === 'uppercase').length;
  const transform = buttonTransforms.length && upperCount / buttonTransforms.length >= 0.6 ? 'uppercase' : 'none';
  const dur = clamp(round(weightedMedian(transitionsDur, 160)), 80, 400);
  const ease = mode(transitionsEase, 'cubic-bezier(.2, .7, .3, 1)');

  /* efeitos de vidro */
  const blur = clamp(round(weightedMedian(blurs, 0)), 0, 40);
  const saturate = clamp(round(weightedMedian(saturates, 1), 2), 0.4, 3);

  /* fundo do palco */
  let stageBg = toCss(pageBg);
  const bodyImg = bodyCs.backgroundImage;
  if (bodyImg && bodyImg !== 'none' && /gradient\(/.test(bodyImg) && !/url\(/.test(bodyImg)) {
    stageBg = bodyImg;
  }

  /* ---------- montagem ---------- */
  const host = location.hostname.replace(/^www\./, '');
  const siteMeta = document.querySelector('meta[property="og:site_name"]');
  const docTitle = String(document.title || '')
    .replace(/\s+/g, ' ')
    .split(/\s+[|\u2013\u2014-]\s+/)[0]
    .trim();
  const name = String(
    (siteMeta && siteMeta.content) ||
    docTitle ||
    host ||
    (location.protocol === 'file:' ? 'Página local' : 'Site importado')
  ).trim().slice(0, 48) || 'Site importado';
  const slug = (host ? name + '-' + host : name)
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'importado';

  const tokens = {
    '--k-bg': toCss(pageBg),
    '--k-surface': toCss(surfaceA),
    '--k-surface-2': toCss(surfaceB),
    '--k-text': toCss(text),
    '--k-muted': toCss(muted),
    '--k-border': toCss(border),
    '--k-primary': toCss(primary),
    '--k-on-primary': toCss(onPrimary),
    '--k-accent': toCss(accent),
    '--k-on-accent': toCss(onAccent),
    '--k-danger': toCss(danger),
    '--k-on-danger': toCss(onDanger),
    '--k-success': toCss(success),
    '--k-on-success': toCss(onSuccess),
    '--k-focus': toCss(focus),

    '--k-radius-xs': rxs + 'px',
    '--k-radius-sm': rsm + 'px',
    '--k-radius-md': rmd + 'px',
    '--k-radius-lg': rlg + 'px',
    '--k-radius-pill': '999px',
    '--k-bw': bw + 'px',

    '--k-shadow-sm': shadowSm,
    '--k-shadow-md': shadowMd,
    '--k-btn-shadow': btnShadow,
    '--k-btn-shadow-hover': btnShadow !== 'none' ? btnShadow : 'none',
    '--k-btn-hover-transform': 'none',
    '--k-btn-active-transform': 'translateY(0)',
    '--k-field-inset': inputShadow,
    '--k-blur': blur + 'px',
    '--k-saturate': String(saturate),

    '--k-gap': gap + 'px',
    '--k-pad': cardPad + 'px',
    '--k-pad-x': padX + 'px',
    '--k-pad-y': padY + 'px',
    '--k-control-h': controlH + 'px',
    '--k-card-pad': cardPad + 'px',
    '--k-section-pad': sectionPad + 'px',

    '--k-font': bodyFont,
    '--k-font-mono': monoFont,
    '--k-fs': fs + 'px',
    '--k-fs-sm': fsSmall + 'px',
    '--k-fs-lg': fsLg + 'px',
    '--k-fs-h1': h1 + 'px',
    '--k-fs-h2': h2 + 'px',
    '--k-fs-h3': h3 + 'px',
    '--k-lh': String(lh),
    '--k-weight': weight,
    '--k-weight-strong': weightStrong,
    '--k-weight-label': weightLabel,
    '--k-track': track + 'em',
    '--k-transform': transform,
    '--k-dur': dur + 'ms',
    '--k-ease': ease,

    '--k-stage-bg': stageBg,
    '--k-texture': 'none',
    '--k-texture-size': '24px 24px',
    '--k-texture-opacity': '1',
    '--k-stage-vignette': 'none',
  };

  const style = {
    id: slug,
    name,
    family: 'Importado',
    note: 'Extraído de ' + location.href.replace(/^https?:\/\//, '').slice(0, 90),
    swatch: [toCss(primary), toCss(surfaceA), toCss(text)],
    font: null,
    radius: radiusName,
    density,
    tokens,
    meta: {
      source: location.href,
      extractedAt: new Date().toISOString(),
      elements: sampled,
      truncated,
      screen: vw + 'x' + vh,
    },
  };

  const json = JSON.stringify(style, null, 2);
  window.__kitStyle = style;

  console.log('%cKit UI · estilo extraído', 'font:700 13px system-ui;color:#7c9cff');
  console.log(style);
  console.log('Elementos analisados: ' + sampled + (truncated ? ' (limitado a ' + MAX_ELEMENTS + ')' : ''));
  console.log('Dica: clique em "Importar" no cabeçalho do Kit UI e cole o JSON.');

  try {
    if (typeof copy === 'function') {
      copy(json);
      console.log('%cJSON copiado para a área de transferência.', 'color:#5fd08a');
    } else {
      console.log(json);
    }
  } catch (err) {
    console.log(json);
  }

  return style;
})();
