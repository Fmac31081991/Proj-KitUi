/* interface_actions.js — aplicação da aba Emojis.
   Esquerda: as 9 bibliotecas locais. Centro: 8 categorias em rolagem virtual.
   Direita: prévia do SVG, cópia e botão para usar a biblioteca no estilo atual.

   A grade central é virtualizada: a altura total é reservada por um spacer e
   apenas as linhas visíveis (mais um pequeno buffer) existem no DOM. As imagens
   fora da janela têm o bitmap liberado, e as animadas podem ser pausadas. */
(function () {
  'use strict';

  const CORE = window.KIT_CORE;
  const E = CORE.E, UI = CORE.UI;
  const state = CORE.state, els = CORE.els;
  const esc = CORE.esc, currentQuery = CORE.currentQuery;
  const matchesQuery = CORE.matchesQuery, specHead = CORE.specHead, sec = CORE.sec;
  const $ = CORE.$, $$ = CORE.$$;
  const LIBS = window.KIT_EMOJI_LIBS || { ordem: [], bibliotecas: {}, categorias: [], padrao: 'fluent-emoji' };

  const ROW_H = 92;       // altura fixa de uma linha (cabeçalho ou células)
  const BUFFER = 4;       // linhas extras acima e abaixo da viewport
  const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

  const v = {
    root: null, win: null, spacer: null, list: [], rows: [], cols: 0,
    start: -1, end: -1, io: null, ro: null, raf: 0,
  };

  function libId() {
    return (LIBS.bibliotecas || {})[state.emojiLib] ? state.emojiLib : (LIBS.padrao || 'fluent-emoji');
  }
  function libInfo(id) {
    return (LIBS.bibliotecas || {})[id || libId()] || {};
  }
  function svgSrc(name, id) {
    return 'tabs_n_buttons/emojis/' + (id || libId()) + '/' + name + '.svg';
  }
  function exportSrc(name, id) {
    return 'emojis/' + (id || libId()) + '/' + name + '.svg';
  }
  function codepoint(hex) {
    return String(hex || '').split('-').filter(Boolean).map((c) => 'U+' + c.toUpperCase()).join(' ');
  }
  /* Itens importados pelo usuário são caracteres Unicode, não arquivos SVG. */
  function isSVG(i) {
    return Boolean(i && i.hex);
  }

  function filteredEmojis() {
    const q = currentQuery();
    return E.items.filter((i) => {
      if (state.emojiCat !== 'all' && i.cat !== state.emojiCat) return false;
      return matchesQuery(q, [i.name, i.keys, i.cat, i.e, i.hex]);
    });
  }

  function panel() {
    const q = currentQuery();
    const emUso = CORE.emojiLibForStyle();
    const html = (LIBS.ordem || []).filter((id) => {
      const b = libInfo(id);
      return matchesQuery(q, [id, b.nome, b.licenca, b.autor]);
    }).map((id) => {
      const b = libInfo(id);
      const ativa = id === libId();
      return (
        '<button class="pitem' + (ativa ? ' is-active' : '') + '" data-emojilib="' + esc(id) + '"' +
        ' title="' + esc(b.nome || id) + ' — ' + esc(b.licenca || '') + '">' +
        '<span class="pitem__name">' + esc(b.nome || id) + '</span>' +
        '<span class="pitem__meta">' + (b.total || 0) + ' SVG · ' + esc(b.licenca || '') +
        (id === emUso ? ' · no estilo' : '') + '</span></button>'
      );
    }).join('');
    els.panel.innerHTML = html || CORE.emptyPanel(q);
  }

  function cellHTML(i) {
    const art = isSVG(i)
      ? '<img class="emoji-cell__img" data-src="' + esc(svgSrc(i.e)) + '" src="' + BLANK + '"' +
        ' alt="" width="40" height="40" decoding="async">'
      : '<span class="emoji-cell__glyph">' + esc(i.e) + '</span>';
    return (
      '<button class="emoji-cell' + (i.e === state.emoji ? ' is-active' : '') + '" data-emoji="' + esc(i.e) + '"' +
      ' title="' + esc(i.name) + (i.hex ? ' · ' + esc(i.hex) : '') + '" aria-label="' + esc(i.name) + '">' +
      art +
      '<span class="emoji-cell__name">' + esc(i.name) + '</span></button>'
    );
  }

  /* ---------------- grade virtual ---------------- */

  function measureCols() {
    const width = v.root ? v.root.clientWidth : 760;
    return Math.max(2, Math.min(14, Math.floor((width - 8) / 80)));
  }

  function buildRows(list) {
    const rows = [];
    v.cols = measureCols();
    /* As 8 categorias do guia vêm primeiro; categorias de itens importados
       pelo usuário aparecem depois, para nenhum item ficar fora da grade. */
    const cats = (LIBS.categorias || []).slice();
    list.forEach(function (i) {
      if (i.cat && cats.indexOf(i.cat) < 0) cats.push(i.cat);
    });
    cats.forEach(function (cat) {
      const all = list.filter((i) => i.cat === cat);
      if (!all.length) return;
      rows.push({ head: cat, count: all.length });
      for (let i = 0; i < all.length; i += v.cols) {
        rows.push({ items: all.slice(i, i + v.cols) });
      }
    });
    return rows;
  }

  /* As imagens só recebem o src quando entram na janela. Ao sair, o bitmap
     decodificado é liberado — o que também encerra qualquer animação SMIL/CSS
     do SVG, mesmo em bibliotecas animadas: nada roda fora da viewport. */
  function observeImages() {
    if (v.io) v.io.disconnect();
    if (!window.IntersectionObserver || !v.root || !v.win) return;
    v.io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        const img = en.target;
        if (en.isIntersecting) {
          const src = img.getAttribute('data-src');
          if (src && img.getAttribute('src') !== src) img.setAttribute('src', src);
        } else if (img.getAttribute('src') !== BLANK) {
          img.setAttribute('src', BLANK);
        }
      });
    }, { root: v.root, rootMargin: '160px 0px' });
    $$('.emoji-cell__img', v.win).forEach(function (img) { v.io.observe(img); });
  }

  function paint(force) {
    if (!v.root || !v.win || !v.rows.length) return;
    const cols = measureCols();
    if (cols !== v.cols) {
      v.rows = buildRows(v.list);
      v.spacer.style.height = (v.rows.length * ROW_H) + 'px';
      force = true;
    }
    const top = v.root.scrollTop;
    const view = v.root.clientHeight || 360;
    const start = Math.max(0, Math.floor(top / ROW_H) - BUFFER);
    const end = Math.min(v.rows.length, Math.ceil((top + view) / ROW_H) + BUFFER);
    if (!force && start === v.start && end === v.end) return;
    v.start = start;
    v.end = end;

    let html = '';
    for (let r = start; r < end; r++) {
      const row = v.rows[r];
      if (row.head) {
        html += '<div class="emoji-vhead"><span class="emoji-group__title">' + esc(row.head) +
          '</span><span class="emoji-group__count">' + row.count + ' SVGs</span></div>';
      } else {
        html += '<div class="emoji-vrow">' + row.items.map(cellHTML).join('') + '</div>';
      }
    }
    v.win.innerHTML = html;
    v.win.style.transform = 'translateY(' + (start * ROW_H) + 'px)';
    observeImages();
  }

  function onScroll(e) {
    if (!v.root || e.target !== v.root || v.raf) return;
    v.raf = requestAnimationFrame(function () {
      v.raf = 0;
      paint(false);
    });
  }
  document.addEventListener('scroll', onScroll, true);

  function setupResize() {
    if (!window.ResizeObserver || !v.root) return;
    if (v.ro) v.ro.disconnect();
    v.ro = new ResizeObserver(function () { paint(false); });
    v.ro.observe(v.root);
  }

  function canvas() {
    if (v.io) { v.io.disconnect(); v.io = null; }
    if (v.raf) { cancelAnimationFrame(v.raf); v.raf = 0; }
    const list = filteredEmojis();
    const b = libInfo();
    const height = Math.max(260, ((els.viewport && els.viewport.clientHeight) || 520) - 190);
    v.list = list;

    els.kit.innerHTML =
      '<div class="spec">' +
      specHead(b.nome || 'Biblioteca de emojis', (b.total || E.items.length) + ' SVGs · ' + (b.licenca || ''),
        'Arquivos SVG locais da biblioteca, separados nas 8 categorias do guia. ' +
        'Role a grade: só os itens visíveis são desenhados e decodificados. ' +
        'Clique para inspecionar, copiar o SVG ou aplicar a biblioteca ao estilo atual.') +
      '<div class="emoji-vroot" style="height:' + height + 'px">' +
      '<div class="emoji-vspacer"><div class="emoji-vwindow"></div></div>' +
      '</div>' +
      '<div class="emoji-vhint">Rolagem progressiva · os SVGs fora da área visível são descarregados.</div>' +
      '</div>';

    v.root = $('.emoji-vroot', els.kit);
    v.spacer = $('.emoji-vspacer', els.kit);
    v.win = $('.emoji-vwindow', els.kit);
    v.rows = buildRows(list);
    v.spacer.style.height = (v.rows.length * ROW_H) + 'px';
    v.win.style.setProperty('--emoji-cols', String(v.cols));
    v.start = -1;
    v.end = -1;
    paint(true);
    setupResize();
  }

  function inspector() {
    const emoji = CORE.currentEmojiItem() || {};
    const id = libId();
    const b = libInfo(id);
    const emUso = id === CORE.emojiLibForStyle();
    const svg = isSVG(emoji);
    const src = exportSrc(emoji.e, id);
    const html = svg
      ? '<img src="' + esc(src) + '" width="32" height="32" alt="">'
      : '<span aria-label="' + esc(emoji.name) + '">' + esc(emoji.e || '') + '</span>';

    return (
      sec('Emoji',
        '<div class="emoji-preview">' + (svg
          ? '<img src="' + esc(svgSrc(emoji.e, id)) + '" alt="' + esc(emoji.name) + '">'
          : '<span class="emoji-preview__glyph">' + esc(emoji.e || '') + '</span>') + '</div>' +
        '<div class="rowk"><label>arquivo</label><span class="val">' +
        (svg ? esc(emoji.e || '—') + '.svg' : '— (caractere importado)') + '</span></div>' +
        '<div class="rowk"><label>nome</label><span class="val">' + esc(emoji.name || '—') + '</span></div>' +
        '<div class="rowk"><label>unicode</label><span class="val">' + esc(emoji.unicode || '—') + '</span></div>' +
        '<div class="rowk"><label>codepoint</label><span class="val">' + esc(codepoint(emoji.hex) || '—') + '</span></div>' +
        '<div class="rowk"><label>categoria</label><span class="val">' + esc(emoji.cat || '—') + '</span></div>', true) +
      sec('Uso no kit',
        '<div class="sec__hint">O kit exportado leva os SVGs em <span class="k-mono" style="color:#B9C4D6">emojis/' +
        esc(id) + '/</span> e o arquivo <span class="k-mono" style="color:#B9C4D6">LICENCAS.md</span>.</div>' +
        '<pre class="codeblock">' + esc(html) + '</pre>' +
        '<div class="minibtns">' +
        '<button class="minibtn minibtn--accent" data-act="copy-emoji-html">' + UI.icon('copy') + 'Copiar HTML</button>' +
        '<button class="minibtn" data-act="copy-emoji-svg">' + UI.icon('component') + 'Copiar caminho SVG</button>' +
        '</div>', true) +
      sec('Biblioteca do estilo',
        '<div class="rowk"><label>biblioteca</label><span class="val">' + esc(b.nome || id) + '</span></div>' +
        '<div class="rowk"><label>licença</label><span class="val">' + esc(b.licenca || '—') + '</span></div>' +
        '<div class="rowk"><label>autor</label><span class="val">' + esc(b.autor || '—') + '</span></div>' +
        '<div class="sec__hint">' + (emUso
          ? 'Esta biblioteca já é usada pelo estilo atual e será incluída na exportação.'
          : 'A biblioteca padrão dos estilos é Fluent Emoji. Aplique esta para usá-la no estilo atual e na exportação.') + '</div>' +
        '<div class="minibtns" style="margin-top:8px"><button class="minibtn minibtn--accent" type="button" ' +
        'data-act="use-emoji-library" data-lib="' + esc(id) + '"' + (emUso ? ' disabled' : '') + '>' +
        UI.icon('download') + (emUso ? 'Biblioteca em uso' : 'Usar esta biblioteca no kit') + '</button></div>', true) +
      sec('Acessibilidade',
        '<div class="sec__hint">SVG decorativo leva <span class="k-mono" style="color:#B9C4D6">alt=""</span>. ' +
        'Quando o emoji carrega significado, use um rótulo em texto no atributo <span class="k-mono" style="color:#B9C4D6">alt</span>.</div>')
    );
  }

  window.KIT_TAB_UI = window.KIT_TAB_UI || {};
  window.KIT_TAB_UI.emojis = { panel, canvas, inspector };
})();
