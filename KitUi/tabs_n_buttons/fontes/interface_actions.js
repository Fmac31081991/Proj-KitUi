/* interface_actions.js — aplicação da aba Fontes.
   Registra em window.KIT_TAB_UI.fonts o painel, o canvas e o inspetor. */
(function () {
  'use strict';

  const CORE = window.KIT_CORE;
  const T = CORE.T, UI = CORE.UI;
  const state = CORE.state, els = CORE.els;
  const esc = CORE.esc, cssAttr = CORE.cssAttr, currentQuery = CORE.currentQuery;
  const matchesQuery = CORE.matchesQuery, emptyPanel = CORE.emptyPanel;
  const specHead = CORE.specHead, sec = CORE.sec;
  const numRow = CORE.numRow, numValue = CORE.numValue;
  const fontInfo = CORE.fontInfo, fontPreviewInfo = CORE.fontPreviewInfo;

  const CHAR_ROWS = [
    { label: 'Maiúsculas', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
    { label: 'minúsculas', chars: 'abcdefghijklmnopqrstuvwxyz' },
    { label: 'Números', chars: '0123456789' },
    { label: 'Pontuação', chars: '.,:;!?…()[]{}/\\|@#$%&*+-=<>~^_' },
    { label: 'Acentos', chars: 'ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïñòóôõöùúûüýÿ' },
  ];

  function appliedId() {
    return state.overrides.font || T.styleById(state.style).font || null;
  }

  function styleFor(f) {
    return 'font-family:' + cssAttr(f && f.stack ? f.stack : 'sans-serif');
  }

  function panel() {
    const cats = [...new Set(T.FONTS.map((f) => f.cat))];
    const applied = appliedId();
    const styleFontId = T.styleById(state.style).font || null;
    const preview = state.fontPreview;
    const active = preview || applied;
    const q = currentQuery();
    const matches = T.FONTS.filter((f) => matchesQuery(q, [f.name, f.cat, f.stack, f.id]));
    if (!matches.length) {
      els.panel.innerHTML = emptyPanel(q);
      return;
    }

    const fontButton = (f) => {
      const tags = [];
      if (preview && f.id === applied) tags.push('<span class="pitem__tag">em uso</span>');
      return (
        '<button class="pitem' + (active === f.id ? ' is-active' : '') + '" data-font="' + esc(f.id) + '"' +
        ' title="Visualizar fonte (prévia)">' +
        '<span class="pitem__name" style="' + styleFor(f) + '">' + esc(f.name) + '</span>' +
        tags.join('') +
        '</button>'
      );
    };

    let html = '';
    /* A fonte do estilo vem primeiro: é ela que o usuário configura aqui. */
    const primary = matches.find((f) => f.id === styleFontId);
    if (primary) html += '<div class="pgroup">Fonte do estilo</div>' + fontButton(primary);
    cats.forEach((cat) => {
      const items = matches.filter((f) => f.cat === cat && f.id !== styleFontId);
      if (!items.length) return;
      html += '<div class="pgroup">' + cat + '</div>' + items.map((f) => fontButton(f)).join('');
    });
    els.panel.innerHTML = html;
  }

  function canvas() {
    const st = T.styleById(state.style);
    const applied = fontInfo();
    const preview = fontPreviewInfo();
    const f = preview || applied;
    const isPreview = !!preview && preview.id !== applied.id;
    const fontStyle = styleFor(f);
    const steps = CORE.fontScaleSteps(CORE.fontMinPx());
    const fmt = (n) => String(n).replace('.', ',');

    const chart = CHAR_ROWS.map(
      (row) =>
        '<div class="font-chart__row">' +
        '<span class="font-chart__label">' + esc(row.label) + '</span>' +
        '<span class="font-chart__chars" style="' + fontStyle + '">' + esc(row.chars) + '</span>' +
        '</div>'
    ).join('');

    els.kit.innerHTML =
      '<div class="spec">' +
      specHead(f.name, f.cat, '') +
      '<div class="font-hero">' +
      '<div class="font-hero__aa" style="' + fontStyle + '">Aa</div>' +
      '<div class="font-hero__meta">' +
      '<div class="font-hero__name">' + esc(f.name) + '</div>' +
      '<div class="font-hero__status">' + (isPreview ? 'Prévia · ainda não aplicada' : 'Em uso no estilo ' + st.name) + '</div>' +
      '<div class="k-mono">' + esc(f.stack) + '</div>' +
      '</div></div>' +
      '<div class="font-chart">' +
      '<div class="font-chart__head"><span class="spec-label">Menor visível · ' + fmt(steps.min) + ' px</span>' +
      '<span class="font-chart__hint">1: ' + fmt(steps.min) + ' px · 2: ' + fmt(steps.medium) + ' px · 3: ' + fmt(steps.large) + ' px</span></div>' +
      chart +
      '<div class="font-chart__words" style="' + fontStyle + '">' +
      esc('São Paulo, 26 de novembro — interface pronta para uso. Ação, contexto e resultado em uma frase.') +
      '</div>' +
      '</div>' +
      '<div class="font-field"><span class="spec-label">Campo de texto</span>' +
      '<textarea class="k-textarea font-field__input" rows="4" spellcheck="false">' +
      esc('São Paulo, 26 de novembro.\nDigite aqui para ver a fonte em várias linhas.') +
      '</textarea></div>' +
      '</div>';
  }

  function inspector() {
    const applied = fontInfo();
    const preview = fontPreviewInfo();
    const canUse = !!preview && preview.id !== applied.id;

    let html =
      sec(
        'Fonte em uso',
        '<div class="minibtns">' +
        '<button class="minibtn minibtn--accent" type="button" data-act="use-font"' + (canUse ? '' : ' disabled') + '>' + UI.icon('text') + 'Usar esta fonte</button>' +
        '<button class="minibtn minibtn--danger" type="button" data-act="remove-font">' + UI.icon('refresh') + 'Remover fonte do estilo atual</button>' +
        '</div>',
        true
      );

    if (state.overrides.font) {
      const steps = CORE.fontScaleSteps(CORE.fontMinPx());
      const fmt = (n) => String(n).replace('.', ',');
      html += sec(
        'Configurações de uso',
        '<div class="rowk"><label>Peso dos títulos</label><select class="sel" data-set="weight">' +
          ['', '500', '600', '700', '800']
            .map((w) => '<option value="' + w + '"' + (String(state.overrides.weight || '') === w ? ' selected' : '') + '>' + (w || 'Do estilo') + '</option>')
            .join('') +
          '</select></div>' +
          numRow('Escala', 'fsScale', numValue('fsScale')) +
          numRow('Entreletra', 'track', numValue('track')) +
          numRow('Menor visível', 'minFont', numValue('minFont')) +
          '<div class="sec__hint">Tamanhos 1 / 2 / 3: ' + fmt(steps.min) + ' / ' + fmt(steps.medium) + ' / ' + fmt(steps.large) + ' px (×1,09 e ×1,30).</div>' +
          '<div class="minibtns" style="margin-top:8px">' +
          '<button class="minibtn" type="button" data-act="set-min-font" data-dir="down">Diminuir</button>' +
          '<button class="minibtn" type="button" data-act="set-min-font" data-dir="up">Aumentar</button>' +
          '<button class="minibtn minibtn--accent" type="button" data-act="set-min-font">Aplicar tamanho mínimo</button>' +
          '</div>'
      );
    }

    html += sec(
      'Fonte local',
      '<div class="sec__hint">As fontes ficam em <b style="color:#E8EBF2">tabs_n_buttons/fontes/padroes/</b> e são servidas pelo próprio projeto, sem acesso a serviços externos. O catálogo é open source (SIL OFL ou Apache 2.0), livre para uso pessoal e comercial; cada família mantém a sua licença de origem.</div>'
    );

    return html;
  }

  window.KIT_TAB_UI = window.KIT_TAB_UI || {};
  window.KIT_TAB_UI.fonts = { panel, canvas, inspector };
})();
