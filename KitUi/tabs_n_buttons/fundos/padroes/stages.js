/* Acervo local de fundos de palco. */
(function () {
  'use strict';

  /* Fundos de palco — independentes das texturas. Cada preset define apenas
     a variável --k-stage-bg. */
  const STAGE_LIST = [
    {
      id: 'studio',
      name: 'Estúdio',
      desc: 'Cinza frio com luz suave vinda do topo, ideal para vitrines claras.',
      tone: 'claro',
      value: 'radial-gradient(120% 90% at 50% 0%, #F9FBFD 0%, #E9EDF3 55%, #DBE1E9 100%)',
    },
    {
      id: 'paper',
      name: 'Papel',
      desc: 'Marfim quente com leve gradiente, lembra papel de desenho.',
      tone: 'claro',
      value: 'linear-gradient(180deg, #FCF9F2 0%, #F2EBDC 100%)',
    },
    {
      id: 'fog',
      name: 'Névoa',
      desc: 'Azul acinzentado muito claro, neutro para qualquer tema.',
      tone: 'claro',
      value: 'linear-gradient(160deg, #EFF4F8 0%, #DDE7F0 100%)',
    },
    {
      id: 'sand',
      name: 'Areia',
      desc: 'Bege arenoso com transição quente, para composições editoriais.',
      tone: 'claro',
      value: 'linear-gradient(180deg, #F7F0E4 0%, #E8D7BE 100%)',
    },
    {
      id: 'mint',
      name: 'Menta',
      desc: 'Verde pálido e fresco, com contraste baixo para superfícies.',
      tone: 'claro',
      value: 'linear-gradient(180deg, #EDF8F2 0%, #D2EBDD 100%)',
    },
    {
      id: 'slate',
      name: 'Ardósia',
      desc: 'Grafite azulado, escuro e uniforme, para palcos sóbrios.',
      tone: 'escuro',
      value: 'linear-gradient(180deg, #1C2331 0%, #0E131C 100%)',
    },
    {
      id: 'midnight',
      name: 'Meia-noite',
      desc: 'Azul profundo com foco de luz no canto superior.',
      tone: 'escuro',
      value: 'radial-gradient(90% 80% at 20% 0%, #1F2E4E 0%, #0C1222 60%, #070A12 100%)',
    },
    {
      id: 'carbon',
      name: 'Carbono',
      desc: 'Quase preto com brilho mínimo, para máxima ênfase no conteúdo.',
      tone: 'escuro',
      value: 'radial-gradient(80% 70% at 50% 0%, #24272D 0%, #111316 60%, #08090B 100%)',
    },
    {
      id: 'aurora',
      name: 'Aurora',
      desc: 'Gradientes multicoloridos desfocados sobre base noturna.',
      tone: 'escuro',
      value:
        'radial-gradient(80% 70% at 15% 10%, #7AA2FF 0%, transparent 55%), radial-gradient(80% 80% at 90% 20%, #C77BFF 0%, transparent 55%), radial-gradient(90% 90% at 50% 100%, #3EE0C8 0%, transparent 60%), #10152A',
    },
    {
      id: 'moss',
      name: 'Musgo',
      desc: 'Verde escuro profundo com variação sutil, para palcos naturais.',
      tone: 'escuro',
      value: 'radial-gradient(100% 90% at 50% 0%, #1B2B24 0%, #0D1712 65%, #070D09 100%)',
    },
  ];

  const STAGE_PRESETS = STAGE_LIST.reduce((acc, s) => {
    acc[s.id] = s;
    return acc;
  }, {});


  window.KIT_TOKENS = Object.assign(window.KIT_TOKENS || {}, {
    STAGE_LIST,
    STAGE_PRESETS,
  });
})();
