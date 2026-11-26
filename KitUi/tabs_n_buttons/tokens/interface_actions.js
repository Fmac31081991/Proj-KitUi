/* interface_actions.js — aplicação da aba Tokens.
   Registra em window.KIT_TAB_UI.tokens o painel, o canvas e o inspetor. */
(function () {
  'use strict';

  const CORE = window.KIT_CORE;
  const T = CORE.T, IC = CORE.IC, LAYOUT_RULES_NOTE = CORE.LAYOUT_RULES_NOTE;
  const state = CORE.state, els = CORE.els;
  const esc = CORE.esc, specHead = CORE.specHead, sec = CORE.sec;
  const resolvedTokens = CORE.resolvedTokens;

  function panel() {
    const st = T.styleById(state.style);
    const groups = [
      ['tok-colors', 'Cores', T.COLOR_ROLES.length + ' papéis'],
      ['tok-type', 'Tipografia', '7 níveis'],
      ['tok-space', 'Espaçamento', '8pt grid'],
      ['tok-shape', 'Forma', 'raio · borda'],
      ['tok-shadow', 'Elevação', '2 sombras'],
      ['tok-backdrop', 'Fundo do palco', st.name],
    ];
    els.panel.innerHTML =
      groups
        .map(
          (g) =>
            '<button class="pitem" data-tok="' + g[0] + '"><span class="pitem__name">' + g[1] + '</span></button>'
        )
        .join('');
  }

  function canvas() {
    const t = resolvedTokens();
    const st = T.styleById(state.style);

    const colorCards = T.COLOR_ROLES.map((r) => {
      const v = t[r.varName];
      return (
        '<div class="tok-color"><span class="tok-color__chip" style="background:' + v + '"></span>' +
        '<div><div class="tok-color__name">' + r.label + '</div>' +
        '<div class="tok-color__var">' + r.varName + '</div>' +
        '<div class="tok-color__val">' + v + '</div></div></div>'
      );
    }).join('');

    const typeRows = [
      ['--k-fs-h1', 'Título 1'],
      ['--k-fs-h2', 'Título 2'],
      ['--k-fs-h3', 'Título 3'],
      ['--k-fs-lg', 'Texto grande'],
      ['--k-fs', 'Texto padrão'],
      ['--k-fs-sm', 'Texto pequeno'],
      ['--k-font-mono', 'Monoespaçado'],
    ]
      .map((r) => {
        const isMono = r[0] === '--k-font-mono';
        const size = isMono ? '13px' : t[r[0]];
        return (
          '<div class="tok-type"><span class="tok-type__label">' + r[1] + '</span>' +
          '<span class="tok-type__sample" style="font-size:' + size + (isMono ? ';font-family:' + t['--k-font-mono'] : '') + '">Aa 0123</span>' +
          '<span class="tok-type__var">' + r[0] + ' · ' + (isMono ? '1em' : size) + '</span></div>'
        );
      })
      .join('');

    const spRows = ['--k-sp-1', '--k-sp-2', '--k-sp-3', '--k-sp-4', '--k-sp-5', '--k-sp-6', '--k-sp-7']
      .map((k) => {
        const v = t[k];
        return (
          '<div class="tok-space"><span class="tok-space__label">' + k + '</span>' +
          '<span class="tok-space__bar" style="width:' + v + '"></span><span class="tok-space__val">' + v + '</span></div>'
        );
      })
      .join('');

    const radii = ['--k-radius-xs', '--k-radius-sm', '--k-radius-md', '--k-radius-lg', '--k-radius-pill']
      .map(
        (k) =>
          '<div class="tok-shape"><span class="tok-shape__box" style="border-radius:' + t[k] + '"></span>' +
          '<span class="tok-shape__label">' + k.replace('--k-radius-', '') + '</span><span class="tok-shape__val">' + t[k] + '</span></div>'
      )
      .join('');

    els.kit.innerHTML =
      '<div class="spec">' +
      specHead('Tokens do estilo', st.name, 'Estes são os valores aplicados agora. O JSON e o CSS exportados usam exatamente este mapa.') +
      '<section id="tok-colors" class="tok-section"><div class="spec-label">Cores · ' + T.COLOR_ROLES.length + ' papéis</div><div class="tok-colors">' + colorCards + '</div></section>' +
      '<section id="tok-type" class="tok-section"><div class="spec-label">Tipografia · ' + t['--k-fs'] + ' / ' + t['--k-lh'] + '</div><div class="tok-typegrid">' + typeRows + '</div></section>' +
      '<section id="tok-space" class="tok-section"><div class="spec-label">Espaçamento · sistema de 8 pontos</div><div class="tok-spacegrid">' + spRows + '</div></section>' +
      '<section id="tok-shape" class="tok-section"><div class="spec-label">Forma</div><div class="tok-shapegrid">' + radii +
      '<div class="tok-shape"><span class="tok-shape__box" style="border-radius:0;border-width:' + t['--k-bw'] + '"></span><span class="tok-shape__label">borda</span><span class="tok-shape__val">' + t['--k-bw'] + '</span></div></div></section>' +
      '<section id="tok-shadow" class="tok-section"><div class="spec-label">Elevação</div><div class="tok-shadowgrid">' +
      '<div class="tok-shadow"><span class="tok-shadow__box" style="box-shadow:' + t['--k-shadow-sm'] + '"></span><span>sm</span></div>' +
      '<div class="tok-shadow"><span class="tok-shadow__box" style="box-shadow:' + t['--k-shadow-md'] + '"></span><span>md</span></div>' +
      '<div class="tok-shadow"><span class="tok-shadow__box" style="box-shadow:' + t['--k-btn-shadow'] + '"></span><span>btn</span></div>' +
      '</div></section>' +
      '<section id="tok-backdrop" class="tok-section"><div class="spec-label">Fundo do palco</div>' +
      '<div class="tok-backdrop" style="background:var(--k-stage-bg)"><span style="background-image:var(--k-texture);background-size:var(--k-texture-size)"></span></div>' +
      '<div class="tok-color__var" style="margin-top:6px">--k-stage-bg · --k-texture</div></section>' +
      '<footer class="tok-rules" contenteditable="false" aria-label="Regras fixas do kit">' +
      '<span class="spec-label">Regras fixas do kit · nota não editável</span>' +
      LAYOUT_RULES_NOTE.map((line) => '<span class="tok-rules__line">' + esc(line) + '</span>').join('') +
      '</footer>' +
      '</div>';
  }

  function inspector() {
    const t = resolvedTokens();
    const count = Object.keys(t).length;
    return (
      sec('Mapa atual', '<div class="sec__hint">' + count + ' variáveis resolvidas para <b style="color:#E8EBF2">' + T.styleById(state.style).name + '</b>. Use o menu de Tokens à esquerda para navegar pelas seções.</div>' +
        '<div class="rowk"><label>Estilo</label><span class="val">' + state.style + '</span></div>' +
        '<div class="rowk"><label>Arquivo</label><span class="val">' + (IC.meta.count) + ' ícones embutidos</span></div>', true) +
      sec('Como consumir', '<div class="sec__hint">1. Importe <span class="k-mono" style="color:#B9C4D6">kit.css</span>.<br>2. Aplique as variáveis em <span class="k-mono" style="color:#B9C4D6">:root</span>.<br>3. Use as classes <span class="k-mono" style="color:#B9C4D6">k-*</span> no HTML.<br>4. Troque de tema sobrescrevendo as mesmas variáveis.</div>')
    );
  }

  window.KIT_TAB_UI = window.KIT_TAB_UI || {};
  window.KIT_TAB_UI.tokens = { panel, canvas, inspector };
})();
