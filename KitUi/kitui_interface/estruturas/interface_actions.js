/* interface_actions.js — ações da moldura fixa do Kit UI.
   Cabeçalho, rodapé, trilha, palco, zoom, orientação e atalhos.
   O conteúdo das abas fica em tabs_n_buttons/<aba>/interface_actions.js. */
(function () {
  'use strict';

  const CORE = window.KIT_CORE;
  const T = CORE.T, C = CORE.C, P = CORE.P, IC = CORE.IC, E = CORE.E;
  const UI = CORE.UI, $ = CORE.$, $$ = CORE.$$;
  const state = CORE.state, els = CORE.els;
  const applyTokens = CORE.applyTokens, save = CORE.save, toast = CORE.toast;

  /* Preenchido pelo orquestrador: funções que pertencem às abas ou ao fluxo
     de importação/exportação, chamadas aqui apenas como pontos de extensão. */
  let ctx = {};
  function configure(handlers) { ctx = handlers; }

  function init() {
    els.stage = $('#stage');
    els.app = $('#app');
    els.kit = $('#kit');
    els.viewport = $('#viewport');
    els.panel = $('#panelBody');
    els.inspector = $('#inspectorBody');
    els.zoomVal = $('#resetZoom');
    els.status = $('#statusbar');
    els.sheet = $('#sheet');
    els.scrim = $('#scrim');
    els.toast = $('#appToast');

    els.picker = document.createElement('div');
    els.picker.className = 'cpick';
    els.picker.hidden = true;
    els.picker.setAttribute('role', 'dialog');
    els.picker.setAttribute('aria-label', 'Editar cor');
    els.app.appendChild(els.picker);

    fillIcons();
    if (state.orient === 'portrait') {
      els.app.classList.add('is-portrait');
      setZoom(0.8); /* retrato abre em 80% */
    }
    if (state.grid) els.viewport.classList.add('grid-on');
    applyUiVisibility();

    applyTokens();
    fitStage();
    ctx.renderAll();
    ctx.initFloatingWindows();
    ctx.initDesktopShell();

    window.addEventListener('resize', () => {
      fitStage();
      updateFS();
      ctx.positionPicker();
    });

    document.addEventListener('click', ctx.onClick);
    document.addEventListener('input', ctx.onInput);
    document.addEventListener('change', ctx.onChange);
    document.addEventListener('keydown', onKey);
    els.app.addEventListener('scroll', ctx.positionPicker, true);

    $$('.fakescroll').forEach(setupFS);
    updateFS();
  }

  function fillIcons() {
    $$('[data-ic]').forEach((el) => {
      el.innerHTML = UI.icon(el.dataset.ic);
    });
  }

  function fitStage() {
    const portrait = state.orient === 'portrait';
    const w = portrait ? 600 : 1280;
    const h = portrait ? 1280 : 600;
    const margin = 24;
    const z = Math.min(1, (window.innerWidth - margin) / w, (window.innerHeight - margin) / h);
    els.stage.style.setProperty('--u-zoom', Math.max(0.2, z).toFixed(4));
  }

  function renderRail() {
    $$('.rail__btn').forEach((b) => {
      const active = b.dataset.tab === state.tab;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    $('#orientBtn').classList.toggle('is-on', state.orient === 'portrait');
    $('#gridBtn').classList.toggle('is-on', state.grid);
  }

  function renderStatus() {
    els.status.innerHTML =
      '<span>' + T.STYLES.length + ' estilos</span><span class="dotsep"></span>' +
      '<span>' + C.components.length + ' componentes</span><span class="dotsep"></span>' +
      '<span>' + P.patterns.length + ' padrões</span><span class="dotsep"></span>' +
      '<span>' + IC.meta.count + ' ícones</span><span class="dotsep"></span>' +
      '<span>' + T.FONTS.length + ' fontes</span><span class="dotsep"></span>' +
      '<span class="status-emojis">' + E.meta.count + ' emojis</span><span class="dotsep status-emojis"></span>' +
      '<span>' + T.TEXTURE_LIST.length + ' texturas</span><span class="dotsep"></span>' +
      '<span>' + T.STAGE_LIST.length + ' fundos</span>' +
      '<span class="sp"></span>' +
      '<span class="statusbar__ver">ver.2026.11.21</span>';
    els.zoomVal.textContent = Math.round(state.zoom * 100) + '%';
  }

  function setTab(tab) {
    ctx.captureSections();
    const portrait = els.app.classList.contains('is-portrait');
    const same = state.tab === tab;
    state.tab = tab;
    if (portrait) {
      if (same && els.app.classList.contains('show-panel')) {
        els.app.classList.remove('show-panel');
      } else {
        els.app.classList.add('show-panel');
      }
      els.app.classList.remove('show-inspector');
    }
    ctx.renderAll();
  }

  function setStyle(id) {
    state.style = id;
    resetOverrides();
    ctx.renderAll();
    els.viewport.scrollTop = 0;
    toast('Estilo ' + T.styleById(id).name + ' aplicado');
  }

  function resetOverrides() {
    state.overrides = JSON.parse(JSON.stringify(CORE.DEFAULTS.overrides));
    state.fontPreview = null;
  }

  function toggleOrient() {
    state.orient = state.orient === 'landscape' ? 'portrait' : 'landscape';
    els.app.classList.toggle('is-portrait', state.orient === 'portrait');
    if (state.orient === 'landscape') els.app.classList.remove('show-panel', 'show-inspector');
    else setZoom(0.8);
    fitStage();
    ctx.renderAll();
  }

  function setZoom(z) {
    state.zoom = Math.min(1.8, Math.max(0.5, Math.round(z * 10) / 10));
    els.kit.style.zoom = state.zoom;
    renderStatus();
    updateFS();
    save();
  }

  function applyUiVisibility() {
    els.app.classList.toggle('is-bare', !!state.uiHidden);
    const btn = $('#uiToggle');
    if (!btn) return;
    btn.innerHTML = UI.icon(state.uiHidden ? 'full-screen' : 'minimize');
    btn.classList.toggle('is-on', !!state.uiHidden);
    const label = state.uiHidden ? 'Mostrar interface do Kit UI' : 'Ocultar interface do Kit UI';
    btn.title = label;
    btn.setAttribute('aria-label', label);
    btn.setAttribute('aria-pressed', state.uiHidden ? 'true' : 'false');
  }

  function toggleUi() {
    state.uiHidden = !state.uiHidden;
    applyUiVisibility();
    save();
    requestAnimationFrame(updateFS);
  }

  function focusSearch() {
    if (state.tab === 'tokens') setTab('icons');
    const input = $('#panelQuery');
    if (input) {
      input.focus();
      input.select();
    }
  }

  function onKey(e) {
    if (e.key === 'Escape') {
      if (els.picker && !els.picker.hidden) return ctx.closePicker(true);
      if (els.sheet.classList.contains('is-on')) ctx.closeSheet();
      else if (els.app.classList.contains('is-portrait')) {
        els.app.classList.remove('show-panel', 'show-inspector');
      }
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      focusSearch();
    }
    if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) {
      e.preventDefault();
      focusSearch();
    }
  }

  function setupFS(el) {
    const wrap = el.closest('.fswrap');
    if (!wrap) return;
    const bar = wrap.querySelector('.fsbar');
    if (!bar) return;
    const thumb = bar.querySelector('i');
    const upd = () => {
      const sh = el.scrollHeight;
      const ch = el.clientHeight;
      if (sh <= ch + 2) {
        bar.classList.add('is-hidden');
        return;
      }
      bar.classList.remove('is-hidden');
      const bh = bar.clientHeight || ch;
      const h = Math.max(26, bh * (ch / sh));
      const top = (el.scrollTop / (sh - ch)) * (bh - h);
      thumb.style.height = h + 'px';
      thumb.style.transform = 'translateY(' + top + 'px)';
    };
    el._fs = upd;
    el.addEventListener('scroll', upd, { passive: true });
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => upd());
      ro.observe(el);
      ro.observe(bar);
    }
    upd();
  }

  function updateFS() {
    $$('.fakescroll').forEach((el) => el._fs && el._fs());
  }

  window.KIT_SHELL_UI = {
    configure, init,
    fillIcons, fitStage, renderRail, renderStatus,
    setTab, setStyle, resetOverrides, toggleOrient, setZoom,
    applyUiVisibility, toggleUi, focusSearch, onKey,
    setupFS, updateFS,
  };
})();
