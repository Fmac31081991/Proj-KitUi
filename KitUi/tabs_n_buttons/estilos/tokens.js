/* Modelo de tokens do kit. Tudo o que um estilo define são valores deste mapa.
   Os componentes em kit.css consomem apenas estas variáveis. */
(function () {
  'use strict';

  const SP = {
    '--k-sp-1': '4px',
    '--k-sp-2': '8px',
    '--k-sp-3': '16px',
    '--k-sp-4': '24px',
    '--k-sp-5': '32px',
    '--k-sp-6': '48px',
    '--k-sp-7': '64px',
  };

  const BASE = Object.assign(
    {
      '--k-bg': '#ffffff',
      '--k-surface': '#ffffff',
      '--k-surface-2': '#f4f5f7',
      '--k-text': '#14161a',
      '--k-muted': '#666d78',
      '--k-border': '#e3e6eb',
      '--k-primary': '#2f6fed',
      '--k-on-primary': '#ffffff',
      '--k-accent': '#7c5cff',
      '--k-on-accent': '#ffffff',
      '--k-danger': '#d92d20',
      '--k-on-danger': '#ffffff',
      '--k-success': '#12805c',
      '--k-on-success': '#ffffff',
      '--k-focus': '#2f6fed',

      '--k-radius-xs': '3px',
      '--k-radius-sm': '6px',
      '--k-radius-md': '10px',
      '--k-radius-lg': '16px',
      '--k-radius-pill': '999px',
      '--k-radius-round': '999px',
      '--k-bw': '1px',

      '--k-shadow-sm': '0 1px 2px rgba(16,24,40,.06)',
      '--k-shadow-md': '0 6px 18px rgba(16,24,40,.10)',
      '--k-shadow-inset': 'inset 0 1px 0 rgba(255,255,255,.55)',
      '--k-btn-shadow': 'none',
      '--k-btn-shadow-hover': 'none',
      '--k-btn-hover-transform': 'translateY(-1px)',
      '--k-btn-active-transform': 'translateY(0)',
      '--k-field-inset': 'none',
      '--k-blur': '0px',
      '--k-saturate': '1',

      '--k-gap': '16px',
      '--k-pad': '20px',
      '--k-pad-x': '16px',
      '--k-pad-y': '9px',
      '--k-control-h': '40px',
      '--k-icon-size': '18px',
      '--k-icon-size-sm': '15px',
      '--k-icon-size-lg': '22px',
      '--k-icon-size-xl': '28px',
      '--k-choice-size': '20px',
      '--k-switch-w': '42px',
      '--k-switch-h': '24px',
      '--k-switch-knob': '18px',
      '--k-card-pad': '20px',
      '--k-section-pad': '28px',

      '--k-font': 'Inter, ui-sans-serif, system-ui, "Segoe UI", sans-serif',
      '--k-font-mono': '"JetBrains Mono", ui-monospace, "Cascadia Code", Consolas, monospace',
      '--k-fs': '15px',
      '--k-fs-sm': '12.5px',
      '--k-fs-compact': '11.5px',
      '--k-fs-lg': '17px',
      '--k-fs-h1': '30px',
      '--k-fs-h2': '22px',
      '--k-fs-h3': '17px',
      '--k-lh': '1.55',
      '--k-weight': '400',
      '--k-weight-strong': '600',
      '--k-weight-label': '600',
      '--k-track': '0em',
      '--k-transform': 'none',
      '--k-dur': '160ms',
      '--k-ease': 'cubic-bezier(.2,.7,.3,1)',

      '--k-stage-bg': '#eceef2',
      '--k-texture': 'none',
      '--k-texture-size': '24px 24px',
      '--k-texture-opacity': '1',
      '--k-stage-vignette': 'none',
    },
    SP
  );

  /* Cada estilo sobrescreve apenas o que o define. */
  const STYLES = [];

  const RADIUS_SETS = {
    sharp: { '--k-radius-xs': '0px', '--k-radius-sm': '2px', '--k-radius-md': '4px', '--k-radius-lg': '6px' },
    soft: { '--k-radius-xs': '4px', '--k-radius-sm': '8px', '--k-radius-md': '12px', '--k-radius-lg': '16px' },
    round: { '--k-radius-xs': '8px', '--k-radius-sm': '12px', '--k-radius-md': '18px', '--k-radius-lg': '24px' },
    pill: { '--k-radius-xs': '12px', '--k-radius-sm': '18px', '--k-radius-md': '26px', '--k-radius-lg': '34px' },
  };

  const DENSITIES = {
    compact: { '--k-control-h': '34px', '--k-pad-x': '12px', '--k-pad-y': '6px', '--k-pad': '16px', '--k-card-pad': '16px', '--k-gap': '10px', '--k-fs': '14px', '--k-section-pad': '20px' },
    regular: { '--k-control-h': '40px', '--k-pad-x': '16px', '--k-pad-y': '9px', '--k-pad': '20px', '--k-card-pad': '20px', '--k-gap': '16px', '--k-fs': '15px', '--k-section-pad': '28px' },
    comfortable: { '--k-control-h': '46px', '--k-pad-x': '20px', '--k-pad-y': '12px', '--k-pad': '28px', '--k-card-pad': '26px', '--k-gap': '20px', '--k-fs': '16px', '--k-section-pad': '36px' },
  };

  const COLOR_ROLES = [
    { key: 'bg', varName: '--k-bg', label: 'Fundo' },
    { key: 'surface', varName: '--k-surface', label: 'Superfície' },
    { key: 'surface2', varName: '--k-surface-2', label: 'Superfície 2' },
    { key: 'text', varName: '--k-text', label: 'Texto' },
    { key: 'muted', varName: '--k-muted', label: 'Texto suave' },
    { key: 'border', varName: '--k-border', label: 'Borda' },
    { key: 'primary', varName: '--k-primary', label: 'Primária' },
    { key: 'onPrimary', varName: '--k-on-primary', label: 'Sobre primária' },
    { key: 'accent', varName: '--k-accent', label: 'Destaque' },
    { key: 'onAccent', varName: '--k-on-accent', label: 'Sobre destaque' },
    { key: 'danger', varName: '--k-danger', label: 'Perigo' },
    { key: 'success', varName: '--k-success', label: 'Sucesso' },
    { key: 'focus', varName: '--k-focus', label: 'Foco' },
  ];

  STYLES.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }));

  window.KIT_TOKENS = {
    BASE,
    STYLES,
    RADIUS_SETS,
    DENSITIES,
    COLOR_ROLES,
    styleById: (id) => STYLES.find((s) => s.id === id) || STYLES[0],
  };
})();
