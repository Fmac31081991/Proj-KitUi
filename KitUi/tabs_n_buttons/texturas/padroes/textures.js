/* Acervo local de texturas do palco. */
(function () {
  'use strict';

  /* Texturas do palco: cada preset só troca variáveis --k-texture*.
     As texturas em gradiente usam --k-text misturado no fundo, então ficam
     legíveis tanto em palcos claros quanto escuros. As texturas em SVG
     carregam cor neutra fixa (cinza médio), visível nos dois casos. */
  const TEXTURES = {
    none: { '--k-texture': 'none' },
    dots: {
      '--k-texture': 'radial-gradient(color-mix(in srgb, var(--k-text) 22%, transparent) 1.2px, transparent 1.3px)',
      '--k-texture-size': '20px 20px',
    },
    grid: {
      '--k-texture':
        'linear-gradient(color-mix(in srgb, var(--k-text) 11%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--k-text) 11%, transparent) 1px, transparent 1px)',
      '--k-texture-size': '28px 28px',
    },
    lines: {
      '--k-texture': 'repeating-linear-gradient(45deg, color-mix(in srgb, var(--k-text) 10%, transparent) 0 1px, transparent 1px 12px)',
      '--k-texture-size': 'auto',
    },
    noise: {
      '--k-texture':
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='.34'/%3E%3C/svg%3E\")",
      '--k-texture-size': '140px 140px',
    },
    blueprint: {
      '--k-texture':
        'linear-gradient(color-mix(in srgb, var(--k-text) 15%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--k-text) 15%, transparent) 1px, transparent 1px), linear-gradient(color-mix(in srgb, var(--k-text) 6%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--k-text) 6%, transparent) 1px, transparent 1px)',
      '--k-texture-size': '64px 64px, 64px 64px, 8px 8px, 8px 8px',
    },
    cross: {
      '--k-texture':
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28'%3E%3Cpath d='M14 9v10M9 14h10' stroke='%238B93A5' stroke-width='1.4' stroke-linecap='round' opacity='.6'/%3E%3C/svg%3E\")",
      '--k-texture-size': '28px 28px',
    },
    waves: {
      '--k-texture': 'repeating-radial-gradient(circle at 50% 130%, color-mix(in srgb, var(--k-text) 17%, transparent) 0 2px, transparent 2px 18px)',
      '--k-texture-size': 'auto',
    },
    paper: {
      '--k-texture': 'repeating-linear-gradient(0deg, color-mix(in srgb, var(--k-text) 13%, transparent) 0 1px, transparent 1px 22px)',
      '--k-texture-size': 'auto',
    },
    mesh: {
      '--k-texture':
        'radial-gradient(circle at 20% 30%, color-mix(in srgb, var(--k-text) 24%, transparent) 0 1.6px, transparent 2.6px), radial-gradient(circle at 70% 65%, color-mix(in srgb, var(--k-text) 18%, transparent) 0 1.6px, transparent 2.6px)',
      '--k-texture-size': '96px 96px, 132px 132px',
    },
    halftone: {
      '--k-texture': 'radial-gradient(color-mix(in srgb, var(--k-text) 28%, transparent) 1.5px, transparent 1.6px)',
      '--k-texture-size': '12px 12px',
    },
    skyline: {
      '--k-texture':
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='96'%3E%3Cg fill='%238B93A5' opacity='.32'%3E%3Crect x='2' y='60' width='16' height='36'/%3E%3Crect x='21' y='46' width='11' height='50'/%3E%3Crect x='35' y='68' width='18' height='28'/%3E%3Crect x='56' y='38' width='13' height='58'/%3E%3Crect x='72' y='56' width='10' height='40'/%3E%3Crect x='85' y='44' width='15' height='52'/%3E%3Crect x='103' y='62' width='15' height='34'/%3E%3C/g%3E%3Cg stroke='%238B93A5' stroke-width='1.6' opacity='.42'%3E%3Cpath d='M62 24v14M97 30v14'/%3E%3C/g%3E%3C/svg%3E\")",
      '--k-texture-size': '120px 96px',
    },
    stars: {
      '--k-texture':
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Cg fill='%238B93A5'%3E%3Cpath d='M15 5l1.7 5.6L22 12.3l-5.3 1.7L15 19.6l-1.7-5.6L8 12.3l5.3-1.7z' opacity='.6'/%3E%3Cpath d='M41 27l1.2 3.9 3.8 1.2-3.8 1.2L41 37.2l-1.2-3.9-3.8-1.2 3.8-1.2z' opacity='.45'/%3E%3Ccircle cx='31' cy='13' r='1.5' opacity='.45'/%3E%3Ccircle cx='9' cy='42' r='1.2' opacity='.38'/%3E%3Ccircle cx='48' cy='47' r='1.8' opacity='.32'/%3E%3C/g%3E%3C/svg%3E\")",
      '--k-texture-size': '56px 56px',
    },
    moon: {
      '--k-texture':
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cpath d='M39 8a19 19 0 1 0 0 38 23 23 0 0 1 0-38z' fill='%238B93A5' opacity='.45'/%3E%3Ccircle cx='50' cy='13' r='1.7' fill='%238B93A5' opacity='.5'/%3E%3Ccircle cx='56' cy='24' r='1.1' fill='%238B93A5' opacity='.42'/%3E%3Cpath d='M14 40l1 3 3 1-3 1-1 3-1-3-3-1 3-1z' fill='%238B93A5' opacity='.4'/%3E%3C/svg%3E\")",
      '--k-texture-size': '64px 64px',
    },
    flowers: {
      '--k-texture':
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72'%3E%3Cg fill='%238B93A5' opacity='.4' transform='translate(14 14)'%3E%3Ccircle cx='0' cy='5' r='3.3'/%3E%3Ccircle cx='-4.4' cy='1.7' r='3.3'/%3E%3Ccircle cx='-2.7' cy='-3.4' r='3.3'/%3E%3Ccircle cx='2.7' cy='-3.4' r='3.3'/%3E%3Ccircle cx='4.4' cy='1.7' r='3.3'/%3E%3C/g%3E%3Ccircle cx='14' cy='14' r='2.2' fill='%238B93A5' opacity='.55'/%3E%3Cg fill='%238B93A5' opacity='.3' transform='translate(46 44) scale(.72)'%3E%3Ccircle cx='0' cy='5' r='3.3'/%3E%3Ccircle cx='-4.4' cy='1.7' r='3.3'/%3E%3Ccircle cx='-2.7' cy='-3.4' r='3.3'/%3E%3Ccircle cx='2.7' cy='-3.4' r='3.3'/%3E%3Ccircle cx='4.4' cy='1.7' r='3.3'/%3E%3C/g%3E%3Ccircle cx='46' cy='44' r='1.6' fill='%238B93A5' opacity='.45'/%3E%3Cg fill='%238B93A5' opacity='.24' transform='translate(60 14) scale(.48)'%3E%3Ccircle cx='0' cy='5' r='3.3'/%3E%3Ccircle cx='-4.4' cy='1.7' r='3.3'/%3E%3Ccircle cx='-2.7' cy='-3.4' r='3.3'/%3E%3Ccircle cx='2.7' cy='-3.4' r='3.3'/%3E%3Ccircle cx='4.4' cy='1.7' r='3.3'/%3E%3C/g%3E%3C/svg%3E\")",
      '--k-texture-size': '72px 72px',
    },
    floral: {
      '--k-texture':
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Cg stroke='%238B93A5' fill='none' opacity='.45'%3E%3Cpath d='M-4 78c16-4 24-14 32-26s18-18 30-16 26 8 42 4' stroke-width='1.2'/%3E%3Cellipse cx='27' cy='52' rx='7' ry='3.2' transform='rotate(-38 27 52)' fill='%238B93A5' stroke='none' opacity='.55'/%3E%3Cellipse cx='49' cy='31' rx='7' ry='3' transform='rotate(-52 49 31)' fill='%238B93A5' stroke='none' opacity='.48'/%3E%3Cellipse cx='71' cy='34' rx='6.5' ry='2.8' transform='rotate(24 71 34)' fill='%238B93A5' stroke='none' opacity='.42'/%3E%3Cellipse cx='37' cy='66' rx='6' ry='2.6' transform='rotate(18 37 66)' fill='%238B93A5' stroke='none' opacity='.38'/%3E%3Ccircle cx='36' cy='60' r='2.4' fill='%238B93A5' stroke='none' opacity='.45'/%3E%3Ccircle cx='58' cy='33' r='1.8' fill='%238B93A5' stroke='none' opacity='.4'/%3E%3C/g%3E%3C/svg%3E\")",
      '--k-texture-size': '96px 96px',
    },
    arabesque: {
      '--k-texture':
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cg stroke='%238B93A5' fill='none' opacity='.42'%3E%3Cpath d='M32 2c0 16.6-13.4 30-30 30 16.6 0 30 13.4 30 30 0-16.6 13.4-30 30-30-16.6 0-30-13.4-30-30z' stroke-width='1.1'/%3E%3Ccircle cx='32' cy='32' r='9' stroke-width='1'/%3E%3Cpath d='M32 0v64M0 32h64' stroke-width='.7' opacity='.6'/%3E%3C/g%3E%3Ccircle cx='32' cy='32' r='2' fill='%238B93A5' opacity='.5'/%3E%3C/svg%3E\")",
      '--k-texture-size': '64px 64px',
    },
    kids: {
      '--k-texture':
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cg opacity='.6'%3E%3Ccircle cx='18' cy='17' r='6.5' fill='%23FFC857'/%3E%3Cg fill='%237CC4FF'%3E%3Ccircle cx='53' cy='20' r='7'/%3E%3Ccircle cx='62' cy='24' r='5.2'/%3E%3Ccircle cx='45' cy='25' r='5.2'/%3E%3Crect x='45' y='20' width='17' height='9' rx='4.5'/%3E%3C/g%3E%3Cpath d='M14 46l1.8 5.9 5.9 1.8-5.9 1.8L14 61.4l-1.8-5.9L6.3 53.7l5.9-1.8z' fill='%23FF9ECD'/%3E%3Ccircle cx='62' cy='52' r='4' fill='%2380E0B0'/%3E%3Ccircle cx='68' cy='47' r='2.6' fill='%2380E0B0'/%3E%3Cpath d='M38 62c3-5 10-5 13 0z' fill='%23B79CFF'/%3E%3Ccircle cx='33' cy='12' r='1.8' fill='%23FFD166'/%3E%3C/g%3E%3C/svg%3E\")",
      '--k-texture-size': '80px 80px',
    },
    confetti: {
      '--k-texture':
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72'%3E%3Cg opacity='.62'%3E%3Crect x='8' y='10' width='8' height='3.4' rx='1.4' fill='%23FF9ECD' transform='rotate(22 12 12)'/%3E%3Crect x='44' y='8' width='7' height='3.2' rx='1.3' fill='%237CC4FF' transform='rotate(-28 47 10)'/%3E%3Crect x='26' y='40' width='8' height='3.4' rx='1.4' fill='%23FFC857' transform='rotate(64 30 42)'/%3E%3Crect x='58' y='46' width='7' height='3.2' rx='1.3' fill='%2380E0B0' transform='rotate(14 61 47)'/%3E%3Crect x='14' y='58' width='7' height='3.2' rx='1.3' fill='%23B79CFF' transform='rotate(-48 17 59)'/%3E%3Ccircle cx='38' cy='20' r='2.2' fill='%23FFC857'/%3E%3Ccircle cx='63' cy='30' r='1.8' fill='%23FF9ECD'/%3E%3Ccircle cx='20' cy='34' r='1.6' fill='%237CC4FF'/%3E%3Ccircle cx='52' cy='60' r='2' fill='%23B79CFF'/%3E%3C/g%3E%3C/svg%3E\")",
      '--k-texture-size': '72px 72px',
    },
  };

  const TEXTURE_LIST = [
    { id: 'none', name: 'Sem textura', cat: 'Básico', desc: 'Fundo liso, definido apenas pelo gradiente ou pela cor do estilo.' },
    { id: 'dots', name: 'Pontos', cat: 'Básico', desc: 'Malha de pontos espaçados para fundos neutros.' },
    { id: 'grid', name: 'Grade', cat: 'Básico', desc: 'Grade fina de 28 px, discreta, para leitura de alinhamento.' },
    { id: 'lines', name: 'Linhas', cat: 'Básico', desc: 'Hachura diagonal de 45°, leve, para superfícies de apoio.' },
    { id: 'noise', name: 'Ruído', cat: 'Técnico', desc: 'Grão orgânico em SVG, útil para dar matéria a fundos planos.' },
    { id: 'blueprint', name: 'Blueprint', cat: 'Técnico', desc: 'Grade técnica com linhas maiores a cada 64 px.' },
    { id: 'cross', name: 'Cruzes', cat: 'Técnico', desc: 'Marcas de registro em cruz, como papel de engenharia.' },
    { id: 'halftone', name: 'Meio-tom', cat: 'Técnico', desc: 'Retícula densa de impressão, com pontos de 12 px.' },
    { id: 'waves', name: 'Ondas', cat: 'Orgânico', desc: 'Anéis concêntricos suaves, para palcos mais orgânicos.' },
    { id: 'paper', name: 'Papel', cat: 'Orgânico', desc: 'Pauta horizontal sutil, lembrando caderno ou editorial.' },
    { id: 'mesh', name: 'Malha', cat: 'Orgânico', desc: 'Dois focos de pontos sobrepostos, com densidade irregular.' },
    { id: 'skyline', name: 'Skyline', cat: 'Decorativo', desc: 'Silhueta de cidade no horizonte, em camadas de prédios.' },
    { id: 'stars', name: 'Estrelas', cat: 'Decorativo', desc: 'Estrelinhas de quatro pontas e brilhos esparsos.' },
    { id: 'moon', name: 'Luas', cat: 'Decorativo', desc: 'Luas crescentes com estrelas soltas, clima noturno.' },
    { id: 'flowers', name: 'Flores', cat: 'Decorativo', desc: 'Flores de cinco pétalas em três tamanhos.' },
    { id: 'floral', name: 'Floral', cat: 'Decorativo', desc: 'Ramo delicado com folhas e botões, estilo botânico.' },
    { id: 'arabesque', name: 'Arabesco', cat: 'Decorativo', desc: 'Trama geométrica simétrica, inspirada em azulejo.' },
    { id: 'kids', name: 'Céu infantil', cat: 'Infantil', desc: 'Sol, nuvem, estrela e formas pastel para telas infantis.' },
    { id: 'confetti', name: 'Confete', cat: 'Infantil', desc: 'Confete colorido espalhado, para clima de festa.' },
  ];


  window.KIT_TOKENS = Object.assign(window.KIT_TOKENS || {}, {
    TEXTURES,
    TEXTURE_LIST,
  });
})();
