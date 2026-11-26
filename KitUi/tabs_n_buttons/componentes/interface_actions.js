/* interface_actions.js — aplicação da aba Componentes.
   Registra em window.KIT_TAB_UI.components o painel, o canvas e o inspetor. */
(function () {
  'use strict';

  const CORE = window.KIT_CORE;
  const C = CORE.C;
  const state = CORE.state, els = CORE.els;
  const currentQuery = CORE.currentQuery, matchesQuery = CORE.matchesQuery;
  const emptyPanel = CORE.emptyPanel, specHead = CORE.specHead;
  const inspCode = CORE.inspCode;

  function panel() {
    const q = currentQuery();
    const list = C.components.filter((c) => matchesQuery(q, [c.title, c.id, c.group, c.desc]));
    if (!list.length) {
      els.panel.innerHTML = emptyPanel(q);
      return;
    }
    els.panel.innerHTML = C.groups
      .map((g) => {
        const items = list.filter((c) => c.group === g);
        if (!items.length) return '';
        return (
          '<div class="pgroup">' + g + '</div>' +
          items
            .map(
              (c) =>
                '<button class="pitem' + (c.id === state.comp ? ' is-active' : '') + '" data-comp="' + c.id + '">' +
                '<span class="pitem__name">' + c.title + '</span></button>'
            )
            .join('')
        );
      })
      .join('');
  }

  function canvas() {
    const comp = C.components.find((c) => c.id === state.comp) || C.components[0];
    els.kit.innerHTML = '<div class="spec">' + specHead(comp.title, comp.id, '') + comp.demo() + '</div>';
  }

  function inspector() {
    return inspCode(C.components.find((c) => c.id === state.comp) || C.components[0], 'componente');
  }

  window.KIT_TAB_UI = window.KIT_TAB_UI || {};
  window.KIT_TAB_UI.components = { panel, canvas, inspector };
})();
