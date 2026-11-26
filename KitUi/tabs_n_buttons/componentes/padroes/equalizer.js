/* equalizer.js — comportamento do componente Equalizador Gráfico.
   Todo o estado vive nos atributos data-eq-* do próprio markup: nada é gravado
   em JSON, token ou localStorage. O áudio é criado sob demanda, somente quando
   a pessoa clica em "Ouvir" (gesto do usuário), e usa ruído local gerado na hora. */
(function () {
  'use strict';

  const C = window.KIT_COMPONENTS || {};
  const SPECS = C.EQ_SPECS || [];
  const Q_BY_ID = { eq6: 0.95, eq15: 2.1, eq31: 4.3 };
  const DETENT = 0.35;       // dB: dentro disso o fader encosta no centro
  const QUARTER = 0.25;      // resolução do arraste
  const STEP = 0.5;          // passo do teclado
  const AUDITION_GAIN = 0.04;

  const fmt = (n) => (Math.round(n * 10) / 10).toFixed(1).replace('.', ',');
  const fmtScale = (n) => (Number.isInteger(n) ? String(n) : fmt(n));
  const clamp = (v, max) => Math.max(-max, Math.min(max, v));
  const detent = (v) => (Math.abs(v) < DETENT ? 0 : v);
  const tracks = (root) => Array.prototype.slice.call(root.querySelectorAll('[data-eq-track]'));
  const maxDb = (root) => +root.dataset.eqRange || 12;
  const specOf = (root) => {
    const id = root.dataset.eqSpec;
    const spec = SPECS.filter((s) => s.id === id)[0];
    return { q: spec ? spec.q : 2, bands: spec ? spec.bands : [] };
  };

  function paintTrack(root, tr) {
    const max = maxDb(root);
    const db = +tr.dataset.eqDb || 0;
    const pct = ((max - db) / (max * 2)) * 100;
    const mid = 50;
    const thumb = tr.querySelector('[data-eq-thumb]');
    const fill = tr.querySelector('[data-eq-fill]');
    const out = tr.parentElement.querySelector('[data-eq-dbout]');
    if (thumb) thumb.style.top = pct + '%';
    if (fill) {
      fill.style.top = Math.min(pct, mid) + '%';
      fill.style.height = Math.abs(pct - mid) + '%';
    }
    if (out) out.textContent = (db > 0 ? '+' : '') + fmt(db);
    tr.classList.toggle('is-zero', db === 0);
    tr.setAttribute('aria-valuenow', String(db));
    tr.setAttribute('aria-valuemin', String(-max));
    tr.setAttribute('aria-valuemax', String(max));
    tr.setAttribute('aria-valuetext', fmt(db) + ' dB');
  }

  function paintAll(root) {
    const max = maxDb(root);
    const half = max / 2;
    const vals = [max, half, 0, -half, -max];
    const labels = root.querySelectorAll('[data-eq-scale] span');
    for (let i = 0; i < labels.length && i < vals.length; i++) {
      labels[i].textContent = (vals[i] > 0 ? '+' : '') + fmtScale(vals[i]);
    }
    tracks(root).forEach((tr) => paintTrack(root, tr));
    const out = root.querySelector('[data-eq-out-out]');
    if (out) out.textContent = (+root.dataset.eqOut > 0 ? '+' : '') + fmt(+root.dataset.eqOut) + ' dB';
    const input = root.querySelector('[data-eq-out-input]');
    if (input) input.value = root.dataset.eqOut;
    const bypassed = root.dataset.eqBypass === 'true';
    root.classList.toggle('is-bypassed', bypassed);
    root.querySelectorAll('[data-eq-act="bypass"]').forEach((b) => b.setAttribute('aria-pressed', String(bypassed)));
    root.querySelectorAll('[data-eq-act="range"]').forEach((b) => b.classList.toggle('is-active', +b.dataset.eqValue === max));
    syncAudio(root);
  }

  function setDb(root, tr, db) {
    const v = detent(clamp(Math.round(db / QUARTER) * QUARTER, maxDb(root)));
    tr.dataset.eqDb = String(v);
    paintTrack(root, tr);
    syncAudio(root);
  }

  /* ---------------- áudio: peaking em cascata + bypass + trim ---------------- */

  function ensureAudio(root) {
    if (root._eqAudio) return root._eqAudio;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    const ctx = new Ctx();
    const spec = specOf(root);
    const list = tracks(root);
    const filters = list.map((tr) => {
      const f = ctx.createBiquadFilter();
      f.type = 'peaking';
      f.frequency.value = +tr.dataset.eqHz;
      f.Q.value = spec.q;
      f.gain.value = +tr.dataset.eqDb || 0;
      return f;
    });
    const dry = ctx.createGain();
    const wet = ctx.createGain();
    const trim = ctx.createGain();
    const master = ctx.createGain();
    dry.gain.value = 1;
    wet.gain.value = 0;
    master.gain.value = AUDITION_GAIN;
    master.connect(trim);
    trim.connect(ctx.destination);

    const len = Math.floor(ctx.sampleRate * 2);
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let brown = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      brown = (brown + 0.02 * white) / 1.02;
      data[i] = white * 0.5 + brown * 3;
    }
    const a = { ctx: ctx, buffer: buffer, filters: filters, dry: dry, wet: wet, trim: trim, src: null };
    root._eqAudio = a;
    return a;
  }

  function startSource(a) {
    const src = a.ctx.createBufferSource();
    src.buffer = a.buffer;
    src.loop = true;
    src.connect(a.dry);
    if (a.filters.length) src.connect(a.filters[0]);
    else src.connect(a.wet);
    for (let i = 0; i < a.filters.length - 1; i++) a.filters[i].connect(a.filters[i + 1]);
    if (a.filters.length) a.filters[a.filters.length - 1].connect(a.wet);
    src.start();
    a.src = src;
  }

  function stopSource(a) {
    if (!a || !a.src) return;
    try { a.src.stop(); } catch (_) { /* já parou */ }
    try { a.src.disconnect(); } catch (_) { /* já desconectou */ }
    a.src = null;
  }

  function syncAudio(root) {
    const a = root._eqAudio;
    if (!a) return;
    const now = a.ctx.currentTime;
    const list = tracks(root);
    a.filters.forEach((f, i) => {
      const tr = list[i];
      if (tr) f.gain.setTargetAtTime(+tr.dataset.eqDb || 0, now, 0.02);
    });
    const bypassed = root.dataset.eqBypass === 'true';
    a.dry.gain.setTargetAtTime(bypassed ? 1 : 0, now, 0.02);
    a.wet.gain.setTargetAtTime(bypassed ? 0 : 1, now, 0.02);
    a.trim.gain.setTargetAtTime(Math.pow(10, (+root.dataset.eqOut || 0) / 20), now, 0.02);
  }

  let listening = null;

  function stopListen(root) {
    if (!root) return;
    stopSource(root._eqAudio);
    root._eqListening = false;
    const btn = root.querySelector('[data-eq-act="listen"]');
    if (btn) {
      btn.classList.remove('is-active');
      btn.setAttribute('aria-pressed', 'false');
      btn.textContent = 'Ouvir';
    }
    if (listening === root) listening = null;
  }

  function stopAll() {
    if (listening) stopListen(listening);
    Array.prototype.slice.call(document.querySelectorAll('[data-eq-root]')).forEach(stopListen);
  }

  async function toggleListen(root) {
    if (root._eqListening) { stopListen(root); return; }
    if (listening) stopListen(listening);
    const a = ensureAudio(root);
    if (!a) return;
    try { await a.ctx.resume(); } catch (_) { /* context já ativo */ }
    startSource(a);
    root._eqListening = true;
    listening = root;
    syncAudio(root);
    const btn = root.querySelector('[data-eq-act="listen"]');
    if (btn) {
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      btn.textContent = 'Parar';
    }
  }

  /* ---------------- eventos delegados (sobrevive ao re-render do #kit) ------- */

  let drag = null;

  function applyPointer(e) {
    if (!drag) return;
    const r = drag.rect;
    const y = Math.max(0, Math.min(r.height, e.clientY - r.top));
    setDb(drag.root, drag.tr, maxDb(drag.root) - (y / r.height) * maxDb(drag.root) * 2);
  }

  document.addEventListener('pointerdown', (e) => {
    const tr = e.target.closest && e.target.closest('[data-eq-track]');
    if (!tr) return;
    const root = tr.closest('[data-eq-root]');
    if (!root) return;
    e.preventDefault();
    tr.focus();
    drag = { root: root, tr: tr, rect: tr.getBoundingClientRect() };
    applyPointer(e);
  });
  document.addEventListener('pointermove', (e) => { if (drag) applyPointer(e); });
  document.addEventListener('pointerup', () => { drag = null; });
  document.addEventListener('pointercancel', () => { drag = null; });

  document.addEventListener('keydown', (e) => {
    const tr = e.target.closest && e.target.closest('[data-eq-track]');
    if (!tr) return;
    const root = tr.closest('[data-eq-root]');
    if (!root) return;
    const cur = +tr.dataset.eqDb || 0;
    let next = cur;
    if (e.key === 'ArrowUp') next = cur + STEP;
    else if (e.key === 'ArrowDown') next = cur - STEP;
    else if (e.key === 'Home') next = maxDb(root);
    else if (e.key === 'End') next = -maxDb(root);
    else return;
    e.preventDefault();
    setDb(root, tr, next);
  });

  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-eq-act]');
    if (!b) return;
    const root = b.closest('[data-eq-root]');
    if (!root) return;
    const act = b.dataset.eqAct;
    if (act === 'range') {
      root.dataset.eqRange = b.dataset.eqValue;
      const list = tracks(root);
      list.forEach((tr) => { if (Math.abs(+tr.dataset.eqDb) > maxDb(root)) setDb(root, tr, +tr.dataset.eqDb); });
      paintAll(root);
    } else if (act === 'bypass') {
      root.dataset.eqBypass = root.dataset.eqBypass === 'true' ? 'false' : 'true';
      paintAll(root);
    } else if (act === 'reset') {
      tracks(root).forEach((tr) => { tr.dataset.eqDb = '0'; paintTrack(root, tr); });
      syncAudio(root);
    } else if (act === 'listen') {
      toggleListen(root);
    }
  });

  document.addEventListener('input', (e) => {
    const input = e.target.closest && e.target.closest('[data-eq-out-input]');
    if (!input) return;
    const root = input.closest('[data-eq-root]');
    if (!root) return;
    root.dataset.eqOut = String(clamp(parseFloat(input.value) || 0, 12));
    paintAll(root);
  });

  window.KIT_EQ = { SPECS: SPECS, Q_BY_ID: Q_BY_ID, stopAll: stopAll, stopListen: stopListen };
}());
