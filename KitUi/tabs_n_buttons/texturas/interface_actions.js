/* interface_actions.js — aplicação da aba Texturas.
   Registra em window.KIT_TAB_UI.textures o painel, o canvas e o inspetor. */
(function () {
  'use strict';

  const CORE = window.KIT_CORE;
  const T = CORE.T, UI = CORE.UI;
  const state = CORE.state, els = CORE.els;
  const currentQuery = CORE.currentQuery, matchesQuery = CORE.matchesQuery;
  const emptyPanel = CORE.emptyPanel, specHead = CORE.specHead, sec = CORE.sec;
  const numRow = CORE.numRow, numValue = CORE.numValue;
  const textureActive = CORE.textureActive, texStyle = CORE.texStyle;
  const styleTexStyle = CORE.styleTexStyle;
  const pvStyle = CORE.pvStyle, pvControls = CORE.pvControls;

  function textureCats() {
    return [...new Set(T.TEXTURE_LIST.map((x) => x.cat).filter(Boolean))];
  }

  function panel() {
    const q = currentQuery();
    const base = T.TEXTURE_LIST.filter((x) => matchesQuery(q, [x.name, x.desc, x.id, x.cat]));
    const cats = ['all'].concat(textureCats());
    const active = cats.indexOf(state.texCat) >= 0 ? state.texCat : 'all';
    if (!base.length) {
      els.panel.innerHTML = emptyPanel(q);
      return;
    }
    els.panel.innerHTML = cats
      .map((c) => {
        const n = c === 'all' ? base.length : base.filter((x) => x.cat === c).length;
        return (
          '<button class="pitem' + (active === c ? ' is-active' : '') + '" data-texcat="' + c + '"' + (n ? '' : ' disabled') + '>' +
          '<span class="pitem__name">' + (c === 'all' ? 'Todos' : c) + '</span></button>'
        );
      })
      .join('');
  }

  function canvas() {
    const active = textureActive();
    const cats = textureCats();
    const cat = state.texCat && cats.indexOf(state.texCat) >= 0 ? state.texCat : 'all';
    const list = cat === 'all' ? T.TEXTURE_LIST : T.TEXTURE_LIST.filter((x) => x.cat === cat);
    const cardOf = (x) =>
      '<button class="tex-card' + (active === x.id ? ' is-active' : '') + '" type="button" data-texture="' + x.id + '">' +
      '<span class="tex-card__preview" style="background:var(--k-stage-bg)"><i style="' + texStyle(x.id) + '"></i></span>' +
      '<span class="tex-card__tag">' + (x.id === 'none' ? 'liso' : 'padrão') + '</span>' +
      '<span class="tex-card__meta"><b>' + x.name + '</b><span>' + x.desc + '</span></span>' +
      '</button>';
    const cards = cats
      .map((c) => {
        const items = list.filter((x) => x.cat === c);
        if (!items.length) return '';
        return (cat === 'all' ? '<div class="tex-cat">' + c + '</div>' : '') + items.map(cardOf).join('');
      })
      .join('');
    els.kit.innerHTML =
      '<div class="spec">' +
      specHead('Texturas do palco', T.TEXTURE_LIST.length + ' presets', 'A textura fica atrás da moldura e do kit, no fundo do palco. Cada preset troca apenas as variáveis <span class="k-mono">--k-texture</span> e <span class="k-mono">--k-texture-size</span>. Use as categorias na lista à esquerda para filtrar.') +
      '<div class="tex-grid">' + cards + '</div>' +
      '<div class="spec-note">A opacidade e o retorno ao estilo ficam em Propriedades. A cor e os presets de fundo estão na aba Fundos.</div>' +
      '</div>';
  }

  function inspector() {
    const active = textureActive();
    const item = T.TEXTURE_LIST.find((x) => x.id === active);
    const name = active ? (item ? item.name : active) : 'Do estilo';
    const cat = active && item && item.cat ? item.cat : '';
    const desc = active
      ? item ? item.desc : ''
      : 'A textura acompanha o estilo escolhido. Selecione um preset para fixar uma textura própria.';
    const preview = active ? texStyle(active) : styleTexStyle();
    return (
      sec('Textura', '<div class="sec__hint"><b style="color:var(--u-text)">' + name + '</b>' + (cat ? ' · ' + cat : '') + ' — ' + desc + '</div>' +
        '<div class="ipreview" style="' + pvStyle() + '"><div class="ipreview__box ipreview__box--tex" style="background:var(--k-stage-bg)"><i style="' + preview + '"></i></div></div>' +
        pvControls() +
        '<div class="minibtns" style="margin-top:2px"><button class="minibtn" data-act="reset-texture">' + UI.icon('refresh') + 'Do estilo</button></div>', true) +
      sec('Aplicação', numRow('Opacidade', 'textureOpacity', numValue('textureOpacity')) +
        '<div class="sec__hint">A cor e o fundo do palco agora ficam na aba <b style="color:var(--u-text)">Fundos</b>.</div>', true) +
      sec('Variáveis', '<div class="sec__hint">A textura usa <code>--k-texture</code>, <code>--k-texture-size</code> e <code>--k-texture-opacity</code>. Nenhuma imagem externa é necessária.</div>')
    );
  }

  window.KIT_TAB_UI = window.KIT_TAB_UI || {};
  window.KIT_TAB_UI.textures = { panel, canvas, inspector };
})();
