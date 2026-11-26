/* interface_actions.js — aplicação da aba Fundos.
   Registra em window.KIT_TAB_UI.stages o painel, o canvas e o inspetor. */
(function () {
  'use strict';

  const CORE = window.KIT_CORE;
  const T = CORE.T, UI = CORE.UI;
  const state = CORE.state, els = CORE.els;
  const currentQuery = CORE.currentQuery, matchesQuery = CORE.matchesQuery;
  const emptyPanel = CORE.emptyPanel, specHead = CORE.specHead, sec = CORE.sec;
  const textureActive = CORE.textureActive, texStyle = CORE.texStyle;
  const styleTexStyle = CORE.styleTexStyle;
  const pvStyle = CORE.pvStyle, pvControls = CORE.pvControls;

  function stageActive() {
    if (state.overrides.stageBg) return 'custom';
    return state.overrides.stage || '';
  }

  function panel() {
    const active = stageActive();
    const q = currentQuery();
    const showCustom = active === 'custom' && matchesQuery(q, ['personalizado', 'cor', 'fundo']);
    const list = T.STAGE_LIST.filter((s) => matchesQuery(q, [s.name, s.desc, s.tone, s.id]));
    els.panel.innerHTML =
      (showCustom
        ? '<div class="pitem pitem--static is-active">' +
          '<button class="pitem__tex pitem__tex--btn" type="button" data-color-pick data-set="stageBg" data-label="Fundo do palco" style="background:' + state.overrides.stageBg + '" title="Editar fundo personalizado" aria-label="Editar fundo personalizado"></button>' +
          '<span class="pitem__name">Personalizado</span></div>'
        : '') +
      (list.length
        ? '<div class="pgroup">Fundos do palco</div>' +
          list
            .map(
              (s) =>
                '<button class="pitem' + (active === s.id ? ' is-active' : '') + '" data-stage="' + s.id + '">' +
                '<span class="pitem__tex" style="background:' + s.value + '"></span>' +
                '<span class="pitem__name">' + s.name + '</span></button>'
            )
            .join('')
        : '') +
      (!showCustom && !list.length ? emptyPanel(q) : '');
  }

  function canvas() {
    const active = stageActive();
    const styleCard =
      '<button class="tex-card tex-card--stage' + (active === '' ? ' is-active' : '') + '" type="button" data-stage="">' +
      '<span class="tex-card__preview" style="background:var(--k-stage-bg)"></span>' +
      '<span class="tex-card__tag">base</span>' +
      '<span class="tex-card__meta"><b>Do estilo</b><span>Usa o fundo definido pelo tema atual.</span></span>' +
      '</button>';
    const customCard = active === 'custom'
      ? '<button class="tex-card tex-card--stage is-active" type="button" data-color-pick data-set="stageBg" data-label="Fundo do palco">' +
        '<span class="tex-card__preview" style="background:' + state.overrides.stageBg + '"></span>' +
        '<span class="tex-card__tag">cor</span>' +
        '<span class="tex-card__meta"><b>Personalizado</b><span>Clique na prévia para abrir o seletor de cor.</span></span>' +
        '</button>'
      : '';
    const cards = T.STAGE_LIST.map(
      (s) =>
        '<button class="tex-card tex-card--stage' + (active === s.id ? ' is-active' : '') + '" type="button" data-stage="' + s.id + '">' +
        '<span class="tex-card__preview" style="background:' + s.value + '"></span>' +
        '<span class="tex-card__tag">' + s.tone + '</span>' +
        '<span class="tex-card__meta"><b>' + s.name + '</b><span>' + s.desc + '</span></span>' +
        '</button>'
    ).join('');
    els.kit.innerHTML =
      '<div class="spec">' +
      specHead('Fundos do palco', T.STAGE_LIST.length + ' presets', 'O fundo do palco é independente da textura. Cada preset troca apenas <span class="k-mono">--k-stage-bg</span>; a textura continua na aba Texturas.') +
      '<div class="tex-grid">' + styleCard + customCard + cards + '</div>' +
      '<div class="spec-note">Escolha uma cor sólida em Propriedades para criar um fundo personalizado.</div>' +
      '</div>';
  }

  function inspector() {
    const o = state.overrides;
    const preset = o.stage ? T.STAGE_PRESETS[o.stage] : null;
    const custom = !!o.stageBg;
    const name = custom ? 'Personalizado' : preset ? preset.name : T.styleById(state.style).name + ' · estilo';
    const desc = custom
      ? 'Cor sólida definida em Propriedades.'
      : preset
        ? preset.desc
        : 'O fundo acompanha o estilo escolhido. Selecione um preset para fixar um fundo próprio.';
    const tex = textureActive() ? texStyle(textureActive()) : styleTexStyle();
    const raw = 'var(--k-stage-bg)';
    return (
      sec('Fundo', '<div class="sec__hint"><b style="color:var(--u-text)">' + name + '</b> — ' + desc + '</div>' +
        '<div class="ipreview" style="' + pvStyle() + '"><div class="ipreview__box ipreview__box--tex" style="background:' + raw + '"><i style="' + tex + '"></i></div></div>' +
        pvControls() +
        '<div class="minibtns" style="margin-top:2px"><button class="minibtn" data-act="reset-stage">' + UI.icon('refresh') + 'Do estilo</button></div>', true) +
      sec('Cor sólida', '<div class="rowk"><label>Personalizado</label>' +
        '<button class="swatch swatch--btn" type="button" data-color-pick data-set="stageBg" data-label="Fundo do palco"' +
        ' style="background:' + (custom ? o.stageBg : raw) + '" title="Editar fundo personalizado" aria-label="Editar fundo personalizado"></button>' +
        '<button class="minibtn" data-act="clear-stagebg"' + (custom ? '' : ' disabled') + '>Limpar</button></div>' +
        '<div class="sec__hint">O quadradinho abre o seletor de cor. A cor sólida substitui o preset até ser limpa; “Do estilo” volta ao fundo do tema.</div>', true) +
      sec('Textura', '<div class="sec__hint">A textura é aplicada sobre este fundo. Ajuste o padrão e a opacidade na aba <b style="color:var(--u-text)">Texturas</b>.</div>')
    );
  }

  window.KIT_TAB_UI = window.KIT_TAB_UI || {};
  window.KIT_TAB_UI.stages = { panel, canvas, inspector };
})();
