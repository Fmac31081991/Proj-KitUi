/* interface_actions.js — aplicação da aba Estilos.
   Registra em window.KIT_TAB_UI.styles o painel, o canvas e o inspetor da aba.
   A importação/gravação de arquivos continua em importar.js. */
(function () {
  'use strict';

  const CORE = window.KIT_CORE;
  const T = CORE.T, P = CORE.P;
  const state = CORE.state, els = CORE.els;
  const esc = CORE.esc, UI = CORE.UI;
  const currentQuery = CORE.currentQuery, matchesQuery = CORE.matchesQuery;
  const emptyPanel = CORE.emptyPanel, swatchHTML = CORE.swatchHTML;
  const specHead = CORE.specHead, resolvedTokens = CORE.resolvedTokens;
  const colorToHex = CORE.colorToHex, colorToText = CORE.colorToText, sec = CORE.sec;
  const numRow = CORE.numRow, numValue = CORE.numValue;
  const styleFontName = CORE.styleFontName;

  function panel() {
    const q = currentQuery();
    const list = T.STYLES.filter((s) => matchesQuery(q, [s.name, s.family, s.note, s.id]));
    const items = list
      .map(
        (s) =>
          '<button class="pitem' + (s.id === state.style ? ' is-active' : '') + '" data-style="' + s.id + '">' +
          swatchHTML(s) +
          '<span class="pitem__name">' + esc(s.name) + '</span>' +
          '</button>'
      )
      .join('');
    els.panel.innerHTML = items || emptyPanel(q);
  }

  function canvas() {
    const st = T.styleById(state.style);
    const overview = P.patterns.find((p) => p.id === 'overview');
    els.kit.innerHTML =
      '<div class="spec">' +
      specHead(st.name, st.family, st.note + ' Troque as cores e a forma no painel da direita; o fundo do palco fica na aba Fundos — os componentes não mudam.') +
      overview.demo() +
      '</div>';
  }

  function inspector() {
    const t = resolvedTokens();
    const o = state.overrides;

    const colors = T.COLOR_ROLES.map((r) => {
      const val = t[r.varName];
      const solid = colorToHex(val);
      const has = Object.prototype.hasOwnProperty.call(o.colors, r.varName);
      return (
        '<div class="rowk"><label title="' + r.varName + '">' + r.label + '</label>' +
        '<button class="swatch' + (solid ? ' swatch--btn' : '') + '" type="button"' +
        (solid ? ' data-color-pick data-var="' + r.varName + '" data-label="' + r.label + '"' : ' disabled') +
        ' style="background:' + val + '"' +
        ' title="' + (solid ? 'Editar ' + r.label : 'Use o campo hexadecimal para esta cor') + '"' +
        ' aria-label="' + (solid ? 'Editar ' + r.label : r.label) + '"></button>' +
        '<input class="hex" value="' + colorToText(val) + '" data-set="color" data-var="' + r.varName + '" spellcheck="false">' +
        '<button class="colorreset" type="button" data-act="reset-color" data-var="' + r.varName + '"' +
        (has ? '' : ' disabled') + ' title="Restaurar ' + r.label + '" aria-label="Restaurar ' + r.label + '">' +
        UI.icon('undo') + '</button>' +
        '</div>'
      );
    }).join('');

    const radiusSel = o.radius || '';
    const density = o.density || 'auto';

    return (
      sec('Modo', '<div class="minibtns"><button class="minibtn" type="button" data-act="toggle-theme-mode">' +
        UI.icon('color') + 'Escuro / Claro</button></div>') +
      sec('Cores', colors +
        '<div class="minibtns"><button class="minibtn" data-act="reset-colors">Restaurar cores</button></div>', true) +
      sec('Forma', '<div class="rowk"><label>Arredondamento</label><select class="sel" data-set="radius">' +
        '<option value="">Do estilo</option>' +
        Object.keys(T.RADIUS_SETS).map((k) => '<option value="' + k + '"' + (radiusSel === k ? ' selected' : '') + '>' +
          ({ sharp: 'Reto', soft: 'Suave', round: 'Arredondado', pill: 'Pílula' }[k]) + '</option>').join('') +
        '</select></div>' +
        numRow('Espessura da borda', 'bw', numValue('bw')) +
        '<div class="sec__divider"></div>' +
        '<div class="rowk"><label>Densidade</label><select class="sel" data-set="density">' +
        ['auto', 'compact', 'regular', 'comfortable'].map((d) => '<option value="' + d + '"' + (density === d ? ' selected' : '') + '>' +
          ({ auto: 'Do estilo', compact: 'Compacto', regular: 'Regular', comfortable: 'Amplo' }[d]) + '</option>').join('') +
        '</select></div>' +
        numRow('Escala do texto', 'fsScale', numValue('fsScale'))) +
      sec('Tipografia', '<div class="rowk"><label>Fonte</label><select class="sel" data-set="font">' +
        '<option value="">' + esc(styleFontName()) + ' (estilo)</option>' +
        T.FONTS.map((f) => '<option value="' + f.id + '"' + (o.font === f.id ? ' selected' : '') + '>' + f.name + '</option>').join('') +
        '</select></div>' +
        '<div class="rowk"><label>Peso dos títulos</label><select class="sel" data-set="weight">' +
        ['', '500', '600', '700', '800'].map((w) => '<option value="' + w + '"' + (String(o.weight || '') === w ? ' selected' : '') + '>' + (w || 'Do estilo') + '</option>').join('') +
        '</select></div>' +
        numRow('Entreletra', 'track', numValue('track')) +
        '<label class="chk"><input type="checkbox" data-set="upper"' + (t['--k-transform'] === 'uppercase' ? ' checked' : '') + '>Caixa alta em botões e etiquetas</label>') +
      sec('Efeitos', '<label class="chk"><input type="checkbox" data-set="shadows"' + (o.shadows ? ' checked' : '') + '>Manter sombras do estilo</label>' +
        numRow('Desfoque de superfície', 'blur', numValue('blur'))) +
      '<div class="minibtns" style="padding:10px 0"><button class="minibtn" data-act="reset-all">Descartar ajustes</button></div>'
    );
  }

  window.KIT_TAB_UI = window.KIT_TAB_UI || {};
  window.KIT_TAB_UI.styles = { panel, canvas, inspector };
})();
