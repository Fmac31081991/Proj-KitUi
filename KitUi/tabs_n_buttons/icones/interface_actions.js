/* interface_actions.js — aplicação da aba Ícones.
   Registra em window.KIT_TAB_UI.icons o painel, o canvas e o inspetor. */
(function () {
  'use strict';

  const CORE = window.KIT_CORE;
  const C = CORE.C, IC = CORE.IC, UI = CORE.UI;
  const state = CORE.state, els = CORE.els;
  const esc = CORE.esc, currentQuery = CORE.currentQuery;
  const matchesQuery = CORE.matchesQuery, specHead = CORE.specHead, sec = CORE.sec;
  const pvStyle = CORE.pvStyle, pvControls = CORE.pvControls;

  function filteredIcons() {
    const q = currentQuery();
    return IC.icons.filter((i) => {
      if (state.iconCat !== 'all' && i.category !== state.iconCat) return false;
      return matchesQuery(q, [i.id, i.label, i.category, i.aliases.join(' ')]);
    });
  }

  function panel() {
    const q = currentQuery();
    const base = IC.icons.filter((i) => matchesQuery(q, [i.id, i.label, i.category, i.aliases.join(' ')]));
    const cats = ['all'].concat(IC.meta.categories);
    els.panel.innerHTML = cats
      .map(
        (c) => {
          const n = c === 'all' ? base.length : base.filter((i) => i.category === c).length;
          return (
            '<button class="pitem' + (state.iconCat === c ? ' is-active' : '') + '" data-iconcat="' + c + '"' + (n ? '' : ' disabled') + '>' +
            '<span class="pitem__name">' + (c === 'all' ? 'Todos' : c) + '</span></button>'
          );
        }
      )
      .join('');
  }

  function canvas() {
    const list = filteredIcons();
    const cells = list
      .map(
        (i) =>
          '<button class="icon-cell' + (i.id === state.icon ? ' is-active' : '') + '" data-icon="' + i.id + '" title="' +
          esc(i.label) + '">' + C.icon(i.id, 'k-icon--lg') + '<span>' + i.id + '</span></button>'
      )
      .join('');
    els.kit.innerHTML =
      '<div class="spec">' +
      specHead('Biblioteca de ícones', '', '') +
      '<div class="icon-grid">' + (cells || '<p class="k-muted">Nenhum ícone encontrado.</p>') + '</div>' +
      '</div>';
  }

  function inspector() {
    const icon = IC.icons.find((i) => i.id === state.icon) || IC.icons[0];
    const markup = '<svg class="k-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + icon.svg + '</svg>';
    return (
      sec('Ícone', '<div class="ipreview" style="' + pvStyle() + '"><div class="ipreview__box">' + C.icon(icon.id, 'ipreview__icon') + '</div></div>' +
        pvControls() +
        '<div class="rowk"><label>id</label><span class="val">' + icon.id + '</span></div>' +
        '<div class="rowk"><label>rótulo</label><span class="val">' + esc(icon.label) + '</span></div>' +
        '<div class="rowk"><label>categoria</label><span class="val">' + icon.category + '</span></div>', true) +
      sec('Uso', '<pre class="codeblock">' + esc(markup) + '</pre>' +
        '<div class="minibtns"><button class="minibtn minibtn--accent" data-act="copy-svg">' + UI.icon('copy') + 'Copiar SVG</button></div>', true)
    );
  }

  window.KIT_TAB_UI = window.KIT_TAB_UI || {};
  window.KIT_TAB_UI.icons = { panel, canvas, inspector };
})();
