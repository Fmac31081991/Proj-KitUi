/* app.js — bootstrap, renderização, ações e exportação. */
(function () {
  'use strict';

  /* Núcleo compartilhado: estado, storage, tokens, fontes e acervos. */
  const CORE = window.KIT_CORE;
  const T = CORE.T, IMP = CORE.IMP, IMPORT_MODULES = CORE.IMPORT_MODULES;
  const C = CORE.C, UI = CORE.UI, IC = CORE.IC, E = CORE.E;
  const $ = CORE.$, $$ = CORE.$$, esc = CORE.esc;
  const IMPORT_KINDS = CORE.IMPORT_KINDS;
  const customAssets = CORE.customAssets, NUM_CFG = CORE.NUM_CFG;
  const secOpen = CORE.secOpen;
  const state = CORE.state, customStyles = CORE.customStyles, els = CORE.els;
  const save = CORE.save, saveCustomStyles = CORE.saveCustomStyles;
  const loadCustomStyles = CORE.loadCustomStyles, seedStyles = CORE.seedStyles;
  const sortStyles = CORE.sortStyles, isCustomStyle = CORE.isCustomStyle;
  const resolvedTokens = CORE.resolvedTokens;
  const applyTokens = CORE.applyTokens;
  const normalizeAsset = CORE.normalizeAsset, rebuildCustomAssets = CORE.rebuildCustomAssets;
  const saveCustomAssets = CORE.saveCustomAssets, assetName = CORE.assetName;
  const toast = CORE.toast;

  /* Helpers usados pelo inspetor e pelo seletor de cor. */
  const sec = CORE.sec, applyNum = CORE.applyNum;
  const colorToHex = CORE.colorToHex, isSolidHex = CORE.isSolidHex;
  const hexToRgb = CORE.hexToRgb, rgbToHex = CORE.rgbToHex;
  const rgbToHsv = CORE.rgbToHsv, hsvToRgb = CORE.hsvToRgb;

  /* Moldura e registro das abas. */
  const SHELL = window.KIT_SHELL_UI;
  const TAB_UI = window.KIT_TAB_UI = window.KIT_TAB_UI || {};
  const renderRail = SHELL.renderRail, renderStatus = SHELL.renderStatus;
  const updateFS = SHELL.updateFS;
  const setTab = SHELL.setTab, setStyle = SHELL.setStyle;
  const toggleOrient = SHELL.toggleOrient, setZoom = SHELL.setZoom;
  const toggleUi = SHELL.toggleUi;

  /* Exportação: geração de arquivos e folha, isolada em tabs_n_buttons/export. */
  const EXP = window.KIT_EXPORTAR;

  let stylesFromFiles = false;
  let importKind = 'styles';
  let renderedTab = null;

  /* Os estilos chegam da API antes de montar a interface. */
  async function bootstrap() {
    const res = await IMP.listar();
    if (res.ok && res.data) {
      const padroes = Array.isArray(res.data.padroes) ? res.data.padroes : [];
      const importados = Array.isArray(res.data.importados) ? res.data.importados : [];
      padroes.forEach((item) => {
        const st = IMP.normalize(item, { preserveId: true });
        if (st && !T.STYLES.some((s) => s.id === st.id)) T.STYLES.push(st);
      });
      importados.forEach((item) => {
        const st = IMP.normalize(item, { preserveId: true });
        if (!st || T.STYLES.some((s) => s.id === st.id)) return;
        st.family = 'Importado';
        customStyles.push(st);
        T.STYLES.push(st);
      });
      stylesFromFiles = T.STYLES.length > 0;
    }
    if (!stylesFromFiles) {
      loadCustomStyles();
      seedStyles();
    }
    sortStyles();
    SHELL.configure({
      onClick, onInput, onChange,
      renderAll, captureSections, closePicker, closeSheet: EXP.closeSheet,
      positionPicker, initFloatingWindows, initDesktopShell,
    });
    SHELL.init();
  }

  /* ------------------------------------------------------------------ */
  /* montagem                                                            */
  /* ------------------------------------------------------------------ */

  function renderAll() {
    applyTokens();
    renderRail();
    renderPanel();
    renderCanvas();
    renderInspector();
    renderStatus();
    updateFS();
    save();
  }

  /* ------------------------------------------------------------------ */
  /* painel                                                              */
  /* ------------------------------------------------------------------ */

  const SEARCH_HINTS = {
    styles: 'Buscar estilo, família ou nota…',
    components: 'Buscar componente, grupo ou id…',
    patterns: 'Buscar padrão, grupo ou tipo…',
    icons: 'Buscar ícone, alias, categoria…',
    emojis: 'Buscar emoji, nome ou termo…',
    textures: 'Buscar textura ou descrição…',
    stages: 'Buscar fundo, tom ou descrição…',
    fonts: 'Buscar fonte ou categoria…',
  };

  function syncPanelSearch() {
    const wrap = $('#panelSearch');
    if (!wrap) return;
    const show = state.tab !== 'tokens';
    wrap.hidden = !show;
    if (!show) return;
    const input = $('#panelQuery');
    if (input) {
      input.value = state.queries[state.tab] || '';
      input.placeholder = SEARCH_HINTS[state.tab] || 'Buscar na lista…';
    }
    const clear = $('#panelQueryClear');
    if (clear) clear.hidden = !(state.queries[state.tab] || '');
  }

  function renderPanel() {
    syncPanelSearch();
    const mod = TAB_UI[state.tab];
    if (mod && mod.panel) return mod.panel();
  }

  /* ------------------------------------------------------------------ */
  /* canvas                                                              */
  /* ------------------------------------------------------------------ */

  function renderCanvas() {
    const kit = els.kit;
    /* O equalizador pode estar com o ruído de teste ligado: parar antes de
       trocar o HTML evita áudio órfão preso a um nó removido do DOM. */
    if (window.KIT_EQ && window.KIT_EQ.stopAll) window.KIT_EQ.stopAll();
    kit.className = 'kit';
    kit.style.zoom = state.zoom;

    const mod = TAB_UI[state.tab];
    if (mod && mod.canvas) return mod.canvas();
  }

  /* Janelas flutuantes (opt-in via .k-window--float): arraste pela barra,
     sobreposição com bring-to-front e limite dentro do quadro. Os listeners
     ficam no #kit, então sobrevivem às re-renderizações do padrão. */
  function initFloatingWindows() {
    const kit = els.kit;
    if (!kit) return;
    let drag = null;

    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

    function stageOf(win) {
      let el = win.parentElement;
      while (el && el !== kit && !el.hasAttribute('data-float-stage')) el = el.parentElement;
      return el && el !== kit ? el : win.parentElement;
    }

    function raise(win) {
      const stage = stageOf(win);
      if (!stage) return;
      let n = (parseInt(stage.dataset.floatZ || '0', 10) || 0) + 1;
      if (n > 90) {
        stage.querySelectorAll('.k-window--float').forEach((w) => { w.style.zIndex = ''; });
        n = 1;
      }
      stage.dataset.floatZ = String(n);
      win.style.zIndex = String(n);
    }

    function measure(win, stage) {
      const sr = stage.getBoundingClientRect();
      const wr = win.getBoundingClientRect();
      if (!sr.width || !sr.height || !stage.clientWidth || !stage.clientHeight) return null;
      return {
        sr: sr,
        left: ((wr.left - sr.left) / sr.width) * 100,
        top: ((wr.top - sr.top) / sr.height) * 100,
        width: (wr.width / sr.width) * 100,
        height: (wr.height / sr.height) * 100,
      };
    }

    /* Posiciona em porcentagem: funciona com zoom e com o palco escalado. */
    function place(win, stage, left, top) {
      const safe = parseFloat(getComputedStyle(stage).getPropertyValue('--float-safe-top')) || 0;
      const minTop = (safe / stage.clientHeight) * 100;
      const maxLeft = Math.max(0, 100 - (win.offsetWidth / stage.clientWidth) * 100);
      const maxTop = Math.max(minTop, 100 - (win.offsetHeight / stage.clientHeight) * 100);
      win.style.left = clamp(left, 0, maxLeft).toFixed(2) + '%';
      win.style.top = clamp(top, minTop, maxTop).toFixed(2) + '%';
      win.style.right = 'auto';
      win.style.bottom = 'auto';
    }

    kit.addEventListener('pointerdown', (e) => {
      const win = e.target.closest('.k-window--float');
      if (!win) return;
      raise(win);
      const bar = e.target.closest('.k-window__bar');
      if (!bar || !win.contains(bar) || e.button > 0) return;
      if (e.target.closest('button, a, input, select, textarea')) return;
      if (win.dataset.osMax === '1') return;
      const stage = stageOf(win);
      const m = stage ? measure(win, stage) : null;
      if (!m) return;
      if (!win.dataset.osBase) win.dataset.osBase = win.getAttribute('style') || '';
      place(win, stage, m.left, m.top);
      drag = { win: win, bar: bar, stage: stage, sr: m.sr, x: e.clientX, y: e.clientY, left: m.left, top: m.top };
      win.classList.add('is-dragging');
      try { bar.setPointerCapture(e.pointerId); } catch (err) { /* evento sintético */ }
      e.preventDefault();
    });

    kit.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const dx = ((e.clientX - drag.x) / drag.sr.width) * 100;
      const dy = ((e.clientY - drag.y) / drag.sr.height) * 100;
      place(drag.win, drag.stage, drag.left + dx, drag.top + dy);
      if (e.cancelable) e.preventDefault();
    });

    function endDrag(e) {
      if (!drag) return;
      const win = drag.win;
      const bar = drag.bar;
      win.classList.remove('is-dragging');
      try {
        if (bar.hasPointerCapture && bar.hasPointerCapture(e.pointerId)) bar.releasePointerCapture(e.pointerId);
      } catch (err) { /* ignore */ }
      drag = null;
    }
    kit.addEventListener('pointerup', endDrag);
    kit.addEventListener('pointercancel', endDrag);
    kit.addEventListener('lostpointercapture', endDrag);

    /* Seletor de cor: anel para o matiz e triângulo para saturação/valor nas
       versões circulares; espectro 2D e faixa de matiz nas retangulares. */
    kit.addEventListener('pointerdown', (e) => {
      const wheel = e.target.closest('[data-cp-wheel]');
      const sv = e.target.closest('[data-cp-sv]');
      const hue = e.target.closest('[data-cp-hue]');
      const area = sv || wheel || hue;
      if (!area) return;
      const root = area.closest('.k-cp');
      if (!root) return;
      e.preventDefault();
      const apply = (ev) => {
        const hsv = cpHsvOf(root);
        if (wheel || (sv && sv.hasAttribute('data-cp-tri'))) {
          const r = (wheel || sv.parentElement).getBoundingClientRect();
          if (!r.width || !r.height) return;
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dx = (ev.clientX - cx) / (r.width / 2);
          const dy = (ev.clientY - cy) / (r.height / 2);
          /* Anel: distância entre o raio interno e o externo escolhe o matiz. */
          if (wheel && !sv && Math.hypot(dx, dy) >= CP_RING_INNER) {
            cpApplyHsv(root, cpHueAt(dx, dy), hsv[1], hsv[2]);
            return;
          }
          /* Triângulo: coordenadas locais giradas até o matiz ficar no topo. */
          const w = cpTriWeights(dx / CP_TRI_SPAN, dy / CP_TRI_SPAN, hsv[0]);
          const chosen = cpTriHSV(w);
          cpApplyHsv(root, hsv[0], chosen[0], chosen[1]);
          return;
        }
        const r = area.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const x = clamp((ev.clientX - r.left) / r.width, 0, 1);
        const y = clamp((ev.clientY - r.top) / r.height, 0, 1);
        if (sv) cpApplyHsv(root, hsv[0], x, 1 - y);
        else cpApplyHsv(root, x, hsv[1], hsv[2]);
      };
      const move = (ev) => { apply(ev); if (ev.cancelable) ev.preventDefault(); };
      const stop = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', stop);
        window.removeEventListener('pointercancel', stop);
      };
      apply(e);
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', stop);
      window.addEventListener('pointercancel', stop);
    });

    /* A nota da janela vale também no uso real: clique fora a fecha. Usamos
       pointerdown porque ele acontece antes do click que reabre o componente. */
    document.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.k-cp')) return;
      document.querySelectorAll('.k-cp:not([hidden])').forEach((win) => { win.hidden = true; });
    });

    /* Menu lateral: filete discreto e overlay por botão externo. */
    const sbTimers = new WeakMap();
    const sbTouch = new WeakMap();
    const sbClearTimer = (fillet) => {
      const t = sbTimers.get(fillet);
      if (t) { clearTimeout(t); sbTimers.delete(fillet); }
    };
    const sbCloseFillet = (fillet) => {
      fillet.classList.remove('is-open');
      sbClearTimer(fillet);
    };
    const sbOpenFillet = (fillet, pointerType) => {
      fillet.classList.add('is-open');
      sbClearTimer(fillet);
      if (pointerType !== 'touch') {
        sbTimers.set(fillet, setTimeout(() => sbCloseFillet(fillet), 2000));
      }
    };
    kit.addEventListener('pointerdown', (e) => {
      const demo = e.target.closest('.k-sb-demo');
      if (!demo) return;
      const fillet = demo.querySelector('[data-sb-fillet]');
      if (!fillet) return;
      if (e.pointerType === 'touch') {
        sbTouch.set(fillet, { x: e.clientX, y: e.clientY, fromEdge: (e.clientX - demo.getBoundingClientRect().left) <= 36 });
      }
    });
    kit.addEventListener('pointermove', (e) => {
      const demo = e.target.closest('.k-sb-demo');
      if (!demo) return;
      const fillet = demo.querySelector('[data-sb-fillet]');
      if (!fillet) return;
      const rect = demo.getBoundingClientRect();
      if (e.pointerType === 'touch') {
        const st = sbTouch.get(fillet);
        if (!st) return;
        const dx = e.clientX - st.x;
        const nearLeft = (e.clientX - rect.left) <= 24;
        if (!fillet.classList.contains('is-open') && st.fromEdge && dx > 12) sbOpenFillet(fillet, 'touch');
        if (fillet.classList.contains('is-open') && dx < -12 && nearLeft) sbCloseFillet(fillet);
        return;
      }
      const nearEdge = (e.clientX - rect.left) >= 0 && (e.clientX - rect.left) <= 28;
      if (nearEdge || e.target.closest('[data-sb-fillet]')) sbOpenFillet(fillet, e.pointerType);
    });
    kit.addEventListener('pointerup', (e) => {
      const demo = e.target.closest('.k-sb-demo');
      if (!demo) return;
      const fillet = demo.querySelector('[data-sb-fillet]');
      if (fillet) sbTouch.delete(fillet);
    });
    kit.addEventListener('pointerleave', (e) => {
      const fillet = e.target.closest('[data-sb-fillet]');
      if (!fillet) return;
      if (e.pointerType === 'touch') return;
      sbClearTimer(fillet);
      sbTimers.set(fillet, setTimeout(() => sbCloseFillet(fillet), 2000));
    }, true);
    document.addEventListener('pointerdown', (e) => {
      document.querySelectorAll('[data-sb-fillet].is-open').forEach((fillet) => {
        if (!fillet.contains(e.target)) sbCloseFillet(fillet);
      });
    });
    kit.addEventListener('click', (e) => {
      const col = e.target.closest('[data-sb-collapse]');
      if (col) {
        const id = col.getAttribute('data-sb-collapse');
        const body = kit.querySelector('#' + id);
        const group = col.closest('.k-sb-group');
        const open = col.getAttribute('aria-expanded') === 'true';
        col.setAttribute('aria-expanded', String(!open));
        if (group) group.classList.toggle('is-open', !open);
        if (body) body.hidden = open;
        return;
      }
      const openBtn = e.target.closest('[data-sb-open]');
      if (openBtn) {
        const id = openBtn.getAttribute('data-sb-open');
        const overlay = kit.querySelector('[data-sb-overlay="' + id + '"]');
        if (overlay) overlay.classList.add('is-open');
        return;
      }
      const closeBtn = e.target.closest('[data-sb-close]');
      if (closeBtn) {
        const id = closeBtn.getAttribute('data-sb-close');
        const overlay = kit.querySelector('[data-sb-overlay="' + id + '"]');
        if (overlay) overlay.classList.remove('is-open');
      }
    });

    kit.addEventListener('keydown', (e) => {
      const bar = e.target.closest('.k-window--float .k-window__bar');
      if (!bar || e.target.closest('button, a, input, select, textarea')) return;
      const win = bar.closest('.k-window--float');
      const stage = stageOf(win);
      const m = stage ? measure(win, stage) : null;
      if (!m) return;
      const step = e.shiftKey ? 4 : 16;
      const dx = (step / stage.clientWidth) * 100;
      const dy = (step / stage.clientHeight) * 100;
      let left = m.left;
      let top = m.top;
      if (e.key === 'ArrowLeft') left -= dx;
      else if (e.key === 'ArrowRight') left += dx;
      else if (e.key === 'ArrowUp') top -= dy;
      else if (e.key === 'ArrowDown') top += dy;
      else return;
      raise(win);
      place(win, stage, left, top);
      e.preventDefault();
    });
  }

  /* Interações do padrão "Interface de sistema": menus da barra, volume
     flutuante, ícones da área de trabalho, dock e controles de janela.
     Tudo delegado no #kit para sobreviver às re-renderizações. */
  function initDesktopShell() {
    const kit = els.kit;
    if (!kit) return;

    const MENUS = {
      arquivo: [
        { label: 'Nova janela', action: 'arrange', kbd: '⌘N' },
        { label: 'Abrir…', action: 'noop', kbd: '⌘O' },
        { sep: true },
        { label: 'Fechar janela', action: 'close-front', kbd: '⌘W' }
      ],
      editar: [
        { label: 'Desfazer', action: 'noop', kbd: '⌘Z' },
        { label: 'Refazer', action: 'noop', kbd: '⇧⌘Z' },
        { sep: true },
        { label: 'Copiar', action: 'noop', kbd: '⌘C' },
        { label: 'Colar', action: 'noop', kbd: '⌘V' }
      ],
      ver: [
        { label: 'Mostrar dock', action: 'toggle-dock', check: true },
        { label: 'Organizar janelas', action: 'arrange' },
        { sep: true },
        { label: 'Tela cheia', action: 'noop', kbd: '⌃⌘F' }
      ],
      janela: [
        { label: 'Minimizar', action: 'minimize-front', kbd: '⌘M' },
        { label: 'Maximizar', action: 'maximize-front' },
        { sep: true },
        { label: 'Organizar janelas', action: 'arrange' }
      ]
    };

    let menu = null;
    let volDrag = null;

    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    const stageOf = (el) => el && el.closest('[data-float-stage]');
    const windowsOf = (stage) => Array.from(stage.querySelectorAll('.k-window--float'));
    const pad = 8;

    function raise(win) {
      const stage = stageOf(win);
      if (!stage) return;
      let n = (parseInt(stage.dataset.floatZ || '0', 10) || 0) + 1;
      if (n > 90) {
        windowsOf(stage).forEach((w) => { w.style.zIndex = ''; });
        n = 1;
      }
      stage.dataset.floatZ = String(n);
      win.style.zIndex = String(n);
    }

    function remember(stage) {
      windowsOf(stage).forEach((w) => {
        if (!w.dataset.osBase) w.dataset.osBase = w.getAttribute('style') || '';
      });
    }

    function updateDock(stage) {
      if (!stage) return;
      const dock = stage.querySelector('[data-os-dock-bar]');
      if (!dock) return;
      windowsOf(stage).forEach((win) => {
        const key = win.dataset.osWindow;
        if (!key) return;
        const item = dock.querySelector('[data-os-dock="' + key + '"]');
        if (item) item.dataset.open = (win.hidden && win.dataset.osClosed === '1') ? 'false' : 'true';
      });
    }

    function markMax(win, on) {
      const btn = win.querySelector('[data-win="max"]');
      if (!btn) return;
      btn.setAttribute('aria-label', on ? 'Restaurar' : 'Maximizar');
      btn.title = on ? 'Restaurar' : 'Maximizar';
    }

    function maximize(win) {
      const stage = stageOf(win);
      if (!stage) return;
      if (win.dataset.osMax === '1') {
        if (win.dataset.osPreMax) win.setAttribute('style', win.dataset.osPreMax);
        delete win.dataset.osPreMax;
        delete win.dataset.osMax;
        win.hidden = false;
        markMax(win, false);
      } else {
        remember(stage);
        win.dataset.osPreMax = win.getAttribute('style') || '';
        const safe = parseFloat(getComputedStyle(stage).getPropertyValue('--float-safe-top')) || 0;
        win.style.left = pad + 'px';
        win.style.top = (safe + pad) + 'px';
        win.style.width = Math.max(120, stage.clientWidth - pad * 2) + 'px';
        win.style.height = Math.max(80, stage.clientHeight - safe - pad * 2) + 'px';
        win.style.right = 'auto';
        win.style.bottom = 'auto';
        win.dataset.osMax = '1';
        win.hidden = false;
        markMax(win, true);
      }
      raise(win);
      updateDock(stage);
    }

    function resetWindow(win) {
      if (win.dataset.osBase) win.setAttribute('style', win.dataset.osBase);
      win.hidden = false;
      delete win.dataset.osMax;
      delete win.dataset.osPreMax;
      delete win.dataset.osClosed;
      markMax(win, false);
    }

    function arrange(stage) {
      if (!stage) return;
      remember(stage);
      windowsOf(stage).forEach(resetWindow);
      delete stage.dataset.floatZ;
      updateDock(stage);
      const files = windowsOf(stage).find((w) => w.dataset.osWindow === 'arquivos');
      if (files) {
        raise(files);
        stage.querySelectorAll('[data-os-dock]').forEach((b) => b.classList.toggle('is-active', b.dataset.osDock === 'arquivos'));
      }
    }

    function frontMost(stage) {
      return windowsOf(stage)
        .filter((w) => !w.hidden)
        .sort((a, b) => (parseInt(b.style.zIndex || '0', 10) || 0) - (parseInt(a.style.zIndex || '0', 10) || 0))[0] || null;
    }

    function act(action, stage) {
      if (!stage) return;
      const front = frontMost(stage);
      if (action === 'arrange') arrange(stage);
      else if (action === 'toggle-dock') {
        const dock = stage.querySelector('[data-os-dock-bar]');
        if (dock) dock.hidden = !dock.hidden;
      } else if (action === 'minimize-front' && front) {
        front.hidden = true;
        delete front.dataset.osClosed;
        updateDock(stage);
      } else if (action === 'close-front' && front) {
        front.hidden = true;
        front.dataset.osClosed = '1';
        updateDock(stage);
      } else if (action === 'maximize-front' && front) {
        maximize(front);
      }
    }

    function closeMenu() {
      if (!menu) return;
      menu.btn.setAttribute('aria-expanded', 'false');
      if (menu.pop.parentNode) menu.pop.parentNode.removeChild(menu.pop);
      menu = null;
    }

    function openMenu(btn) {
      closeMenu();
      const stage = stageOf(btn);
      if (!stage) return;
      const items = MENUS[btn.dataset.osMenu] || [];
      const dock = stage.querySelector('[data-os-dock-bar]');
      const dockOn = dock ? !dock.hidden : true;
      const pop = document.createElement('div');
      pop.className = 'k-menu__pop k-os-menu-pop';
      pop.setAttribute('role', 'menu');
      pop.innerHTML = items.map(function (it) {
        if (it.sep) return '<div class="k-menu__sep"></div>';
        const checked = it.check ? dockOn : false;
        return '<button class="k-menu__item" type="button" role="menuitem" data-os-action="' + it.action + '">' +
          '<span style="width:12px;flex:none">' + (checked ? '✓' : '') + '</span>' +
          '<span>' + it.label + '</span>' +
          (it.kbd ? '<span class="k-kbd" style="margin-left:auto">' + it.kbd + '</span>' : '') +
          '</button>';
      }).join('');
      stage.appendChild(pop);
      const sr = stage.getBoundingClientRect();
      const br = btn.getBoundingClientRect();
      pop.style.left = (((br.left - sr.left) / sr.width) * 100) + '%';
      pop.style.top = 'calc(' + (((br.bottom - sr.top) / sr.height) * 100) + '% + 4px)';
      pop.style.zIndex = '220';
      const pr = pop.getBoundingClientRect();
      if (pr.right > sr.right - 6) {
        pop.style.left = (((br.right - sr.left) / sr.width) * 100) + '%';
        pop.style.transform = 'translateX(-100%)';
      }
      btn.setAttribute('aria-expanded', 'true');
      menu = { btn: btn, pop: pop };
    }

    function closeVolume() {
      kit.querySelectorAll('[data-os-volume-toggle]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
      kit.querySelectorAll('[data-os-volume-pop]').forEach((p) => { p.hidden = true; });
    }

    function volumeOf(stage) {
      const n = parseInt(stage.dataset.osVolumeLevel || '68', 10);
      return isNaN(n) ? 68 : n;
    }

    function setVolume(stage, value) {
      if (!stage) return;
      const v = clamp(Math.round(value), 0, 100);
      stage.dataset.osVolumeLevel = String(v);
      const fill = stage.querySelector('[data-os-volume-fill]');
      const thumb = stage.querySelector('[data-os-volume-thumb]');
      const label = stage.querySelector('[data-os-volume-value]');
      const track = stage.querySelector('[data-os-volume-track]');
      if (fill) fill.style.height = v + '%';
      if (thumb) thumb.style.bottom = v + '%';
      if (label) label.textContent = String(v);
      if (track) track.setAttribute('aria-valuenow', String(v));
    }

    kit.addEventListener('click', (e) => {
      const icon = e.target.closest('[data-os-icon]');
      if (icon) {
        const stage = stageOf(icon);
        if (stage) stage.querySelectorAll('[data-os-icon]').forEach((b) => b.setAttribute('aria-pressed', String(b === icon)));
        return;
      }
      const stage = e.target.closest('[data-float-stage]');
      if (stage) stage.querySelectorAll('[data-os-icon]').forEach((b) => b.setAttribute('aria-pressed', 'false'));
    });

    kit.addEventListener('click', (e) => {
      const ctrl = e.target.closest('[data-win]');
      if (ctrl) {
        const win = ctrl.closest('.k-window--float');
        const stage = stageOf(win);
        if (!win || !stage) return;
        const kind = ctrl.dataset.win;
        if (kind === 'close') { win.hidden = true; win.dataset.osClosed = '1'; }
        else if (kind === 'min') { win.hidden = true; delete win.dataset.osClosed; }
        else if (kind === 'max') maximize(win);
        updateDock(stage);
        return;
      }

      const dockItem = e.target.closest('[data-os-dock]');
      if (dockItem) {
        const key = dockItem.dataset.osDock;
        const stage = stageOf(dockItem);
        if (!key || !stage) return;
        const win = stage.querySelector('.k-window--float[data-os-window="' + key + '"]');
        if (!win) return;
        win.hidden = false;
        delete win.dataset.osClosed;
        raise(win);
        stage.querySelectorAll('[data-os-dock]').forEach((b) => b.classList.toggle('is-active', b === dockItem));
        updateDock(stage);
        return;
      }

      const item = e.target.closest('[data-os-action]');
      if (item) {
        act(item.dataset.osAction, e.target.closest('[data-float-stage]'));
        closeMenu();
      }
    });

    kit.addEventListener('pointerdown', (e) => {
      const win = e.target.closest('.k-window--float');
      if (!win) return;
      const stage = stageOf(win);
      const key = win.dataset.osWindow;
      if (!stage || !key) return;
      stage.querySelectorAll('[data-os-dock]').forEach((b) => b.classList.toggle('is-active', b.dataset.osDock === key));
    });

    kit.addEventListener('pointerdown', (e) => {
      const track = e.target.closest('[data-os-volume-track]');
      if (!track) return;
      const stage = stageOf(track);
      if (!stage) return;
      const r = track.getBoundingClientRect();
      volDrag = { stage: stage, rect: r };
      setVolume(stage, ((r.bottom - e.clientY) / r.height) * 100);
      try { track.setPointerCapture(e.pointerId); } catch (err) { /* evento sintético */ }
    });

    kit.addEventListener('pointermove', (e) => {
      if (!volDrag) return;
      setVolume(volDrag.stage, ((volDrag.rect.bottom - e.clientY) / volDrag.rect.height) * 100);
      if (e.cancelable) e.preventDefault();
    });

    function endVolume() { volDrag = null; }
    kit.addEventListener('pointerup', endVolume);
    kit.addEventListener('pointercancel', endVolume);
    kit.addEventListener('lostpointercapture', endVolume);

    kit.addEventListener('keydown', (e) => {
      const track = e.target.closest('[data-os-volume-track]');
      if (!track) return;
      const stage = stageOf(track);
      if (!stage) return;
      let v = volumeOf(stage);
      const step = e.shiftKey ? 1 : 5;
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') v += step;
      else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') v -= step;
      else if (e.key === 'Home') v = 0;
      else if (e.key === 'End') v = 100;
      else return;
      setVolume(stage, v);
      e.preventDefault();
    });

    document.addEventListener('click', (e) => {
      const menuBtn = e.target.closest('[data-os-menu]');
      const volBtn = e.target.closest('[data-os-volume-toggle]');
      if (menuBtn) {
        closeVolume();
        if (menu && menu.btn === menuBtn) closeMenu();
        else openMenu(menuBtn);
        return;
      }
      if (volBtn) {
        closeMenu();
        const stage = stageOf(volBtn);
        const pop = stage && stage.querySelector('[data-os-volume-pop]');
        if (!pop) return;
        const open = !pop.hidden;
        pop.hidden = open;
        volBtn.setAttribute('aria-expanded', String(!open));
        if (!open) setVolume(stage, volumeOf(stage));
        return;
      }
      if (e.target.closest('.k-os-menu-pop') || e.target.closest('[data-os-volume-pop]')) return;
      closeMenu();
      closeVolume();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      closeMenu();
      closeVolume();
    });
  }

  /* ------------------------------------------------------------------ */
  /* seletor de cor — popover próprio no estilo da moldura               */
  /* ------------------------------------------------------------------ */

  const picker = { anchor: null, ctx: null, h: 0, s: 0, v: 0, dirty: false, stageDirty: false };

  function pickerHex() { return rgbToHex.apply(null, hsvToRgb(picker.h, picker.s, picker.v)); }

  function pickerHTML(ctx) {
    const hasOverride = ctx.isStage
      ? state.overrides.stageBg !== null && state.overrides.stageBg !== undefined
      : Object.prototype.hasOwnProperty.call(state.overrides.colors, ctx.varName);
    return (
      '<div class="cpick__head">' +
        '<span class="cpick__chip"></span>' +
        '<div class="cpick__meta"><b class="cpick__label">' + ctx.label + '</b>' +
        '<span class="cpick__var">' + (ctx.isStage ? '--k-stage-bg' : ctx.varName) + '</span></div>' +
        '<button class="cpick__x" type="button" data-cpick-close aria-label="Fechar">' + UI.icon('close') + '</button>' +
      '</div>' +
      '<div class="cpick__field" data-cpick-sv><div class="cpick__thumb"></div></div>' +
      '<div class="cpick__hue" data-cpick-hue><div class="cpick__hthumb"></div></div>' +
      '<div class="cpick__row"><label for="cpickHex">Hex</label>' +
      '<input id="cpickHex" class="cpick__hex" spellcheck="false" maxlength="7" autocomplete="off"></div>' +
      '<div class="cpick__foot"><button class="minibtn" type="button" data-cpick-reset' + (hasOverride ? '' : ' disabled') + '>' +
      UI.icon('undo') + 'Restaurar cor</button></div>'
    );
  }

  function paintPicker(syncInput, writeOverride) {
    if (!picker.ctx || !els.picker || els.picker.hidden) return;
    const hex = pickerHex();
    const field = $('[data-cpick-sv]', els.picker);
    const hue = $('[data-cpick-hue]', els.picker);
    field.style.setProperty('--hue', (picker.h * 360).toFixed(1));
    field.style.setProperty('--s', picker.s.toFixed(4));
    field.style.setProperty('--y', (1 - picker.v).toFixed(4));
    hue.style.setProperty('--h', picker.h.toFixed(4));
    $('.cpick__chip', els.picker).style.background = hex;
    const input = $('.cpick__hex', els.picker);
    if (syncInput && document.activeElement !== input) input.value = hex;
    if (writeOverride === false) return;

    if (picker.ctx.isStage) state.overrides.stageBg = hex;
    else state.overrides.colors[picker.ctx.varName] = hex;
    applyTokens();
    picker.dirty = true;
    if (picker.ctx.isStage) picker.stageDirty = true;

    if (picker.anchor) {
      const anchor = picker.anchor;
      if (anchor.classList.contains('tex-card')) {
        const prev = anchor.querySelector('.tex-card__preview');
        if (prev) prev.style.background = hex;
      } else {
        anchor.style.background = hex;
      }
      const row = anchor.closest('.rowk');
      if (row) {
        const hexField = row.querySelector('.hex');
        if (hexField) hexField.value = hex;
        const reset = row.querySelector('.colorreset');
        if (reset) reset.disabled = false;
      }
    }
    const resetBtn = $('[data-cpick-reset]', els.picker);
    if (resetBtn) resetBtn.disabled = false;
  }

  function commitPicker(writeStore) {
    if (writeStore && picker.dirty) {
      picker.dirty = false;
      save();
    }
  }

  function bindPickArea(el, apply) {
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      const y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      apply(x, y);
      paintPicker(true);
    };
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      try { el.setPointerCapture(e.pointerId); } catch (err) { /* ponteiro sintético */ }
      move(e);
      const up = () => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', up);
        el.removeEventListener('pointercancel', up);
        commitPicker(true);
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
    });
  }

  function positionPicker() {
    if (!picker.anchor || !els.picker || els.picker.hidden) return;
    const a = picker.anchor.getBoundingClientRect();
    const app = els.app.getBoundingClientRect();
    const scale = els.app.offsetWidth ? app.width / els.app.offsetWidth : 1;
    const appW = els.app.offsetWidth, appH = els.app.offsetHeight;
    const pw = els.picker.offsetWidth, ph = els.picker.offsetHeight;
    let left = (a.right - app.left) / scale - pw + 12;
    let top = (a.bottom - app.top) / scale + 8;
    left = Math.max(8, Math.min(appW - pw - 8, left));
    if (top + ph > appH - 8) top = Math.max(8, (a.top - app.top) / scale - ph - 8);
    els.picker.style.left = left + 'px';
    els.picker.style.top = top + 'px';
  }

  function openPicker(anchor) {
    const isStage = anchor.dataset.set === 'stageBg';
    const varName = anchor.dataset.var || '';
    const raw = isStage ? state.overrides.stageBg || resolvedTokens()['--k-stage-bg'] : resolvedTokens()[varName];
    const value = colorToHex(raw) || (isStage ? '#FFFFFF' : null);
    if (!value) return;

    closePicker();
    const hsv = rgbToHsv.apply(null, hexToRgb(value));
    picker.anchor = anchor;
    picker.ctx = { isStage, varName, label: anchor.dataset.label || 'Cor' };
    picker.h = hsv.h; picker.s = hsv.s; picker.v = hsv.v; picker.dirty = false;

    els.picker.innerHTML = pickerHTML(picker.ctx);
    els.picker.hidden = false;

    bindPickArea($('[data-cpick-sv]', els.picker), (x, y) => { picker.s = x; picker.v = 1 - y; });
    bindPickArea($('[data-cpick-hue]', els.picker), (x) => { picker.h = x; });
    $('[data-cpick-close]', els.picker).addEventListener('click', () => closePicker(true));
    $('[data-cpick-reset]', els.picker).addEventListener('click', resetPickedColor);

    const input = $('.cpick__hex', els.picker);
    input.addEventListener('input', () => {
      if (!isSolidHex(input.value)) return;
      const h = rgbToHsv.apply(null, hexToRgb(input.value));
      picker.h = h.h; picker.s = h.s; picker.v = h.v;
      paintPicker(false);
    });
    input.addEventListener('change', () => commitPicker(true));
    input.addEventListener('blur', () => {
      if (!isSolidHex(input.value)) input.value = pickerHex();
      else commitPicker(true);
    });

    paintPicker(true, false);
    picker.dirty = false;
    picker.stageDirty = false;
    positionPicker();
    input.focus({ preventScroll: true });
    input.select();
  }

  function closePicker(restoreFocus) {
    if (!els.picker || els.picker.hidden) return;
    const anchor = picker.anchor;
    const hadFocus = els.picker.contains(document.activeElement);
    const refreshStage = picker.stageDirty && picker.ctx && picker.ctx.isStage;
    els.picker.hidden = true;
    els.picker.innerHTML = '';
    picker.anchor = null;
    picker.ctx = null;
    picker.dirty = false;
    picker.stageDirty = false;
    if (restoreFocus && hadFocus && anchor) anchor.focus({ preventScroll: true });
    if (refreshStage) {
      renderPanel();
      renderCanvas();
      renderInspector();
    }
  }

  function resetPickedColor() {
    if (!picker.ctx) return;
    if (picker.ctx.isStage) state.overrides.stageBg = null;
    else delete state.overrides.colors[picker.ctx.varName];
    picker.dirty = false;
    applyTokens();
    renderInspector();
    save();
    toast('Cor restaurada');
  }

  /* ------------------------------------------------------------------ */
  /* inspetor                                                            */
  /* ------------------------------------------------------------------ */

  function captureSections() {
    if (!els.inspector || renderedTab === null || renderedTab !== state.tab) return;
    $$('details.sec', els.inspector).forEach((d) => {
      if (d.dataset.sec) secOpen.set(state.tab + '|' + d.dataset.sec, d.open);
    });
  }

  /* Item importado atualmente selecionado, por aba. Itens do acervo base
     não entram aqui: só podem ser removidos os ativos gravados no navegador. */
  function currentRemovable() {
    let list = null;
    let item = null;
    let label = 'Remover item';

    if (state.tab === 'styles') {
      list = customStyles;
      item = list.find((x) => x.id === state.style);
      label = 'Remover estilo';
    } else if (state.tab === 'icons') {
      list = customAssets.icons;
      item = list.find((x) => x.id === state.icon);
      label = 'Remover ícone';
    } else if (state.tab === 'fonts') {
      const current = state.overrides.font || T.styleById(state.style).font;
      list = customAssets.fonts;
      item = list.find((x) => x.id === current);
      label = 'Remover esta fonte do Kit UI';
    } else if (state.tab === 'emojis') {
      list = customAssets.emojis;
      item = list.find((x) => x.e === state.emoji);
      label = 'Remover emoji';
    } else if (state.tab === 'textures') {
      list = customAssets.textures;
      item = list.find((x) => x.id === state.overrides.texture);
      label = 'Remover textura';
    } else if (state.tab === 'stages') {
      list = customAssets.stages;
      item = list.find((x) => x.id === state.overrides.stage);
      label = 'Remover fundo';
    }

    if (!item) return null;
    const name = state.tab === 'styles' ? item.name : assetName(kindOfTab(state.tab), item);
    return { kind: kindOfTab(state.tab), id: item.id, name, label };
  }

  function kindOfTab(tab) {
    return ({ icons: 'icons', fonts: 'fonts', emojis: 'emojis', textures: 'textures', stages: 'stages' })[tab] || 'styles';
  }

  function inspRemoval() {
    const current = currentRemovable();
    const isFonts = state.tab === 'fonts';
    const title = isFonts ? 'Remover esta fonte do Kit UI' : 'Remover';
    if (!current) {
      const hint = isFonts
        ? 'Esta fonte faz parte do acervo padrão do Kit UI e não pode ser removida.'
        : 'Os itens padrões do Kitui não podem ser removidos';
      return sec(
        title,
        '<div class="sec__hint">' + hint + '</div>' +
          '<div class="minibtns" style="margin-top:8px"><button class="minibtn minibtn--danger" type="button" disabled>' + UI.icon('trash') + esc(title) + '</button></div>'
      );
    }
    return sec(
      title,
      '<div class="sec__hint">Remove <b style="color:var(--u-text)">' + esc(current.name) + '</b>' +
        (current.kind === 'styles' ? ' do projeto e do navegador' : ' deste navegador') +
        '. Esta ação pede confirmação.</div>' +
        '<div class="minibtns" style="margin-top:8px"><button class="minibtn minibtn--danger" type="button" data-act="remove-current">' +
        UI.icon('trash') + esc(current.label) + '</button></div>'
    );
  }

  function renderInspector() {
    closePicker();
    captureSections();
    let html = '';
    const mod = TAB_UI[state.tab];
    if (mod && mod.inspector) html = mod.inspector();
    els.inspector.innerHTML = html + inspRemoval();
    renderedTab = state.tab;
  }

  /* ------------------------------------------------------------------ */
  /* seletor de cor flutuante (componente)                              */
  /* Valores ficam só no DOM da janela: nada é gravado nem vira token.   */
  /* ------------------------------------------------------------------ */

  function cpClamp(n, min, max) {
    if (n === '' || n === null || n === undefined) return null;
    const v = Number(n);
    return Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v))) : null;
  }

  function cpParseHex(value) {
    const s = String(value || '').trim().replace(/^#/, '');
    if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s)) return null;
    const full = s.length === 3 ? s[0] + s[0] + s[1] + s[1] + s[2] + s[2] : s;
    const n = parseInt(full, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function cpRgbToCmyk(r, g, b) {
    const rn = r / 255, gn = g / 255, bn = b / 255;
    const k = 1 - Math.max(rn, gn, bn);
    if (k >= 0.999) return [0, 0, 0, 100];
    const rest = 1 - k;
    return [
      Math.round(((1 - rn - k) / rest) * 100),
      Math.round(((1 - gn - k) / rest) * 100),
      Math.round(((1 - bn - k) / rest) * 100),
      Math.round(k * 100),
    ];
  }

  function cpCmykToRgb(c, m, y, k) {
    const f = 1 - k / 100;
    return [c, m, y].map((v) => Math.round(255 * (1 - v / 100) * f));
  }

  function cpRgbOf(root) {
    const r = cpClamp(root.dataset.cpR, 0, 255);
    const g = cpClamp(root.dataset.cpG, 0, 255);
    const b = cpClamp(root.dataset.cpB, 0, 255);
    return [r === null ? 59 : r, g === null ? 130 : g, b === null ? 246 : b];
  }

  function cpUnit(n) {
    const v = Number(n);
    return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0;
  }

  function cpHsvOf(root) {
    let h = Number(root.dataset.cpH);
    let s = Number(root.dataset.cpS);
    let v = Number(root.dataset.cpV);
    if (!Number.isFinite(h) || !Number.isFinite(s) || !Number.isFinite(v)) {
      const fallback = rgbToHsv.apply(null, cpRgbOf(root));
      h = fallback.h; s = fallback.s; v = fallback.v;
    }
    return [cpUnit(h), cpUnit(s), cpUnit(v)];
  }

  /* Anel cromático + triângulo concêntrico. O vértice A acompanha o matiz do
     anel, B é branco e C é preto. Com pesos baricêntricos: v = A + B,
     s = A / (A + B). Padrão comum em seletores HSV de roda com triângulo. */
  /* Anel com 10% de inset: raio interno = 0,80 do raio externo. */
  const CP_RING_INNER = 0.8;
  /* O marcador do matiz fica no meio da espessura do anel. As coordenadas CSS
     são frações da largura, por isso o raio externo vale 0,5 (não 1). */
  const CP_HUE_PIN_FRAC = (1 + CP_RING_INNER) / 4;
  /* O triângulo é 5% menor que a abertura do anel: ocupa 76% da largura da
     roda (inset 12% no CSS), em vez dos 80% anteriores. */
  const CP_TRI_SPAN = CP_RING_INNER * 0.95;
  const CP_SQRT3_2 = Math.sqrt(3) / 2;

  function cpBary(x, y, ax, ay, bx, by, cx, cy) {
    const d = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy);
    if (Math.abs(d) < 1e-9) return [1, 0, 0];
    const a = ((by - cy) * (x - cx) + (cx - bx) * (y - cy)) / d;
    const b = ((cy - ay) * (x - cx) + (ax - cx) * (y - cy)) / d;
    return [a, b, 1 - a - b];
  }

  /* x e y em relação ao centro do anel, na unidade do raio externo. */
  function cpTriWeights(x, y, h) {
    const th = h * 2 * Math.PI;
    const cos = Math.cos(th), sin = Math.sin(th);
    const lx = x * cos + y * sin;
    const ly = -x * sin + y * cos;
    const w = cpBary(lx, ly, 0, -1, CP_SQRT3_2, .5, -CP_SQRT3_2, .5);
    const a = Math.max(0, w[0]), b = Math.max(0, w[1]), c = Math.max(0, w[2]);
    const sum = a + b + c || 1;
    return [a / sum, b / sum, c / sum];
  }

  function cpTriHSV(w) {
    const v = w[0] + w[1];
    return [v > 0 ? w[0] / v : 0, v];
  }

  function cpHueAt(dx, dy) {
    const h = Math.atan2(dx, -dy) / (2 * Math.PI);
    return h < 0 ? h + 1 : h;
  }

  /* Um único campo de texto: o formato acompanha o modo ativo. */
  function cpFormat(rgb, mode) {
    const r = Math.round(rgb[0]), g = Math.round(rgb[1]), b = Math.round(rgb[2]);
    if (mode === 'hex') return rgbToHex(r, g, b);
    if (mode === 'cmyk') return cpRgbToCmyk(r, g, b).join(', ');
    return r + ', ' + g + ', ' + b;
  }

  function cpWriteText(root, skipEl) {
    const input = root.querySelector('[data-cp="text"]');
    const mode = root.dataset.cpMode || 'rgb';
    if (input && input !== skipEl) input.value = cpFormat(cpRgbOf(root), mode);
  }

  function cpPaint(root, skipEl) {
    const hsv = cpHsvOf(root);
    root.style.setProperty('--cp-h', hsv[0].toFixed(4));
    root.style.setProperty('--cp-s', hsv[1].toFixed(4));
    root.style.setProperty('--cp-v', hsv[2].toFixed(4));
    /* Anel e triângulo: marcador do matiz na roda e ponto de saturação/
       valor dentro do triângulo (coordenadas locais, antes da rotação). */
    if (root.classList.contains('k-cp--tri')) {
      const th = hsv[0] * 2 * Math.PI;
      root.style.setProperty('--cp-hx', (0.5 + CP_HUE_PIN_FRAC * Math.sin(th)).toFixed(4));
      root.style.setProperty('--cp-hy', (0.5 - CP_HUE_PIN_FRAC * Math.cos(th)).toFixed(4));
      const a = hsv[1] * hsv[2];
      const lx = CP_SQRT3_2 * ((1 - hsv[1]) * hsv[2] - (1 - hsv[2]));
      const ly = 0.5 - 1.5 * a;
      root.style.setProperty('--cp-tx', (0.5 + 0.5 * lx).toFixed(4));
      root.style.setProperty('--cp-ty', (0.5 + 0.5 * ly).toFixed(4));
    }
    const chip = root.querySelector('[data-cp-preview]');
    if (chip) chip.style.background = 'rgb(' + cpRgbOf(root).join(', ') + ')';
    cpWriteText(root, skipEl);
  }

  function cpApplyRgb(root, rgb, skipEl) {
    const r = cpClamp(rgb[0], 0, 255);
    const g = cpClamp(rgb[1], 0, 255);
    const b = cpClamp(rgb[2], 0, 255);
    if (r === null || g === null || b === null) return;
    const hsv = rgbToHsv(r, g, b);
    root.dataset.cpR = String(r);
    root.dataset.cpG = String(g);
    root.dataset.cpB = String(b);
    root.dataset.cpH = hsv.h.toFixed(4);
    root.dataset.cpS = hsv.s.toFixed(4);
    root.dataset.cpV = hsv.v.toFixed(4);
    cpPaint(root, skipEl);
  }

  function cpApplyHsv(root, h, s, v) {
    const hh = cpUnit(h), ss = cpUnit(s), vv = cpUnit(v);
    const rgb = hsvToRgb(hh, ss, vv);
    root.dataset.cpH = hh.toFixed(4);
    root.dataset.cpS = ss.toFixed(4);
    root.dataset.cpV = vv.toFixed(4);
    root.dataset.cpR = String(Math.round(rgb[0]));
    root.dataset.cpG = String(Math.round(rgb[1]));
    root.dataset.cpB = String(Math.round(rgb[2]));
    cpPaint(root);
  }

  function cpNumbers(value, count, max) {
    const parts = String(value || '')
      .replace(/^\s*(rgb|cmyk)\s*\(?/i, '')
      .replace(/[)%]/g, '')
      .split(/[\s,]+/)
      .filter(Boolean);
    if (parts.length !== count) return null;
    const nums = parts.map((p) => Number(p));
    if (nums.some((n) => !Number.isFinite(n))) return null;
    return nums.map((n) => Math.min(max, Math.max(0, n)));
  }

  function cpParseText(root, value) {
    const mode = root.dataset.cpMode || 'rgb';
    if (mode === 'hex') return cpParseHex(value);
    if (mode === 'cmyk') {
      const cmyk = cpNumbers(value, 4, 100);
      return cmyk ? cpCmykToRgb(cmyk[0], cmyk[1], cmyk[2], cmyk[3]) : null;
    }
    return cpNumbers(value, 3, 255);
  }

  /* Durante a digitação não se sobrescreve o campo; no blur ele é normalizado. */
  function cpSyncText(el) {
    const root = el.closest('.k-cp');
    if (!root) return;
    const rgb = cpParseText(root, el.value);
    if (rgb) cpApplyRgb(root, rgb, el);
  }

  function cpNormalizeText(el) {
    const root = el.closest('.k-cp');
    if (!root) return;
    const rgb = cpParseText(root, el.value);
    if (rgb) cpApplyRgb(root, rgb);
    else cpWriteText(root);
  }

  function cpSetMode(btn) {
    const root = btn.closest('.k-cp');
    if (!root) return;
    root.dataset.cpMode = btn.dataset.cpMode;
    root.querySelectorAll('[data-cp-mode]').forEach((b) => {
      const active = b === btn;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', String(active));
    });
    cpWriteText(root);
  }

  /* Abas de apresentação: mostram uma variação por vez. Não criam janelas,
     não gravam JSONs e não alteram tokens; só mexem no painel visível. */
  function cpSetVariant(btn) {
    const wrap = btn.closest('[data-cp-variants]');
    if (!wrap) return;
    const id = btn.dataset.cpVariant;
    wrap.querySelectorAll('[data-cp-variant]').forEach((b) => {
      const active = b === btn;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', String(active));
    });
    wrap.querySelectorAll('[data-cp-pane]').forEach((pane) => {
      const active = pane.dataset.cpPane === id;
      pane.hidden = !active;
      const win = pane.querySelector('.k-cp');
      if (win) win.hidden = !active;
    });
  }

  /* Switch dentro da mesma janela: alterna espectro retangular e anel com
     triângulo. Só presentation: não grava JSONs nem altera tokens. */
  function cpSetShape(btn) {
    const root = btn.closest('.k-cp');
    if (!root) return;
    const tri = root.dataset.cpShapeMode !== 'tri';
    root.dataset.cpShapeMode = tri ? 'tri' : 'square';
    root.classList.toggle('k-cp--tri', tri);
    const rect = root.querySelector('[data-cp-rect]');
    const wheel = root.querySelector('[data-cp-wheel]');
    if (rect) rect.hidden = tri;
    if (wheel) wheel.hidden = !tri;
    btn.setAttribute('aria-pressed', String(tri));
    btn.classList.toggle('is-active', tri);
    btn.setAttribute('aria-label', tri ? 'Mudar para caixa quadrada' : 'Mudar para caixa triangular');
    btn.title = tri ? 'Mudar para caixa quadrada' : 'Mudar para caixa triangular';
    cpPaint(root);
  }

  /* Padrão operacional da janela: reabre no modo e com a cor configurados,
     porque apenas mostra de novo a caixa existente. Um clique duplo nunca cria
     duas janelas. */
  function cpReopen(btn) {
    const wrap = btn.closest('[data-cp-variants]');
    const activePane = wrap && wrap.querySelector('[data-cp-pane]:not([hidden])');
    const stage = (activePane && activePane.querySelector('[data-float-stage]')) ||
      btn.closest('[data-float-stage]') || els.kit;
    if (!stage) return;
    const win = stage.querySelector('.k-cp');
    if (win) {
      win.hidden = false;
      delete win.dataset.osClosed;
      return;
    }
    renderCanvas();
  }

  /* Copia o valor atual do campo para a área de transferência. */
  function cpCopy(btn) {
    const root = btn.closest('.k-cp');
    if (!root) return;
    const field = root.querySelector('[data-cp="text"]');
    const value = field ? field.value : '';
    const done = () => toast('Cor copiada');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(done, () => cpFallbackCopy(value, done));
    } else {
      cpFallbackCopy(value, done);
    }
  }

  function cpFallbackCopy(text, done) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { toast('Não foi possível copiar'); }
    ta.remove();
  }

  /* Cola o valor da área de transferência no campo e atualiza a cor. */
  function cpPaste(btn) {
    const root = btn.closest('.k-cp');
    if (!root) return;
    const field = root.querySelector('[data-cp="text"]');
    if (!field) return;
    const apply = (text) => {
      if (!text) return;
      field.value = String(text).trim();
      cpNormalizeText(field);
    };
    if (navigator.clipboard && navigator.clipboard.readText) {
      navigator.clipboard.readText().then(apply, () => toast('Não foi possível colar'));
    } else {
      toast('Não foi possível colar');
    }
  }

  /* ------------------------------------------------------------------ */
  /* eventos                                                             */
  /* ------------------------------------------------------------------ */

  function onClick(e) {
    const t = e.target;

    const pickBtn = t.closest('[data-color-pick]');
    if (pickBtn) return openPicker(pickBtn);
    if (t.closest('.cpick')) return;
    closePicker();

    const cpVariantBtn = t.closest('[data-cp-variant]');
    if (cpVariantBtn) return cpSetVariant(cpVariantBtn);

    const cpShapeBtn = t.closest('[data-cp-shape]');
    if (cpShapeBtn) return cpSetShape(cpShapeBtn);

    const cpReopenBtn = t.closest('[data-cp-reopen]');
    if (cpReopenBtn) return cpReopen(cpReopenBtn);

    const cpCopyBtn = t.closest('[data-cp-copy]');
    if (cpCopyBtn) return cpCopy(cpCopyBtn);

    const cpPasteBtn = t.closest('[data-cp-paste]');
    if (cpPasteBtn) return cpPaste(cpPasteBtn);

    const cpModeBtn = t.closest('[data-cp-mode]');
    if (cpModeBtn) return cpSetMode(cpModeBtn);

    const tabBtn = t.closest('[data-tab]');
    if (tabBtn) return setTab(tabBtn.dataset.tab);

    if (t.closest('#panelQueryClear')) {
      state.queries[state.tab] = '';
      renderPanel(); renderCanvas();
      const input = $('#panelQuery');
      if (input) input.focus();
      updateFS();
      return;
    }

    const styleItem = t.closest('.pitem[data-style]');
    if (styleItem) return setStyle(styleItem.dataset.style);

    if (t.closest('[data-copy-prompt]')) return copyPrompt();
    if (t.closest('[data-import-run]')) return runImport();
    const kindBtn = t.closest('[data-import-kind]');
    if (kindBtn) {
      importKind = kindBtn.dataset.importKind;
      return openImportSheet();
    }
    const texCatBtn = t.closest('[data-texcat]');
    if (texCatBtn) {
      state.texCat = texCatBtn.dataset.texcat || 'all';
      renderPanel();
      renderCanvas();
      save();
      els.viewport.scrollTop = 0;
      return;
    }

    const texBtn = t.closest('[data-texture]');
    if (texBtn) {
      state.overrides.texture = texBtn.dataset.texture || null;
      applyTokens();
      renderPanel(); renderCanvas(); renderInspector(); save();
      updateFS();
      return;
    }

    const stageBtn = t.closest('[data-stage]');
    if (stageBtn) {
      state.overrides.stage = stageBtn.dataset.stage || null;
      state.overrides.stageBg = null;
      applyTokens();
      renderPanel(); renderCanvas(); renderInspector(); save();
      updateFS();
      return;
    }

    const pvBtn = t.closest('[data-pv]');
    if (pvBtn) {
      if (pvBtn.dataset.pv === 'reset') state.previewZoom = 1;
      else {
        const step = pvBtn.dataset.pv === '+' ? 0.2 : -0.2;
        state.previewZoom = Math.min(2, Math.max(0.6, Math.round((state.previewZoom + step) * 10) / 10));
      }
      renderInspector();
      save();
      return;
    }

    const compBtn = t.closest('[data-comp]');
    if (compBtn) {
      state.comp = compBtn.dataset.comp;
      renderPanel(); renderCanvas(); renderInspector(); save();
      els.viewport.scrollTop = 0;
      updateFS();
      return;
    }

    const patBtn = t.closest('[data-pattern]');
    if (patBtn) {
      state.pattern = patBtn.dataset.pattern;
      renderPanel(); renderCanvas(); renderInspector(); save();
      els.viewport.scrollTop = 0;
      updateFS();
      return;
    }

    const catBtn = t.closest('[data-iconcat]');
    if (catBtn) {
      state.iconCat = catBtn.dataset.iconcat;
      renderPanel(); renderCanvas(); updateFS();
      return;
    }

    const emojiLib = t.closest('[data-emojilib]');
    if (emojiLib) {
      const id = emojiLib.dataset.emojilib;
      if (!CORE.activateEmojiLib(id)) return;
      state.emojiCat = 'all';
      renderPanel(); renderCanvas(); renderInspector(); save();
      els.viewport.scrollTop = 0;
      updateFS();
      return;
    }

    const emojiCat = t.closest('[data-emojicat]');
    if (emojiCat) {
      state.emojiCat = emojiCat.dataset.emojicat;
      renderPanel(); renderCanvas(); updateFS();
      return;
    }

    const emojiCell = t.closest('[data-emoji]');
    if (emojiCell) {
      state.emoji = emojiCell.dataset.emoji;
      $$('.emoji-cell').forEach((c) => c.classList.toggle('is-active', c.dataset.emoji === state.emoji));
      renderInspector(); save();
      return;
    }

    const iconCell = t.closest('[data-icon]');
    if (iconCell) {
      state.icon = iconCell.dataset.icon;
      $$('.icon-cell').forEach((c) => c.classList.toggle('is-active', c.dataset.icon === state.icon));
      renderInspector();
      return;
    }

    const fontBtn = t.closest('[data-font]');
    if (fontBtn) {
      /* Clique na lista é só prévia: a fonte do estilo muda em "Usar esta fonte". */
      const id = fontBtn.dataset.font || null;
      state.fontPreview = state.fontPreview === id ? null : id;
      renderPanel(); renderCanvas(); renderInspector();
      return;
    }

    const tokBtn = t.closest('[data-tok]');
    if (tokBtn) {
      const el = document.getElementById(tokBtn.dataset.tok);
      if (el && els.viewport.contains(el)) {
        els.viewport.scrollTo({ top: el.offsetTop - 20, behavior: 'smooth' });
      }
      return;
    }

    const act = t.closest('[data-act]');
    if (act) {
      Promise.resolve(action(act.dataset.act, act)).catch(() => toast('Não foi possível concluir a ação'));
      return;
    }

    const stepBtn = t.closest('[data-step]');
    if (stepBtn) {
      const key = stepBtn.dataset.num;
      const cfg = NUM_CFG[key];
      const input = stepBtn.closest('.stepper').querySelector('input');
      const cur = parseFloat(input.value) || 0;
      const delta = stepBtn.dataset.step === 'inc' ? cfg.step : -cfg.step;
      const next = applyNum(key, cur + delta);
      input.value = next.toFixed(cfg.decimals);
      return;
    }

    if (t.closest('[data-code-tab]')) {
      const which = t.closest('[data-code-tab]').dataset.codeTab;
      const box = t.closest('.sec__body').querySelector('[data-code-pane]');
      if (box) box.textContent = which === 'css' ? EXP.snippetCSS() : EXP.currentCode();
      $$('[data-code-tab]').forEach((b) => b.classList.toggle('is-active', b.dataset.codeTab === which));
      return;
    }

    if (t.closest('#orientBtn')) return toggleOrient();
    if (t.closest('#gridBtn')) {
      state.grid = !state.grid;
      els.viewport.classList.toggle('grid-on', state.grid);
      renderRail();
      return;
    }
    if (t.closest('#importBtn')) return openImportSheet();
    if (t.closest('#exportBtn')) return EXP.openSheet();
    if (t.closest('[data-close-sheet]')) return EXP.closeSheet();
    if (t === els.scrim) return EXP.closeSheet();
    if (t === els.sheet) return EXP.closeSheet();
    if (t.closest('#zoomIn')) return setZoom(state.zoom + 0.1);
    if (t.closest('#zoomOut')) return setZoom(state.zoom - 0.1);
    if (t.closest('#resetZoom')) return setZoom(els.app.classList.contains('is-portrait') ? 0.8 : 1);
    if (t.closest('#uiToggle')) return toggleUi();

    /* navegação em retrato */
    if (els.app.classList.contains('is-portrait')) {
      if (t.closest('.rail__btn') || t.closest('.panel') || t.closest('.inspector')) {
        if (t.closest('.rail__btn')) els.app.classList.remove('show-inspector');
      }
      if (t.closest('#inspectorToggle')) {
        els.app.classList.toggle('show-inspector');
        if (els.app.classList.contains('show-inspector')) els.app.classList.remove('show-panel');
      } else if (t.closest('.canvas__body') && !t.closest('.panel') && !t.closest('.inspector')) {
        els.app.classList.remove('show-panel', 'show-inspector');
      }
    }
  }

  function onInput(e) {
    const el = e.target;
    if (el.id === 'panelQuery') {
      state.queries[state.tab] = el.value;
      const clear = $('#panelQueryClear');
      if (clear) clear.hidden = !el.value;
      renderPanel();
      renderCanvas();
      els.viewport.scrollTop = 0;
      updateFS();
      return;
    }

    if (el.dataset.cp === 'text' && el.closest('.k-cp')) {
      cpSyncText(el);
      return;
    }

    const set = el.dataset.set;
    if (!set) return;

    if (set === 'color') {
      state.overrides.colors[el.dataset.var] = el.value;
      applyTokens();
      if (state.tab === 'tokens') renderCanvas();
      const row = el.closest('.rowk');
      const sw = row && row.querySelector('.swatch');
      if (sw) sw.style.background = el.value;
      const rst = row && row.querySelector('.colorreset');
      if (rst) rst.disabled = false;
      save();
      return;
    }

    if (set === 'num') {
      const key = el.dataset.num;
      const v = parseFloat(el.value);
      if (isNaN(v)) return;
      applyNum(key, v);
      if (key === 'minFont') {
        renderCanvas();
        renderInspector();
      }
      return;
    }
  }

  function onChange(e) {
    const el = e.target;
    if (el.dataset.cp === 'text' && el.closest('.k-cp')) {
      cpNormalizeText(el);
      return;
    }
    const set = el.dataset.set;
    if (!set) return;

    if (set === 'radius') {
      state.overrides.radius = el.value || null;
      applyTokens(); return save();
    }
    if (set === 'density') {
      state.overrides.density = el.value || 'auto';
      applyTokens(); return save();
    }
    if (set === 'font') {
      state.overrides.font = el.value || null;
      applyTokens(); renderPanel(); renderCanvas(); renderInspector(); return save();
    }
    if (set === 'weight') {
      state.overrides.weight = el.value || null;
      applyTokens(); return save();
    }
    if (set === 'texture') {
      state.overrides.texture = el.value || null;
      applyTokens(); save();
      return;
    }
    if (set === 'stageBg') {
      state.overrides.stageBg = el.value;
      applyTokens(); save();
      return;
    }
    if (set === 'shadows') {
      state.overrides.shadows = el.checked;
      applyTokens(); save();
      return;
    }
    if (set === 'upper') {
      state.overrides.upper = el.checked;
      applyTokens(); save();
      return;
    }
    if (set === 'color') {
      state.overrides.colors[el.dataset.var] = el.value;
      applyTokens(); save();
    }
  }

  /* ------------------------------------------------------------------ */
  /* ações                                                               */
  /* ------------------------------------------------------------------ */

  async function action(name, el) {
    if (name === 'use-emoji-library') {
      const id = el && el.dataset.lib;
      if (!id || !CORE.setEmojiLibForStyle(id)) return toast('Biblioteca indisponível');
      renderPanel(); renderInspector();
      const b = ((window.KIT_EMOJI_LIBS || {}).bibliotecas || {})[id] || {};
      return toast('Biblioteca ' + (b.nome || id) + ' aplicada ao estilo');
    }
    if (await EXP.handleAction(name, el)) return;
    if (name === 'use-font') {
      const id = state.fontPreview || state.overrides.font || T.styleById(state.style).font;
      if (!id) return toast('Selecione uma fonte na lista para prévia');
      const f = T.fontById(id);
      state.overrides.font = id;
      state.overrides.minFont = null;
      state.fontPreview = null;
      applyTokens(); renderPanel(); renderCanvas(); renderInspector(); save();
      return toast('Fonte ' + (f ? f.name : id) + ' aplicada ao estilo');
    }
    if (name === 'remove-font') {
      state.overrides.font = null;
      state.overrides.weight = null;
      state.overrides.fsScale = 1;
      state.overrides.minFont = null;
      state.overrides.track = null;
      applyTokens(); renderPanel(); renderCanvas(); renderInspector(); save();
      return toast('Fonte do estilo restaurada');
    }
    if (name === 'set-min-font') {
      const cfg = NUM_CFG.minFont;
      const current = CORE.fontMinPx();
      let v = current;
      if (el.dataset.dir === 'up') v = current + cfg.step;
      else if (el.dataset.dir === 'down') v = current - cfg.step;
      else {
        const input = document.querySelector('input.num[data-num="minFont"]');
        if (input) v = parseFloat(input.value);
      }
      if (!isNaN(v)) {
        state.overrides.minFont = Math.min(cfg.max, Math.max(cfg.min, v));
        applyTokens(); renderCanvas(); renderInspector(); save();
        toast('Tamanho mínimo aplicado: ' + state.overrides.minFont + ' px');
      }
      return;
    }
    if (name === 'reset-colors') {
      state.overrides.colors = {};
      applyTokens(); renderInspector(); save();
      return toast('Cores do estilo restauradas');
    }
    if (name === 'reset-color') {
      delete state.overrides.colors[el.dataset.var];
      applyTokens(); renderInspector(); save();
      return toast('Cor restaurada');
    }
    if (name === 'clear-stagebg') {
      state.overrides.stageBg = null;
      applyTokens(); renderPanel(); renderCanvas(); renderInspector(); save();
      return;
    }
    if (name === 'reset-stage') {
      state.overrides.stage = null;
      state.overrides.stageBg = null;
      applyTokens(); renderPanel(); renderCanvas(); renderInspector(); save();
      return toast('Fundo do estilo restaurado');
    }
    if (name === 'reset-texture') {
      state.overrides.texture = null;
      state.overrides.textureOpacity = null;
      applyTokens();
      renderPanel(); renderCanvas(); renderInspector(); save();
      return toast('Textura do estilo restaurada');
    }
    if (name === 'remove-current') {
      const current = currentRemovable();
      if (!current) return;
      if (current.kind === 'styles') return removeCustomStyle(current.id);
      return removeCustomAsset(current.kind, current.id);
    }
    if (name === 'reset-all') {
      resetOverrides();
      secOpen.clear();
      renderAll();
      return toast('Ajustes descartados');
    }
    if (name === 'toggle-theme-mode') {
      /* A ação depende da natureza do estilo: claro recebe modo escuro,
         escuro recebe modo claro. Um segundo clique volta ao original. */
      const alvo = CORE.styleIsDark() ? 'light' : 'dark';
      state.themeMode = state.themeMode === alvo ? 'auto' : alvo;
      applyTokens();
      renderInspector();
      save();
      if (state.themeMode === 'auto') return toast('Estilo original restaurado');
      return toast(alvo === 'light' ? 'Variante clara ativada na prévia' : 'Variante escura ativada na prévia');
    }
  }


  /* acervos importados - dicas e prompts da janela de importacao */
  const IMPORT_HINTS = {
    icons: {
      label: 'JSON dos ícones',
      placeholder: '{ &quot;id&quot;: &quot;meu-icone&quot;, &quot;label&quot;: &quot;Meu ícone&quot;, &quot;svg&quot;: &quot;&lt;path d=\\&quot;M4 4h16v16H4z\\&quot;/&gt;&quot; }',
      html: 'Um objeto ou uma lista com <code>{ id, label, category, svg, aliases }</code>. O <code>svg</code> é o conteúdo interno de uma tag <code>&lt;svg&gt;</code>; scripts, eventos e URLs <code>javascript:</code> são removidos.',
      prompt: `COMO USAR ESTE PROMPT
 1. Abra o site no Chrome e localize os SVGs usados na interface.
 2. Cole este texto na IA do Chrome e, depois, cole o HTML/CSS do trecho desejado.
 3. Copie o JSON da resposta, volte ao Kit UI → Importar → Ícones e cole.

PROMPT PARA A IA
Você é engenheiro de design systems. Examine o material colado e prepare ícones para entrar no pacote já existente do Kit UI.

Regras:
 1. Responda apenas JSON válido, no formato {"items":[...]}, sem markdown nem comentários.
 2. Cada item: {"id":"slug-minusculo","label":"Nome curto","category":"edit","svg":"conteúdo interno da tag <svg>","aliases":["termo1","termo2"]}.
 3. Aceite só SVGs simples: viewBox 24×24, traço com currentColor, até 8 caminhos, sem gradiente, imagem, filtro ou cor fixa.
 4. Remova <script>, eventos on*, href javascript: e qualquer URL externa. Não invente caminhos.
 5. No campo "_resumo", diga quantos candidatos passaram e quantos foram descartados e por quê, para o operador conferir antes de colar no Kit UI.
 6. Não crie um estilo novo: os ícones são adicionados ao pacote selecionado na ferramenta.
 7. Se não houver candidatos, responda {"items":[],"_resumo":"Nenhum SVG adequado encontrado."}.

Material para examinar:
<cole aqui>`,
    },
    fonts: {
      label: 'JSON das fontes',
      placeholder: '{ &quot;id&quot;: &quot;MinhaFonte&quot;, &quot;name&quot;: &quot;Minha Fonte&quot;, &quot;stack&quot;: &quot;Minha Fonte, sans-serif&quot;, &quot;data&quot;: &quot;data:font/woff2;base64,...&quot; }',
      html: 'Um objeto ou uma lista com <code>{ id, name, stack, cat, data }</code>. O campo <code>data</code> é opcional: se trouxer um data URI <code>font/woff2</code>, a fonte é registrada na hora. Sem ele, o arquivo precisa estar no acervo local.',
      prompt: `COMO USAR ESTE PROMPT
 1. No site, use F12 → aba Rede (Network) para identificar as fontes carregadas (.woff2).
 2. Baixe os arquivos e anote o nome e a pilha CSS de cada uma.
 3. Cole este texto na IA com essa lista, copie o JSON e importe em Fontes.

PROMPT PARA A IA
Você é engenheiro de design systems. Organize as fontes informadas para o catálogo do Kit UI.

Regras:
 1. Responda apenas JSON válido, no formato {"items":[...]}, sem markdown nem comentários.
 2. Cada item: {"id":"slug-minusculo","name":"Nome da fonte","stack":"Nome, sans-serif","cat":"Sans","data":""}.
 3. Use cat apenas como Sans, Serif, Mono ou Display.
 4. Preencha "data" somente se você recebeu um data URI completo iniciado por data:font/woff2. Nunca invente esse dado.
 5. Sem data URI, avise no campo "_aviso" que o arquivo precisa estar no acervo local; o item continua válido.
 6. Não copie URLs externas, trechos de CSS de terceiros nem nomes de arquivos que você não recebeu.

Lista recebida:
<cole aqui>`,
    },
    emojis: {
      label: 'JSON dos emojis',
      placeholder: '{ &quot;e&quot;: &quot;✨&quot;, &quot;name&quot;: &quot;Brilho&quot;, &quot;cat&quot;: &quot;Símbolos e Bandeiras&quot;, &quot;keys&quot;: &quot;brilho estrela&quot; }',
      html: 'Um objeto ou uma lista com <code>{ e, name, cat, keys }</code>. <code>e</code> é o caractere; <code>name</code> é o nome exibido na lista.',
      prompt: `COMO USAR ESTE PROMPT
 1. Escolha os caracteres que quer catalogar (Windows, Android ou iOS).
 2. Cole este texto na IA com a lista de caracteres e nomes desejados.
 3. Copie o JSON da resposta e importe em Emojis.

PROMPT PARA A IA
Você é engenheiro de design systems. Organize caracteres emoji para o catálogo do Kit UI.

Regras:
 1. Responda apenas JSON válido, no formato {"items":[...]}, sem markdown nem comentários.
 2. Cada item: {"e":"✨","name":"Brilho","cat":"Símbolos e Bandeiras","keys":"brilho estrela"}.
 3. "e" é o caractere Unicode (máximo de 8 caracteres); "name" é o nome curto exibido na lista; "keys" são termos de busca separados por espaço.
 4. O Kit UI guarda caracteres, não a arte vetorial da plataforma: não tente desenhar, converter ou descrever SVG.
 5. Não invente caracteres que não foram informados e não inclua textos de páginas.

Lista recebida:
<cole aqui>`,
    },
    textures: {
      label: 'JSON das texturas',
      placeholder: '{ &quot;id&quot;: &quot;minha-textura&quot;, &quot;name&quot;: &quot;Minha textura&quot;, &quot;tokens&quot;: { &quot;--k-texture&quot;: &quot;radial-gradient(...)&quot;, &quot;--k-texture-size&quot;: &quot;20px 20px&quot; } }',
      html: 'Um objeto ou uma lista com <code>{ id, name, cat, desc, tokens }</code>. <code>tokens</code> precisa conter <code>--k-texture</code>; opcionalmente <code>--k-texture-size</code>.',
      prompt: `COMO USAR ESTE PROMPT
 1. Descreva a textura desejada (padrão, cor, densidade) e peça a uma IA secundária que gere o CSS.
 2. Cole este texto na IA junto com o CSS recebido.
 3. Copie o JSON da resposta e importe em Texturas. O Kit UI só cataloga: não edita a textura.

PROMPT PARA A IA
Você é engenheiro de design systems. Converta o CSS de textura recebido em itens do catálogo do Kit UI.

Regras:
 1. Responda apenas JSON válido, no formato {"items":[...]}, sem markdown nem comentários.
 2. Cada item: {"id":"slug-minusculo","name":"Nome curto","cat":"Importada","desc":"Frase objetiva","tokens":{"--k-texture":"radial-gradient(...)","--k-texture-size":"20px 20px"}}.
 3. "tokens" precisa conter --k-texture; --k-texture-size é opcional.
 4. Use só CSS puro: gradientes, repeating-linear-gradient ou radial-gradient. Sem url() externa, sem data URI e sem JavaScript.
 5. Preserve o CSS recebido; não invente cores ou medidas. Se o CSS não servir, responda {"items":[],"_aviso":"motivo"}.

CSS recebido:
<cole aqui>`,
    },
    stages: {
      label: 'JSON dos fundos',
      placeholder: '{ &quot;id&quot;: &quot;meu-fundo&quot;, &quot;name&quot;: &quot;Meu fundo&quot;, &quot;tone&quot;: &quot;claro&quot;, &quot;value&quot;: &quot;linear-gradient(135deg, #fff, #ddd)&quot; }',
      html: 'Um objeto ou uma lista com <code>{ id, name, desc, tone, value }</code>. <code>value</code> deve ser uma cor ou gradiente CSS; URLs externas não são aceitas.',
      prompt: `COMO USAR ESTE PROMPT
 1. Descreva o fundo desejado e peça a uma IA secundária o CSS da cor ou do gradiente.
 2. Cole este texto na IA junto com o CSS recebido.
 3. Copie o JSON da resposta e importe em Fundos. O Kit UI só cataloga.

PROMPT PARA A IA
Você é engenheiro de design systems. Converta o fundo recebido em itens do catálogo do Kit UI.

Regras:
 1. Responda apenas JSON válido, no formato {"items":[...]}, sem markdown nem comentários.
 2. Cada item: {"id":"slug-minusculo","name":"Nome curto","desc":"Frase objetiva","tone":"claro","value":"linear-gradient(135deg, #fff, #ddd)"}.
 3. "tone" é exatamente "claro" ou "escuro". "value" é uma cor CSS ou um gradiente linear-gradient, radial-gradient ou conic-gradient.
 4. Não use url(), endereços externos, data URI, imagem ou JavaScript.
 5. Preserve o valor recebido; se não houver valor válido, responda {"items":[],"_aviso":"motivo"}.

CSS recebido:
<cole aqui>`,
    },
  };


  function removeCustomAsset(kind, id) {
    const list = customAssets[kind];
    if (!list) return;
    const i = list.findIndex((x) => String(x.id) === String(id));
    if (i < 0) return;
    const item = list[i];
    const name = assetName(kind, item);
    if (!window.confirm('Remover “' + name + '”?')) return;
    list.splice(i, 1);
    const removedId = String(item.id);

    if (kind === 'icons' && String(state.icon) === removedId) {
      state.icon = (IC.icons[0] || {}).id || state.icon;
    } else if (kind === 'fonts' && String(state.overrides.font || T.styleById(state.style).font) === removedId) {
      state.overrides.font = null;
    } else if (kind === 'emojis' && item.e === state.emoji) {
      state.emoji = (E.items[0] || {}).e || state.emoji;
    } else if (kind === 'textures' && String(state.overrides.texture) === removedId) {
      state.overrides.texture = null;
      state.overrides.textureOpacity = null;
    } else if (kind === 'stages' && String(state.overrides.stage) === removedId) {
      state.overrides.stage = null;
      state.overrides.stageBg = null;
    }

    rebuildCustomAssets();
    saveCustomAssets();
    save();
    renderAll();
    toast('Item removido');
  }

  /* ------------------------------------------------------------------ */
  /* janela de importação                                                 */
  /* ------------------------------------------------------------------ */

  function moduloImportacao() {
    return IMPORT_MODULES[importKind] || null;
  }

  function promptImportacao() {
    const mod = moduloImportacao();
    if (mod && mod.prompt) return mod.prompt;
    const hint = IMPORT_HINTS[importKind];
    return hint && hint.prompt ? hint.prompt : '';
  }

  function copyPrompt() {
    const text = promptImportacao();
    if (text) EXP.copy(text, 'Prompt copiado — cole na IA do Chrome');
  }

  function openImportSheet() {
    const mod = moduloImportacao();
    const hint = mod ? mod.hint : IMPORT_HINTS[importKind];
    const types = IMPORT_KINDS.map(
      (k) => '<button class="imp__type' + (k.id === importKind ? ' is-active' : '') + '" data-import-kind="' + k.id + '">' + k.label + '</button>'
    ).join('');
    const steps = mod && mod.steps
      ? '<div class="imp__steps"><b>Como extrair</b>' + mod.steps + '</div>'
      : '<div class="imp__steps"><b>Formato aceito</b><div>' + hint.html + '</div></div>';
    const extraHint = mod
      ? hint.html
      : 'Itens com o mesmo <code>id</code> são substituídos. Para remover um ativo importado, selecione-o na aba correspondente e use <b>Remover</b> no fim de Propriedades.';
    const promptBtn = promptImportacao()
      ? '<button class="minibtn imp__promptbtn" data-copy-prompt>' + UI.icon('text') + 'Copiar prompt p/ IA</button>'
      : '';

    els.sheet.innerHTML =
      '<div class="sheet__card sheet__card--wide">' +
      '<div class="sheet__head"><div><div class="sheet__title">Importar</div>' +
      '<div class="sheet__sub">Escolha o tipo de ativo e cole o JSON correspondente.</div></div>' +
      '<button class="iconbtn iconbtn--sm" data-close-sheet aria-label="Fechar">' + UI.icon('close') + '</button></div>' +
      '<div class="sheet__body">' +
      '<div class="imp__label">Tipo de ativo</div>' +
      '<div class="imp__types">' + types + '</div>' +
      steps +
      '<label class="imp__label" for="importStyleText">' + hint.label + '</label>' +
      '<textarea class="imp__area" id="importStyleText" spellcheck="false" placeholder="' + hint.placeholder + '"></textarea>' +
      '<div class="imp__hint">' + extraHint + '</div>' +
      '<div class="imp__error" id="importStyleError" hidden></div>' +
      '</div>' +
      '<div class="sheet__foot">' + promptBtn +
      '<button class="minibtn" data-close-sheet>Cancelar</button>' +
      '<button class="minibtn minibtn--accent" data-import-run>' + UI.icon('export') + 'Importar</button></div>' +
      '</div>';
    els.sheet.classList.add('is-on');
    els.scrim.classList.add('is-on');
    const ta = $('#importStyleText');
    if (ta) ta.focus();
  }

  function importError(msg) {
    const box = $('#importStyleError');
    if (!box) return;
    box.textContent = msg;
    box.hidden = false;
  }

  function runImport() {
    const mod = moduloImportacao();
    if (mod) return runModuleImport(mod);
    return runAssetImport();
  }

  /* O módulo da aba valida, normaliza e grava o arquivo. Aqui apenas
     refletimos o resultado na memória e na interface. */
  async function runModuleImport(mod) {
    const ta = $('#importStyleText');
    const raw = ta ? ta.value.trim() : '';
    if (!raw) return importError('Cole o JSON antes de importar.');
    const ids = T.STYLES.concat(customStyles).map((s) => s.id);
    const result = await mod.importar(raw, ids);
    if (!result.ok) return importError(result.error);
    const item = result.style;
    const existing = customStyles.findIndex((s) => s.id === item.id);
    if (existing >= 0) customStyles.splice(existing, 1);
    const ti = T.STYLES.findIndex((s) => s.id === item.id);
    if (ti >= 0) T.STYLES.splice(ti, 1);
    customStyles.push(item);
    T.STYLES.push(item);
    sortStyles();
    saveCustomStyles();
    EXP.closeSheet();
    setStyle(item.id);
    toast('“' + item.name + '” importado' + (result.file ? ' · ' + result.file : ''));
  }

  function runAssetImport() {
    const ta = $('#importStyleText');
    const raw = ta ? ta.value.trim() : '';
    if (!raw) return importError('Cole o JSON antes de importar.');
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      return importError('JSON inválido: ' + e.message);
    }
    const arr = Array.isArray(data) ? data : data && Array.isArray(data.items) ? data.items : [data];
    if (!arr.length) return importError('Nenhum item encontrado no JSON.');
    const items = [];
    for (const entry of arr) {
      const item = normalizeAsset(importKind, entry);
      if (!item) return importError('Item inválido para este tipo de ativo. Verifique o formato.');
      items.push(item);
    }
    const list = customAssets[importKind];
    items.forEach((item) => {
      const i = list.findIndex((x) => String(x.id) === String(item.id));
      if (i >= 0) list[i] = item;
      else list.push(item);
    });
    rebuildCustomAssets();
    const saved = saveCustomAssets();
    renderAll();
    if (!saved) return importError('Importado nesta sessão, mas não foi possível salvar no navegador (espaço insuficiente).');
    EXP.closeSheet();
    const label = (IMPORT_KINDS.find((k) => k.id === importKind) || IMPORT_KINDS[0]).label;
    toast(items.length + (items.length === 1 ? ' item importado' : ' itens importados') + ' · ' + label);
  }

  async function removeCustomStyle(id) {
    if (!isCustomStyle(id)) return;
    const st = T.styleById(id);
    if (!window.confirm('Remover o estilo “' + st.name + '” e seu arquivo em importados?')) return;
    const removed = await IMP.remover(id);
    if (!removed.ok) {
      const why = removed.data && removed.data.error ? removed.data.error : 'o servidor local não respondeu';
      return toast('Não foi possível remover o arquivo: ' + why);
    }
    const ti = T.STYLES.findIndex((s) => s.id === id);
    if (ti >= 0) T.STYLES.splice(ti, 1);
    sortStyles();
    const ci = customStyles.findIndex((s) => s.id === id);
    if (ci >= 0) customStyles.splice(ci, 1);
    saveCustomStyles();
    if (state.style === id) {
      state.style = T.STYLES[0].id;
      resetOverrides();
      save();
    }
    renderAll();
    toast('Estilo e arquivo removidos');
  }

  /* ------------------------------------------------------------------ */
  /* barra de rolagem visual                                             */
  /* ------------------------------------------------------------------ */

  /* ------------------------------------------------------------------ */

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootstrap);
  else bootstrap();
})();