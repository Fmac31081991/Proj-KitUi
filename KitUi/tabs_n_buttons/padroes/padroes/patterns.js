/* Acervo local de padrões (telas compostas). */
(function () {
  'use strict';

  const { icon, esc, block, statCard, row, alert, chart } = window.KIT_COMPONENTS;

  /* ---------------------------------------------------------------- */
  /* Padrões (telas compostas)                                         */
  /* ---------------------------------------------------------------- */

  const patternGroups = ['Essenciais', 'Mídia', 'Aplicativos', 'Sistema', 'Web e produto'];

  const patterns = [
    {
      id: 'overview',
      group: 'Essenciais',
      kind: 'tela',
      title: 'Visão geral',
      desc: 'Uma tela completa do kit: barra, hero, indicadores, tabela e formulário no estilo atual.',
      code: '<!-- Tela composta: use os trechos de cada componente -->',
      demo: () => overview(),
    },
    {
      id: 'dashboard',
      group: 'Essenciais',
      kind: 'tela',
      title: 'Painel',
      desc: 'Barra lateral, indicadores, gráfico e tabela — o esqueleto de um app administrativo.',
      code: '<!-- Tela composta: use os trechos de cada componente -->',
      demo: () => dashboard(),
    },
    {
      id: 'login',
      group: 'Essenciais',
      kind: 'tela',
      title: 'Entrar',
      desc: 'Formulário centrado com campos, alternador e ação principal.',
      code: '<!-- Tela composta: use os trechos de cada componente -->',
      demo: () => login(),
    },
    {
      id: 'settings',
      group: 'Essenciais',
      kind: 'tela',
      title: 'Ajustes',
      desc: 'Página de configurações com abas, blocos de formulário e ações fixas.',
      code: '<!-- Tela composta: use os trechos de cada componente -->',
      demo: () => settings(),
    },
    {
      id: 'video',
      group: 'Mídia',
      kind: 'mídia',
      title: 'Player de vídeo',
      desc: 'Janela de reprodução com palco, controles sobrepostos, progresso e ações sociais.',
      code: '<!-- Tela composta: use os trechos de cada componente -->',
      demo: () => patternVideo(),
    },
    {
      id: 'audio',
      group: 'Mídia',
      kind: 'mídia',
      title: 'Player de áudio',
      desc: 'Tocador com capa, transporte, progresso e fila de reprodução lateral.',
      code: '<!-- Tela composta: use os trechos de cada componente -->',
      demo: () => patternAudio(),
    },
    {
      id: 'gallery',
      group: 'Mídia',
      kind: 'mídia',
      title: 'Visualizador de imagem',
      desc: 'Galeria com imagem principal, navegação, tira de miniaturas e painel de detalhes.',
      code: '<!-- Tela composta: use os trechos de cada componente -->',
      demo: () => patternGallery(),
    },
    {
      id: 'editor',
      group: 'Aplicativos',
      kind: 'app',
      title: 'Editor de texto',
      desc: 'Documento com barra de formatação, numeração de linhas e barra de estado editorial.',
      code: '<!-- Tela composta: use os trechos de cada componente -->',
      demo: () => patternEditor(),
    },
    {
      id: 'inbox',
      group: 'Aplicativos',
      kind: 'app',
      title: 'Caixa de entrada',
      desc: 'Três colunas: pastas, lista de mensagens e leitura, com anexos e ações rápidas.',
      code: '<!-- Tela composta: use os trechos de cada componente -->',
      demo: () => patternInbox(),
    },
    {
      id: 'calendar',
      group: 'Aplicativos',
      kind: 'app',
      title: 'Calendário',
      desc: 'Mês completo com eventos coloridos, alternador de visão e agenda do dia.',
      code: '<!-- Tela composta: use os trechos de cada componente -->',
      demo: () => patternCalendar(),
    },
    {
      id: 'chat',
      group: 'Aplicativos',
      kind: 'app',
      title: 'Conversa',
      desc: 'Mensageiro com lista de conversas, histórico em balões, chamada e compositor.',
      code: '<!-- Tela composta: use os trechos de cada componente -->',
      demo: () => patternChat(),
    },
    {
      id: 'kanban',
      group: 'Aplicativos',
      kind: 'app',
      title: 'Quadro Kanban',
      desc: 'Colunas de fluxo com cartões, etiquetas, responsáveis e contadores.',
      code: '<!-- Tela composta: use os trechos de cada componente -->',
      demo: () => patternKanban(),
    },
    {
      id: 'desktop',
      group: 'Sistema',
      kind: 'sistema',
      title: 'Interface de sistema',
      desc: 'Área de trabalho com barra de menu, ícones, janelas flutuantes e dock.',
      code: '<!-- Tela composta: use os trechos de cada componente -->',
      demo: () => patternDesktop(),
    },
    {
      id: 'preferences',
      group: 'Sistema',
      kind: 'sistema',
      title: 'Interface de ajustes',
      desc: 'Janela de preferências com categorias laterais, controles e ações de rodapé.',
      code: '<!-- Tela composta: use os trechos de cada componente -->',
      demo: () => patternPreferences(),
    },
    {
      id: 'webapp',
      group: 'Web e produto',
      kind: 'web',
      title: 'Aplicação web',
      desc: 'Navegador com app embutido: barra, navegação, indicadores, tabela e atividade.',
      code: '<!-- Tela composta: use os trechos de cada componente -->',
      demo: () => patternWebapp(),
    },
    {
      id: 'store',
      group: 'Web e produto',
      kind: 'web',
      title: 'Loja de produto',
      desc: 'Página de venda com galeria, preço, variações, avaliações e chamada para comprar.',
      code: '<!-- Tela composta: use os trechos de cada componente -->',
      demo: () => patternStore(),
    },
    {
      id: 'article',
      group: 'Web e produto',
      kind: 'web',
      title: 'Artigo',
      desc: 'Leitura editorial com capa, autoria, citação destacada, corpo e etiquetas.',
      code: '<!-- Tela composta: use os trechos de cada componente -->',
      demo: () => patternArticle(),
    },
    {
      id: 'profile',
      group: 'Web e produto',
      kind: 'web',
      title: 'Perfil',
      desc: 'Cabeçalho com capa, avatar, métricas, abas e grade de trabalhos.',
      code: '<!-- Tela composta: use os trechos de cada componente -->',
      demo: () => patternProfile(),
    },
    {
      id: 'comments',
      group: 'Aplicativos',
      kind: 'app',
      title: 'Comentários e revisão',
      desc: 'Thread de revisão sobre a peça, com marcações na imagem, respostas e resolução.',
      code: '<!-- Tela composta: use os trechos de cada componente -->',
      demo: () => patternComments(),
    },
    {
      id: 'notifications',
      group: 'Aplicativos',
      kind: 'app',
      title: 'Central de atividade',
      desc: 'Notificações agrupadas por dia, com menções, convites e marcação de leitura.',
      code: '<!-- Tela composta: use os trechos de cada componente -->',
      demo: () => patternNotifications(),
    },
    {
      id: 'social',
      group: 'Aplicativos',
      kind: 'app',
      title: 'Feed de mídia social',
      desc: 'Compositor, publicações com mídia, ações sociais e coluna de tendências.',
      code: '<!-- Tela composta: use os trechos de cada componente -->',
      demo: () => patternSocial(),
    },
    {
      id: 'onboarding',
      group: 'Essenciais',
      kind: 'tela',
      title: 'Primeiros passos',
      desc: 'Onboarding em três etapas com progresso, escolha de perfil e ações de avanço.',
      code: '<!-- Tela composta: use os trechos de cada componente -->',
      demo: () => patternOnboarding(),
    },
    {
      id: 'checkout',
      group: 'Web e produto',
      kind: 'web',
      title: 'Checkout e carrinho',
      desc: 'Fluxo de compra em etapas com itens, entrega, resumo do pedido e pagamento.',
      code: '<!-- Tela composta: use os trechos de cada componente -->',
      demo: () => patternCheckout(),
    },
    {
      id: 'search',
      group: 'Web e produto',
      kind: 'web',
      title: 'Busca com filtros',
      desc: 'Resultados com busca, chips, facetas laterais, ordenação e paginação.',
      code: '<!-- Tela composta: use os trechos de cada componente -->',
      demo: () => patternSearch(),
    },
    {
      id: 'team',
      group: 'Web e produto',
      kind: 'web',
      title: 'Diretório de equipe',
      desc: 'Membros do time em cartões com função, status, localização e ações.',
      code: '<!-- Tela composta: use os trechos de cada componente -->',
      demo: () => patternTeam(),
    },
    {
      id: 'report',
      group: 'Web e produto',
      kind: 'web',
      title: 'Relatório imprimível',
      desc: 'Página de relatório com indicadores, tabela, gráfico, observações e assinatura.',
      code: '<!-- Tela composta: use os trechos de cada componente -->',
      demo: () => patternReport(),
    },
    {
      id: 'error',
      group: 'Web e produto',
      kind: 'web',
      title: 'Erro e estado vazio',
      desc: 'Página 404 e estado vazio lado a lado, com ações de recuperação.',
      code: '<!-- Tela composta: use os trechos de cada componente -->',
      demo: () => patternError(),
    },
    {
      id: 'docs',
      group: 'Web e produto',
      kind: 'web',
      title: 'Documentação técnica',
      desc: 'Navegação lateral, artigo com passos, blocos de código e navegação sequencial.',
      code: '<!-- Tela composta: use os trechos de cada componente -->',
      demo: () => patternDocs(),
    },
    {
      id: 'app-frame',
      group: 'Sistema',
      kind: 'moldura',
      title: 'Moldura de aplicação',
      desc: 'Casca 1280×600 com marca, três abas, aviso, cartões, tabela e rodapé. Paleta escura isolada; paisagem e retrato; controles apenas visuais.',
      code: '<!-- Molde visual com CSS isolado. Use o HTML completo em “Ver HTML desta tela”. -->',
      uses: ['appbar', 'tabs', 'button', 'card', 'badge', 'alert', 'table', 'footer', 'avatar'],
      compatible: ['menu', 'field', 'choice', 'combobox', 'search', 'empty', 'skeleton', 'toast', 'modal', 'progress'],
      demo: () => patternFrame(),
    },
  ];

  function overview() {
    return (
      '<div class="k-appbar"><div class="k-appbar__brand"><span class="k-avatar k-avatar--sm k-avatar--solid">K</span>Atlas</div>' +
      '<nav class="k-appbar__nav"><a class="k-appbar__link is-active" href="#">Visão geral</a><a class="k-appbar__link" href="#">Projetos</a><a class="k-appbar__link" href="#">Equipe</a><a class="k-appbar__link" href="#">Relatórios</a></nav>' +
      '<div class="k-grow"></div><div class="k-row k-row--tight" style="margin-left:auto"><button class="k-btn k-btn--icon k-btn--ghost" type="button" aria-label="Buscar">' + icon('search') + '</button>' +
      '<button class="k-btn k-btn--icon k-btn--ghost" type="button" aria-label="Notificações">' + icon('notifications') + '</button>' +
      '<span class="k-avatar k-avatar--sm">FS</span></div></div>' +
      '<div class="k-row" style="align-items:flex-end;gap:24px;margin-top:24px"><div class="k-grow"><div class="k-eyebrow">Coleção 2026</div>' +
      '<h1 class="k-h1" style="margin-top:6px">Interfaces que<br>começam prontas.</h1>' +
      '<p class="k-lead" style="margin-top:10px">Um kit vetorial com oito estilos, componentes funcionais e tokens exportáveis.</p></div>' +
      '<div class="k-row k-row--tight"><button class="k-btn k-btn--secondary" type="button">' + icon('grid', 'k-icon--sm') + 'Explorar</button><button class="k-btn k-btn--primary" type="button">' + icon('download', 'k-icon--sm') + 'Baixar kit</button></div></div>' +
      '<div class="k-grid" style="margin-top:24px">' + statCard('Componentes', '86', '+9 novos', [30, 42, 38, 55, 62, 70, 84]) + statCard('Estilos', '8', '+2 previstos', [20, 30, 30, 44, 44, 44, 60]) + statCard('Peso do CSS', '24 kB', '−3 kB', [72, 66, 60, 52, 46, 40, 34], true) + '</div>' +
      '<div class="k-row" style="margin-top:16px;align-items:stretch"><div class="k-card k-grow" style="flex:2"><div class="k-card__head"><div><div class="k-card__title">Adoção por semana</div><div class="k-card__meta">Projetos que usam o kit</div></div><span class="k-badge k-badge--success">+18%</span></div>' + chart() + '</div>' +
      '<div class="k-card k-grow" style="flex:1"><div class="k-card__title">Próximos passos</div><div class="k-stack k-stack--sm" style="margin-top:10px">' +
      '<label class="k-choice"><input type="checkbox" checked><span class="k-choice__box"></span>Revisar tokens</label>' +
      '<label class="k-choice"><input type="checkbox" checked><span class="k-choice__box"></span>Validar contraste</label>' +
      '<label class="k-choice"><input type="checkbox"><span class="k-choice__box"></span>Publicar v1.0</label>' +
      '<label class="k-choice"><input type="checkbox"><span class="k-choice__box"></span>Documentar padrões</label></div>' +
      '<div class="k-progress" style="margin-top:14px"><div class="k-progress__bar" style="width:52%"></div></div></div></div>'
    );
  }

  function dashboard() {
    return (
      '<div class="k-row" style="align-items:flex-start;gap:16px">' +
      '<aside class="k-sidebar"><div class="k-sidebar__brand k-eyebrow" style="padding:6px 10px">Workspace</div>' +
      '<a class="k-sidebar__item is-active" href="#">' + icon('home', 'k-icon--sm') + '<span class="k-sidebar__item__label">Início</span></a>' +
      '<a class="k-sidebar__item" href="#">' + icon('chart', 'k-icon--sm') + '<span class="k-sidebar__item__label">Métricas</span></a>' +
      '<a class="k-sidebar__item" href="#">' + icon('folder', 'k-icon--sm') + '<span class="k-sidebar__item__label">Projetos</span><span class="k-badge">7</span></a>' +
      '<a class="k-sidebar__item" href="#">' + icon('component', 'k-icon--sm') + '<span class="k-sidebar__item__label">Componentes</span></a>' +
      '<a class="k-sidebar__item" href="#">' + icon('settings', 'k-icon--sm') + '<span class="k-sidebar__item__label">Ajustes</span></a></aside>' +
      '<div class="k-grow k-stack"><div class="k-row k-row--between"><div><h2 class="k-h2">Painel</h2><p class="k-small k-muted">Semana 34 · 18 a 24 de agosto</p></div><div class="k-row k-row--tight"><div class="k-seg"><button class="k-seg__btn is-active" type="button">7d</button><button class="k-seg__btn" type="button">30d</button><button class="k-seg__btn" type="button">90d</button></div><button class="k-btn k-btn--secondary k-btn--sm" type="button">' + icon('download', 'k-icon--sm') + 'Exportar</button></div></div>' +
      '<div class="k-grid">' + statCard('Sessões', '18.402', '+8,1%', [40, 52, 44, 62, 58, 74, 78]) + statCard('Conversão', '3,84%', '+0,4 pp', [30, 34, 30, 40, 46, 44, 52]) + '</div>' +
      '<div class="k-card"><div class="k-card__head"><div><div class="k-card__title">Tráfego</div><div class="k-card__meta">Visitantes únicos</div></div><span class="k-badge k-badge--primary">tempo real</span></div>' + chart() + '</div>' +
      '<div class="k-table__wrap"><table class="k-table"><thead><tr><th>Origem</th><th>Status</th><th class="k-num">Sessões</th><th class="k-num">Conv.</th></tr></thead><tbody>' +
      '<tr><td class="k-strong">Busca orgânica</td><td><span class="k-badge k-badge--success">Saudável</span></td><td class="k-num">8.420</td><td class="k-num">4,1%</td></tr>' +
      '<tr><td class="k-strong">Direto</td><td><span class="k-badge k-badge--success">Saudável</span></td><td class="k-num">4.118</td><td class="k-num">3,2%</td></tr>' +
      '<tr><td class="k-strong">Social</td><td><span class="k-badge k-badge--primary">Atenção</span></td><td class="k-num">2.904</td><td class="k-num">1,8%</td></tr>' +
      '</tbody></table></div></div></div>'
    );
  }

  function login() {
    return (
      '<div class="login-wrap">' +
      '<div class="k-card k-card--raised" style="width:360px">' +
      '<div class="k-row k-row--tight" style="margin-bottom:6px"><span class="k-avatar k-avatar--sm k-avatar--solid">K</span><span class="k-strong">Atlas</span></div>' +
      '<h2 class="k-h2" style="margin-top:8px">Entrar na conta</h2>' +
      '<p class="k-small k-muted" style="margin-bottom:18px">Use o e-mail corporativo para continuar.</p>' +
      '<div class="k-stack">' +
      '<label class="k-field"><span class="k-field__label">E-mail</span><span class="k-input-icon">' + icon('account') + '<input class="k-input" type="email" placeholder="voce@empresa.com"></span></label>' +
      '<label class="k-field"><span class="k-field__label">Senha</span><span class="k-input-icon">' + icon('settings') + '<input class="k-input" type="password" placeholder="••••••••"><span class="k-input-suffix">esqueci</span></span></label>' +
      '<label class="k-switch"><input type="checkbox" checked><span class="k-switch__track"></span>Manter conectado</label>' +
      '<button class="k-btn k-btn--primary k-btn--block" type="button">Continuar</button>' +
      '<div class="k-row" style="justify-content:center;gap:8px"><div class="k-divider k-grow"></div><span class="k-small k-muted">ou</span><div class="k-divider k-grow"></div></div>' +
      '<button class="k-btn k-btn--secondary k-btn--block" type="button">' + icon('insert-link') + 'Entrar com link mágico</button>' +
      '<p class="k-small k-muted" style="text-align:center">Não tem conta? <a class="k-link" href="#">Solicite acesso</a></p>' +
      '</div></div></div>'
    );
  }

  function settings() {
    return (
      '<div class="k-stack">' +
      '<div><h2 class="k-h2">Ajustes</h2><p class="k-small k-muted">Preferências do projeto Catálogo.</p></div>' +
      '<div class="k-tabs"><button class="k-tab" aria-selected="true" type="button">Geral</button><button class="k-tab" type="button">Membros</button><button class="k-tab" type="button">Tokens</button><button class="k-tab" type="button">Faturamento</button></div>' +
      '<div class="k-row" style="align-items:flex-start;gap:20px"><div class="k-grow k-stack">' +
      '<div class="k-card"><div class="k-card__title">Identidade</div><div class="k-card__meta">Nome e descrição exibidos na lateral.</div>' +
      '<div class="k-stack" style="margin-top:14px"><label class="k-field"><span class="k-field__label">Nome</span><input class="k-input" value="Catálogo de interface"></label>' +
      '<label class="k-field"><span class="k-field__label">Descrição</span><textarea class="k-textarea" rows="2">Kit vetorial, temas por tokens.</textarea></label>' +
      '<label class="k-field"><span class="k-field__label">Visibilidade</span><select class="k-select"><option>Equipe</option><option>Público</option><option>Privado</option></select></label></div></div>' +
      '<div class="k-card"><div class="k-card__title">Preferências</div><div class="k-stack" style="margin-top:12px">' +
      '<label class="k-switch"><input type="checkbox" checked><span class="k-switch__track"></span>Aplicar tema automaticamente</label>' +
      '<label class="k-switch"><input type="checkbox"><span class="k-switch__track"></span>Exportar ícones junto ao ZIP</label>' +
      '<label class="k-switch"><input type="checkbox" checked><span class="k-switch__track"></span>Preservar comentários</label></div></div>' +
      '</div><div class="k-stack" style="width:210px"><div class="k-card k-card--accent"><div class="k-small k-strong">Plano Pro</div><p class="k-small" style="margin:6px 0 12px;opacity:.85">8 estilos · 473 ícones · exportação ilimitada.</p><button class="k-btn k-btn--sm k-btn--block" type="button">Gerenciar plano</button></div>' +
      '<div class="k-alert k-alert--info"><span class="k-alert__icon">' + icon('help') + '</span><div class="k-alert__body"><div class="k-alert__text">As alterações valem só para este navegador até exportar.</div></div></div></div></div>' +
      '<div class="k-row k-row--between" style="border-top:var(--k-bw) solid var(--k-border);padding-top:14px"><span class="k-small k-muted">Última alteração há 4 min</span><div class="k-row k-row--tight"><button class="k-btn k-btn--ghost" type="button">Descartar</button><button class="k-btn k-btn--primary" type="button">' + icon('save', 'k-icon--sm') + 'Salvar</button></div></div>' +
      '</div>'
    );
  }

  /* ---------------------------------------------------------------- */
  /* Padrões adicionais                                                */
  /* ---------------------------------------------------------------- */

  /* Imagens de apoio: preservam o clima original, mas recebem a matiz do
     estilo ativo para que todos os padrões acompanhem a paleta escolhida. */
  function art(a, b, c) {
    return 'background:linear-gradient(135deg,' +
      'color-mix(in srgb,var(--k-primary) 26%,' + a + ') 0%,' +
      'color-mix(in srgb,var(--k-accent) 22%,' + b + ') 55%,' +
      'color-mix(in srgb,var(--k-text) 10%,' + c + ') 100%)';
  }

  /* Papel de parede do padrão de sistema: usa o fundo e as cores do estilo
     ativo, em vez de um gradiente fixo. */
  function wallpaper() {
    return 'background:' +
      'radial-gradient(circle at 78% 10%,color-mix(in srgb,var(--k-primary) 30%,transparent),transparent 48%),' +
      'radial-gradient(circle at 14% 88%,color-mix(in srgb,var(--k-accent) 26%,transparent),transparent 56%),' +
      'var(--k-surface-2)';
  }

  function patternVideo() {
    return (
      '<div class="k-window">' +
      '<div class="k-window__bar"><span class="k-window__lights"><i></i><i></i><i></i></span>' +
      '<span class="k-window__title">Estúdio Aberto <span class="k-window__sub">— episódio 04</span></span>' +
      '<div class="k-window__tools"><button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Minimizar">' + icon('minimize', 'k-icon--sm') + '</button>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Tela cheia">' + icon('full-screen', 'k-icon--sm') + '</button></div></div>' +
      '<div style="position:relative;height:244px;' + art('#1B2440', '#3A2A55', '#6B2F3A') + ';display:grid;place-items:center;overflow:hidden">' +
      '<div style="position:absolute;inset:0;background:radial-gradient(circle at 28% 22%,rgba(255,255,255,.18),transparent 42%)"></div>' +
      '<button class="k-btn k-btn--primary k-btn--icon" type="button" aria-label="Reproduzir" style="width:56px;height:56px;border-radius:var(--k-radius-round);box-shadow:0 12px 32px rgba(0,0,0,.45)">' + icon('play', 'k-icon--lg') + '</button>' +
      '<div style="position:absolute;left:14px;right:14px;bottom:12px;color:#fff">' +
      '<div class="k-progress" style="background:rgba(255,255,255,.24)"><div class="k-progress__bar" style="width:38%"></div></div>' +
      '<div class="k-row k-row--between" style="margin-top:8px">' +
      '<div class="k-row k-row--tight"><button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Pausar" style="color:#fff">' + icon('pause', 'k-icon--sm') + '</button>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Volume" style="color:#fff">' + icon('mute', 'k-icon--sm') + '</button>' +
      '<span class="k-small k-mono">04:12 / 11:38</span></div>' +
      '<div class="k-row k-row--tight"><span class="k-badge k-badge--outline" style="color:#fff;border-color:rgba(255,255,255,.35)">1080p</span>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Legendas" style="color:#fff">' + icon('subtitles', 'k-icon--sm') + '</button>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Tela cheia" style="color:#fff">' + icon('full-screen', 'k-icon--sm') + '</button></div></div></div></div>' +
      '<div class="k-window__foot"><span class="k-window__status"><span class="k-dot"></span>Transmitindo em 1080p</span>' +
      '<span class="k-row k-row--tight"><button class="k-btn k-btn--ghost k-btn--sm" type="button">' + icon('like', 'k-icon--sm') + '1,2 mil</button>' +
      '<button class="k-btn k-btn--ghost k-btn--sm" type="button">' + icon('share', 'k-icon--sm') + 'Compartilhar</button></span></div></div>' +
      '<div class="k-row k-row--between" style="margin-top:16px;align-items:flex-start"><div><h2 class="k-h3">Como interfaces nascem prontas</h2>' +
      '<p class="k-small k-muted">Atlas Studio · 12 mil visualizações · há 3 dias</p></div>' +
      '<button class="k-btn k-btn--secondary k-btn--sm" type="button">' + icon('subscribe', 'k-icon--sm') + 'Inscrever-se</button></div>' +
      '<div class="k-row k-row--tight" style="margin-top:14px">' + ['Design system', 'Tokens', 'Componentes', 'Acessibilidade'].map(function (t) { return '<span class="k-tag">' + t + '</span>'; }).join('') + '</div>'
    );
  }

  function patternAudio() {
    var queue = [
      ['Sinais Lentos', 'Atlas Ensemble', '04:58', true],
      ['Maré Alta', 'Clara Nunes', '03:41', false],
      ['Vidro Frio', 'Novo Norte', '05:12', false],
      ['Horizonte', 'Atlas Ensemble', '02:27', false],
    ];
    return (
      '<div class="k-window">' +
      '<div class="k-window__bar"><span class="k-window__lights"><i></i><i></i><i></i></span>' +
      '<span class="k-window__title">Foco profundo <span class="k-window__sub">— sessão 03</span></span>' +
      '<div class="k-window__tools"><button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Transmitir">' + icon('cast', 'k-icon--sm') + '</button>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Miniplayer">' + icon('miniplayer', 'k-icon--sm') + '</button></div></div>' +
      '<div class="k-window__body k-window__body--pad" style="display:grid;grid-template-columns:1.1fr .9fr;gap:18px">' +
      '<div style="display:flex;flex-direction:column;gap:14px;min-width:0">' +
      '<div class="k-row" style="gap:16px;align-items:flex-start">' +
      '<div style="width:112px;height:112px;border-radius:var(--k-radius-md);flex:none;' + art('#23304F', '#4E2F58', '#B45A48') + ';display:grid;place-items:center;color:#fff">' + icon('music', 'k-icon--xl') + '</div>' +
      '<div class="k-stack k-stack--sm" style="min-width:0"><span class="k-eyebrow">Tocando agora</span><h2 class="k-h2" style="margin-top:2px">Sinais Lentos</h2>' +
      '<p class="k-small k-muted">Atlas Ensemble · álbum <em>Horizonte</em></p>' +
      '<div class="k-row k-row--tight" style="margin-top:6px"><span class="k-badge k-badge--primary">Lossless</span><span class="k-badge k-badge--outline">48 kHz</span></div></div></div>' +
      '<div><div class="k-meter"><span>02:41</span><span>04:58</span></div><div class="k-progress"><div class="k-progress__bar" style="width:54%"></div></div></div>' +
      '<div class="k-row" style="justify-content:center;gap:8px"><button class="k-btn k-btn--ghost k-btn--icon" type="button" aria-label="Aleatório">' + icon('random', 'k-icon--sm') + '</button>' +
      '<button class="k-btn k-btn--ghost k-btn--icon" type="button" aria-label="Anterior">' + icon('back', 'k-icon--sm') + '</button>' +
      '<button class="k-btn k-btn--primary k-btn--icon" type="button" aria-label="Reproduzir" style="width:40px;height:40px;border-radius:var(--k-radius-round)">' + icon('play') + '</button>' +
      '<button class="k-btn k-btn--ghost k-btn--icon" type="button" aria-label="Próxima">' + icon('forward', 'k-icon--sm') + '</button>' +
      '<button class="k-btn k-btn--ghost k-btn--icon" type="button" aria-label="Repetir">' + icon('loop', 'k-icon--sm') + '</button></div>' +
      '<div class="k-row k-row--between"><span class="k-small k-muted">' + icon('mute', 'k-icon--sm') + '</span><input class="k-range" type="range" min="0" max="100" value="70" style="max-width:160px" aria-label="Volume"><span class="k-small k-mono k-muted">−6 dB</span></div></div>' +
      '<div class="k-card" style="padding:0;overflow:hidden"><div class="k-row k-row--between" style="padding:10px 12px;border-bottom:var(--k-bw) solid var(--k-border)">' +
      '<span class="k-strong">Fila</span><span class="k-badge k-badge--outline">4 faixas</span></div><ul class="k-list">' +
      queue.map(function (q, i) {
        return '<li class="k-list__item" style="padding:7px 12px"><span style="width:30px;height:30px;border-radius:var(--k-radius-xs);flex:none;' + art(i === 0 ? '#23304F' : i === 1 ? '#42405A' : i === 2 ? '#4A3339' : '#2F4045', i === 0 ? '#4E2F58' : i === 1 ? '#6A4A62' : i === 2 ? '#6B4A42' : '#3E5560', '#7A5C4F') + '"></span>' +
          '<div class="k-list__main"><div class="k-list__title" style="font-size:var(--k-fs-sm)">' + q[0] + '</div><div class="k-list__meta" style="font-size:11px">' + q[1] + '</div></div>' +
          '<span class="k-small k-mono k-muted">' + (q[3] ? icon('play', 'k-icon--sm') : q[2]) + '</span></li>';
      }).join('') +
      '</ul></div></div>' +
      '<div class="k-window__foot"><span class="k-window__status"><span class="k-dot"></span>Áudio do sistema</span><span class="k-small k-mono">44,1 → 48 kHz</span></div></div>'
    );
  }

  function patternGallery() {
    var thumbs = ['#2A3550', '#4A3355', '#5B3A44', '#2F444C', '#3A3D52'];
    return (
      '<div class="k-window">' +
      '<div class="k-window__bar"><span class="k-window__lights"><i></i><i></i><i></i></span>' +
      '<span class="k-window__title">Galeria <span class="k-window__sub">— 24 fotos</span></span>' +
      '<div class="k-window__tools"><button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Favoritar">' + icon('favorite', 'k-icon--sm') + '</button>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Compartilhar">' + icon('share', 'k-icon--sm') + '</button>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Mais">' + icon('more-options', 'k-icon--sm') + '</button></div></div>' +
      '<div class="k-window__body"><div class="k-window__content" style="display:flex;flex-direction:column;gap:10px">' +
      '<div style="position:relative;height:248px;border-radius:var(--k-radius-md);overflow:hidden;' + art('#2A3550', '#5D3A58', '#C06A4B') + '">' +
      '<div style="position:absolute;inset:0;background:radial-gradient(circle at 30% 20%,rgba(255,255,255,.22),transparent 45%),radial-gradient(circle at 75% 80%,rgba(255,255,255,.12),transparent 50%)"></div>' +
      '<button class="k-btn k-btn--icon" type="button" aria-label="Anterior" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);background:rgba(8,10,14,.42);color:#fff;border-color:transparent">' + icon('previous') + '</button>' +
      '<button class="k-btn k-btn--icon" type="button" aria-label="Próxima" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:rgba(8,10,14,.42);color:#fff;border-color:transparent">' + icon('next') + '</button>' +
      '<span class="k-badge" style="position:absolute;right:10px;top:10px;color:#fff;background:rgba(8,10,14,.42);border-color:transparent">1 / 24</span></div>' +
      '<div class="k-row k-row--tight">' +
      thumbs.map(function (c, i) {
        return '<button type="button" aria-label="Foto ' + (i + 1) + '" style="flex:1;height:52px;border-radius:var(--k-radius-xs);border:2px solid ' + (i === 0 ? 'var(--k-primary)' : 'transparent') + ';' + art(c, '#7A5C6A', '#B98A6A') + ';cursor:pointer"></button>';
      }).join('') + '</div></div>' +
      '<div style="width:168px;flex:none;padding:12px;border-left:var(--k-bw) solid var(--k-border);display:flex;flex-direction:column;gap:10px;background:color-mix(in srgb,var(--k-text) 2%,var(--k-surface))">' +
      '<div><div class="k-eyebrow">Detalhes</div><div class="k-strong" style="margin-top:4px;font-size:var(--k-fs-sm)">costa-norte-04.jpg</div><div class="k-small k-muted">4,2 MB · 4032 × 3024</div></div>' +
      '<div class="k-divider"></div>' +
      '<div class="k-small"><div class="k-muted">Câmera</div><div>Atlas M2 · 35 mm</div><div class="k-muted" style="margin-top:6px">Abertura</div><div>f/2.8 · 1/250 s</div><div class="k-muted" style="margin-top:6px">Local</div><div>Praia do Norte</div></div>' +
      '<div class="k-row k-row--tight" style="flex-wrap:wrap;margin-top:auto"><span class="k-tag" style="padding:3px 8px">paisagem</span><span class="k-tag" style="padding:3px 8px">costa</span></div>' +
      '<button class="k-btn k-btn--secondary k-btn--sm k-btn--block" type="button">' + icon('download', 'k-icon--sm') + 'Baixar original</button></div></div>' +
      '<div class="k-window__foot"><span class="k-window__status"><span class="k-dot"></span>Sincronizado com a nuvem</span><span class="k-small k-mono">JPG · sRGB</span></div></div>'
    );
  }

  function patternEditor() {
    var lines = Array.from({ length: 13 }, function (_, i) { return i + 1; }).join('<br>');
    return (
      '<div class="k-window" style="height:398px">' +
      '<div class="k-window__bar"><span class="k-window__lights"><i></i><i></i><i></i></span>' +
      '<span class="k-window__title">ensaio-final.md <span class="k-window__sub">— salvo</span></span>' +
      '<div class="k-window__tools"><button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Salvar">' + icon('save', 'k-icon--sm') + '</button>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Compartilhar">' + icon('share', 'k-icon--sm') + '</button>' +
      '<button class="k-btn k-btn--secondary k-btn--sm" type="button">Publicar</button></div></div>' +
      '<div class="k-row k-row--tight" style="padding:6px 8px;border-bottom:var(--k-bw) solid var(--k-border);flex:none">' +
      ['bold', 'italic', 'underline', 'strikethrough'].map(function (ic) { return '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="' + ic + '">' + icon(ic, 'k-icon--sm') + '</button>'; }).join('') +
      '<span class="k-divider k-divider--vertical"></span>' +
      ['bullets', 'numbering', 'insert-link', 'pictures', 'comment'].map(function (ic) { return '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="' + ic + '">' + icon(ic, 'k-icon--sm') + '</button>'; }).join('') +
      '<div class="k-grow"></div><span class="k-badge k-badge--outline">Markdown</span></div>' +
      '<div style="display:flex;flex:1;min-height:0">' +
      '<div style="width:40px;flex:none;padding:12px 8px;text-align:right;font-family:var(--k-font-mono);font-size:10.5px;line-height:2;color:var(--k-muted);border-right:var(--k-bw) solid var(--k-border);background:color-mix(in srgb,var(--k-text) 2%,var(--k-surface))">' + lines + '</div>' +
      '<div style="flex:1;padding:12px 16px;font-family:var(--k-font-mono);font-size:11.5px;line-height:2;overflow:hidden">' +
      '<div><span class="k-muted"># </span><strong>Interfaces que começam prontas</strong></div>' +
      '<div class="k-muted">Um kit vetorial com estilos, componentes e tokens.</div>' +
      '<div>&nbsp;</div>' +
      '<div><span class="k-muted">## </span><strong>Princípios</strong></div>' +
      '<div>1. Contraste antes de decoração.</div>' +
      '<div>2. Espaço em escala de oito pontos.</div>' +
      '<div><mark style="background:color-mix(in srgb,var(--k-primary) 22%,transparent);color:inherit;border-radius:var(--k-radius-xs);padding:0 2px">3. Cada token tem um papel semântico.</mark></div>' +
      '<div>&nbsp;</div>' +
      '<div><span class="k-muted">## </span><strong>Entrega</strong></div>' +
      '<div>Exporte HTML, CSS e ícones em um único pacote.</div>' +
      '<div><span class="k-link">Ver checklist de publicação</span> <span class="k-muted">→</span></div>' +
      '</div></div>' +
      '<div class="k-window__foot"><span class="k-window__status"><span class="k-dot"></span>Salvo automaticamente</span>' +
      '<span class="k-row k-row--tight k-small k-mono"><span>1.284 palavras</span><span>·</span><span>6 min</span><span>·</span><span>PT-BR</span></span></div></div>'
    );
  }

  function patternInbox() {
    var mails = [
      ['Marina Costa', 'MC', 'Revisão do design system', 'Anexei a nova tabela de tokens e os ajustes de contraste.', '09:41', true],
      ['Rafael Prado', 'RP', 'Proposta do cliente aprovada', 'Podemos iniciar a implementação na segunda-feira.', '08:12', true],
      ['Equipe Atlas', 'AT', 'Resumo semanal do projeto', '3 entregas concluídas, 2 em revisão e 1 bloqueio.', 'Ontem', false],
      ['Beatriz Lima', 'BL', 'Convite: workshop de acessibilidade', 'Quinta às 15h, na sala virtual do time de produto.', 'Ontem', false],
    ];
    return (
      '<div class="k-window">' +
      '<div class="k-window__bar"><span class="k-window__lights"><i></i><i></i><i></i></span>' +
      '<span class="k-window__title">Caixa de entrada <span class="k-window__sub">— 12 não lidos</span></span>' +
      '<div class="k-window__tools"><button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Atualizar">' + icon('refresh', 'k-icon--sm') + '</button>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Mais">' + icon('more-options', 'k-icon--sm') + '</button></div></div>' +
      '<div class="k-window__body" style="height:352px">' +
      '<div style="width:132px;flex:none;padding:8px;border-right:var(--k-bw) solid var(--k-border);display:flex;flex-direction:column;gap:2px;background:color-mix(in srgb,var(--k-text) 2%,var(--k-surface))">' +
      '<button class="k-btn k-btn--primary k-btn--sm k-btn--block" type="button" style="margin-bottom:8px">' + icon('new', 'k-icon--sm') + 'Novo</button>' +
      '<a class="k-sidebar__item is-active" href="#">' + icon('unread', 'k-icon--sm') + '<span class="k-sidebar__item__label">Entrada</span><span class="k-badge">12</span></a>' +
      '<a class="k-sidebar__item" href="#">' + icon('saved', 'k-icon--sm') + '<span class="k-sidebar__item__label">Marcados</span></a>' +
      '<a class="k-sidebar__item" href="#">' + icon('send', 'k-icon--sm') + '<span class="k-sidebar__item__label">Enviados</span></a>' +
      '<a class="k-sidebar__item" href="#">' + icon('archive', 'k-icon--sm') + '<span class="k-sidebar__item__label">Arquivo</span></a>' +
      '<a class="k-sidebar__item" href="#">' + icon('trash', 'k-icon--sm') + '<span class="k-sidebar__item__label">Lixeira</span></a>' +
      '<div class="k-sidebar__label">Etiquetas</div>' +
      '<a class="k-sidebar__item" href="#">' + icon('labels', 'k-icon--sm') + '<span class="k-sidebar__item__label">Produto</span></a>' +
      '<a class="k-sidebar__item" href="#">' + icon('labels', 'k-icon--sm') + '<span class="k-sidebar__item__label">Cliente</span></a></div>' +
      '<div style="width:238px;flex:none;border-right:var(--k-bw) solid var(--k-border);display:flex;flex-direction:column;min-height:0">' +
      '<div class="k-row k-row--between" style="padding:8px 10px;border-bottom:var(--k-bw) solid var(--k-border)"><span class="k-strong k-small">Hoje</span>' +
      '<span class="k-row k-row--tight"><span class="k-small k-muted">12</span><button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Ordenar">' + icon('sort', 'k-icon--sm') + '</button></span></div>' +
      mails.map(function (m, i) {
        return '<div style="padding:8px 10px;border-bottom:var(--k-bw) solid var(--k-border);' + (i === 0 ? 'background:color-mix(in srgb,var(--k-primary) 7%,transparent)' : '') + '">' +
          '<div class="k-row k-row--between" style="gap:6px"><span class="k-row k-row--tight" style="min-width:0"><span class="k-dot" style="background:' + (m[5] ? 'var(--k-primary)' : 'transparent') + '"></span>' +
          '<span class="k-small" style="font-weight:' + (m[5] ? '700' : '500') + ';overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + m[0] + '</span></span>' +
          '<span class="k-small k-muted k-mono" style="flex:none">' + m[4] + '</span></div>' +
          '<div class="k-small" style="margin-top:2px;font-weight:' + (m[5] ? '600' : '400') + ';overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + m[2] + '</div>' +
          '<div class="k-small k-muted" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + m[3] + '</div></div>';
      }).join('') + '</div>' +
      '<div style="flex:1;min-width:0;padding:10px 12px;display:flex;flex-direction:column;gap:8px">' +
      '<div class="k-row k-row--tight"><button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Arquivar">' + icon('archive', 'k-icon--sm') + '</button>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Excluir">' + icon('trash', 'k-icon--sm') + '</button>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Marcar como lido">' + icon('mark-as-read', 'k-icon--sm') + '</button>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Mover">' + icon('move-to', 'k-icon--sm') + '</button>' +
      '<span class="k-grow"></span><button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Mais">' + icon('more-options', 'k-icon--sm') + '</button></div>' +
      '<h3 class="k-h3">Revisão do design system</h3>' +
      '<div class="k-row k-row--tight"><span class="k-avatar k-avatar--sm">MC</span><span class="k-small"><span class="k-strong">Marina Costa</span> <span class="k-muted">· para mim</span></span>' +
      '<span class="k-grow"></span><span class="k-small k-muted k-mono">09:41</span><span class="k-badge k-badge--outline">Produto</span></div>' +
      '<p class="k-small" style="margin-top:2px">Oi! Anexei a nova tabela de tokens e os ajustes de contraste do tema escuro. Os pares de texto agora passam em AA em todos os níveis.</p>' +
      '<p class="k-small k-muted">Se estiver de acordo, publico a versão 0.9 hoje à tarde.</p>' +
      '<div class="k-card k-card--flat" style="padding:8px 10px;display:flex;align-items:center;gap:10px">' +
      '<span class="k-alert__icon">' + icon('attach') + '</span><div class="k-grow" style="min-width:0"><div class="k-small k-strong" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">tokens-contraste-v9.csv</div><div class="k-small k-muted">18 kB · planilha</div></div>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Baixar">' + icon('download', 'k-icon--sm') + '</button></div>' +
      '<span class="k-grow"></span>' +
      '<div class="k-row k-row--tight"><button class="k-btn k-btn--primary k-btn--sm" type="button">' + icon('forward', 'k-icon--sm') + 'Responder</button>' +
      '<button class="k-btn k-btn--secondary k-btn--sm" type="button">Encaminhar</button></div></div></div>' +
      '<div class="k-window__foot"><span class="k-window__status"><span class="k-dot"></span>1–12 de 248</span><span class="k-small k-mono">2,4 GB de 15 GB</span></div></div>'
    );
  }

  function patternCalendar() {
    var days = [];
    for (var d = 1; d <= 30; d++) days.push(d);
    while (days.length < 35) days.push('');
    var events = { 3: ['Revisão', 'primary'], 5: ['Sprint 14', 'success'], 12: ['Demo day', 'accent'], 17: ['Planejamento', 'primary'], 24: ['Retro', 'outline'], 27: ['Release', 'danger'] };
    var weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return (
      '<div class="k-window">' +
      '<div class="k-window__bar"><span class="k-window__lights"><i></i><i></i><i></i></span>' +
      '<span class="k-window__title">Agenda <span class="k-window__sub">— novembro de 2026</span></span>' +
      '<div class="k-window__tools"><button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Anterior">' + icon('previous', 'k-icon--sm') + '</button>' +
      '<button class="k-btn k-btn--secondary k-btn--sm" type="button">Hoje</button>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Próximo">' + icon('next', 'k-icon--sm') + '</button></div></div>' +
      '<div class="k-window__body k-window__body--pad" style="gap:10px">' +
      '<div class="k-row k-row--between"><div class="k-row k-row--tight"><span class="k-strong">Novembro</span><span class="k-small k-muted">6 eventos</span></div>' +
      '<div class="k-row k-row--tight"><div class="k-seg"><button class="k-seg__btn is-active" type="button">Mês</button><button class="k-seg__btn" type="button">Semana</button><button class="k-seg__btn" type="button">Dia</button></div>' +
      '<button class="k-btn k-btn--primary k-btn--sm" type="button">' + icon('new', 'k-icon--sm') + 'Novo evento</button></div></div>' +
      '<div class="k-row" style="align-items:stretch;gap:12px;min-height:0;flex:1">' +
      '<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:4px">' +
      '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px">' + weekdays.map(function (w) { return '<span class="k-small k-muted" style="text-align:center;font-weight:600">' + w + '</span>'; }).join('') + '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(7,1fr);grid-auto-rows:1fr;gap:4px;flex:1">' +
      days.map(function (n) {
        var ev = events[n];
        var today = n === 17;
        if (!n) return '<div style="border:var(--k-bw) dashed color-mix(in srgb,var(--k-text) 8%,transparent);border-radius:var(--k-radius-xs)"></div>';
        return '<div style="min-height:50px;border:var(--k-bw) solid ' + (today ? 'color-mix(in srgb,var(--k-primary) 48%,var(--k-border))' : 'var(--k-border)') + ';border-radius:var(--k-radius-xs);padding:4px;display:flex;flex-direction:column;gap:3px;' + (today ? 'background:color-mix(in srgb,var(--k-primary) 8%,transparent)' : '') + '">' +
          '<span class="k-small k-mono" style="font-weight:' + (today ? '700' : '400') + ';color:' + (today ? 'var(--k-primary)' : 'var(--k-muted)') + '">' + n + '</span>' +
          (ev ? '<span class="k-badge k-badge--' + ev[1] + '" style="font-size:9px;padding:1px 5px;max-width:100%;overflow:hidden;text-overflow:ellipsis">' + ev[0] + '</span>' : '') +
          '</div>';
      }).join('') + '</div></div>' +
      '<div style="width:182px;flex:none;display:flex;flex-direction:column;gap:8px;border-left:var(--k-bw) solid var(--k-border);padding-left:12px">' +
      '<div class="k-row k-row--between"><span class="k-strong k-small">Hoje, 17</span><span class="k-badge k-badge--primary">3</span></div>' +
      [['09:00', 'Planejamento semanal', 'Produto · 45 min'], ['11:30', 'Revisão de contraste', 'Design · 30 min'], ['15:00', 'Workshop de tokens', 'Equipe toda · 1 h']].map(function (e, i) {
        return '<div style="padding:7px 8px;border-left:2px solid ' + (i === 1 ? 'var(--k-accent)' : 'var(--k-primary)') + ';background:color-mix(in srgb,var(--k-text) 3%,transparent);border-radius:0 var(--k-radius-xs) var(--k-radius-xs) 0">' +
          '<div class="k-small k-mono k-muted">' + e[0] + '</div><div class="k-small k-strong">' + e[1] + '</div><div style="font-size:10px;color:var(--k-muted)">' + e[2] + '</div></div>';
      }).join('') +
      '<div class="k-divider"></div><div class="k-small k-muted">A seguir</div>' +
      '<div class="k-small"><span class="k-strong">18 nov</span> · Retrô do sprint</div>' +
      '<div class="k-small"><span class="k-strong">24 nov</span> · Retrospectiva</div>' +
      '<span class="k-grow"></span><button class="k-btn k-btn--ghost k-btn--sm k-btn--block" type="button">Ver agenda completa</button></div></div></div>' +
      '<div class="k-window__foot"><span class="k-window__status"><span class="k-dot"></span>Calendário sincronizado</span><span class="k-small k-mono">GMT−3</span></div></div>'
    );
  }

  function patternChat() {
    var chats = [
      ['Produto', '#produto', 'Você: fecho a revisão hoje', '09:42', 3, 'PR'],
      ['Marina Costa', 'online', 'Perfeito, envio os tokens.', '09:31', 1, 'MC'],
      ['Design', '#design', 'Rafael: subi os ícones.', 'Ontem', 0, 'DE'],
      ['Plataforma', '#plataforma', 'Build 284 passou.', 'Ontem', 0, 'PL'],
      ['Rafael Prado', 'há 2 h', 'Valeu! Até amanhã.', 'seg', 0, 'RP'],
    ];
    var messages = [
      ['MC', 'Marina Costa', 'Bom dia! A tabela de contraste ficou pronta.', '09:34', false],
      ['RP', 'Rafael Prado', 'Vi os ajustes no tema escuro. Ficou bem mais legível.', '09:36', false],
      ['FS', 'Você', 'Ótimo. Vou fechar a revisão hoje e publicar a 0.9.', '09:38', true],
      ['MC', 'Marina Costa', 'Lembrei de incluir os estados de foco nos botões.', '09:40', false],
      ['FS', 'Você', 'Já está no pacote. Falta só revisar o contraste do badge.', '09:42', true],
    ];
    return (
      '<div class="k-window">' +
      '<div class="k-window__bar"><span class="k-window__lights"><i></i><i></i><i></i></span>' +
      '<span class="k-window__title">Equipe Produto <span class="k-window__sub">— 5 online</span></span>' +
      '<div class="k-window__tools"><button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Chamada de voz">' + icon('voice-call', 'k-icon--sm') + '</button>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Chamada de vídeo">' + icon('video-call', 'k-icon--sm') + '</button></div></div>' +
      '<div class="k-window__body">' +
      '<div style="width:192px;flex:none;border-right:var(--k-bw) solid var(--k-border);display:flex;flex-direction:column;min-height:0;background:color-mix(in srgb,var(--k-text) 2%,var(--k-surface))">' +
      '<div style="padding:8px">' + '<div class="k-search"><input class="k-input" placeholder="Buscar conversa" style="font-size:var(--k-fs-sm);min-height:30px"></div></div>' +
      chats.map(function (c) {
        return '<div class="k-row k-row--tight" style="padding:7px 8px;border-bottom:var(--k-bw) solid var(--k-border);' + (c[1] === '#produto' ? 'background:color-mix(in srgb,var(--k-primary) 8%,transparent)' : '') + '">' +
          '<span class="k-avatar k-avatar--sm">' + c[5] + '</span><div style="flex:1;min-width:0"><div class="k-row k-row--between"><span class="k-small k-strong" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + c[0] + '</span><span style="font-size:9.5px;color:var(--k-muted)">' + c[3] + '</span></div>' +
          '<div class="k-small k-muted" style="font-size:10.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + c[2] + '</div></div>' +
          (c[4] ? '<span class="k-badge k-badge--primary" style="font-size:9px;padding:1px 6px">' + c[4] + '</span>' : '') + '</div>';
      }).join('') + '</div>' +
      '<div style="flex:1;min-width:0;display:flex;flex-direction:column;min-height:0">' +
      '<div class="k-row k-row--between" style="padding:8px 12px;border-bottom:var(--k-bw) solid var(--k-border);flex:none">' +
      '<div><div class="k-strong k-small"># produto</div><div style="font-size:10.5px;color:var(--k-muted)">8 membros · 5 online</div></div>' +
      '<div class="k-row k-row--tight"><span class="k-avatar-group"><span class="k-avatar k-avatar--sm">MC</span><span class="k-avatar k-avatar--sm">RP</span><span class="k-avatar k-avatar--sm">BL</span></span>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Fixar">' + icon('pin', 'k-icon--sm') + '</button>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Buscar">' + icon('search', 'k-icon--sm') + '</button></div></div>' +
      '<div style="flex:1;min-height:0;padding:10px 12px;display:flex;flex-direction:column;gap:8px;overflow:hidden">' +
      '<div class="k-row k-row--tight" style="justify-content:center"><span class="k-badge k-badge--outline" style="font-size:9.5px">Hoje</span></div>' +
      messages.map(function (m) {
        if (m[4]) {
          return '<div class="k-row k-row--tight" style="justify-content:flex-end"><div style="max-width:72%;background:color-mix(in srgb,var(--k-primary) 14%,var(--k-surface));border:var(--k-bw) solid color-mix(in srgb,var(--k-primary) 26%,var(--k-border));border-radius:var(--k-radius-md) var(--k-radius-md) var(--k-radius-xs) var(--k-radius-md);padding:6px 9px">' +
            '<div class="k-small">' + m[2] + '</div><div style="font-size:9.5px;color:var(--k-muted);text-align:right;margin-top:2px">' + m[3] + ' ✓✓</div></div></div>';
        }
        return '<div class="k-row" style="align-items:flex-start;gap:8px"><span class="k-avatar k-avatar--sm">' + m[0] + '</span>' +
          '<div style="max-width:72%"><div class="k-row k-row--tight"><span class="k-small k-strong">' + m[1] + '</span><span style="font-size:9.5px;color:var(--k-muted)">' + m[3] + '</span></div>' +
          '<div style="background:var(--k-surface-2);border:var(--k-bw) solid var(--k-border);border-radius:var(--k-radius-md) var(--k-radius-md) var(--k-radius-md) var(--k-radius-xs);padding:6px 9px;margin-top:2px"><div class="k-small">' + m[2] + '</div></div></div></div>';
      }).join('') + '</div>' +
      '<div class="k-row k-row--tight" style="padding:8px;border-top:var(--k-bw) solid var(--k-border);flex:none">' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Anexar">' + icon('attach', 'k-icon--sm') + '</button>' +
      '<input class="k-input" style="flex:1;min-height:32px" placeholder="Mensagem para #produto">' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Emoji">' + icon('emoji', 'k-icon--sm') + '</button>' +
      '<button class="k-btn k-btn--primary k-btn--icon k-btn--sm" type="button" aria-label="Enviar">' + icon('send', 'k-icon--sm') + '</button></div></div></div></div>'
    );
  }

  function patternKanban() {
    var cols = [
      ['A fazer', 'var(--k-muted)', [['Pesquisa', 'Pesquisa com 8 usuários', 'MC', 4, 2], ['Tokens', 'Documentar papéis de cor', 'RP', 2, 0], ['Ícones', 'Revisar traço em 24px', 'BL', 1, 1]]],
      ['Em progresso', 'var(--k-primary)', [['Componentes', 'Estados de foco nos botões', 'FS', 6, 3], ['Acessibilidade', 'Contraste AA no tema escuro', 'MC', 3, 1]]],
      ['Revisão', 'var(--k-accent)', [['Entrega', 'Pacote HTML + CSS', 'RP', 2, 2], ['Guia', 'Página de primeiros passos', 'BL', 5, 0]]],
    ];
    return (
      '<div class="k-stack">' +
      '<div class="k-row k-row--between"><div><h2 class="k-h2">Sprint 14</h2><p class="k-small k-muted">17 a 28 de novembro · 7 cartões</p></div>' +
      '<div class="k-row k-row--tight"><span class="k-avatar-group"><span class="k-avatar k-avatar--sm">FS</span><span class="k-avatar k-avatar--sm">MC</span><span class="k-avatar k-avatar--sm">RP</span><span class="k-avatar k-avatar--sm">BL</span></span>' +
      '<button class="k-btn k-btn--secondary k-btn--sm" type="button">' + icon('filters', 'k-icon--sm') + 'Filtrar</button>' +
      '<button class="k-btn k-btn--primary k-btn--sm" type="button">' + icon('new', 'k-icon--sm') + 'Novo cartão</button></div></div>' +
      '<div class="k-row" style="align-items:stretch;gap:10px">' +
      cols.map(function (col) {
        return '<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:8px;padding:8px;border:var(--k-bw) solid var(--k-border);border-radius:var(--k-radius-md);background:color-mix(in srgb,var(--k-text) 3%,var(--k-surface))">' +
          '<div class="k-row k-row--between" style="padding:0 2px"><span class="k-row k-row--tight"><span class="k-dot" style="background:' + col[1] + '"></span><span class="k-small k-strong">' + col[0] + '</span><span class="k-badge k-badge--outline" style="font-size:9px;padding:1px 6px">' + col[2].length + '</span></span>' +
          '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Adicionar">' + icon('new', 'k-icon--sm') + '</button></div>' +
          col[2].map(function (c) {
            return '<div style="background:var(--k-surface);border:var(--k-bw) solid var(--k-border);border-radius:var(--k-radius-sm);padding:9px;display:flex;flex-direction:column;gap:6px;box-shadow:var(--k-shadow-sm)">' +
              '<span class="k-badge k-badge--outline" style="align-self:flex-start;font-size:9px;padding:1px 7px">' + c[0] + '</span>' +
              '<div class="k-small k-strong">' + c[1] + '</div>' +
              '<div class="k-row k-row--between"><span class="k-avatar k-avatar--sm" style="width:20px;height:20px;font-size:9px">' + c[2] + '</span>' +
              '<span class="k-row k-row--tight k-small k-muted" style="gap:5px">' + icon('comment', 'k-icon--sm') + c[3] + icon('attach', 'k-icon--sm') + c[4] + '</span></div></div>';
          }).join('') +
          '<button class="k-btn k-btn--ghost k-btn--sm" type="button" style="border:var(--k-bw) dashed var(--k-border);color:var(--k-muted)">+ Adicionar cartão</button></div>';
      }).join('') + '</div></div>'
    );
  }

  function patternDesktop() {
    var deskIcons = [['folder', 'Arquivos'], ['pictures', 'Fotos'], ['settings', 'Ajustes']];
    var docs = [['folder', 'Projetos', 'Hoje, 09:12'], ['pages', 'briefing-final.md', 'Ontem'], ['pictures', 'capa-atlas.png', '12 nov'], ['music', 'trilha-foco.mp3', '08 nov']];
    var menus = [['arquivo', 'Arquivo'], ['editar', 'Editar'], ['ver', 'Ver'], ['janela', 'Janela']];
    var dock = [['folder', 'Arquivos', 'arquivos'], ['pictures', 'Fotos', ''], ['music', 'Música', 'musica'], ['chat', 'Mensagens', ''], ['events', 'Agenda', ''], ['settings', 'Ajustes', ''], ['shopping', 'Loja', '']];
    function controls() {
      return '<div class="k-window__controls">' +
        '<button class="k-window__ctrl" type="button" data-win="min" aria-label="Minimizar" title="Minimizar">' + icon('minimize', 'k-icon--sm') + '</button>' +
        '<button class="k-window__ctrl" type="button" data-win="max" aria-label="Maximizar" title="Maximizar">' + icon('full-screen', 'k-icon--sm') + '</button>' +
        '<button class="k-window__ctrl k-window__ctrl--close" type="button" data-win="close" aria-label="Fechar" title="Fechar">' + icon('close', 'k-icon--sm') + '</button></div>';
    }
    return (
      '<div data-float-stage style="position:relative;height:408px;border-radius:var(--k-radius-lg);overflow:hidden;--float-safe-top:26px;border:var(--k-bw) solid color-mix(in srgb,var(--k-text) 20%,transparent);' + wallpaper() + '">' +
      '<div style="position:absolute;inset:0;background:radial-gradient(circle at 75% 15%,color-mix(in srgb,var(--k-surface) 50%,transparent),transparent 42%),radial-gradient(circle at 20% 85%,color-mix(in srgb,var(--k-text) 10%,transparent),transparent 56%)"></div>' +
      '<div style="position:relative;display:flex;align-items:center;gap:13px;height:26px;padding:0 12px;background:color-mix(in srgb,var(--k-surface) 84%,transparent);border-bottom:var(--k-bw) solid var(--k-border);border-radius:max(0px,calc(var(--k-radius-lg) - var(--k-bw))) max(0px,calc(var(--k-radius-lg) - var(--k-bw))) 0 0;overflow:hidden;color:var(--k-text);font-size:10.5px;backdrop-filter:blur(8px)">' +
      '<span class="k-row k-row--tight"><span style="width:9px;height:9px;border-radius:var(--k-radius-xs);background:var(--k-primary);border:var(--k-bw) solid var(--k-border);display:inline-block"></span><strong>Atlas OS</strong></span>' +
      menus.map(function (m) {
        return '<button class="k-os-menu" type="button" data-os-menu="' + m[0] + '" aria-haspopup="menu" aria-expanded="false">' + m[1] + '</button>';
      }).join('') +
      '<span style="margin-left:auto">Ter, 17 nov</span><span class="k-mono">09:41</span>' + icon('stats', 'k-icon--sm') +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" data-os-volume-toggle aria-label="Volume" aria-haspopup="dialog" aria-expanded="false" style="width:20px;height:20px;min-height:20px;padding:0">' + icon('mute', 'k-icon--sm') + '</button>' +
      '<span class="k-avatar k-avatar--sm" style="width:18px;height:18px;font-size:9px">FS</span></div>' +
      '<div style="position:absolute;top:42px;left:14px;display:flex;flex-direction:column;gap:10px;color:var(--k-text);text-align:center">' +
      deskIcons.map(function (d) {
        return '<button class="k-os-icon" type="button" data-os-icon="' + d[1] + '" aria-pressed="false">' +
          '<span style="width:34px;height:34px;border-radius:var(--k-radius-sm);display:grid;place-items:center;background:color-mix(in srgb,var(--k-surface) 72%,transparent);border:var(--k-bw) solid var(--k-border)">' + icon(d[0], 'k-icon--sm') + '</span>' +
          '<span style="font-size:9.5px">' + d[1] + '</span></button>';
      }).join('') + '</div>' +
      '<div class="k-window k-window--float" data-os-window="arquivos" style="position:absolute;top:48px;left:96px;width:326px">' +
      '<div class="k-window__bar" tabindex="0" title="Arraste para mover a janela"><span class="k-window__lights"><i></i><i></i><i></i></span><span class="k-window__title">Arquivos</span>' + controls() + '</div>' +
      '<div class="k-window__body k-window__body--pad" style="gap:6px">' +
      '<div class="k-row k-row--between"><span class="k-small k-muted">Início / Projetos</span>' + icon('search', 'k-icon--sm') + '</div>' +
      docs.map(function (f) {
        return '<div class="k-row k-row--tight" style="padding:5px 6px;border-radius:var(--k-radius-xs);background:color-mix(in srgb,var(--k-text) 3%,transparent)">' + icon(f[0], 'k-icon--sm') +
          '<span class="k-small k-grow">' + f[1] + '</span><span style="font-size:9.5px;color:var(--k-muted)">' + f[2] + '</span></div>';
      }).join('') + '</div></div>' +
      '<div class="k-window k-window--float" data-os-window="musica" style="position:absolute;right:14px;bottom:54px;width:242px">' +
      '<div class="k-window__bar" tabindex="0" title="Arraste para mover a janela"><span class="k-window__lights"><i></i><i></i><i></i></span><span class="k-window__title">Música</span>' + controls() + '</div>' +
      '<div class="k-window__body k-window__body--pad" style="gap:8px">' +
      '<div class="k-row k-row--tight"><span style="width:42px;height:42px;border-radius:var(--k-radius-sm);flex:none;background:linear-gradient(135deg,color-mix(in srgb,var(--k-primary) 90%,var(--k-surface-2)),color-mix(in srgb,var(--k-accent) 80%,var(--k-surface-2)));display:grid;place-items:center;color:var(--k-on-primary)">' + icon('music', 'k-icon--sm') + '</span>' +
      '<div style="min-width:0"><div class="k-small k-strong">Sinais Lentos</div><div style="font-size:10px;color:var(--k-muted)">Atlas Ensemble</div></div></div>' +
      '<div><div class="k-meter" style="font-size:9.5px"><span>01:24</span><span>04:58</span></div><div class="k-progress k-progress--xs"><div class="k-progress__bar" style="width:28%"></div></div></div>' +
      '<div class="k-row" style="justify-content:center;gap:2px"><button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Anterior">' + icon('back', 'k-icon--sm') + '</button>' +
      '<button class="k-btn k-btn--primary k-btn--icon k-btn--sm" type="button" aria-label="Reproduzir" style="width:32px;height:32px;min-height:32px;padding:0;border-radius:var(--k-radius-round)">' + icon('play', 'k-icon--sm') + '</button>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Próxima">' + icon('forward', 'k-icon--sm') + '</button></div></div></div>' +
      '<div class="k-os-volume" data-os-volume-pop hidden role="dialog" aria-label="Volume" style="position:absolute;right:12px;top:34px;z-index:230">' +
      '<span class="k-mono" data-os-volume-value style="font-size:9.5px">68</span>' +
      '<div class="k-os-volume__track" data-os-volume-track role="slider" tabindex="0" aria-label="Volume" aria-orientation="vertical" aria-valuemin="0" aria-valuemax="100" aria-valuenow="68">' +
      '<span class="k-os-volume__fill" data-os-volume-fill style="height:68%"></span>' +
      '<span class="k-os-volume__thumb" data-os-volume-thumb style="bottom:68%"></span></div></div>' +
      '<div class="k-os-dock" data-os-dock-bar>' +
      dock.map(function (d, i) {
        return '<button class="k-os-dock__item' + (i === 0 ? ' is-active' : '') + '" type="button" aria-label="' + d[1] + '"' + (d[2] ? ' data-os-dock="' + d[2] + '" data-open="true"' : '') + '>' + icon(d[0], 'k-icon--sm') + '</button>';
      }).join('') + '</div></div>'
    );
  }

  function patternPreferences() {
    var cats = [['settings', 'Geral', true], ['color', 'Aparência', false], ['account', 'Conta', false], ['private', 'Privacidade', false], ['cpu-meter', 'Avançado', false]];
    var swatches = ['#C6F24E', '#5AA9FF', '#FF7A59', '#B07CFF', '#4FD1A5', '#F2C94C', '#E5E9F0'];
    return (
      '<div class="k-window">' +
      '<div class="k-window__bar"><span class="k-window__lights"><i></i><i></i><i></i></span>' +
      '<span class="k-window__title">Preferências</span>' +
      '<div class="k-window__tools"><button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Fechar">' + icon('close', 'k-icon--sm') + '</button></div></div>' +
      '<div class="k-window__body">' +
      '<div class="k-window__rail" style="width:150px">' +
      cats.map(function (c) {
        return '<a class="k-sidebar__item' + (c[2] ? ' is-active' : '') + '" href="#">' + icon(c[0], 'k-icon--sm') + '<span class="k-sidebar__item__label">' + c[1] + '</span></a>';
      }).join('') +
      '<span class="k-grow"></span><div class="k-small k-muted" style="padding:0 10px">v0.9 · build 284</div></div>' +
      '<div class="k-window__content" style="padding:14px 16px;overflow:hidden">' +
      '<h3 class="k-h3">Aparência</h3><p class="k-small k-muted" style="margin-top:2px">Defina como o kit é exibido neste dispositivo.</p>' +
      '<div class="k-stack k-stack--sm" style="margin-top:12px">' +
      '<div class="k-row k-row--between"><div><div class="k-small k-strong">Tema</div><div class="k-small k-muted">Aplicado a todas as telas.</div></div>' +
      '<div class="k-seg"><button class="k-seg__btn" type="button">Claro</button><button class="k-seg__btn is-active" type="button">Escuro</button><button class="k-seg__btn" type="button">Automático</button></div></div>' +
      '<div class="k-row k-row--between" style="margin-top:10px"><div><div class="k-small k-strong">Cor de destaque</div><div class="k-small k-muted">Usada em ações e seleção.</div></div>' +
      '<div class="k-row k-row--tight">' + swatches.map(function (c, i) {
        return '<button type="button" aria-label="Cor ' + (i + 1) + '" style="width:22px;height:22px;border-radius:var(--k-radius-round);background:' + c + ';border:2px solid ' + (i === 0 ? 'var(--k-text)' : 'transparent') + ';box-shadow:var(--k-shadow-sm);cursor:pointer"></button>';
      }).join('') + '</div></div>' +
      '<div class="k-divider" style="margin:2px 0"></div>' +
      '<label class="k-switch"><input type="checkbox" checked><span class="k-switch__track"></span>Reduzir movimento nas transições</label>' +
      '<label class="k-switch"><input type="checkbox"><span class="k-switch__track"></span>Aumentar contraste de textos secundários</label>' +
      '<div class="k-row" style="gap:12px;margin-top:6px"><label class="k-field k-grow"><span class="k-field__label">Densidade</span><select class="k-select"><option>Confortável</option><option>Compacta</option></select></label>' +
      '<label class="k-field k-grow"><span class="k-field__label">Escala do texto</span><select class="k-select"><option>100%</option><option>110%</option></select></label></div>' +
      '<div class="k-alert k-alert--info" style="margin-top:6px"><span class="k-alert__icon">' + icon('help', 'k-icon--sm') + '</span><div class="k-alert__body"><div class="k-alert__text">Estas preferências valem só para este navegador.</div></div></div>' +
      '</div></div></div>' +
      '<div class="k-window__foot"><span class="k-window__status"><span class="k-dot"></span>Alterações salvas automaticamente</span>' +
      '<span class="k-row k-row--tight"><button class="k-btn k-btn--ghost k-btn--sm" type="button">Restaurar</button><button class="k-btn k-btn--primary k-btn--sm" type="button">Concluir</button></span></div></div>'
    );
  }

  function patternWebapp() {
    var rows = [['Atlas Web', 'Em andamento', 'success', '12', '09:41'], ['Norte Loja', 'Em revisão', 'primary', '8', 'ontem'], ['Painel de dados', 'Concluído', 'outline', '24', '14 nov']];
    return (
      '<div class="k-window">' +
      '<div class="k-window__bar"><span class="k-window__lights"><i></i><i></i><i></i></span>' +
      '<div class="k-input" style="flex:1;max-width:308px;display:flex;align-items:center;gap:6px;min-height:24px;padding:2px 9px;font-size:10.5px;color:var(--k-muted);box-shadow:none">' + icon('private', 'k-icon--sm') + 'app.atlas.dev/projetos</div>' +
      '<div class="k-window__tools"><button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Atualizar">' + icon('refresh', 'k-icon--sm') + '</button>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Mais">' + icon('more-options', 'k-icon--sm') + '</button></div></div>' +
      '<div class="k-window__body k-window__body--pad" style="gap:10px;overflow:hidden">' +
      '<div class="k-appbar" style="padding:6px 10px">' +
      '<span class="k-appbar__brand"><span class="k-avatar k-avatar--sm k-avatar--solid">K</span>Atlas</span>' +
      '<nav class="k-appbar__nav"><a class="k-appbar__link is-active" href="#">Projetos</a><a class="k-appbar__link" href="#">Equipe</a><a class="k-appbar__link" href="#">Relatórios</a></nav>' +
      '<span class="k-grow"></span><div class="k-search" style="width:150px"><input class="k-input" placeholder="Buscar" style="min-height:28px;font-size:var(--k-fs-sm)"></div>' +
      '<span class="k-avatar k-avatar--sm">FS</span></div>' +
      '<div class="k-row k-row--between"><div><h2 class="k-h2">Projetos</h2><p class="k-small k-muted">6 ativos · 2 em revisão</p></div>' +
      '<div class="k-row k-row--tight"><div class="k-seg"><button class="k-seg__btn is-active" type="button">Todos</button><button class="k-seg__btn" type="button">Meus</button></div>' +
      '<button class="k-btn k-btn--primary k-btn--sm" type="button">' + icon('new', 'k-icon--sm') + 'Novo projeto</button></div></div>' +
      '<div class="k-grid">' + statCard('Projetos ativos', '6', '+2 este mês', [30, 42, 38, 55, 62, 70, 84]) + statCard('Taxa de conclusão', '82%', '+6 pp', [40, 44, 52, 50, 58, 66, 72]) + statCard('Tempo médio', '4,2 d', '−0,8 d', [72, 66, 60, 54, 48, 42, 36], true) + '</div>' +
      '<div class="k-row" style="align-items:stretch;gap:10px">' +
      '<div class="k-card" style="flex:2;min-width:0;padding:0"><div class="k-row k-row--between" style="padding:9px 12px;border-bottom:var(--k-bw) solid var(--k-border)"><span class="k-strong k-small">Projetos recentes</span><span class="k-badge k-badge--outline">3 de 6</span></div>' +
      '<div class="k-table__wrap"><table class="k-table"><thead><tr><th>Nome</th><th>Status</th><th class="k-num">Arquivos</th><th class="k-num">Alterado</th></tr></thead><tbody>' +
      rows.map(function (r) {
        return '<tr><td class="k-strong">' + r[0] + '</td><td><span class="k-badge k-badge--' + r[2] + '">' + r[1] + '</span></td><td class="k-num">' + r[3] + '</td><td class="k-num k-small k-muted">' + r[4] + '</td></tr>';
      }).join('') + '</tbody></table></div></div>' +
      '<div class="k-card" style="width:206px;flex:none;padding:10px"><div class="k-row k-row--between"><span class="k-strong k-small">Atividade</span><span class="k-dot"></span></div>' +
      '<div class="k-stack k-stack--sm" style="margin-top:8px">' +
      [['MC', 'Marina revisou os tokens', '09:41'], ['RP', 'Rafael publicou a v0.9', '08:12'], ['BL', 'Beatriz adicionou 3 ícones', 'ontem']].map(function (a) {
        return '<div class="k-row k-row--tight" style="align-items:flex-start"><span class="k-avatar k-avatar--sm" style="width:20px;height:20px;font-size:9px">' + a[0] + '</span><div style="min-width:0"><div style="font-size:10.5px;line-height:1.35">' + a[1] + '</div><div style="font-size:9.5px;color:var(--k-muted)">' + a[2] + '</div></div></div>';
      }).join('') + '</div></div></div></div></div>'
    );
  }

  function patternStore() {
    return (
      '<div class="k-stack">' +
      '<div class="k-appbar" style="padding:6px 10px"><span class="k-appbar__brand">Norte</span>' +
      '<nav class="k-appbar__nav"><a class="k-appbar__link is-active" href="#">Loja</a><a class="k-appbar__link" href="#">Coleções</a><a class="k-appbar__link" href="#">Diário</a><a class="k-appbar__link" href="#">Sobre</a></nav>' +
      '<span class="k-grow"></span><button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Buscar">' + icon('search', 'k-icon--sm') + '</button>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Sacola" style="position:relative">' + icon('shopping', 'k-icon--sm') + '<span class="k-badge k-badge--primary" style="position:absolute;top:-2px;right:-2px;font-size:8px;padding:0 4px">2</span></button>' +
      '<span class="k-avatar k-avatar--sm">FS</span></div>' +
      '<div class="k-row" style="align-items:stretch;gap:18px">' +
      '<div style="flex:1.05;min-width:0;display:flex;flex-direction:column;gap:8px">' +
      '<div style="position:relative;height:216px;border-radius:var(--k-radius-md);overflow:hidden;' + art('#D9C6A8', '#B79B77', '#6E5540') + '">' +
      '<div style="position:absolute;inset:0;background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.4),transparent 48%),radial-gradient(circle at 70% 80%,rgba(0,0,0,.22),transparent 55%)"></div>' +
      '<span style="position:absolute;left:50%;top:52%;transform:translate(-50%,-50%);color:rgba(255,255,255,.62)">' + icon('pictures', 'k-icon--xl') + '</span>' +
      '<span class="k-badge" style="position:absolute;left:10px;top:10px;background:rgba(20,18,16,.6);color:#fff;border-color:transparent">Edição limitada</span></div>' +
      '<div class="k-row k-row--tight">' + ['#D9C6A8', '#8C9C8B', '#4E5566', '#C08A6A'].map(function (c, i) {
        return '<button type="button" aria-label="Foto ' + (i + 1) + '" style="flex:1;height:46px;border-radius:var(--k-radius-xs);border:2px solid ' + (i === 0 ? 'var(--k-primary)' : 'transparent') + ';' + art(c, c, '#5A4A3C') + ';cursor:pointer"></button>';
      }).join('') + '</div></div>' +
      '<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:7px">' +
      '<span class="k-eyebrow">Norte Casa · Série Arco</span><h1 class="k-h1" style="font-size:calc(var(--k-fs-h1) * .72)">Cadeira Arco</h1>' +
      '<div class="k-row k-row--tight"><span class="k-row k-row--tight" style="gap:1px;color:var(--k-primary)">' + [0, 1, 2, 3, 4].map(function () { return icon('star', 'k-icon--sm'); }).join('') + '</span>' +
      '<span class="k-small k-muted">4,9 · 128 avaliações</span></div>' +
      '<div class="k-row k-row--tight" style="align-items:baseline"><span class="k-h2">R$ 1.290</span><span class="k-small k-muted" style="text-decoration:line-through">R$ 1.590</span><span class="k-badge k-badge--success">−19%</span></div>' +
      '<p class="k-small k-muted">Estrutura em freijó maciço, assento curvado e acabamento natural. Feita sob encomenda em 12 dias.</p>' +
      '<div class="k-divider" style="margin:1px 0"></div>' +
      '<div class="k-row k-row--between"><span class="k-small k-strong">Cor</span><span class="k-small k-muted">Freijó natural</span></div>' +
      '<div class="k-row k-row--tight">' + ['#B79B77', '#8C9C8B', '#4E5566'].map(function (c, i) {
        return '<button type="button" aria-label="Acabamento ' + (i + 1) + '" style="width:22px;height:22px;border-radius:var(--k-radius-round);background:' + c + ';border:2px solid ' + (i === 0 ? 'var(--k-text)' : 'transparent') + ';cursor:pointer"></button>';
      }).join('') + '</div>' +
      '<div class="k-row k-row--between" style="margin-top:2px"><span class="k-small k-strong">Tamanho</span><div class="k-seg"><button class="k-seg__btn" type="button">P</button><button class="k-seg__btn is-active" type="button">M</button><button class="k-seg__btn" type="button">G</button></div></div>' +
      '<div class="k-row k-row--tight" style="margin-top:4px"><button class="k-btn k-btn--primary k-grow" type="button">' + icon('shopping', 'k-icon--sm') + 'Adicionar à sacola</button>' +
      '<button class="k-btn k-btn--secondary k-btn--icon" type="button" aria-label="Favoritar">' + icon('favorite', 'k-icon--sm') + '</button></div>' +
      '<div class="k-small k-muted">' + icon('shopping', 'k-icon--sm') + ' Frete grátis acima de R$ 500 · chega em 12 dias úteis</div></div></div>' +
      '<div class="k-grid">' +
      [['shopping', 'Frete grátis', 'Todo o Brasil'], ['refresh', '30 dias', 'Troca sem custo'], ['protect', '2 anos', 'Garantia de estrutura']].map(function (b) {
        return '<div class="k-card k-card--flat" style="padding:8px 10px;display:flex;align-items:center;gap:8px">' + icon(b[0], 'k-icon--sm') +
          '<div><div class="k-small k-strong">' + b[1] + '</div><div class="k-small k-muted" style="font-size:10px">' + b[2] + '</div></div></div>';
      }).join('') + '</div></div>'
    );
  }

  function patternArticle() {
    return (
      '<div style="max-width:638px;margin:0 auto;display:flex;flex-direction:column;gap:11px">' +
      '<div class="k-row k-row--between"><div class="k-row k-row--tight k-small k-muted"><span>Revista</span><span>/</span><span>Ensaios</span></div><span class="k-badge k-badge--outline">8 min de leitura</span></div>' +
      '<h1 class="k-h1" style="font-size:calc(var(--k-fs-h1) * .82)">O que um bom sistema de design deixa de fora</h1>' +
      '<p class="k-lead" style="font-size:var(--k-fs);max-width:none">Menos componentes, mais decisões registradas. A curadoria é o que transforma uma biblioteca em linguagem.</p>' +
      '<div class="k-row k-row--between"><div class="k-row k-row--tight"><span class="k-avatar k-avatar--sm">FS</span><div><div class="k-small k-strong">Felipe Simões</div><div style="font-size:10px;color:var(--k-muted)">17 de novembro de 2026</div></div></div>' +
      '<div class="k-row k-row--tight"><button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Favoritar">' + icon('favorite', 'k-icon--sm') + '</button>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Compartilhar">' + icon('share', 'k-icon--sm') + '</button></div></div>' +
      '<div style="position:relative;height:132px;border-radius:var(--k-radius-md);overflow:hidden;' + art('#22304A', '#4A3550', '#B0704F') + '">' +
      '<div style="position:absolute;inset:0;background:radial-gradient(circle at 25% 20%,rgba(255,255,255,.22),transparent 45%)"></div>' +
      '<span class="k-small" style="position:absolute;left:12px;bottom:10px;color:#fff;opacity:.85">Coleção de padrões · Atlas, 2026</span></div>' +
      '<p class="k-small">Todo kit começa generoso e termina seletivo. O valor não está no número de peças, mas na clareza do que cada uma resolve. Quando um componente serve para tudo, ele não comunica nada.</p>' +
      '<blockquote style="margin:0;padding:8px 14px;border-left:3px solid var(--k-primary);background:color-mix(in srgb,var(--k-primary) 6%,transparent);border-radius:0 var(--k-radius-sm) var(--k-radius-sm) 0">' +
      '<p style="font-size:var(--k-fs-lg);line-height:1.4">“Um sistema maduro é medido pelo que recusa, não pelo que acumula.”</p></blockquote>' +
      '<p class="k-small k-muted">A curadoria também é documentação: cada remoção precisa de uma justificativa e um caminho alternativo. É assim que a linguagem se mantém coerente entre times.</p>' +
      '<div class="k-row k-row--between" style="border-top:var(--k-bw) solid var(--k-border);padding-top:10px">' +
      '<div class="k-row k-row--tight">' + ['Design system', 'Curadoria', 'Processo'].map(function (t) { return '<span class="k-tag">' + t + '</span>'; }).join('') + '</div>' +
      '<button class="k-btn k-btn--ghost k-btn--sm" type="button">' + icon('bookmark', 'k-icon--sm') + 'Salvar</button></div></div>'
    );
  }

  function patternProfile() {
    var works = [
      ['Atlas Web', 'Produto · 2026', '#23304F', '#4E2F58'],
      ['Norte Loja', 'E-commerce · 2026', '#6E5540', '#B79B77'],
      ['Painel de dados', 'Dashboard · 2025', '#2F4045', '#3E5560'],
    ];
    return (
      '<div class="k-card" style="padding:0;overflow:hidden">' +
      '<div style="height:104px;' + art('#22304A', '#4A3550', '#B0704F') + '"></div>' +
      '<div style="padding:0 16px 14px">' +
      '<div class="k-row" style="align-items:flex-end;margin-top:-28px;gap:12px">' +
      '<span class="k-avatar k-avatar--solid" style="width:58px;height:58px;font-size:19px;border:3px solid var(--k-surface)">FS</span>' +
      '<div class="k-grow" style="min-width:0"><h2 class="k-h2" style="margin-top:26px">Felipe Simões</h2><div class="k-small k-muted">@fimis · São Paulo, Brasil</div></div>' +
      '<button class="k-btn k-btn--primary k-btn--sm" type="button">' + icon('invite-members', 'k-icon--sm') + 'Seguir</button>' +
      '<button class="k-btn k-btn--secondary k-btn--sm" type="button">Mensagem</button>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Mais">' + icon('more-options', 'k-icon--sm') + '</button></div>' +
      '<p class="k-small" style="margin-top:8px;max-width:44ch">Designer de interfaces. Construo sistemas visuais, tokens e componentes que escalam com o time.</p>' +
      '<div class="k-row" style="gap:18px;margin-top:10px">' +
      [['24', 'Projetos'], ['1,8 mil', 'Seguidores'], ['312', 'Seguindo']].map(function (s) {
        return '<div><span class="k-strong">' + s[0] + '</span> <span class="k-small k-muted">' + s[1] + '</span></div>';
      }).join('') + '</div>' +
      '<div class="k-tabs" style="margin-top:12px"><button class="k-tab" aria-selected="true" type="button">Trabalhos</button>' +
      '<button class="k-tab" type="button">Sobre</button><button class="k-tab" type="button">Atividade</button></div></div></div>' +
      '<div class="k-grid" style="margin-top:12px">' +
      works.map(function (w) {
        return '<article class="k-card" style="padding:0;overflow:hidden"><div style="height:84px;' + art(w[2], w[3], '#8A6A52') + '"></div>' +
          '<div style="padding:9px 10px"><div class="k-small k-strong">' + w[0] + '</div><div class="k-small k-muted" style="font-size:10px">' + w[1] + '</div>' +
          '<div class="k-row k-row--tight" style="margin-top:8px"><span class="k-badge k-badge--outline" style="font-size:9px;padding:1px 6px">web</span><span class="k-grow"></span>' +
          '<span class="k-small k-muted" style="display:inline-flex;align-items:center;gap:3px">' + icon('like', 'k-icon--sm') + ' 128</span></div></div></article>';
      }).join('') + '</div>'
    );
  }

  function patternComments() {
    var thread = [
      ['MC', 'Marina Costa', 'há 12 min', 'O contraste do título ficou baixo sobre a imagem. Podemos escurecer o véu?', false, false],
      ['RP', 'Rafael Prado', 'há 9 min', 'Ajustei o gradiente para 4.8:1 e subi a opacidade do véu.', true, false],
      ['BL', 'Beatriz Lima', 'há 4 min', 'Ficou ótimo. Aprovo a versão 3 para publicar.', false, true],
    ];
    return (
      '<div class="k-window">' +
      '<div class="k-window__bar"><span class="k-window__lights"><i></i><i></i><i></i></span>' +
      '<span class="k-window__title">Revisão <span class="k-window__sub">— capa-atlas.png · versão 3</span></span>' +
      '<div class="k-window__tools"><button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Aprovar">' + icon('accept', 'k-icon--sm') + '</button>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Rejeitar">' + icon('reject', 'k-icon--sm') + '</button>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Mais">' + icon('more-options', 'k-icon--sm') + '</button></div></div>' +
      '<div class="k-window__body">' +
      '<div class="k-window__content" style="display:flex;flex-direction:column;gap:8px">' +
      '<div class="k-row k-row--between"><span class="k-small k-muted">Capa · 1600 × 900</span>' +
      '<span class="k-row k-row--tight"><span class="k-badge k-badge--outline">PNG</span><span class="k-badge k-badge--success">3 aprovadas</span></span></div>' +
      '<div style="position:relative;height:232px;border-radius:var(--k-radius-md);overflow:hidden;' + art('#1D2740', '#3B2A52', '#8C4A3E') + '">' +
      '<div style="position:absolute;inset:0;background:radial-gradient(circle at 26% 22%,rgba(255,255,255,.2),transparent 44%),linear-gradient(180deg,transparent 40%,rgba(8,10,14,.52))"></div>' +
      '<span class="k-eyebrow" style="position:absolute;left:16px;top:31%;color:rgba(255,255,255,.7)">Coleção 2026</span>' +
      '<div style="position:absolute;left:16px;bottom:16px;color:#fff"><div style="font-size:24px;font-weight:700;line-height:1.1;letter-spacing:-.02em">Interfaces que<br>começam prontas</div>' +
      '<div class="k-small" style="opacity:.72;margin-top:5px">Um kit vetorial com oito estilos</div></div>' +
      '<span style="position:absolute;left:49%;top:33%;width:26px;height:26px;border-radius:var(--k-radius-round) var(--k-radius-round) var(--k-radius-round) 3px;background:var(--k-primary);color:var(--k-on-primary);display:grid;place-items:center;font-size:11px;font-weight:700;box-shadow:0 6px 16px rgba(0,0,0,.4)">2</span>' +
      '<span style="position:absolute;right:76px;bottom:62px;width:24px;height:24px;border-radius:var(--k-radius-round) var(--k-radius-round) 3px var(--k-radius-round);background:var(--k-accent);color:var(--k-on-primary);display:grid;place-items:center;font-size:10px;font-weight:700;box-shadow:0 6px 16px rgba(0,0,0,.4)">3</span></div>' +
      '<div class="k-row k-row--between"><span class="k-row k-row--tight">' +
      [1, 2, 3, 4].map(function (i) {
        return '<span style="width:38px;height:26px;border-radius:var(--k-radius-xs);border:2px solid ' + (i === 1 ? 'var(--k-primary)' : 'transparent') + ';' + art(i % 2 ? '#31405E' : '#4A3355', i % 2 ? '#6A4A62' : '#7A5C4A', '#B08A6A') + '"></span>';
      }).join('') + '</span>' +
      '<button class="k-btn k-btn--ghost k-btn--sm" type="button">' + icon('download', 'k-icon--sm') + 'Baixar</button></div></div>' +
      '<div style="width:264px;flex:none;border-left:var(--k-bw) solid var(--k-border);display:flex;flex-direction:column">' +
      '<div class="k-row k-row--between" style="padding:10px 12px;border-bottom:var(--k-bw) solid var(--k-border)"><span class="k-strong k-small">Comentários</span><span class="k-badge">3</span></div>' +
      '<div style="padding:6px 12px;border-bottom:var(--k-bw) solid var(--k-border)"><div class="k-seg"><button class="k-seg__btn is-active" type="button">Abertos</button><button class="k-seg__btn" type="button">Resolvidos</button></div></div>' +
      '<div style="padding:10px 12px;display:flex;flex-direction:column;gap:12px">' +
      thread.map(function (c, i) {
        return '<div' + (i === 1 ? ' style="border-left:2px solid var(--k-border);padding-left:9px;margin-left:8px"' : '') + '>' +
          '<div class="k-row k-row--tight"><span class="k-avatar k-avatar--sm">' + c[0] + '</span><span class="k-small k-strong">' + c[1] + '</span><span class="k-grow"></span>' +
          '<span style="font-size:9.5px;color:var(--k-muted);white-space:nowrap">' + c[2] + '</span>' +
          (c[5] ? '<span class="k-badge k-badge--success" style="font-size:8.5px;padding:1px 6px">Resolvido</span>' : '') + '</div>' +
          '<div class="k-small" style="margin-top:4px;color:' + (i === 2 ? 'var(--k-muted)' : 'inherit') + '">' + c[3] + '</div></div>';
      }).join('') + '</div>' +
      '<span class="k-grow"></span>' +
      '<div style="padding:10px 12px;border-top:var(--k-bw) solid var(--k-border);display:flex;flex-direction:column;gap:7px">' +
      '<textarea class="k-input" rows="2" style="resize:none;font-size:var(--k-fs-sm);padding-left:var(--k-pad-x)" placeholder="Responder a Rafael…"></textarea>' +
      '<div class="k-row k-row--between"><span class="k-small k-muted">' + icon('attach', 'k-icon--sm') + ' Anexar</span>' +
      '<button class="k-btn k-btn--primary k-btn--sm" type="button">' + icon('send', 'k-icon--sm') + 'Comentar</button></div></div></div></div>' +
      '<div class="k-window__foot"><span class="k-window__status"><span class="k-dot"></span>3 de 5 comentários resolvidos</span><span class="k-small k-mono">v3 · hoje</span></div></div>'
    );
  }

  function patternCheckout() {
    var items = [
      ['Cadeira Arco', 'Freijó natural · M', 'R$ 1.290', '#B79B77', '#6E5540'],
      ['Luminária Pilar', 'Preto fosco · 40 cm', 'R$ 389', '#4E5566', '#2F333D'],
      ['Vaso Terra', 'Cerâmica crua', 'R$ 149', '#C08A6A', '#7A4A36'],
    ];
    var steps = [
      ['1', 'Sacola', 'done'],
      ['2', 'Entrega', 'active'],
      ['3', 'Pagamento', ''],
    ];
    return (
      '<div class="k-window">' +
      '<div class="k-window__bar"><span class="k-window__lights"><i></i><i></i><i></i></span>' +
      '<span class="k-window__title">Finalizar compra <span class="k-window__sub">— 3 itens</span></span>' +
      '<div class="k-window__tools"><button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Ajuda">' + icon('help', 'k-icon--sm') + '</button>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Fechar">' + icon('close', 'k-icon--sm') + '</button></div></div>' +
      '<div class="k-window__body k-window__body--pad" style="flex-direction:row;align-items:flex-start;gap:18px">' +
      '<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:12px">' +
      '<div class="k-row k-row--tight" style="gap:6px;flex-wrap:wrap">' +
      steps.map(function (s) {
        var on = s[2] !== '';
        return '<span style="display:inline-flex;align-items:center;gap:6px;padding:3px 9px 3px 4px;border-radius:var(--k-radius-pill);border:var(--k-bw) solid ' + (on ? 'color-mix(in srgb,var(--k-primary) 34%,var(--k-border))' : 'var(--k-border)') + ';background:' + (s[2] === 'active' ? 'color-mix(in srgb,var(--k-primary) 9%,transparent)' : 'transparent') + ';color:' + (on ? 'var(--k-text)' : 'var(--k-muted)') + ';font-size:var(--k-fs-sm)">' +
          '<span style="width:18px;height:18px;border-radius:var(--k-radius-round);display:grid;place-items:center;font-size:10px;font-weight:700;background:' + (on ? 'var(--k-primary)' : 'color-mix(in srgb,var(--k-text) 10%,transparent)') + ';color:' + (on ? 'var(--k-on-primary)' : 'var(--k-muted)') + '">' + (s[2] === 'done' ? icon('accept', 'k-icon--sm') : s[0]) + '</span>' +
          '<span style="font-weight:' + (s[2] === 'active' ? '700' : '500') + '">' + s[1] + '</span></span>';
      }).join('') + '</div>' +
      '<div class="k-card" style="padding:0;overflow:hidden">' +
      '<div class="k-row k-row--between" style="padding:9px 12px;border-bottom:var(--k-bw) solid var(--k-border)"><span class="k-strong k-small">Sua sacola</span><span class="k-small k-muted">3 itens</span></div>' +
      items.map(function (it) {
        return '<div class="k-row" style="align-items:center;gap:10px;padding:9px 12px;border-bottom:var(--k-bw) solid var(--k-border)">' +
          '<span style="width:42px;height:42px;border-radius:var(--k-radius-sm);flex:none;' + art(it[3], it[4], '#5A4A3C') + '"></span>' +
          '<div class="k-grow" style="min-width:0"><div class="k-small k-strong" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + it[0] + '</div><div class="k-small k-muted">' + it[1] + '</div></div>' +
          '<div class="k-seg" style="padding:2px;flex:none"><button class="k-seg__btn" type="button" style="padding:1px 6px" aria-label="Diminuir">−</button><span class="k-small k-mono" style="padding:0 3px">1</span><button class="k-seg__btn" type="button" style="padding:1px 6px" aria-label="Aumentar">+</button></div>' +
          '<span class="k-small k-strong k-mono" style="width:66px;text-align:right;flex:none">' + it[2] + '</span>' +
          '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Remover">' + icon('trash', 'k-icon--sm') + '</button></div>';
      }).join('') + '</div>' +
      '<div class="k-card" style="padding:12px;display:flex;flex-direction:column;gap:9px">' +
      '<div class="k-row k-row--between"><span class="k-strong k-small">Entrega</span><span class="k-badge k-badge--outline">12 dias úteis</span></div>' +
      '<div class="k-row" style="gap:10px"><label class="k-field" style="width:112px;flex:none"><span class="k-field__label">CEP</span><input class="k-input" value="01310-100" style="padding-left:var(--k-pad-x)"></label>' +
      '<label class="k-field k-grow"><span class="k-field__label">Cidade</span><input class="k-input" value="São Paulo · SP" style="padding-left:var(--k-pad-x)"></label></div>' +
      '<label class="k-field"><span class="k-field__label">Endereço</span><input class="k-input" value="Av. Paulista, 1578 — Bela Vista" style="padding-left:var(--k-pad-x)"></label>' +
      '<div class="k-stack k-stack--sm"><label class="k-choice k-choice--radio"><input type="radio" name="ship" checked><span class="k-choice__box"></span>Padrão — grátis acima de R$ 500</label>' +
      '<label class="k-choice k-choice--radio"><input type="radio" name="ship"><span class="k-choice__box"></span>Expressa — R$ 39 · 3 dias úteis</label></div></div></div>' +
      '<aside style="width:242px;flex:none;display:flex;flex-direction:column;gap:10px">' +
      '<div class="k-card k-card--raised" style="padding:12px;display:flex;flex-direction:column;gap:7px">' +
      '<div class="k-eyebrow">Resumo</div>' +
      '<div class="k-row k-row--between k-small"><span class="k-muted">Subtotal</span><span class="k-mono">R$ 1.828</span></div>' +
      '<div class="k-row k-row--between k-small"><span class="k-muted">Frete padrão</span><span class="k-mono" style="color:var(--k-success)">Grátis</span></div>' +
      '<div class="k-row k-row--between k-small"><span class="k-muted">Cupom ARCO100</span><span class="k-mono">− R$ 100</span></div>' +
      '<div class="k-divider" style="margin:2px 0"></div>' +
      '<div class="k-row k-row--between" style="align-items:baseline"><span class="k-small k-strong">Total</span><span class="k-h3">R$ 1.728</span></div>' +
      '<div class="k-small k-muted">em até 10× de R$ 172,80</div>' +
      '<button class="k-btn k-btn--primary k-btn--block" type="button" style="margin-top:3px">Ir para pagamento ' + icon('forward', 'k-icon--sm') + '</button>' +
      '<div class="k-small k-muted" style="display:flex;align-items:center;gap:5px;justify-content:center">' + icon('protect', 'k-icon--sm') + 'Pagamento criptografado</div></div>' +
      '<div class="k-card k-card--flat" style="padding:9px 10px;display:flex;flex-direction:column;gap:6px"><span class="k-small k-strong">Formas de pagamento</span>' +
      '<div class="k-row k-row--tight" style="flex-wrap:wrap"><span class="k-badge k-badge--outline">Visa</span><span class="k-badge k-badge--outline">Master</span><span class="k-badge k-badge--outline">Pix</span><span class="k-badge k-badge--outline">Boleto</span></div></div></aside></div>' +
      '<div class="k-window__foot"><span class="k-window__status"><span class="k-dot"></span>Frete grátis aplicado</span><span class="k-small k-mono">Etapa 2 de 3</span></div></div>'
    );
  }

  function patternOnboarding() {
    var personas = [
      ['apps-grid', 'Produto digital', 'Telas, fluxos e componentes para o app.'],
      ['chart', 'Dados e relatórios', 'Painéis, tabelas e leitura de indicadores.'],
      ['star', 'Marca e conteúdo', 'Páginas de campanha, artigos e perfil.'],
    ];
    return (
      '<div class="k-row" style="justify-content:center">' +
      '<div class="k-window" style="width:100%;max-width:520px">' +
      '<div class="k-window__bar k-window__bar--plain"><span class="k-window__lights"><i></i><i></i><i></i></span>' +
      '<span class="k-window__title">Configuração inicial</span>' +
      '<div class="k-window__tools"><button class="k-btn k-btn--ghost k-btn--sm" type="button">Pular</button></div></div>' +
      '<div class="k-window__body k-window__body--pad">' +
      '<div class="k-row k-row--between"><span class="k-eyebrow">Passo 1 de 3</span><span class="k-small k-muted">≈ 2 min</span></div>' +
      '<div class="k-progress"><div class="k-progress__bar" style="width:33%"></div></div>' +
      '<div style="position:relative;height:94px;border-radius:var(--k-radius-md);overflow:hidden;' + art('#22304A', '#4A3550', '#B0704F') + '">' +
      '<div style="position:absolute;inset:0;background:radial-gradient(circle at 24% 20%,rgba(255,255,255,.22),transparent 45%)"></div>' +
      '<span style="position:absolute;right:14px;bottom:2px;font-size:62px;font-weight:800;letter-spacing:-.05em;color:rgba(255,255,255,.18);line-height:1">01</span>' +
      '<span style="position:absolute;left:14px;top:16px;width:34px;height:34px;border-radius:var(--k-radius-sm);display:grid;place-items:center;background:rgba(255,255,255,.18);color:#fff;border:1px solid rgba(255,255,255,.24)">' + icon('apps-grid') + '</span>' +
      '<div style="position:absolute;left:14px;bottom:12px;color:#fff"><div class="k-small k-strong">Vamos personalizar o kit</div><div style="font-size:10.5px;opacity:.72">Três respostas rápidas</div></div></div>' +
      '<div><h2 class="k-h3">Como você pretende usar o kit?</h2><p class="k-small k-muted" style="margin-top:3px">Isso ajusta os componentes em destaque. Você pode mudar depois.</p></div>' +
      '<div class="k-stack k-stack--sm">' +
      personas.map(function (p, i) {
        return '<label class="k-choice" style="align-items:flex-start;width:100%;padding:9px 10px;border:var(--k-bw) solid ' + (i === 0 ? 'color-mix(in srgb,var(--k-primary) 44%,var(--k-border))' : 'var(--k-border)') + ';border-radius:var(--k-radius-md);background:' + (i === 0 ? 'color-mix(in srgb,var(--k-primary) 6%,transparent)' : 'var(--k-surface)') + '">' +
          '<input type="radio" name="onb" ' + (i === 0 ? 'checked' : '') + '><span class="k-choice__box" style="margin-top:1px"></span>' +
          '<span style="min-width:0"><span class="k-row k-row--tight"><span class="k-strong k-small">' + p[1] + '</span></span>' +
          '<span class="k-small k-muted" style="display:block;margin-top:1px">' + p[2] + '</span></span>' +
          '<span style="margin-left:auto;color:var(--k-muted);flex:none">' + icon(p[0], 'k-icon--sm') + '</span></label>';
      }).join('') + '</div></div>' +
      '<div class="k-window__foot"><button class="k-btn k-btn--ghost k-btn--sm" type="button" disabled>' + icon('back', 'k-icon--sm') + 'Voltar</button>' +
      '<span class="k-row k-row--tight"><span class="k-small k-muted">1 / 3</span><button class="k-btn k-btn--primary k-btn--sm" type="button">Continuar' + icon('forward', 'k-icon--sm') + '</button></span></div></div></div>'
    );
  }

  function patternSearch() {
    var results = [
      ['Componentes', 'Botões', 'Ações primárias, secundárias, ícone e estados de foco.', '24 variantes', 'component'],
      ['Padrões', 'Painel administrativo', 'Barra lateral, indicadores, gráfico e tabela de dados.', 'tela', 'grid'],
      ['Ícones', 'seta, busca, filtro', 'Ícones vetoriais de 24 px com traço de 2 px.', '473 ícones', 'search'],
      ['Artigos', 'Contraste em temas escuros', 'Como validar pares de cor em AA e AAA.', '8 min', 'pages'],
    ];
    var facets = [
      ['Categoria', ['Componentes', 'Padrões', 'Ícones', 'Artigos']],
      ['Estilo', ['Material', 'Editorial', 'Neon']],
    ];
    return (
      '<div class="k-window">' +
      '<div class="k-window__bar"><span class="k-window__lights"><i></i><i></i><i></i></span>' +
      '<span class="k-window__title">Busca no catálogo</span>' +
      '<div class="k-window__tools"><button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Filtros">' + icon('filters', 'k-icon--sm') + '</button>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Fechar">' + icon('close', 'k-icon--sm') + '</button></div></div>' +
      '<div class="k-window__content" style="display:flex;flex-direction:column;gap:10px">' +
      '<div class="k-row k-row--tight"><div class="k-search k-search--lg k-grow">' + icon('search') + '<input class="k-input" placeholder="Buscar componentes, padrões e ícones…" value="contraste"></div>' +
      '<button class="k-btn k-btn--primary" type="button">Buscar</button></div>' +
      '<div class="k-row k-row--tight" style="flex-wrap:wrap"><span class="k-small k-muted" style="margin-right:2px">Filtros:</span>' +
      ['Tudo', 'Componentes', 'Padrões', 'Ícones', 'Artigos'].map(function (c, i) {
        return '<button class="k-btn k-btn--sm ' + (i === 0 ? 'k-btn--primary' : 'k-btn--secondary') + '" type="button">' + c + '</button>';
      }).join('') +
      '<span class="k-grow"></span><button class="k-btn k-btn--ghost k-btn--sm" type="button">' + icon('close', 'k-icon--sm') + 'Limpar</button></div>' +
      '<div class="k-row" style="align-items:flex-start;gap:14px">' +
      '<aside style="width:152px;flex:none;display:flex;flex-direction:column;gap:11px;padding-right:12px;border-right:var(--k-bw) solid var(--k-border)">' +
      facets.map(function (f) {
        return '<div><div class="k-eyebrow" style="margin-bottom:5px">' + f[0] + '</div><div class="k-stack k-stack--sm">' +
          f[1].map(function (o, i) {
            return '<label class="k-choice"><input type="checkbox" ' + (i === 0 ? 'checked' : '') + '><span class="k-choice__box"></span><span class="k-small">' + o + '</span></label>';
          }).join('') + '</div></div>';
      }).join('') +
      '<div class="k-divider"></div><label class="k-choice k-choice--radio"><input type="radio" name="lic" checked><span class="k-choice__box"></span><span class="k-small">Licença aberta</span></label>' +
      '<label class="k-choice k-choice--radio"><input type="radio" name="lic"><span class="k-choice__box"></span><span class="k-small">Uso comercial</span></label></aside>' +
      '<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:8px">' +
      '<div class="k-row k-row--between"><span class="k-small k-muted"><span class="k-strong" style="color:var(--k-text)">128</span> resultados para “contraste”</span>' +
      '<label class="k-field" style="width:128px;flex:none"><select class="k-select" style="min-height:28px;font-size:var(--k-fs-sm)"><option>Mais relevantes</option><option>Mais recentes</option></select></label></div>' +
      '<div class="k-list">' +
      results.map(function (r) {
        return '<div class="k-list__item" style="padding:8px 10px;align-items:flex-start">' +
          '<span style="width:32px;height:32px;border-radius:var(--k-radius-sm);flex:none;display:grid;place-items:center;background:color-mix(in srgb,var(--k-primary) 12%,transparent);color:var(--k-primary)">' + icon(r[4], 'k-icon--sm') + '</span>' +
          '<div class="k-list__main"><div class="k-row k-row--tight" style="gap:6px"><span class="k-small k-strong">' + r[1] + '</span><span class="k-badge k-badge--outline" style="font-size:8.5px;padding:1px 6px">' + r[0] + '</span><span class="k-small k-muted" style="font-size:10px">· ' + r[3] + '</span></div>' +
          '<div class="k-small k-muted" style="margin-top:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + r[2] + '</div></div>' +
          '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Abrir">' + icon('next', 'k-icon--sm') + '</button></div>';
      }).join('') + '</div>' +
      '<div class="k-row k-row--between"><span class="k-small k-muted">1–4 de 128</span><div class="k-pagination">' +
      '<button class="k-page" type="button" disabled>' + icon('previous', 'k-icon--sm') + '</button><button class="k-page is-active" type="button">1</button><button class="k-page" type="button">2</button><button class="k-page" type="button">3</button><button class="k-page" type="button">' + icon('next', 'k-icon--sm') + '</button></div></div></div></div></div>' +
      '<div class="k-window__foot"><span class="k-window__status"><span class="k-dot"></span>Busca em 29 padrões e 38 componentes</span><span class="k-small k-mono">⌘K</span></div></div>'
    );
  }

  function patternNotifications() {
    var today = [
      ['comment', 'Marina Costa', 'comentou em', 'Briefing do produto', '“O contraste do título ficou baixo sobre a imagem.”', '09:41', true, ''],
      ['invite-members', 'Rafael Prado', 'convidou você para', 'Plataforma', 'Aceite para acompanhar os builds do time.', '08:56', true, 'invite'],
      ['accept', 'Beatriz Lima', 'aprovou sua revisão de', 'Tokens de cor', 'A versão 3 está pronta para publicar.', '08:12', false, ''],
      ['notifications', 'Atlas', 'publicou', 'Kit UI 0.9', 'Novos padrões de janela e estados vazios.', '07:40', false, ''],
    ];
    var older = [
      ['like', 'Felipe Simões', 'curtiu seu comentário em', 'Painel de dados', '“Menos componentes, mais decisões.”', 'Ontem', false, ''],
      ['saved', 'Equipe Produto', 'salvou', 'Guia de acessibilidade', 'Documento compartilhado com o time.', 'Ontem', false, ''],
    ];
    function notif(n) {
      return '<div class="k-row" style="align-items:flex-start;gap:10px;padding:9px 10px;border-bottom:var(--k-bw) solid var(--k-border);' + (n[6] ? 'background:color-mix(in srgb,var(--k-primary) 5%,transparent)' : '') + '">' +
        '<span style="width:30px;height:30px;border-radius:var(--k-radius-sm);flex:none;display:grid;place-items:center;background:color-mix(in srgb,var(--k-primary) 11%,transparent);color:var(--k-primary)">' + icon(n[0], 'k-icon--sm') + '</span>' +
        '<div class="k-grow" style="min-width:0"><div class="k-small" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><span class="k-strong">' + n[1] + '</span> <span class="k-muted">' + n[2] + '</span> <span class="k-strong">' + n[3] + '</span></div>' +
        '<div class="k-small k-muted" style="margin-top:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + n[4] + '</div>' +
        (n[7] === 'invite' ? '<div class="k-row k-row--tight" style="margin-top:5px"><button class="k-btn k-btn--primary k-btn--sm" type="button">Aceitar</button><button class="k-btn k-btn--ghost k-btn--sm" type="button">Recusar</button></div>' : '') + '</div>' +
        '<div style="flex:none;display:flex;flex-direction:column;align-items:flex-end;gap:4px"><span class="k-small k-muted k-mono" style="font-size:10px">' + n[5] + '</span>' +
        (n[6] ? '<span class="k-dot"></span>' : '<span class="k-dot" style="background:transparent"></span>') + '</div></div>';
    }
    return (
      '<div class="k-window">' +
      '<div class="k-window__bar"><span class="k-window__lights"><i></i><i></i><i></i></span>' +
      '<span class="k-window__title">Central de atividade</span>' +
      '<div class="k-window__tools"><button class="k-btn k-btn--ghost k-btn--sm" type="button">' + icon('mark-as-read', 'k-icon--sm') + 'Marcar lidas</button>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Preferências">' + icon('settings', 'k-icon--sm') + '</button></div></div>' +
      '<div class="k-window__body k-window__body--pad" style="gap:10px">' +
      '<div class="k-row k-row--between"><div class="k-tabs" style="border:0"><button class="k-tab" aria-selected="true" type="button">Todas <span class="k-badge" style="font-size:8.5px;padding:0 5px">12</span></button>' +
      '<button class="k-tab" type="button">Não lidas <span class="k-badge k-badge--primary" style="font-size:8.5px;padding:0 5px">4</span></button>' +
      '<button class="k-tab" type="button">Menções</button></div>' +
      '<label class="k-switch"><input type="checkbox"><span class="k-switch__track"></span><span class="k-small">Só importantes</span></label></div>' +
      '<div class="k-divider"></div>' +
      '<div class="k-eyebrow">Hoje</div><div class="k-card" style="padding:0;overflow:hidden">' + today.map(notif).join('') + '</div>' +
      '<div class="k-eyebrow" style="margin-top:2px">Ontem</div><div class="k-card" style="padding:0;overflow:hidden">' + older.map(notif).join('') + '</div></div>' +
      '<div class="k-window__foot"><span class="k-window__status"><span class="k-dot"></span>4 não lidas</span>' +
      '<button class="k-btn k-btn--ghost k-btn--sm" type="button">' + icon('mark-as-read', 'k-icon--sm') + 'Marcar todas como lidas</button></div></div>'
    );
  }

  function patternTeam() {
    var people = [
      ['MC', 'Marina Costa', 'Design lead', 'Design', 'São Paulo', 'Disponível', 'success'],
      ['RP', 'Rafael Prado', 'Engenheiro de produto', 'Engenharia', 'Remoto · Lisboa', 'Em reunião', 'primary'],
      ['BL', 'Beatriz Lima', 'Pesquisadora', 'Produto', 'Recife', 'Disponível', 'success'],
      ['FS', 'Felipe Simões', 'Designer de sistemas', 'Design', 'São Paulo', 'Focado', 'accent'],
      ['AC', 'Ana Clara', 'Gerente de produto', 'Produto', 'Curitiba', 'Ausente', 'outline'],
      ['JO', 'João Ortiz', 'Engenheiro front-end', 'Engenharia', 'Remoto · Porto', 'Disponível', 'success'],
    ];
    return (
      '<div class="k-stack">' +
      '<div class="k-row k-row--between" style="align-items:flex-end"><div><div class="k-eyebrow">Pessoas</div><h2 class="k-h2" style="margin-top:4px">Diretório da equipe</h2>' +
      '<p class="k-small k-muted" style="margin-top:2px">24 pessoas em 4 times · 5 online agora</p></div>' +
      '<div class="k-row k-row--tight"><div class="k-search" style="width:168px"><input class="k-input" placeholder="Buscar pessoa" style="min-height:32px;font-size:var(--k-fs-sm)"></div>' +
      '<button class="k-btn k-btn--primary k-btn--sm" type="button">' + icon('invite-members', 'k-icon--sm') + 'Convidar</button></div></div>' +
      '<div class="k-row k-row--tight" style="flex-wrap:wrap"><div class="k-seg"><button class="k-seg__btn is-active" type="button">Todos 24</button><button class="k-seg__btn" type="button">Design 8</button><button class="k-seg__btn" type="button">Engenharia 9</button><button class="k-seg__btn" type="button">Produto 7</button></div>' +
      '<span class="k-grow"></span><span class="k-small k-muted">' + icon('groups', 'k-icon--sm') + ' 4 times</span></div>' +
      '<div class="k-grid">' +
      people.map(function (p) {
        return '<div class="k-card k-card--flat" style="padding:10px;display:flex;flex-direction:column;gap:8px">' +
          '<div class="k-row k-row--tight" style="min-width:0"><span class="k-avatar k-avatar--solid">' + p[0] + '</span>' +
          '<div style="min-width:0"><div class="k-small k-strong" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + p[1] + '</div>' +
          '<div class="k-small k-muted" style="font-size:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + p[2] + '</div></div>' +
          '<span class="k-dot" style="margin-left:auto;background:var(--k-' + p[6] + ')" title="' + p[5] + '"></span></div>' +
          '<div class="k-row k-row--tight k-small k-muted" style="font-size:10.5px">' + icon('pin', 'k-icon--sm') + p[4] + '</div>' +
          '<div class="k-row k-row--tight"><span class="k-badge k-badge--outline" style="font-size:8.5px;padding:1px 6px">' + p[3] + '</span>' +
          '<span class="k-grow"></span><button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Mensagem">' + icon('chat', 'k-icon--sm') + '</button>' +
          '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Enviar e-mail">' + icon('send', 'k-icon--sm') + '</button></div></div>';
      }).join('') + '</div></div>'
    );
  }

  function patternReport() {
    var rows = [
      ['Receita recorrente', 'R$ 38,2 mil', 'R$ 44,9 mil', '+17,5%', true],
      ['Novos assinantes', '412', '386', '−6,3%', false],
      ['Retenção em 30 dias', '86%', '91%', '+5 pp', true],
      ['Tempo médio de sessão', '7m 12s', '8m 04s', '+12,0%', true],
    ];
    return (
      '<div class="k-row" style="justify-content:center">' +
      '<div class="k-card" style="width:100%;max-width:632px;padding:18px;display:flex;flex-direction:column;gap:12px">' +
      '<div class="k-row k-row--between" style="align-items:flex-start"><div><div class="k-eyebrow">Relatório mensal · novembro de 2026</div>' +
      '<h2 class="k-h2" style="margin-top:4px">Desempenho do catálogo</h2><p class="k-small k-muted" style="margin-top:2px">Kit UI · período de 01 a 17 de novembro</p></div>' +
      '<div class="k-row k-row--tight"><button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Baixar">' + icon('download', 'k-icon--sm') + '</button>' +
      '<button class="k-btn k-btn--secondary k-btn--sm" type="button">' + icon('print', 'k-icon--sm') + 'Imprimir</button></div></div>' +
      '<div class="k-divider"></div>' +
      '<div class="k-grid" style="grid-template-columns:repeat(3,1fr)">' + statCard('Receita', 'R$ 44,9 mil', '+17,5%', [28, 36, 42, 40, 54, 62, 74]) + statCard('Assinantes', '1.284', '+9,2%', [34, 38, 44, 50, 52, 60, 68]) + statCard('Churn', '1,8%', '−0,4 pp', [70, 64, 58, 54, 46, 40, 32], true) + '</div>' +
      '<div class="k-table__wrap"><table class="k-table"><thead><tr><th>Indicador</th><th class="k-num">Outubro</th><th class="k-num">Novembro</th><th class="k-num">Variação</th></tr></thead><tbody>' +
      rows.map(function (r) {
        return '<tr><td class="k-strong">' + r[0] + '</td><td class="k-num k-small k-muted">' + r[1] + '</td><td class="k-num">' + r[2] + '</td>' +
          '<td class="k-num"><span style="color:' + (r[4] ? 'var(--k-success)' : 'var(--k-danger)') + ';font-weight:600">' + r[3] + '</span></td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<div class="k-row" style="align-items:stretch;gap:14px"><div class="k-card k-card--flat" style="flex:1.4;min-width:0;padding:10px"><div class="k-row k-row--between"><span class="k-small k-strong">Receita por semana</span><span class="k-badge k-badge--success">+17,5%</span></div>' + chart() + '</div>' +
      '<div class="k-card k-card--flat" style="flex:1;min-width:0;padding:10px"><div class="k-small k-strong">Observações</div><div class="k-stack k-stack--sm" style="margin-top:7px">' +
      ['O pacote HTML + CSS respondeu por 62% dos downloads.', 'Acessibilidade foi o filtro mais usado na busca.', 'Revisar o churn de contas anuais em dezembro.'].map(function (t) {
        return '<div class="k-row k-row--tight" style="align-items:flex-start"><span class="k-dot" style="margin-top:6px;flex:none"></span><span class="k-small k-muted">' + t + '</span></div>';
      }).join('') + '</div></div></div>' +
      '<div class="k-row k-row--between" style="border-top:var(--k-bw) solid var(--k-border);padding-top:10px;margin-top:2px">' +
      '<div><div style="border-bottom:var(--k-bw) solid var(--k-text);width:150px;height:22px"></div><div class="k-small k-muted" style="margin-top:4px">Felipe Simões · responsável</div></div>' +
      '<div style="text-align:right"><div class="k-small k-mono k-muted">Página 1 de 4</div><div class="k-small k-muted">Gerado em 17 nov 2026</div></div></div></div></div>'
    );
  }

  function patternError() {
    return (
      '<div class="k-grid" style="grid-template-columns:1fr 1fr;align-items:stretch">' +
      '<div class="k-card" style="padding:22px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:9px">' +
      '<span class="k-eyebrow">Erro 404</span>' +
      '<div style="font-size:66px;font-weight:800;line-height:.95;letter-spacing:-.05em;color:var(--k-primary)">404</div>' +
      '<h2 class="k-h3">Página não encontrada</h2>' +
      '<p class="k-small k-muted" style="max-width:28ch">O endereço pode ter mudado ou a página foi removida do catálogo.</p>' +
      '<div class="k-row k-row--tight" style="margin-top:4px"><button class="k-btn k-btn--primary k-btn--sm" type="button">' + icon('home', 'k-icon--sm') + 'Voltar ao início</button>' +
      '<button class="k-btn k-btn--secondary k-btn--sm" type="button">' + icon('previous', 'k-icon--sm') + 'Página anterior</button></div></div>' +
      '<div class="k-card" style="padding:14px;display:flex;flex-direction:column;gap:10px">' +
      '<div class="k-row k-row--between"><span class="k-strong k-small">Resultados</span><span class="k-badge k-badge--outline">0 itens</span></div>' +
      '<div class="k-empty k-grow" style="justify-content:center">' +
      '<span class="k-empty__icon">' + icon('search', 'k-icon--lg') + '</span>' +
      '<div class="k-empty__title">Nenhum resultado</div>' +
      '<div class="k-empty__text">Não encontramos nada com esses filtros. Tente outro termo ou remova as restrições.</div>' +
      '<div class="k-row k-row--tight"><button class="k-btn k-btn--primary k-btn--sm" type="button">' + icon('search', 'k-icon--sm') + 'Nova busca</button>' +
      '<button class="k-btn k-btn--ghost k-btn--sm" type="button">' + icon('close', 'k-icon--sm') + 'Limpar filtros</button></div></div>' +
      '<div class="k-row k-row--between k-small k-muted"><span>' + icon('help', 'k-icon--sm') + ' Precisa de ajuda?</span><span class="k-link">Falar com suporte</span></div></div></div>'
    );
  }

  function patternSocial() {
    var trending = [
      ['#DesignSystem', '1.284 posts'],
      ['#Tokens', '860 posts'],
      ['#Acessibilidade', '512 posts'],
      ['#Janelas', '318 posts'],
    ];
    var people = [
      ['MC', 'Marina Costa', '@marinac'],
      ['RP', 'Rafael Prado', '@rprado'],
      ['BL', 'Beatriz Lima', '@bealima'],
    ];
    return (
      '<div class="k-row" style="align-items:flex-start;gap:14px">' +
      '<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:10px">' +
      '<div class="k-card k-card--flat" style="padding:10px;display:flex;gap:9px">' +
      '<span class="k-avatar k-avatar--sm">FS</span>' +
      '<div class="k-grow" style="min-width:0;display:flex;flex-direction:column;gap:8px">' +
      '<input class="k-input" placeholder="O que você está criando?" style="min-height:34px;padding-left:var(--k-pad-x)">' +
      '<div class="k-row k-row--between"><div class="k-row k-row--tight">' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Imagem">' + icon('pictures', 'k-icon--sm') + '</button>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Emoji">' + icon('emoji', 'k-icon--sm') + '</button>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Gráfico">' + icon('chart', 'k-icon--sm') + '</button>' +
      '<span class="k-small k-muted" style="margin-left:3px">' + icon('groups', 'k-icon--sm') + ' Todos</span></div>' +
      '<button class="k-btn k-btn--primary k-btn--sm" type="button">Publicar</button></div></div></div>' +
      '<div class="k-card" style="padding:0;overflow:hidden">' +
      '<div class="k-row k-row--between" style="padding:10px 12px"><div class="k-row k-row--tight" style="min-width:0"><span class="k-avatar k-avatar--solid k-avatar--sm">MC</span>' +
      '<div style="min-width:0"><div class="k-small k-strong">Marina Costa <span class="k-muted" style="font-weight:400">@marinac · 2 h</span></div>' +
      '<div class="k-small k-muted" style="font-size:10px">Design de sistemas</div></div></div>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Mais">' + icon('more-options', 'k-icon--sm') + '</button></div>' +
      '<div style="padding:0 12px 10px"><p class="k-small">Subi a nova tabela de contraste do tema escuro. Todos os pares de texto passam em AA — e os títulos agora chegam a AAA.</p></div>' +
      '<div style="height:178px;' + art('#23304F', '#4E2F58', '#B45A48') + ';position:relative">' +
      '<div style="position:absolute;inset:0;background:radial-gradient(circle at 28% 24%,rgba(255,255,255,.2),transparent 45%)"></div>' +
      '<div style="position:absolute;left:14px;bottom:12px;color:#fff"><div class="k-small k-strong">Tokens · contraste AA</div><div style="font-size:10px;opacity:.72">atlas.dev/tokens</div></div>' +
      '<span class="k-badge" style="position:absolute;right:10px;top:10px;background:rgba(8,10,14,.42);border-color:transparent;color:#fff">3 / 6</span></div>' +
      '<div class="k-row k-row--between" style="padding:8px 12px"><div class="k-row k-row--tight">' +
      '<button class="k-btn k-btn--ghost k-btn--sm" type="button">' + icon('like', 'k-icon--sm') + '248</button>' +
      '<button class="k-btn k-btn--ghost k-btn--sm" type="button">' + icon('comment', 'k-icon--sm') + '32</button>' +
      '<button class="k-btn k-btn--ghost k-btn--sm" type="button">' + icon('share', 'k-icon--sm') + '18</button></div>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Salvar">' + icon('bookmark', 'k-icon--sm') + '</button></div></div>' +
      '<div class="k-card" style="padding:10px 12px;display:flex;flex-direction:column;gap:7px">' +
      '<div class="k-row k-row--tight"><span class="k-avatar k-avatar--sm">RP</span><div style="min-width:0"><div class="k-small k-strong">Rafael Prado <span class="k-muted" style="font-weight:400">@rprado · ontem</span></div></div>' +
      '<span class="k-grow"></span><button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Mais">' + icon('more-options', 'k-icon--sm') + '</button></div>' +
      '<div style="border-left:2px solid var(--k-primary);padding-left:9px"><p class="k-small k-muted" style="font-style:italic">“Um sistema maduro é medido pelo que recusa, não pelo que acumula.”</p></div>' +
      '<div class="k-row k-row--tight"><button class="k-btn k-btn--ghost k-btn--sm" type="button">' + icon('like', 'k-icon--sm') + '96</button>' +
      '<button class="k-btn k-btn--ghost k-btn--sm" type="button">' + icon('comment', 'k-icon--sm') + '11</button>' +
      '<span class="k-grow"></span><span class="k-small k-muted" style="font-size:10px">ver 4 respostas</span></div></div></div>' +
      '<aside style="width:198px;flex:none;display:flex;flex-direction:column;gap:10px">' +
      '<div class="k-card k-card--flat" style="padding:10px"><div class="k-row k-row--between"><span class="k-small k-strong">Em alta</span>' + icon('trending', 'k-icon--sm') + '</div>' +
      '<div class="k-stack k-stack--sm" style="margin-top:7px">' +
      trending.map(function (t, i) {
        return '<div class="k-row k-row--between"><div style="min-width:0"><div class="k-small k-strong" style="font-size:var(--k-fs-sm)">' + t[0] + '</div><div style="font-size:10px;color:var(--k-muted)">' + t[1] + '</div></div><span class="k-small k-mono k-muted" style="font-size:10px">0' + (i + 1) + '</span></div>';
      }).join('') + '</div></div>' +
      '<div class="k-card k-card--flat" style="padding:10px"><div class="k-small k-strong">Quem seguir</div>' +
      '<div class="k-stack k-stack--sm" style="margin-top:7px">' +
      people.map(function (p) {
        return '<div class="k-row k-row--tight"><span class="k-avatar k-avatar--sm" style="width:24px;height:24px;font-size:9px">' + p[0] + '</span>' +
          '<div style="min-width:0;flex:1"><div class="k-small k-strong" style="font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + p[1] + '</div><div style="font-size:9.5px;color:var(--k-muted)">' + p[2] + '</div></div>' +
          '<button class="k-btn k-btn--secondary k-btn--sm" type="button" style="padding:2px 8px;min-height:24px;font-size:10px">Seguir</button></div>';
      }).join('') + '</div></div>' +
      '<div class="k-small k-muted" style="padding:0 2px;line-height:1.6">Sobre · Ajuda · Termos · Privacidade<br>© 2026 Atlas Studio</div></aside></div>'
    );
  }

  function patternDocs() {
    var nav = [
      ['Começando', [['open', 'Instalação', true], ['layout', 'Estrutura', false], ['color', 'Tokens', false]]],
      ['Componentes', [['component', 'Botões', false], ['input-tools', 'Campos', false], ['window', 'Janelas', false]]],
      ['Padrões', [['grid', 'Telas', false], ['pattern', 'Estados', false]]],
    ];
    var code =
      '&lt;link rel="stylesheet" href="kit.css"&gt;\n' +
      '&lt;div class="kit"&gt;\n' +
      '  &lt;button class="k-btn k-btn--primary"&gt;Salvar&lt;/button&gt;\n' +
      '&lt;/div&gt;';
    return (
      '<div class="k-window">' +
      '<div class="k-window__bar"><span class="k-window__lights"><i></i><i></i><i></i></span>' +
      '<span class="k-window__title">Documentação <span class="k-window__sub">— Kit UI 0.9</span></span>' +
      '<div class="k-window__tools"><div class="k-search" style="width:176px"><input class="k-input" placeholder="Buscar na documentação" style="min-height:24px;font-size:10.5px"></div>' +
      '<button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Mais">' + icon('more-options', 'k-icon--sm') + '</button></div></div>' +
      '<div class="k-window__body">' +
      '<div class="k-window__rail" style="width:166px;padding:8px">' +
      '<div class="k-row k-row--tight" style="padding:2px 8px 8px"><span class="k-avatar k-avatar--solid k-avatar--sm" style="width:20px;height:20px;font-size:9px">K</span><span class="k-small k-strong">Atlas Docs</span></div>' +
      nav.map(function (g) {
        return '<div class="k-sidebar__label" style="padding:8px 10px 4px">' + g[0] + '</div>' +
          g[1].map(function (n) {
            return '<a class="k-sidebar__item' + (n[2] ? ' is-active' : '') + '" href="#">' + icon(n[0], 'k-icon--sm') + '<span class="k-sidebar__item__label">' + n[1] + '</span></a>';
          }).join('');
      }).join('') + '</div>' +
      '<div class="k-window__content" style="display:flex;flex-direction:column;gap:9px">' +
      '<div class="k-row k-row--tight k-small k-muted"><span>Docs</span><span>/</span><span>Começando</span><span>/</span><span class="k-strong" style="color:var(--k-text)">Instalação</span></div>' +
      '<div><h2 class="k-h2">Instalação</h2><p class="k-small k-muted" style="margin-top:3px">Inclua o CSS do kit, importe os tokens do estilo escolhido e envolva o conteúdo em <span class="k-mono">.kit</span>.</p></div>' +
      '<div class="k-stack k-stack--sm">' +
      [['1', 'Baixe o pacote', 'Exporte HTML, CSS e ícones pelo botão Exportar.'],
       ['2', 'Importe o CSS', 'Adicione kit.css depois dos seus estilos base.'],
       ['3', 'Aplique o tema', 'Copie as variáveis --k-* do painel de tokens.']].map(function (s) {
        return '<div class="k-row k-row--tight" style="align-items:flex-start"><span style="width:18px;height:18px;border-radius:var(--k-radius-round);flex:none;display:grid;place-items:center;font-size:9.5px;font-weight:700;background:color-mix(in srgb,var(--k-primary) 14%,transparent);color:var(--k-primary)">' + s[0] + '</span>' +
          '<div><div class="k-small k-strong">' + s[1] + '</div><div class="k-small k-muted" style="font-size:10.5px">' + s[2] + '</div></div></div>';
      }).join('') + '</div>' +
      '<div class="k-card k-card--flat" style="padding:0;overflow:hidden"><div class="k-row k-row--between" style="padding:5px 9px;border-bottom:var(--k-bw) solid var(--k-border)"><span class="k-small k-strong">index.html</span>' +
      '<button class="k-btn k-btn--ghost k-btn--sm" type="button" style="padding:1px 6px;min-height:22px;font-size:10px">' + icon('copy', 'k-icon--sm') + 'Copiar</button></div>' +
      '<pre style="margin:0;padding:9px 11px;font-family:var(--k-font-mono);font-size:10.5px;line-height:1.65;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;color:var(--k-text);background:color-mix(in srgb,var(--k-text) 3%,transparent)">' + code + '</pre></div>' +
      '<div class="k-alert k-alert--info"><span class="k-alert__icon">' + icon('help', 'k-icon--sm') + '</span>' +
      '<div class="k-alert__body"><div class="k-alert__text">Os componentes usam apenas variáveis. Nenhum estilo global é afetado fora de <span class="k-mono">.kit</span>.</div></div></div>' +
      '<div><div class="k-small k-strong">Tokens essenciais</div>' +
      '<div class="k-table__wrap" style="margin-top:5px"><table class="k-table"><thead><tr><th>Token</th><th>Uso</th><th class="k-num">Padrão</th></tr></thead><tbody>' +
      [['--k-bg', 'Fundo da página', '#14161C'], ['--k-primary', 'Ações e seleção', '#6750A4'], ['--k-radius-md', 'Cantos de controles', '10px']].map(function (t) {
        return '<tr><td class="k-mono k-small">' + t[0] + '</td><td class="k-small k-muted">' + t[1] + '</td><td class="k-num k-small k-mono">' + t[2] + '</td></tr>';
      }).join('') + '</tbody></table></div></div>' +
      '<span class="k-grow"></span>' +
      '<div class="k-row k-row--between" style="border-top:var(--k-bw) solid var(--k-border);padding-top:8px">' +
      '<button class="k-btn k-btn--ghost k-btn--sm" type="button">' + icon('previous', 'k-icon--sm') + 'Estrutura</button>' +
      '<button class="k-btn k-btn--ghost k-btn--sm" type="button">Tokens' + icon('next', 'k-icon--sm') + '</button></div></div></div></div>'
    );
  }


  /* Moldura exemplar: CSS próprio, escopo limitado a .dm-frame. Nenhuma
     variável --k-* é redefinida; a moldura fixa do Kit UI não é tocada. */
  function patternFrame() {
    const css = [
      '.dm-frame{--dm-scale:.62;--dm-bg:#14131A;--dm-surface:#1E1D26;--dm-surface-2:#292733;--dm-text:#F2EFF7;--dm-muted:#B7B1C2;--dm-border:#3A3746;--dm-primary:#C6A9FF;--dm-on:#1A1226;--dm-danger:#FF8A80;--dm-radius:8px;--dm-glow:#241F33;color:var(--dm-text);font-family:system-ui,sans-serif;font-size:16px;line-height:1.4}',
      '.dm-frame *{box-sizing:border-box}',
      '.dm-frame .dm-wrap{position:relative;width:calc(1280px * var(--dm-scale));height:calc(600px * var(--dm-scale))}',
      '.dm-frame .dm-shell{position:absolute;top:0;left:0;width:1280px;height:600px;transform:scale(var(--dm-scale));transform-origin:top left;display:flex;flex-direction:column;overflow:hidden;border:1px solid var(--dm-border);border-radius:var(--dm-radius);box-shadow:0 4px 14px rgba(0,0,0,.6);background:radial-gradient(110% 80% at 12% 0%,var(--dm-glow) 0%,var(--dm-bg) 46%,#121116 100%)}',
      '.dm-frame .dm-inner{display:flex;flex-direction:column;width:100%;height:100%;min-height:0}',
      '.dm-frame .dm-top{flex:none;height:48px;display:flex;align-items:center;gap:24px;padding:0 24px;border-bottom:1px solid var(--dm-border)}',
      '.dm-frame .dm-brand{display:flex;align-items:center;gap:10px}',
      '.dm-frame .dm-mark{width:28px;height:28px;flex:none;display:grid;place-items:center;border-radius:50%;background:var(--dm-primary);color:var(--dm-on);font-size:14px;font-weight:700}',
      '.dm-frame .dm-brand b{display:block;font-size:15px;line-height:1.1}',
      '.dm-frame .dm-brand small{display:block;color:var(--dm-muted);font-size:10px}',
      '.dm-frame .dm-ctrls{margin-left:auto;display:flex;align-items:center;gap:4px}',
      '.dm-frame .dm-zoom{padding:0 6px;color:var(--dm-muted);font-size:12px}',
      '.dm-frame .dm-sep{width:1px;height:16px;margin:0 6px;background:var(--dm-border)}',
      '.dm-frame .dm-ico{width:32px;height:32px;display:grid;place-items:center;border:1px solid var(--dm-border);border-radius:var(--dm-radius);background:var(--dm-surface);color:var(--dm-muted);font-size:16px;cursor:default}',
      '.dm-frame .dm-ico.is-on{color:var(--dm-primary);background:var(--dm-surface-2)}',
      '.dm-frame .dm-tabs{flex:none;height:38px;display:flex;align-items:flex-end;gap:4px;padding:0 24px;background:color-mix(in srgb,var(--dm-text) 3%,transparent)}',
      '.dm-frame .dm-tab{border:1px solid var(--dm-border);border-bottom:0;border-radius:var(--dm-radius) var(--dm-radius) 0 0;background:var(--dm-surface);color:var(--dm-muted);padding:7px 16px;font:inherit;font-size:13px;cursor:default}',
      '.dm-frame .dm-tab.is-on{color:var(--dm-primary);background:var(--dm-bg);box-shadow:inset 0 3px 0 var(--dm-primary)}',
      '.dm-frame .dm-banner{flex:none;display:flex;align-items:center;gap:10px;margin:14px 24px 0;padding:8px 12px;border:1px solid color-mix(in srgb,var(--dm-primary) 40%,var(--dm-border));border-radius:var(--dm-radius);background:color-mix(in srgb,var(--dm-primary) 10%,var(--dm-surface));font-size:13px}',
      '.dm-frame .dm-main{flex:1;min-height:0;overflow:auto;padding:16px 24px;scrollbar-width:thin;scrollbar-color:var(--dm-border) transparent}',
      '.dm-frame .dm-main::-webkit-scrollbar{width:8px}',
      '.dm-frame .dm-main::-webkit-scrollbar-thumb{background:var(--dm-border);border-radius:var(--dm-radius)}',
      '.dm-frame .dm-grid{display:grid;grid-template-columns:1fr 300px;gap:16px;align-items:start}',
      '.dm-frame .dm-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}',
      '.dm-frame .dm-card{border:1px solid var(--dm-border);border-radius:var(--dm-radius);background:var(--dm-surface);padding:16px}',
      '.dm-frame .dm-card small{display:block;color:var(--dm-muted);font-size:12px}',
      '.dm-frame .dm-card b{display:block;margin-top:6px;font-size:30px;line-height:1.1}',
      '.dm-frame .dm-card em{display:block;margin-top:4px;color:var(--dm-primary);font-size:12px;font-style:normal}',
      '.dm-frame .dm-table{width:100%;margin-top:16px;border:1px solid var(--dm-border);border-radius:var(--dm-radius);border-collapse:separate;border-spacing:0;overflow:hidden;font-size:13px}',
      '.dm-frame .dm-table th,.dm-frame .dm-table td{padding:8px 12px;text-align:left;border-bottom:1px solid var(--dm-border)}',
      '.dm-frame .dm-table th{background:var(--dm-surface);color:var(--dm-muted);font-size:11px;text-transform:uppercase;letter-spacing:.06em}',
      '.dm-frame .dm-table tr:last-child td{border-bottom:0}',
      '.dm-frame .dm-pill{display:inline-block;padding:2px 8px;border-radius:var(--dm-radius);background:var(--dm-surface-2);color:var(--dm-primary);font-size:11px}',
      '.dm-frame .dm-side h3{margin:0 0 12px;font-size:15px}',
      '.dm-frame .dm-actions{display:grid;gap:8px}',
      '.dm-frame .dm-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:36px;padding:0 14px;border:1px solid var(--dm-border);border-radius:var(--dm-radius);background:var(--dm-surface);color:var(--dm-text);font:inherit;font-size:13px;cursor:default}',
      '.dm-frame .dm-btn--primary{background:var(--dm-primary);border-color:var(--dm-primary);color:var(--dm-on)}',
      '.dm-frame .dm-btn--ghost{background:transparent}',
      '.dm-frame .dm-btn--danger{background:transparent;color:var(--dm-danger);border-color:color-mix(in srgb,var(--dm-danger) 45%,transparent)}',
      '.dm-frame .dm-btn--sm{min-height:28px;padding:0 10px;font-size:12px}',
      '.dm-frame .dm-foot{flex:none;height:32px;display:flex;align-items:center;gap:20px;padding:0 24px;border-top:1px solid var(--dm-border);color:var(--dm-muted);font-size:11px}',
      '.dm-frame .dm-foot span{display:inline-flex;align-items:center;gap:6px;white-space:nowrap}',
      '.dm-frame .dm-foot span::before{content:"";width:5px;height:5px;flex:none;border-radius:var(--dm-radius);background:var(--dm-muted)}',
      '.dm-frame .dm-ver{margin-left:auto}',
      '.dm-frame .dm-framelegend{margin-top:10px;color:#8B8796;font-size:11px}',
      '.dm-frame[data-or="portrait"] .dm-inner{width:600px;height:1280px;transform-origin:top left;transform:translateY(600px) rotate(-90deg)}',
      '.dm-frame[data-or="portrait"] .dm-grid{grid-template-columns:1fr}',
      '.dm-frame[data-or="portrait"] .dm-cards{grid-template-columns:1fr 1fr}',
      '.dm-frame[data-or="portrait"] .dm-ctrls .dm-ico.is-on{background:var(--dm-surface)}',
    ].join('\n');
    const cards = [['Itens ativos', '128', '+12 nesta semana'], ['Na fila', '24', '8 aguardando'], ['Concluídos', '96', 'últimos 30 dias']];
    const rows = [['Coleta', 'Em andamento', 'agora'], ['Revisão', 'Na fila', 'há 5 min'], ['Exportação', 'Concluído', 'ontem'], ['Validação', 'Em andamento', 'ontem']];
    return (
      '<style>' + css + '</style>' +
      '<div class="dm-frame" data-or="landscape">' +
      '<div class="dm-wrap"><div class="dm-shell"><div class="dm-inner">' +
      '<header class="dm-top">' +
      '<div class="dm-brand"><span class="dm-mark">◆</span><span><b>Painel de dados</b><small>Ambiente de demonstração</small></span></div>' +
      '<div class="dm-ctrls" role="group" aria-label="Controles de visualização">' +
      '<button class="dm-ico" type="button" aria-label="Reduzir zoom">−</button><span class="dm-zoom">100%</span>' +
      '<button class="dm-ico" type="button" aria-label="Ampliar zoom">+</button><span class="dm-sep"></span>' +
      '<button class="dm-ico" type="button" aria-label="Alternar orientação">' + icon('rotate', 'k-icon--sm') + '</button>' +
      '<button class="dm-ico is-on" type="button" aria-label="Alternar tema">' + icon('color', 'k-icon--sm') + '</button>' +
      '</div></header>' +
      '<nav class="dm-tabs" role="tablist" aria-label="Seções">' +
      '<button class="dm-tab is-on" type="button" role="tab" aria-selected="true">Visão geral</button>' +
      '<button class="dm-tab" type="button" role="tab" aria-selected="false">Fila</button>' +
      '<button class="dm-tab" type="button" role="tab" aria-selected="false">Ajustes</button></nav>' +
      '<div class="dm-banner">' + icon('help', 'k-icon--sm') + '<span>Moldura de exemplo: os controles de visualização são apenas parte da cena.</span></div>' +
      '<main class="dm-main"><div class="dm-grid"><div>' +
      '<div class="dm-cards">' + cards.map(function (c) {
        return '<div class="dm-card"><small>' + c[0] + '</small><b>' + c[1] + '</b><em>' + c[2] + '</em></div>';
      }).join('') + '</div>' +
      '<table class="dm-table"><thead><tr><th>Processo</th><th>Estado</th><th>Atualização</th></tr></thead><tbody>' +
      rows.map(function (r) {
        return '<tr><td>' + r[0] + '</td><td><span class="dm-pill">' + r[1] + '</span></td><td>' + r[2] + '</td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<aside class="dm-side"><h3>Ações rápidas</h3><div class="dm-actions">' +
      '<button class="dm-btn dm-btn--primary" type="button">Criar novo</button>' +
      '<button class="dm-btn" type="button">Revisar itens</button>' +
      '<button class="dm-btn dm-btn--ghost" type="button">Exportar</button>' +
      '<button class="dm-btn dm-btn--danger" type="button">Limpar fila</button>' +
      '<button class="dm-btn dm-btn--sm" type="button">Ver detalhes</button>' +
      '</div></aside></div></main>' +
      '<footer class="dm-foot"><span>Ambiente de demonstração</span><span>Leia as instruções antes de usar</span><span class="dm-ver">v1.0</span></footer>' +
      '</div></div></div>' +
      '<div class="dm-framelegend">Moldura exemplar · paisagem e retrato · controles apenas visuais</div>' +
      '</div>'
    );
  }

  window.KIT_PATTERNS = { patterns, patternGroups };
})();
