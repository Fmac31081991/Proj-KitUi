/* interface_actions.js — aplicação da aba Padrões.
   Registra em window.KIT_TAB_UI.patterns o painel, o canvas e o inspetor. */
(function () {
  'use strict';

  const CORE = window.KIT_CORE;
  const P = CORE.P;
  const state = CORE.state, els = CORE.els;
  const currentQuery = CORE.currentQuery, matchesQuery = CORE.matchesQuery;
  const emptyPanel = CORE.emptyPanel, specHead = CORE.specHead;
  const inspCode = CORE.inspCode;

  function panel() {
    const q = currentQuery();
    const list = P.patterns.filter((p) => matchesQuery(q, [p.title, p.id, p.group, p.kind, p.desc]));
    if (!list.length) {
      els.panel.innerHTML = emptyPanel(q);
      return;
    }
    els.panel.innerHTML = P.patternGroups
      .map(function (g) {
        const items = list.filter((p) => p.group === g);
        if (!items.length) return '';
        return (
          '<div class="pgroup">' + g + '</div>' +
          items
            .map(
              (p) =>
                '<button class="pitem' + (p.id === state.pattern ? ' is-active' : '') + '" data-pattern="' + p.id + '">' +
                '<span class="pitem__name">' + p.title + '</span></button>'
            )
            .join('')
        );
      })
      .join('');
  }

  function canvas() {
    const p = P.patterns.find((x) => x.id === state.pattern) || P.patterns[0];
    els.kit.innerHTML = '<div class="spec">' + specHead(p.title, p.kind || 'tela', p.desc) + p.demo() + '</div>';
  }

  function inspector() {
    return inspCode(P.patterns.find((p) => p.id === state.pattern) || P.patterns[0], 'tela');
  }

  window.KIT_TAB_UI = window.KIT_TAB_UI || {};
  window.KIT_TAB_UI.patterns = { panel, canvas, inspector };
})();
