/* Catálogo: cada item traz markup de demonstração e um trecho canônico para copiar. */
(function () {
  'use strict';

  const ICONS = window.KIT_ICONS;

  function icon(id, cls) {
    /* Busca viva: inclui ícones importados depois do carregamento. */
    const item = ICONS.icons.find((i) => i.id === id);
    if (!item) return '';
    return (
      '<svg class="k-icon' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      item.svg +
      '</svg>'
    );
  }

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const block = (label, html, cls) =>
    '<div class="spec-block"><div class="spec-label">' + label + '</div><div class="spec-stage' + (cls ? ' ' + cls : '') + '">' + html + '</div></div>';

  /* Três tamanhos, cada um com os dois padrões na mesma janela. O switch ao
     lado do CMYK usa um único ícone de looping e alterna o espectro retangular
     e o anel com triângulo; a área principal de seleção é 100% quadrada nos
     dois modos, com a mesma altura de janela. Padrão operacional da janela:
     reabrir mantém o modo e a cor configurados pelo usuário (data-cp-note),
     sem depender do programa receptor. Markup copiável: janela grande. */
  const CP_VARIANTS = [
    { id: 'large', label: 'Grande', width: 264, cls: 'k-cp--large', stage: '' },
    { id: 'medium', label: 'Mediana', width: 228, cls: 'k-cp--medium', stage: 'k-cp-stage--medium' },
    { id: 'compact', label: 'Compacta', width: 196, cls: 'k-cp--compact', stage: 'k-cp-stage--compact' }
  ];

  const CP_SHAPE_SWITCH =
    '<button class="k-seg__btn k-cp__shape" type="button" data-cp-shape aria-pressed="false" ' +
    'aria-label="Mudar para caixa triangular" title="Alternar caixa quadrada/triangular">' +
    icon('loop', 'k-icon--sm') +
    '</button>';

  function colorpickerMarkup(demo, variant, hiddenWin) {
    const v = variant || CP_VARIANTS[0];
    const stage = demo ? 'spec-stage k-cp-stage' : 'k-cp-stage';
    const stageCls = stage + (v.stage ? ' ' + v.stage : '');
    return [
      '<div class="' + stageCls + '" data-float-stage>',
      '  <section class="k-window k-window--float k-cp ' + v.cls + '"' + (hiddenWin ? ' hidden' : '') + ' data-cp-r="59" data-cp-g="130" data-cp-b="246" data-cp-h="0.6034" data-cp-s="0.7602" data-cp-v="0.9647" data-cp-mode="rgb" data-cp-shape-mode="square" data-cp-note="Reabre no modo e com a cor configurados pelo usuário" style="left:8%;top:3%;width:' + v.width + 'px;--cp-h:.6034;--cp-s:.7602;--cp-v:.9647;--cp-tx:.5849;--cp-ty:.2000;--cp-hx:.2278;--cp-hy:.8583">',
      '    <div class="k-window__bar k-cp__bar"></div>',
      '    <div class="k-window__body k-cp__body">',
      '      <div class="k-seg k-cp__modes" role="tablist" aria-label="Formato da cor">',
      '        <button class="k-seg__btn is-active" type="button" data-cp-mode="rgb" role="tab" aria-selected="true">RGB</button>',
      '        <button class="k-seg__btn" type="button" data-cp-mode="hex" role="tab" aria-selected="false">HEX</button>',
      '        <button class="k-seg__btn" type="button" data-cp-mode="cmyk" role="tab" aria-selected="false">CMYK</button>',
      CP_SHAPE_SWITCH,
      '      </div>',
      '      <div class="k-cp__selector">',
      '        <div class="k-cp__rect" data-cp-rect>',
      '          <div class="k-cp__sv" data-cp-sv><span class="k-cp__svthumb"></span></div>',
      '          <div class="k-cp__hue" data-cp-hue><span class="k-cp__hthumb"></span></div>',
      '        </div>',
      '        <div class="k-cp__wheel" data-cp-wheel hidden>',
      '          <span class="k-cp__huepin" aria-hidden="true"></span>',
      '          <div class="k-cp__sv" data-cp-sv data-cp-tri><span class="k-cp__svthumb"></span></div>',
      '        </div>',
      '      </div>',
      '      <div class="k-cp__row">',
      '        <span class="k-cp__chip" data-cp-preview aria-hidden="true" style="background:rgb(59, 130, 246)"></span>',
      '        <input class="k-input k-cp__text" type="text" value="59, 130, 246" data-cp="text" spellcheck="false" autocomplete="off" aria-label="Valor da cor">',
      '        <button class="k-cp__mini" type="button" data-cp-copy aria-label="Copiar valor">' + icon('copy', 'k-icon--sm') + '</button>',
      '        <button class="k-cp__mini" type="button" data-cp-paste aria-label="Colar valor">' + icon('paste', 'k-icon--sm') + '</button>',
      '      </div>',
      '    </div>',
      '  </section>',
      '</div>'
    ].join('\n');
  }

  /* Abas de tamanho com Reabrir caixas à direita, fora do palco pontilhado. */
  function colorpickerDemo() {
    const tabs = CP_VARIANTS.map((v, i) => {
      const active = i === 0;
      return '<button class="k-tab' + (active ? ' is-active' : '') + '" type="button" role="tab" aria-selected="' +
        active + '" data-cp-variant="' + v.id + '">' + v.label + '</button>';
    }).join('');
    const panes = CP_VARIANTS.map((v, i) =>
      '<div class="k-cp__pane"' + (i ? ' hidden' : '') + ' data-cp-pane="' + v.id + '">' +
      colorpickerMarkup(true, v, i > 0) + '</div>'
    ).join('');
    return '<div class="spec-block" data-cp-variants>' +
      '<div class="k-cp__toolbar">' +
      '<div class="k-tabs k-cp__tabs" role="tablist" aria-label="Tamanho do seletor">' + tabs + '</div>' +
      '<button class="k-btn k-btn--secondary k-btn--sm k-cp__reopen" type="button" data-cp-reopen>Reabrir caixas</button>' +
      '</div>' +
      panes + '</div>';
  }

  /* ---------------------------------------------------------------- */
  /* Demonstrações                                                     */
  /* ---------------------------------------------------------------- */

  const BTN = '<button class="k-btn k-btn--primary" type="button">' + icon('save') + 'Salvar alterações</button>';
  const BTN2 = '<button class="k-btn k-btn--secondary" type="button">Cancelar</button>';
  const BTN3 = '<button class="k-btn k-btn--ghost" type="button">' + icon('help') + 'Ajuda</button>';
  const BTN4 = '<button class="k-btn k-btn--danger" type="button">' + icon('trash') + 'Excluir</button>';

  /* Demonstração dos botões: cada variante aparece em uma linha horizontal com
     os cinco estados. Ordem: todos os compactos, depois medianos, depois grandes.
     A geometria de cada passo vem da menor fonte aplicada ao estilo: a mesma
     referência de --k-type-1/2/3 comanda altura, paddings e ícone. */
  const BTN_VARIANTS = [
    { label: 'Salvar',   variant: 'k-btn--primary',   icon: 'save' },
    { label: 'Cancelar', variant: 'k-btn--secondary', icon: 'copy' },
    { label: 'Filtrar',  variant: 'k-btn--outline',   icon: 'search' },
    { label: 'Ajuda',    variant: 'k-btn--ghost',     icon: 'help' },
    { label: 'Excluir',  variant: 'k-btn--danger',    icon: 'trash' }
  ];
  const BTN_SIZES = [
    { label: 'Compacto', cls: ' k-btn--compact', ic: '', icons: false },
    { label: 'Mediano',  cls: ' k-btn--sm',      ic: 'k-icon--sm', icons: true },
    { label: 'Grande',   cls: '',                 ic: '', icons: true }
  ];
  const BTN_STATES = [
    { label: 'Normal',      cls: '',         attrs: '' },
    { label: 'Hover',       cls: ' is-hover', attrs: '' },
    { label: 'Foco',        cls: ' is-focus', attrs: '' },
    { label: 'Pressionado', cls: ' is-active', attrs: '' },
    { label: 'Desativado',  cls: '',         attrs: ' disabled' }
  ];

  const btnStateRows = (size) => BTN_VARIANTS.map((v) => {
    const ic = size.icons ? icon(v.icon, size.ic) : '';
    const buttons = BTN_STATES.map((st) =>
      '<button class="k-btn ' + v.variant + size.cls + st.cls + '" type="button"' + st.attrs + '>' + ic + st.label + '</button>'
    ).join('');
    return '<div class="k-row k-row--tight k-btn-demo-row">' + buttons + '</div>';
  }).join('');

  const btnGroupRows = () => BTN_SIZES.map((size) => {
    const cls = size.cls;
    return '<div class="k-row k-row--tight k-btn-demo-row">' +
      '<div class="k-btn-group">' +
        '<button class="k-btn k-btn--secondary' + cls + '" type="button">Dia</button>' +
        '<button class="k-btn k-btn--secondary' + cls + '" type="button">Semana</button>' +
        '<button class="k-btn k-btn--secondary' + cls + '" type="button">Mês</button>' +
      '</div>' +
      '<button class="k-btn k-btn--primary k-btn--block' + cls + '" type="button" style="max-width:220px">Largura total</button>' +
      '</div>';
  }).join('');

  const BTN_RULES_CARD =
    '<div class="k-btn-rules">' +
      '<div class="k-btn-rules__head">' +
        '<p class="k-btn-rules__meta">Três tamanhos de botão · geometria derivada da menor fonte aplicada ao estilo</p>' +
      '</div>' +
      '<div class="k-btn-rules__row"><strong>Compacto</strong><span>Altura e paddings calculados do tamanho vertical da menor fonte aplicada (<code>--k-btn-h-compact</code>, <code>--k-btn-pad-*</code>). Fonte = menor visível (<code>--k-fs-compact</code>, 11,5 px por padrão), peso 400, sem ícone e sem sombra.</span></div>' +
      '<div class="k-btn-rules__row"><strong>Mediano</strong><span>A mesma referência no passo intermediário da fonte (<code>--k-btn-h-sm</code>). Fonte = mínimo × 1,09 (<code>--k-fs-sm</code>, 12,5 px por padrão), peso 500; o ícone acompanha a fonte (<code>--k-btn-icon-sm</code>).</span></div>' +
      '<div class="k-btn-rules__row"><strong>Grande</strong><span>A mesma referência no passo alto (<code>--k-btn-h</code>). Fonte = mínimo × 1,30 (<code>--k-fs</code>, 15 px por padrão), peso 500, ícone proporcional (<code>--k-btn-icon</code>). Classe base, proporções de “Salvar alterações”; é o maior botão permitido.</span></div>' +
      '<div class="k-btn-rules__row"><strong>Fonte aplicada</strong><span>A referência é a fonte do estilo. Ao escolher outra fonte, seu menor visível pode ser redefinido nas configurações da própria fonte; ao clicar em <code>Aplicar</code> em Propriedades, esse valor em px passa a comandar a sequência: 1 = mínimo, 2 = mínimo × 1,09, 3 = mínimo × 1,30 (padrão 11,5 / 12,5 / 15 px). Altura, margens, paddings e ícones dos botões derivam do mesmo valor.</span></div>' +
      '<div class="k-btn-rules__row"><strong>Estilo extraído</strong><span>Ao menos um dos passos além do compacto deve manter compatibilidade visual com o estilo extraído. Se o estilo extraído já for próximo do menor tamanho possível, não se cria um compacto menor: as variantes sobem de tamanho.</span></div>' +
      '<div class="k-btn-rules__row"><strong>Ícones</strong><span>Sem tamanho fixo: o compacto não exibe ícone; nos outros dois o ícone é calculado a partir da fonte aplicada (<code>--k-btn-icon-sm</code> e <code>--k-btn-icon</code>).</span></div>' +
    '</div>';

  const components = [
    /* ---------------- Ações ---------------- */
    {
      id: 'button',
      group: 'Ações',
      title: 'Botões',
      desc: 'Cinco variantes em três tamanhos. Cada linha mostra os estados normal, hover, foco, pressionado e desativado: primeiro os compactos, depois os medianos e os grandes. A geometria acompanha a menor fonte aplicada ao estilo; regras técnicas no bloco inferior.',
      code:
        '<button class="k-btn k-btn--primary k-btn--compact" type="button">Salvar</button>\n' +
        '<button class="k-btn k-btn--secondary k-btn--sm" type="button">' + icon('copy', 'k-icon--sm') + 'Cancelar</button>\n' +
        '<button class="k-btn k-btn--primary" type="button">' + icon('save') + 'Salvar alterações</button>\n\n' +
        '<button class="k-btn k-btn--primary" type="button">Normal</button>\n' +
        '<button class="k-btn k-btn--primary is-hover" type="button">Hover</button>\n' +
        '<button class="k-btn k-btn--primary is-focus" type="button">Foco</button>\n' +
        '<button class="k-btn k-btn--primary is-active" type="button">Pressionado</button>\n' +
        '<button class="k-btn k-btn--primary" type="button" disabled>Desativado</button>\n\n' +
        '<div class="k-btn-group">\n' +
        '  <button class="k-btn k-btn--secondary" type="button">Dia</button>\n' +
        '  <button class="k-btn k-btn--secondary" type="button">Semana</button>\n' +
        '  <button class="k-btn k-btn--secondary" type="button">Mês</button>\n' +
        '</div>',
      demo: () =>
        block(
          'Variantes',
          '<div class="k-row k-row--tight">' + BTN + BTN2 + '<button class="k-btn k-btn--outline" type="button">Filtrar</button>' + BTN3 + BTN4 + '</div>'
        ) +
        block('Compacto', btnStateRows(BTN_SIZES[0])) +
        block('Mediano', btnStateRows(BTN_SIZES[1])) +
        block('Grande', btnStateRows(BTN_SIZES[2])) +
        block('Grupo e largura total', btnGroupRows()) +
        block('Informação técnica', BTN_RULES_CARD),
    },
    {
      id: 'menu',
      group: 'Ações',
      title: 'Menu suspenso',
      desc: 'Feito com <details>, abre sem JavaScript e funciona no modo funcional.',
      code:
        '<details class="k-menu">\n' +
        '  <summary class="k-btn k-btn--secondary">Ações</summary>\n' +
        '  <div class="k-menu__pop">\n' +
        '    <button class="k-menu__item" type="button">Editar</button>\n' +
        '    <button class="k-menu__item" type="button">Duplicar</button>\n' +
        '    <div class="k-menu__sep"></div>\n' +
        '    <button class="k-menu__item k-menu__item--danger" type="button">Excluir</button>\n' +
        '  </div>\n' +
        '</details>',
      demo: () =>
        '<div class="spec-stage spec-stage--tall"><div class="k-row">' +
        '<details class="k-menu" open><summary class="k-btn k-btn--secondary">' + icon('more-options') + 'Ações</summary>' +
        '<div class="k-menu__pop">' +
        '<div class="k-menu__label">Arquivo</div>' +
        '<button class="k-menu__item" type="button">' + icon('edit-mode', 'k-icon--sm') + 'Editar</button>' +
        '<button class="k-menu__item" type="button">' + icon('duplicate', 'k-icon--sm') + 'Duplicar</button>' +
        '<button class="k-menu__item" type="button">' + icon('share', 'k-icon--sm') + 'Compartilhar</button>' +
        '<div class="k-menu__sep"></div>' +
        '<button class="k-menu__item k-menu__item--danger" type="button">' + icon('trash', 'k-icon--sm') + 'Excluir</button>' +
        '</div></details>' +
        '<button class="k-btn k-btn--icon k-btn--ghost" type="button" aria-label="Mais">' + icon('more-options') + '</button>' +
        '</div></div>',
    },
    {
      id: 'pagination',
      group: 'Ações',
      title: 'Paginação',
      desc: 'Página atual, limites e total de resultados.',
      code:
        '<nav class="k-pagination" aria-label="Paginação">\n' +
        '  <button class="k-page" type="button" disabled>Anterior</button>\n' +
        '  <button class="k-page is-active" type="button">1</button>\n' +
        '  <button class="k-page" type="button">2</button>\n' +
        '  <button class="k-page" type="button">3</button>\n' +
        '  <button class="k-page" type="button">Próxima</button>\n' +
        '</nav>',
      demo: () =>
        block(
          'Páginas',
          '<div class="k-pagination">' +
            '<button class="k-page" type="button" disabled>Anterior</button>' +
            '<button class="k-page is-active" type="button">1</button>' +
            '<button class="k-page" type="button">2</button>' +
            '<button class="k-page" type="button">3</button>' +
            '<button class="k-page" type="button">…</button>' +
            '<button class="k-page" type="button">12</button>' +
            '<button class="k-page" type="button">Próxima</button>' +
            '</div>'
        ) +
        block('Com contagem', '<div class="k-row k-row--between"><span class="k-small k-muted">Mostrando 1–20 de 248</span><div class="k-pagination"><button class="k-page is-active" type="button">1</button><button class="k-page" type="button">2</button><button class="k-page" type="button">3</button></div></div>'),
    },

    /* ---------------- Formulários ---------------- */
    {
      id: 'field',
      group: 'Formulários',
      title: 'Campos',
      desc: 'Rótulo, texto de apoio, erro, ícone e sufixo. Foco visível em todos os estilos.',
      code:
        '<label class="k-field">\n' +
        '  <span class="k-field__label">E-mail</span>\n' +
        '  <input class="k-input" type="email" placeholder="voce@empresa.com">\n' +
        '  <span class="k-field__hint">Usamos para login e avisos.</span>\n' +
        '</label>\n\n' +
        '<label class="k-field k-field--error">\n' +
        '  <span class="k-field__label">Senha</span>\n' +
        '  <input class="k-input" type="password" value="1234">\n' +
        '  <span class="k-field__error">Mínimo de 8 caracteres.</span>\n' +
        '</label>',
      demo: () =>
        '<div class="spec-grid2">' +
        '<div class="k-stack">' +
        '<label class="k-field"><span class="k-field__label">Nome do projeto <span class="k-req">*</span></span><input class="k-input" value="Catálogo de interface"><span class="k-field__hint">Aparece na barra lateral.</span></label>' +
        '<label class="k-field"><span class="k-field__label">Buscar</span><span class="k-input-icon">' + icon('search') + '<input class="k-input" placeholder="Buscar componentes"></span></label>' +
        '<label class="k-field"><span class="k-field__label">Ambiente</span><select class="k-select"><option>Produção</option><option>Homologação</option><option>Local</option></select></label>' +
        '</div>' +
        '<div class="k-stack">' +
        '<label class="k-field k-field--error"><span class="k-field__label">E-mail</span><input class="k-input" value="nome@" aria-invalid="true"><span class="k-field__error">' + icon('report', 'k-icon--sm') + 'Informe um e-mail válido.</span></label>' +
        '<label class="k-field"><span class="k-field__label">Descrição</span><textarea class="k-textarea" rows="3">Kit de interface em HTML e CSS, com temas por tokens.</textarea></label>' +
        '<label class="k-field"><span class="k-field__label">Desativado</span><input class="k-input" value="Somente leitura" disabled></label>' +
        '</div>' +
        '</div>',
    },
    {
      id: 'choice',
      group: 'Formulários',
      title: 'Seleção e alternadores',
      desc: 'Caixas, rádios, interruptores e controle deslizante, com estados marcados e desativados.',
      code:
        '<label class="k-choice">\n' +
        '  <input type="checkbox" checked>\n' +
        '  <span class="k-choice__box"></span>\n' +
        '  Receber novidades\n' +
        '</label>\n\n' +
        '<label class="k-switch">\n' +
        '  <input type="checkbox" checked>\n' +
        '  <span class="k-switch__track"></span>\n' +
        '  Modo compacto\n' +
        '</label>',
      demo: () =>
        '<div class="spec-grid2">' +
        '<div class="k-stack">' +
        '<div class="k-eyebrow">Caixas</div>' +
        '<label class="k-choice"><input type="checkbox" checked><span class="k-choice__box"></span>Notificações por e-mail</label>' +
        '<label class="k-choice"><input type="checkbox"><span class="k-choice__box"></span>Resumo semanal</label>' +
        '<label class="k-choice"><input type="checkbox" disabled><span class="k-choice__box"></span>Opção indisponível</label>' +
        '<div class="k-eyebrow" style="margin-top:8px">Rádios</div>' +
        '<label class="k-choice k-choice--radio"><input type="radio" name="r1" checked><span class="k-choice__box"></span>Mensal</label>' +
        '<label class="k-choice k-choice--radio"><input type="radio" name="r1"><span class="k-choice__box"></span>Anual — 20% off</label>' +
        '</div>' +
        '<div class="k-stack">' +
        '<div class="k-eyebrow">Interruptores</div>' +
        '<label class="k-switch"><input type="checkbox" checked><span class="k-switch__track"></span>Tema escuro</label>' +
        '<label class="k-switch"><input type="checkbox"><span class="k-switch__track"></span>Animações</label>' +
        '<div class="k-eyebrow" style="margin-top:8px">Intensidade</div>' +
        '<input class="k-range" type="range" min="0" max="100" value="64">' +
        '<div class="k-row k-row--between"><span class="k-small k-muted">Suave</span><span class="k-small k-mono">64</span><span class="k-small k-muted">Forte</span></div>' +
        '</div></div>',
    },
    {
      id: 'combobox',
      group: 'Formulários',
      title: 'Caixa combinada',
      desc: 'Campo de digitação com lista filtrável de opções. Aceita seleção única, estado vazio e item ativo.',
      code:
        '<div class="k-combo is-open">\n' +
        '  <div class="k-combo__field">\n' +
        '    <input class="k-input" role="combobox" aria-expanded="true" aria-controls="cidades" value="São">\n' +
        '    <span class="k-combo__caret"></span>\n' +
        '  </div>\n' +
        '  <div class="k-combo__pop" id="cidades" role="listbox">\n' +
        '    <button class="k-combo__opt" type="button" role="option">São Paulo</button>\n' +
        '    <button class="k-combo__opt" type="button" role="option">Santo André</button>\n' +
        '  </div>\n' +
        '</div>',
      demo: () =>
        block(
          'Aberto com filtro',
          '<div class="k-combo" style="max-width:340px">' +
            '<div class="k-combo__field"><input class="k-input" value="São" aria-label="Cidade"><span class="k-combo__caret"></span></div>' +
            '<div class="k-combo__pop k-combo__pop--inline" role="listbox">' +
            '<button class="k-combo__opt is-active" type="button" role="option">' + icon('select-checkbox', 'k-icon--sm') + 'São Paulo</button>' +
            '<button class="k-combo__opt" type="button" role="option">Santo André</button>' +
            '<button class="k-combo__opt" type="button" role="option">Santos</button>' +
            '<div class="k-combo__empty">Nenhum resultado para “São Carlos”.</div>' +
            '</div>' +
            '</div>'
        ) +
        block(
          'Fechado',
          '<div class="k-combo" style="max-width:340px"><div class="k-combo__field"><input class="k-input" placeholder="Escolher cidade" aria-label="Cidade"><span class="k-combo__caret"></span></div></div>'
        ),
    },
    {
      id: 'slider',
      group: 'Formulários',
      title: 'Controle deslizante',
      desc: 'Seleção de valor único com escala, e faixa de dois indicadores para intervalos.',
      code:
        '<div class="k-slider">\n' +
        '  <div class="k-slider__head">\n' +
        '    <span>Volume</span><span class="k-slider__value">64%</span>\n' +
        '  </div>\n' +
        '  <input class="k-range" type="range" min="0" max="100" value="64">\n' +
        '  <div class="k-slider__scale"><span>0</span><span>100</span></div>\n' +
        '</div>',
      demo: () =>
        block(
          'Valor único',
          '<div class="k-slider" style="max-width:380px"><div class="k-slider__head"><span>Opacidade da textura</span><span class="k-slider__value">64%</span></div>' +
            '<input class="k-range" type="range" min="0" max="100" value="64" aria-label="Opacidade">' +
            '<div class="k-slider__scale"><span>0</span><span>50</span><span>100</span></div></div>'
        ) +
        block(
          'Faixa de valores',
          '<div class="k-slider" style="max-width:380px"><div class="k-slider__head"><span>Faixa de preço</span><span class="k-slider__value">R$ 120 – 480</span></div>' +
            '<div class="k-slider__rails"><span class="k-slider__rail"></span><span class="k-slider__fill" style="left:12%;width:68%"></span>' +
            '<span class="k-slider__thumb" style="left:12%"></span><span class="k-slider__thumb" style="left:80%"></span></div>' +
            '<div class="k-slider__scale"><span>R$ 0</span><span>R$ 600</span></div></div>'
        ),
    },
    {
      id: 'datetime',
      group: 'Formulários',
      title: 'Data e hora',
      desc: 'Calendário mensal com dia atual, seleção e dias adjacentes, além de campo de horário.',
      code:
        '<div class="k-datetime">\n' +
        '  <div class="k-datetime__head">\n' +
        '    <span class="k-datetime__month">Novembro 2026</span>\n' +
        '    <div class="k-datetime__nav">…</div>\n' +
        '  </div>\n' +
        '  <div class="k-datetime__grid">…</div>\n' +
        '  <div class="k-datetime__time">Horário <input class="k-input" type="time" value="09:30"></div>\n' +
        '</div>',
      demo: () => {
        const dows = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
          .map((d) => '<span class="k-datetime__dow">' + d + '</span>')
          .join('');
        let days = '';
        for (let i = 1; i <= 30; i++) {
          const cls = i === 17 ? ' is-selected' : i === 19 ? ' is-today' : '';
          days += '<button class="k-datetime__day' + cls + '" type="button">' + i + '</button>';
        }
        for (let i = 1; i <= 5; i++) {
          days += '<button class="k-datetime__day is-muted" type="button">' + i + '</button>';
        }
        return (
          block(
            'Calendário',
            '<div class="k-datetime"><div class="k-datetime__head"><span class="k-datetime__month">Novembro 2026</span>' +
              '<div class="k-datetime__nav"><button type="button" aria-label="Mês anterior">' + icon('previous', 'k-icon--sm') + '</button>' +
              '<button type="button" aria-label="Próximo mês">' + icon('next', 'k-icon--sm') + '</button></div></div>' +
              '<div class="k-datetime__grid">' + dows + days + '</div>' +
              '<div class="k-datetime__time">Horário <input class="k-input" type="time" value="09:30" aria-label="Horário"></div></div>'
          ) +
          block(
            'Campo de data',
            '<label class="k-field" style="max-width:320px"><span class="k-field__label">Data de publicação</span>' +
              '<span class="k-input-icon">' + icon('date-and-time') + '<input class="k-input" value="17/11/2026"></span>' +
              '<span class="k-field__hint">Formato conforme o idioma do navegador.</span></label>'
          )
        );
      },
    },
    {
      id: 'upload',
      group: 'Formulários',
      title: 'Envio de arquivos',
      desc: 'Área de arrastar e soltar, arquivo em progresso e arquivo concluído com remoção.',
      code:
        '<label class="k-upload">\n' +
        '  <span class="k-upload__icon">…</span>\n' +
        '  <span class="k-upload__title">Solte arquivos ou clique para enviar</span>\n' +
        '  <span class="k-upload__hint">PNG, SVG ou PDF · até 8 MB</span>\n' +
        '  <input type="file" hidden>\n' +
        '</label>',
      demo: () =>
        block(
          'Área de envio',
          '<label class="k-upload"><span class="k-upload__icon">' + icon('insert-files-using-drive', 'k-icon--lg') + '</span>' +
            '<span class="k-upload__title">Solte arquivos ou clique para enviar</span>' +
            '<span class="k-upload__hint">PNG, SVG ou PDF · até 8 MB</span>' +
            '<button class="k-btn k-btn--secondary k-btn--sm" type="button">Escolher arquivo</button>' +
            '<input type="file" hidden></label>'
        ) +
        block(
          'Arquivos',
          '<div class="k-stack k-stack--sm">' +
            '<div class="k-file"><div class="k-file__icon">' + icon('generate-image') + '</div><div class="k-file__main"><div class="k-file__name">capa-do-kit.png</div><div class="k-file__meta">1,2 MB · enviado</div></div><span class="k-badge k-badge--success">Pronto</span><button class="k-file__x" type="button" aria-label="Remover">' + icon('close', 'k-icon--sm') + '</button></div>' +
            '<div class="k-file"><div class="k-file__icon">' + icon('folder') + '</div><div class="k-file__main"><div class="k-file__name">tokens.json</div><div class="k-file__meta">48% · 22 kB de 46 kB</div><div class="k-file__bar"><i style="width:48%"></i></div></div><button class="k-file__x" type="button" aria-label="Cancelar">' + icon('close', 'k-icon--sm') + '</button></div>' +
            '</div>'
        ),
    },
    {
      id: 'accordion',
      group: 'Formulários',
      title: 'Acordeão',
      desc: 'Perguntas frequentes e blocos avançados. Um item aberto por vez não é obrigatório.',
      code:
        '<div class="k-acc">\n' +
        '  <details class="k-acc__item" open>\n' +
        '    <summary>Como os temas funcionam?</summary>\n' +
        '    <div class="k-acc__body">Cada estilo é um conjunto de tokens.</div>\n' +
        '  </details>\n' +
        '</div>',
      demo: () =>
        '<div class="k-acc">' +
        '<details class="k-acc__item" open><summary>Como os temas funcionam?</summary><div class="k-acc__body">Cada estilo é apenas um conjunto de valores: cor, raio, borda, sombra, espaçamento e tipografia. Os componentes não mudam.</div></details>' +
        '<details class="k-acc__item"><summary>Posso usar em outro projeto?</summary><div class="k-acc__body">Sim. Exporte HTML + CSS, os tokens em JSON ou o pacote ZIP.</div></details>' +
        '<details class="k-acc__item"><summary>Os ícones acompanham a exportação?</summary><div class="k-acc__body">Sí. São vetoriais e herdam a cor do texto.</div></details>' +
        '</div>',
    },
    {
      id: 'colorpicker',
      group: 'Formulários',
      title: 'Seletor de cor flutuante',
      desc: 'Mini janela arrastável com espectro 100% quadrado e RGB/HEX/CMYK sincronizados; os quatro botões da linha superior usam o mesmo padrão, inclusive o switch de ícone único que troca o modo sem mudar a altura, com copiar/colar alinhados ao campo e Reabrir caixas; ao reabrir, mantém o modo e a cor configurados.',
      code: colorpickerMarkup(false, CP_VARIANTS[0]),
      demo: colorpickerDemo,
    },
    /* ---------------- Exibição ---------------- */
    {
      id: 'badge',
      group: 'Exibição',
      title: 'Etiquetas, tags e teclas',
      desc: 'Status, contadores, filtros removíveis e atalhos de teclado.',
      code:
        '<span class="k-badge k-badge--primary">Novo</span>\n' +
        '<span class="k-badge k-badge--success">Ativo</span>\n' +
        '<span class="k-tag">Design <button class="k-tag__x">×</button></span>\n' +
        '<kbd class="k-kbd">Ctrl</kbd>',
      demo: () =>
        block(
          'Etiquetas',
          '<div class="k-row k-row--tight">' +
            '<span class="k-badge">Neutra</span>' +
            '<span class="k-badge k-badge--primary">Novo</span>' +
            '<span class="k-badge k-badge--solid">Beta</span>' +
            '<span class="k-badge k-badge--success"><span class="k-dot"></span>Ativo</span>' +
            '<span class="k-badge k-badge--danger">Erro</span>' +
            '<span class="k-badge k-badge--accent">Destaque</span>' +
            '<span class="k-badge k-badge--outline">Rascunho</span>' +
            '</div>'
        ) +
        block(
          'Tags removíveis',
          '<div class="k-row k-row--tight">' +
            '<span class="k-tag">Design' + btnX() + '</span>' +
            '<span class="k-tag">CSS' + btnX() + '</span>' +
            '<span class="k-tag">Tokens' + btnX() + '</span>' +
            '</div>'
        ) +
        block('Teclas', '<div class="k-row k-row--tight"><kbd class="k-kbd">Ctrl</kbd><span class="k-small k-muted">+</span><kbd class="k-kbd">K</kbd><span class="k-small k-muted" style="margin-left:10px">para buscar</span><kbd class="k-kbd">Esc</kbd></div>'),
    },
    {
      id: 'divider',
      group: 'Exibição',
      title: 'Divisores',
      desc: 'Linhas horizontais, verticais e com rótulo para separar seções lógicas.',
      code:
        '<hr class="k-divider">\n' +
        '<hr class="k-divider k-divider--inset">\n' +
        '<div class="k-divider k-divider--label">ou</div>',
      demo: () =>
        block('Horizontal', '<div class="k-stack k-stack--sm"><span class="k-small k-muted">Acima do divisor</span><hr class="k-divider"><span class="k-small k-muted">Abaixo do divisor</span><hr class="k-divider k-divider--inset"><span class="k-small k-muted">Com recuo lateral</span></div>') +
        block('Com rótulo', '<div class="k-stack"><div class="k-divider k-divider--label">ou continue com</div><div class="k-row k-row--tight"><button class="k-btn k-btn--secondary k-btn--sm" type="button">E-mail</button><button class="k-btn k-btn--secondary k-btn--sm" type="button">Link mágico</button></div></div>') +
        block('Vertical', '<div class="k-divider-group"><span class="k-small">Editar</span><span class="k-divider k-divider--vertical"></span><span class="k-small">Duplicar</span><span class="k-divider k-divider--vertical"></span><span class="k-small">Excluir</span></div>'),
    },
    {
      id: 'card',
      group: 'Exibição',
      title: 'Card',
      desc: 'Superfície base para agrupar conteúdo, com cabeçalho, corpo e rodapé de ações.',
      code:
        '<article class="k-card">\n' +
        '  <div class="k-card__head">\n' +
        '    <div>\n' +
        '      <h3 class="k-card__title">Plano Pro</h3>\n' +
        '      <p class="k-card__meta">Cobrança mensal</p>\n' +
        '    </div>\n' +
        '    <span class="k-badge k-badge--success">Ativo</span>\n' +
        '  </div>\n' +
        '  <p class="k-muted">Recursos avançados para equipes.</p>\n' +
        '  <div class="k-card__foot">\n' +
        '    <button class="k-btn k-btn--ghost">Detalhes</button>\n' +
        '  </div>\n' +
        '</article>',
      demo: () =>
        '<div class="k-grid">' +
        '<article class="k-card"><div class="k-card__head"><div><h3 class="k-card__title">Plano Pro</h3><p class="k-card__meta">Cobrança mensal</p></div><span class="k-badge k-badge--success">Ativo</span></div><p class="k-muted k-small">Recursos avançados para equipes que publicam interfaces com frequência.</p><div class="k-card__foot"><button class="k-btn k-btn--ghost k-btn--sm" type="button">Detalhes</button><button class="k-btn k-btn--secondary k-btn--sm" type="button">Gerenciar</button></div></article>' +
        '<article class="k-card k-card--accent"><div class="k-card__head"><div><h3 class="k-card__title">Convite pendente</h3><p class="k-card__meta">Expira em 3 dias</p></div>' + icon('notifications', 'k-icon--lg') + '</div><p class="k-small" style="color:inherit;opacity:.85">Compartilhe o link com o time de produto.</p><div class="k-row k-row--tight" style="margin-top:12px"><span class="k-mono k-small k-grow" style="overflow:hidden;text-overflow:ellipsis">kit.ui/convite/9f2a…</span><button class="k-btn k-btn--sm" type="button">' + icon('copy') + 'Copiar</button></div></article>' +
        '<article class="k-card k-card--flat"><div class="k-card__head"><h3 class="k-card__title">Rascunho</h3><span class="k-badge k-badge--outline">v3</span></div><div class="k-stack k-stack--sm"><div class="k-skel" style="width:90%"></div><div class="k-skel" style="width:75%"></div><div class="k-skel" style="width:55%"></div></div></article>' +
        '</div>',
    },
    {
      id: 'window',
      group: 'Exibição',
      title: 'Janela',
      desc: 'Moldura de aplicativo com barra de título, controles de janela (minimizar, maximizar, fechar), área lateral, corpo e rodapé de status.',
      code:
        '<section class="k-window">\n' +
        '  <div class="k-window__bar">\n' +
        '    <span class="k-window__lights"><i></i><i></i><i></i></span>\n' +
        '    <span class="k-window__title">Projeto Atlas <span class="k-window__sub">— rascunho</span></span>\n' +
        '    <div class="k-window__tools">\n' +
        '      <button class="k-btn k-btn--ghost k-btn--icon k-btn--sm">…</button>\n' +
        '    </div>\n' +
        '    <div class="k-window__controls">\n' +
        '      <button class="k-window__ctrl" aria-label="Minimizar">…</button>\n' +
        '      <button class="k-window__ctrl" aria-label="Maximizar">…</button>\n' +
        '      <button class="k-window__ctrl k-window__ctrl--close" aria-label="Fechar">…</button>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '  <div class="k-window__body">\n' +
        '    <nav class="k-window__rail">…</nav>\n' +
        '    <div class="k-window__content">…</div>\n' +
        '  </div>\n' +
        '  <div class="k-window__foot">…</div>\n' +
        '</section>\n\n' +
        '<section class="k-window k-window--dialog">…</section>',
      demo: () =>
        block(
          'Aplicativo',
          '<section class="k-window">' +
            '<div class="k-window__bar"><span class="k-window__lights"><i></i><i></i><i></i></span>' +
            '<span class="k-window__title">Projeto Atlas <span class="k-window__sub">— rascunho</span></span>' +
            '<div class="k-window__tools"><button class="k-btn k-btn--ghost k-btn--icon k-btn--sm" type="button" aria-label="Mais ações">' + icon('more-options', 'k-icon--sm') + '</button></div>' +
            '<div class="k-window__controls">' +
            '<button class="k-window__ctrl" type="button" aria-label="Minimizar" title="Minimizar">' + icon('minimize', 'k-icon--sm') + '</button>' +
            '<button class="k-window__ctrl" type="button" aria-label="Maximizar" title="Maximizar">' + icon('full-screen', 'k-icon--sm') + '</button>' +
            '<button class="k-window__ctrl k-window__ctrl--close" type="button" aria-label="Fechar" title="Fechar">' + icon('close', 'k-icon--sm') + '</button></div></div>' +
            '<div class="k-window__body"><nav class="k-window__rail">' +
            '<a class="k-sidebar__item is-active" href="#">' + icon('home', 'k-icon--sm') + '<span class="k-sidebar__item__label">Início</span></a>' +
            '<a class="k-sidebar__item" href="#">' + icon('folder', 'k-icon--sm') + '<span class="k-sidebar__item__label">Arquivos</span></a>' +
            '<a class="k-sidebar__item" href="#">' + icon('comment', 'k-icon--sm') + '<span class="k-sidebar__item__label">Comentários</span><span class="k-badge">3</span></a>' +
            '<a class="k-sidebar__item" href="#">' + icon('settings', 'k-icon--sm') + '<span class="k-sidebar__item__label">Ajustes</span></a></nav>' +
            '<div class="k-window__content"><div class="k-row k-row--between"><h3 class="k-h3">Documentos</h3><button class="k-btn k-btn--primary k-btn--sm" type="button">' + icon('new', 'k-icon--sm') + 'Novo</button></div>' +
            '<ul class="k-list" style="margin-top:8px">' +
            '<li class="k-list__item"><span class="k-avatar k-avatar--sm">A</span><div class="k-list__main"><div class="k-list__title">Briefing do produto</div><div class="k-list__meta">Editado há 4 min</div></div><span class="k-badge k-badge--success">Pronto</span></li>' +
            '<li class="k-list__item"><span class="k-avatar k-avatar--sm">B</span><div class="k-list__main"><div class="k-list__title">Tokens de cor</div><div class="k-list__meta">Editado ontem</div></div><span class="k-badge k-badge--outline">Rascunho</span></li>' +
            '</ul></div></div>' +
            '<div class="k-window__foot"><span class="k-window__status"><span class="k-dot"></span>Salvo automaticamente</span><span class="k-small k-mono">v0.8.2</span></div></section>'
        ) +
        block(
          'Diálogo',
          '<div class="k-row" style="justify-content:center"><section class="k-window k-window--dialog">' +
            '<div class="k-window__bar k-window__bar--plain"><span class="k-window__title">Renomear projeto</span>' +
            '<div class="k-window__controls"><button class="k-window__ctrl k-window__ctrl--close" type="button" aria-label="Fechar" title="Fechar">' + icon('close', 'k-icon--sm') + '</button></div></div>' +
            '<div class="k-window__body k-window__body--pad">' +
            '<label class="k-field"><span class="k-field__label">Nome</span><input class="k-input" value="Catálogo de interface"></label>' +
            '<p class="k-small k-muted">O endereço público será atualizado na próxima publicação.</p></div>' +
            '<div class="k-window__foot"><span class="k-small k-muted">Enter para confirmar</span><div class="k-row k-row--tight"><button class="k-btn k-btn--ghost k-btn--sm" type="button">Cancelar</button><button class="k-btn k-btn--primary k-btn--sm" type="button">Renomear</button></div></div></section></div>'
        ) +
        block(
          'Janela de comandos',
          '<section class="k-window k-window--dialog" style="max-width:100%">' +
            '<div class="k-window__bar k-window__bar--plain"><span class="k-window__title">Comandos rápidos</span><span class="k-kbd" style="margin-left:auto">Esc</span></div>' +
            '<div class="k-window__body k-window__body--pad">' +
            '<div class="k-search">' + icon('search') + '<input class="k-input" placeholder="Buscar comando…" value="ex"></div>' +
            '<div class="k-menu" style="display:block;border:var(--k-bw) solid var(--k-border);border-radius:var(--k-radius-md);padding:4px">' +
            '<div class="k-menu__label">Ações</div>' +
            '<button class="k-menu__item" type="button">' + icon('download', 'k-icon--sm') + 'Exportar projeto<span class="k-kbd" style="margin-left:auto">⌘E</span></button>' +
            '<button class="k-menu__item" type="button">' + icon('share', 'k-icon--sm') + 'Compartilhar link</button>' +
            '<button class="k-menu__item k-menu__item--danger" type="button">' + icon('trash', 'k-icon--sm') + 'Excluir rascunho</button>' +
            '</div></div></section>'
        ),
    },
    {
      id: 'avatar',
      group: 'Exibição',
      title: 'Avatar',
      desc: 'Iniciais, tamanhos, formato quadrado e grupo sobreposto.',
      code:
        '<span class="k-avatar">FS</span>\n' +
        '<span class="k-avatar k-avatar--sm">RP</span>\n' +
        '<div class="k-avatar-group">\n' +
        '  <span class="k-avatar">A</span>\n' +
        '  <span class="k-avatar">B</span>\n' +
        '</div>',
      demo: () =>
        block(
          'Formatos',
          '<div class="k-row">' +
            '<span class="k-avatar k-avatar--lg k-avatar--solid">FS</span>' +
            '<span class="k-avatar">FS</span>' +
            '<span class="k-avatar k-avatar--sm">RP</span>' +
            '<span class="k-avatar k-avatar--square k-avatar--solid">' + icon('account') + '</span>' +
            '<div class="k-avatar-group"><span class="k-avatar">AL</span><span class="k-avatar">MC</span><span class="k-avatar">JP</span><span class="k-avatar k-avatar--solid">+7</span></div>' +
            '</div>'
        ) +
        block(
          'Com texto',
          '<div class="k-row"><span class="k-avatar k-avatar--solid">FS</span><div><div class="k-strong">Fernanda Salas</div><div class="k-small k-muted">Design systems · fernanda@kit.ui</div></div><span class="k-badge k-badge--success" style="margin-left:auto">Online</span></div>'
        ),
    },
    {
      id: 'stat',
      group: 'Exibição',
      title: 'Indicadores',
      desc: 'Número, rótulo, variação e mini gráfico de barras.',
      code:
        '<div class="k-card k-card--flat">\n' +
        '  <div class="k-stat">\n' +
        '    <span class="k-stat__label">Receita mensal</span>\n' +
        '    <span class="k-stat__value">R$ 48.290</span>\n' +
        '    <span class="k-stat__delta">+12,4% no mês</span>\n' +
        '  </div>\n' +
        '</div>',
      demo: () =>
        '<div class="k-grid">' +
        statCard('Receita mensal', 'R$ 48.290', '+12,4%', [30, 45, 38, 60, 52, 70, 84]) +
        statCard('Componentes', '86', '+9 novos', [20, 28, 34, 30, 44, 52, 61]) +
        statCard('Tempo de build', '1,8s', '−0,4s', [70, 62, 58, 50, 46, 38, 32], true) +
        '</div>',
    },
    {
      id: 'progress',
      group: 'Exibição',
      title: 'Progresso',
      desc: 'Barras de 4, 8 e 12 px com variações de cor e rótulo.',
      code:
        '<div class="k-progress">\n' +
        '  <div class="k-progress__bar" style="width:68%"></div>\n' +
        '</div>',
      demo: () =>
        block(
          'Barras',
          '<div class="k-stack">' +
            '<div><div class="k-meter"><span>Documentação</span><span class="k-mono">68%</span></div><div class="k-progress"><div class="k-progress__bar" style="width:68%"></div></div></div>' +
            '<div><div class="k-meter"><span>Tokens revisados</span><span class="k-mono">92%</span></div><div class="k-progress k-progress--lg"><div class="k-progress__bar" style="width:92%"></div></div></div>' +
            '<div><div class="k-meter"><span>Ícones aplicados</span><span class="k-mono">34%</span></div><div class="k-progress k-progress--xs"><div class="k-progress__bar" style="width:34%"></div></div></div>' +
            '</div>'
        ) +
        block('Cor de destaque', '<div class="k-progress k-progress--accent"><div class="k-progress__bar" style="width:74%"></div></div>'),
    },
    {
      id: 'spinner',
      group: 'Feedback',
      title: 'Indicador de carregamento',
      desc: 'Anel giratório em três tamanhos, com texto de apoio e bloco centralizado.',
      code:
        '<div class="k-loading">\n' +
        '  <span class="k-spinner k-spinner--sm"></span>\n' +
        '  Carregando…\n' +
        '</div>',
      demo: () =>
        block('Tamanhos', '<div class="k-row" style="gap:24px"><span class="k-spinner k-spinner--sm"></span><span class="k-spinner"></span><span class="k-spinner k-spinner--lg"></span></div>') +
        block('Com texto', '<div class="k-row" style="gap:22px"><span class="k-loading"><span class="k-spinner k-spinner--sm"></span>Carregando tokens…</span><span class="k-loading"><span class="k-spinner"></span>Sincronizando</span></div>') +
        block('Bloco de espera', '<div class="k-loading-block"><span class="k-spinner k-spinner--lg"></span><span class="k-small k-muted">Gerando o pacote ZIP do kit…</span></div>'),
    },
    {
      id: 'table',
      group: 'Exibição',
      title: 'Tabela',
      desc: 'Cabeçalho em caixa alta, números tabulares e status por etiqueta.',
      code:
        '<div class="k-table__wrap">\n' +
        '  <table class="k-table">\n' +
        '    <thead><tr><th>Projeto</th><th>Status</th><th class="k-num">Tokens</th></tr></thead>\n' +
        '    <tbody>\n' +
        '      <tr><td>Catálogo</td><td><span class="k-badge k-badge--success">Ativo</span></td><td class="k-num">128</td></tr>\n' +
        '    </tbody>\n' +
        '  </table>\n' +
        '</div>',
      demo: () =>
        '<div class="k-table__wrap"><table class="k-table"><thead><tr><th>Projeto</th><th>Responsável</th><th>Status</th><th class="k-num">Tokens</th><th class="k-num">Atualizado</th></tr></thead><tbody>' +
        row('Catálogo de interface', 'FS', 'Ativo', 'ok', '128', 'hoje') +
        row('Painel de métricas', 'MC', 'Revisão', 'warn', '96', 'ontem') +
        row('Portal do cliente', 'JP', 'Ativo', 'ok', '74', '2 dias') +
        row('App de campo', 'AL', 'Pausado', 'off', '52', '1 sem.') +
        '</tbody></table></div>',
    },
    {
      id: 'list',
      group: 'Exibição',
      title: 'Lista',
      desc: 'Itens com avatar, metadados e ação à direita.',
      code:
        '<ul class="k-list">\n' +
        '  <li class="k-list__item">…</li>\n' +
        '</ul>',
      demo: () =>
        '<div class="k-card k-card--flat" style="padding:0">' +
        '<ul class="k-list">' +
        listItem('FS', 'Fernanda Salas', 'Atualizou os tokens de cor', 'há 12 min', 'ok') +
        listItem('MC', 'Marcos Costa', 'Comentou no card “Botões”', 'há 1 h', 'warn') +
        listItem('JP', 'Julia Prado', 'Publicou a versão 3 do kit', 'há 3 h', 'ok') +
        listItem('AL', 'André Lima', 'Solicitou acesso ao projeto', 'ontem', 'off') +
        '</ul></div>',
    },
    {
      id: 'empty',
      group: 'Exibição',
      title: 'Estado vazio',
      desc: 'Área tracejada com ícone, explicação e ação principal.',
      code:
        '<div class="k-empty">\n' +
        '  <div class="k-empty__icon">…</div>\n' +
        '  <div class="k-empty__title">Nenhum componente</div>\n' +
        '  <p class="k-empty__text">Crie o primeiro para começar.</p>\n' +
        '  <button class="k-btn k-btn--primary">Novo componente</button>\n' +
        '</div>',
      demo: () =>
        '<div class="k-empty"><div class="k-empty__icon">' + icon('blank-page', 'k-icon--xl') + '</div><div class="k-empty__title">Nenhum componente neste grupo</div><p class="k-empty__text">Adicione um componente ou importe um pacote de ícones para começar.</p><button class="k-btn k-btn--primary" type="button">Novo componente</button></div>',
    },
    {
      id: 'skeleton',
      group: 'Exibição',
      title: 'Esqueleto de carga',
      desc: 'Placeholders com brilho contínuo, no lugar de spinner.',
      code:
        '<div class="k-skel" style="width:60%"></div>',
      demo: () =>
        '<div class="k-card k-card--flat"><div class="k-row"><div class="k-skel" style="width:38px;height:38px;border-radius:var(--k-radius-round)"></div><div class="k-grow k-stack k-stack--sm"><div class="k-skel" style="width:40%"></div><div class="k-skel" style="width:65%"></div></div></div><div class="k-stack k-stack--sm" style="margin-top:16px"><div class="k-skel"></div><div class="k-skel" style="width:92%"></div><div class="k-skel" style="width:78%"></div></div></div>',
    },
    {
      id: 'tooltip',
      group: 'Exibição',
      title: 'Dica flutuante',
      desc: 'Balão acima do elemento, revelado no hover ou fixado com a classe is-open.',
      code:
        '<span class="k-tip">\n' +
        '  <button class="k-btn k-btn--icon" aria-label="Ajuda">?</button>\n' +
        '  <span class="k-tip__bubble">Texto de ajuda</span>\n' +
        '</span>',
      demo: () =>
        block(
          'Aberta e em repouso',
          '<div class="k-row" style="padding-top:40px;gap:32px">' +
            '<span class="k-tip is-open">' + '<button class="k-btn k-btn--icon k-btn--secondary" type="button" aria-label="Ajuda">' + icon('help') + '</button><span class="k-tip__bubble">Abre a documentação</span></span>' +
            '<span class="k-tip">' + '<button class="k-btn k-btn--icon k-btn--ghost" type="button" aria-label="Informações">' + icon('help') + '</button><span class="k-tip__bubble">Passe o mouse</span></span>' +
            '</div>',
          'spec-stage--tall'
        ),
    },
    {
      id: 'chart',
      group: 'Exibição',
      title: 'Gráfico',
      desc: 'Linha suavizada com área, grade discreta e pontos. SVG puro, sem biblioteca.',
      code:
        '<svg class="k-chart" viewBox="0 0 320 120" role="img">\n' +
        '  <path class="k-chart__area" d="…"/>\n' +
        '  <path class="k-chart__line" d="…"/>\n' +
        '</svg>',
      demo: () =>
        '<div class="k-card"><div class="k-row k-row--between" style="margin-bottom:10px"><div><div class="k-card__title">Uso por semana</div><div class="k-card__meta">Últimos 3 meses</div></div><div class="k-row k-row--tight"><span class="k-badge k-badge--primary">Componentes</span><span class="k-small k-muted">+18%</span></div></div>' + chart() + '</div>',
    },

    /* ---------------- Navegação ---------------- */
    {
      id: 'tabs',
      group: 'Navegação',
      title: 'Abas e seletor segmentado',
      desc: 'Abas com indicador inferior e controle segmentado para alternar visões.',
      code:
        '<div class="k-tabs" role="tablist">\n' +
        '  <button class="k-tab" role="tab" aria-selected="true">Visão geral</button>\n' +
        '  <button class="k-tab" role="tab">Atividade</button>\n' +
        '</div>',
      demo: () =>
        block(
          'Abas',
          '<div class="k-tabs" role="tablist"><button class="k-tab" role="tab" aria-selected="true">' + icon('home', 'k-icon--sm') + 'Visão geral</button><button class="k-tab" role="tab">' + icon('history', 'k-icon--sm') + 'Atividade</button><button class="k-tab" role="tab">' + icon('settings', 'k-icon--sm') + 'Configurações</button><button class="k-tab" role="tab">Membros</button></div>'
        ) +
        block(
          'Segmentado',
          '<div class="k-seg"><button class="k-seg__btn is-active" type="button">Dia</button><button class="k-seg__btn" type="button">Semana</button><button class="k-seg__btn" type="button">Mês</button></div>' +
            '<div class="k-seg" style="margin-left:12px"><button class="k-seg__btn is-active" type="button">' + icon('grid', 'k-icon--sm') + 'Grade</button><button class="k-seg__btn" type="button">' + icon('layer', 'k-icon--sm') + 'Lista</button></div>'
        ),
    },
    {
      id: 'breadcrumb',
      group: 'Navegação',
      title: 'Trilha de navegação',
      desc: 'Caminho hierárquico com página atual destacada.',
      code:
        '<nav class="k-crumbs">\n' +
        '  <ol>\n' +
        '    <li><a href="#">Projetos</a></li>\n' +
        '    <li aria-current="page">Catálogo</li>\n' +
        '  </ol>\n' +
        '</nav>',
      demo: () =>
        block(
          'Caminho',
          '<nav class="k-crumbs"><ol><li><a href="#">Início</a></li><li><a href="#">Projetos</a></li><li><a href="#">Catálogo</a></li><li aria-current="page">Botões</li></ol></nav>'
        ),
    },
    {
      id: 'search',
      group: 'Navegação',
      title: 'Campo de busca',
      desc: 'Barra de pesquisa com atalho de teclado, limpeza e lista de sugestões.',
      code:
        '<div class="k-search">\n' +
        '  <svg class="k-icon">…</svg>\n' +
        '  <input class="k-input" type="search" placeholder="Buscar">\n' +
        '  <button class="k-search__clear" type="button" aria-label="Limpar">×</button>\n' +
        '  <kbd class="k-kbd k-search__kbd">/</kbd>\n' +
        '</div>',
      demo: () =>
        block(
          'Campo',
          '<div class="k-search" style="max-width:440px">' + icon('search') +
            '<input class="k-input" type="search" placeholder="Buscar componentes, ícones, tokens" aria-label="Buscar">' +
            '<button class="k-search__clear" type="button" aria-label="Limpar">' + icon('close', 'k-icon--sm') + '</button>' +
            '<kbd class="k-kbd k-search__kbd">/</kbd></div>'
        ) +
        block(
          'Campo grande e sugestões',
          '<div style="max-width:440px"><div class="k-search k-search--lg">' + icon('search') +
            '<input class="k-input" value="botão" aria-label="Buscar"><button class="k-search__clear" type="button" aria-label="Limpar">' + icon('close', 'k-icon--sm') + '</button></div>' +
            '<div class="k-search__pop k-search__pop--inline">' +
            '<button class="k-search__item is-active" type="button">' + icon('component', 'k-icon--sm') + 'Botões<small>componente</small></button>' +
            '<button class="k-search__item" type="button">' + icon('text', 'k-icon--sm') + 'Botão de texto<small>diretriz</small></button>' +
            '<button class="k-search__item" type="button">' + icon('pattern-stamp', 'k-icon--sm') + 'Textura de botão<small>estilo</small></button>' +
            '</div></div>'
        ),
    },
    {
      id: 'footer',
      group: 'Navegação',
      title: 'Rodapé',
      desc: 'Área inferior com marca, colunas de links, informações legais e redes.',
      code:
        '<footer class="k-footer">\n' +
        '  <div class="k-footer__top">\n' +
        '    <div class="k-footer__brand">…</div>\n' +
        '    <div class="k-footer__cols">…</div>\n' +
        '  </div>\n' +
        '  <div class="k-footer__bottom">…</div>\n' +
        '</footer>',
      demo: () =>
        '<div class="k-footer"><div class="k-footer__top">' +
        '<div class="k-footer__brand"><div class="k-row k-row--tight"><span class="k-avatar k-avatar--sm k-avatar--solid">K</span><span class="k-strong">Kit UI</span></div>' +
        '<p class="k-small k-muted">Componentes funcionais, oito estilos e tokens exportáveis para começar interfaces mais rápido.</p></div>' +
        '<div class="k-footer__cols">' +
        '<div class="k-footer__col"><div class="k-footer__title">Produto</div><a class="k-footer__link" href="#">Componentes</a><a class="k-footer__link" href="#">Padrões</a><a class="k-footer__link" href="#">Ícones</a></div>' +
        '<div class="k-footer__col"><div class="k-footer__title">Recursos</div><a class="k-footer__link" href="#">Tokens</a><a class="k-footer__link" href="#">Exportar</a><a class="k-footer__link" href="#">Changelog</a></div>' +
        '<div class="k-footer__col"><div class="k-footer__title">Empresa</div><a class="k-footer__link" href="#">Sobre</a><a class="k-footer__link" href="#">Contato</a><a class="k-footer__link" href="#">Privacidade</a></div>' +
        '</div></div>' +
        '<div class="k-footer__bottom"><span>© 2026 Kit UI. Feito com tokens.</span><div class="k-footer__social">' +
        '<button class="k-btn k-btn--icon k-btn--ghost k-btn--sm" type="button" aria-label="E-mail">' + icon('mailings') + '</button>' +
        '<button class="k-btn k-btn--icon k-btn--ghost k-btn--sm" type="button" aria-label="Compartilhar">' + icon('share') + '</button>' +
        '<button class="k-btn k-btn--icon k-btn--ghost k-btn--sm" type="button" aria-label="Link">' + icon('insert-link') + '</button>' +
        '</div></div></div>',
    },
    {
      id: 'carousel',
      group: 'Navegação',
      title: 'Carrossel',
      desc: 'Sequência horizontal de cartões com navegação anterior/próxima e indicadores.',
      code:
        '<div class="k-carousel">\n' +
        '  <div class="k-carousel__track">\n' +
        '    <article class="k-carousel__slide is-current">…</article>\n' +
        '  </div>\n' +
        '  <button class="k-carousel__nav k-carousel__nav--prev">‹</button>\n' +
        '  <button class="k-carousel__nav k-carousel__nav--next">›</button>\n' +
        '  <div class="k-carousel__dots">…</div>\n' +
        '</div>',
      demo: () =>
        '<div class="k-carousel">' +
        '<div class="k-carousel__track">' +
        '<article class="k-carousel__slide is-current"><div class="k-carousel__media">' + icon('pattern-stamp', 'k-icon--xl') + '</div><div class="k-carousel__body"><div class="k-carousel__title">Texturas do palco</div><div class="k-carousel__meta">Onze presets prontos para o fundo.</div></div></article>' +
        '<article class="k-carousel__slide"><div class="k-carousel__media">' + icon('component', 'k-icon--xl') + '</div><div class="k-carousel__body"><div class="k-carousel__title">Componentes</div><div class="k-carousel__meta">34 peças com estados e código.</div></div></article>' +
        '</div>' +
        '<button class="k-carousel__nav k-carousel__nav--prev" type="button" aria-label="Anterior">' + icon('previous', 'k-icon--sm') + '</button>' +
        '<button class="k-carousel__nav k-carousel__nav--next" type="button" aria-label="Próximo">' + icon('next', 'k-icon--sm') + '</button>' +
        '<div class="k-carousel__dots"><button class="k-carousel__dot is-active" type="button" aria-label="Slide 1"></button><button class="k-carousel__dot" type="button" aria-label="Slide 2"></button><button class="k-carousel__dot" type="button" aria-label="Slide 3"></button></div>' +
        '</div>',
    },
    {
      id: 'drawer',
      group: 'Navegação',
      title: 'Gaveta',
      desc: 'Painel lateral sobreposto ao conteúdo, com véu, formulário curto e ações fixas.',
      code:
        '<div class="k-drawer">\n' +
        '  <div class="k-drawer__scrim"></div>\n' +
        '  <aside class="k-drawer__panel">\n' +
        '    <div class="k-drawer__head">…</div>\n' +
        '    <div class="k-drawer__body">…</div>\n' +
        '    <div class="k-drawer__foot">…</div>\n' +
        '  </aside>\n' +
        '</div>',
      demo: () =>
        '<div class="k-drawer"><div class="k-drawer__scrim"></div>' +
        '<aside class="k-drawer__panel"><div class="k-drawer__head"><div><div class="k-drawer__title">Filtros</div><div class="k-drawer__sub">Refine a listagem de componentes.</div></div>' +
        '<button class="k-file__x" type="button" aria-label="Fechar">' + icon('close', 'k-icon--sm') + '</button></div>' +
        '<div class="k-drawer__body">' +
        '<label class="k-field"><span class="k-field__label">Categoria</span><select class="k-select"><option>Formulários</option><option>Navegação</option><option>Feedback</option></select></label>' +
        '<label class="k-field"><span class="k-field__label">Buscar</span><span class="k-input-icon">' + icon('search') + '<input class="k-input" placeholder="Nome do componente"></span></label>' +
        '<label class="k-switch"><input type="checkbox" checked><span class="k-switch__track"></span>Somente com código</label>' +
        '<label class="k-switch"><input type="checkbox"><span class="k-switch__track"></span>Mostrar experimentais</label>' +
        '</div>' +
        '<div class="k-drawer__foot"><button class="k-btn k-btn--ghost k-btn--sm" type="button">Limpar</button><button class="k-btn k-btn--primary k-btn--sm" type="button">Aplicar</button></div>' +
        '</aside></div>',
    },
    {
      id: 'appbar',
      group: 'Navegação',
      title: 'Barra superior',
      desc: 'Marca, navegação, busca e conta em uma linha.',
      code:
        '<header class="k-appbar">\n' +
        '  <div class="k-appbar__brand">…</div>\n' +
        '  <nav class="k-appbar__nav">…</nav>\n' +
        '</header>',
      demo: () =>
        '<div class="k-appbar"><div class="k-appbar__brand"><span class="k-avatar k-avatar--sm k-avatar--solid">K</span>Kit UI</div>' +
        '<nav class="k-appbar__nav"><a class="k-appbar__link is-active" href="#">Componentes</a><a class="k-appbar__link" href="#">Padrões</a><a class="k-appbar__link" href="#">Ícones</a></nav>' +
        '<div class="k-grow"></div>' +
        '<span class="k-input-icon" style="width:190px">' + icon('search') + '<input class="k-input" placeholder="Buscar"></span>' +
        '<button class="k-btn k-btn--icon k-btn--ghost" type="button" aria-label="Notificações">' + icon('notifications') + '</button>' +
        '<span class="k-avatar k-avatar--sm">FS</span></div>' +
        '<div style="margin-top:16px" class="k-appbar"><div class="k-appbar__brand">Relatório</div><div class="k-grow"></div><div class="k-crumbs"><ol><li><a href="#">Dashboards</a></li><li aria-current="page">Semana 34</li></ol></div><button class="k-btn k-btn--sm" type="button">' + icon('download') + 'Exportar</button></div>',
    },
    {
      id: 'floatbar',
      group: 'Navegação',
      title: 'Barra flutuante',
      desc: 'Barra ancorada com menu em painel suspenso. Dentro de uma área rolável, ela usa sticky e o painel acompanha o topo enquanto o conteúdo passa.',
      code:
        '<div class="k-floatbar-demo">\n' +
        '  <nav class="k-floatbar">\n' +
        '    <div class="k-floatbar__bar">\n' +
        '      <a class="k-floatbar__brand" href="#">…</a>\n' +
        '      <div class="k-floatbar__links">\n' +
        '        <a class="k-floatbar__link is-active" href="#">Início</a>\n' +
        '        <details class="k-floatbar__menu">\n' +
        '          <summary class="k-floatbar__link">Explorar</summary>\n' +
        '          <div class="k-floatbar__panel">…</div>\n' +
        '        </details>\n' +
        '      </div>\n' +
        '      <div class="k-floatbar__actions">…</div>\n' +
        '    </div>\n' +
        '  </nav>\n' +
        '  <div class="k-floatbar-demo__body">…</div>\n' +
        '</div>',
      demo: () => {
        const item = (ic, label) =>
          '<a class="k-floatbar__item" href="#">' + icon(ic, 'k-icon--sm') + label + '</a>';
        const tile = (name, by, a, b) =>
          '<a class="k-card k-card--flat" href="#" style="padding:8px;text-decoration:none;color:inherit">' +
          '<span style="display:block;height:72px;border:var(--k-bw) solid var(--k-border);border-radius:var(--k-radius-sm);background:linear-gradient(135deg,' + a + ',' + b + ')"></span>' +
          '<span class="k-small k-strong" style="display:block;margin-top:6px">' + name + '</span>' +
          '<span class="k-small k-muted" style="display:block;font-size:11px">' + by + '</span>' +
          '</a>';
        const grid = (items) =>
          '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:8px">' + items + '</div>';
        const panel =
          '<div class="k-floatbar__panel">' +
          '<div class="k-floatbar__promos">' +
          '<a class="k-floatbar__promo" href="#"><span class="k-floatbar__eyebrow"><b>Novo</b> no catálogo</span><strong>Galeria de padrões</strong><small>Telas completas prontas para o seu produto.</small></a>' +
          '<a class="k-floatbar__promo" href="#"><span class="k-floatbar__eyebrow">Em destaque</span><strong>Estúdio de tokens</strong><small>Cores, forma e densidade no mesmo lugar.</small></a>' +
          '</div>' +
          '<div class="k-floatbar__grid">' +
          '<div class="k-floatbar__col"><div class="k-floatbar__label">Explorar</div>' +
          item('component', 'Componentes') + item('grid', 'Padrões') + item('color', 'Estilos') + item('symbol', 'Ícones') + '</div>' +
          '<div class="k-floatbar__col"><div class="k-floatbar__label">Recursos</div>' +
          item('text', 'Docs') + item('download', 'Exportar') + item('input-tools', 'Atalhos') + item('settings', 'Ajustes') + '</div>' +
          '<div class="k-floatbar__col"><div class="k-floatbar__label">Comunidade</div>' +
          item('send-feedback', 'Feedback') + item('help', 'Suporte') + item('pages', 'Blog') + item('apps-grid', 'App') + '</div>' +
          '</div>' +
          '<div class="k-floatbar__foot"><span>Explorar o catálogo completo</span><span class="k-kbd">⌘K</span></div>' +
          '</div>';
        const nav =
          '<nav class="k-floatbar"><div class="k-floatbar__bar">' +
          '<a class="k-floatbar__brand" href="#"><span class="k-floatbar__mark">A</span>Atlas</a>' +
          '<div class="k-floatbar__links">' +
          '<a class="k-floatbar__link is-active" href="#">Início</a>' +
          '<a class="k-floatbar__link k-floatbar__link--optional" href="#">Projetos</a>' +
          '<details class="k-floatbar__menu" open><summary class="k-floatbar__link">Explorar</summary>' + panel + '</details>' +
          '<a class="k-floatbar__link k-floatbar__link--optional" href="#">Preços</a>' +
          '</div>' +
          '<div class="k-floatbar__actions">' +
          '<button class="k-btn k-btn--ghost k-btn--sm k-btn--icon" type="button" aria-label="Buscar">' + icon('search', 'k-icon--sm') + '</button>' +
          '<button class="k-btn k-btn--primary k-btn--sm" type="button">Entrar</button>' +
          '</div></div></nav>';
        const body =
          '<div class="k-floatbar-demo__body">' +
          '<div style="padding:16px 4px 10px"><div class="k-floatbar__eyebrow">Catálogo</div>' +
          '<h3 class="k-h2" style="margin-top:4px">Skins em alta</h3>' +
          '<p class="k-small k-muted" style="margin-top:4px;max-width:48ch">Role o quadro: a barra e o menu continuam suspensos no topo.</p></div>' +
          grid(
            tile('Golden Crown', 'por Laby', 'color-mix(in srgb, var(--k-primary) 38%, var(--k-surface-2))', 'color-mix(in srgb, var(--k-accent) 42%, var(--k-surface))') +
            tile('Ocean Drift', 'por Marina', 'color-mix(in srgb, var(--k-accent) 40%, var(--k-surface-2))', 'color-mix(in srgb, var(--k-primary) 32%, var(--k-surface))') +
            tile('Mint Lab', 'por Theo', 'color-mix(in srgb, var(--k-success) 38%, var(--k-surface-2))', 'color-mix(in srgb, var(--k-primary) 28%, var(--k-surface))') +
            tile('Night Shift', 'por Ana', 'color-mix(in srgb, var(--k-text) 26%, var(--k-surface-2))', 'color-mix(in srgb, var(--k-accent) 30%, var(--k-surface))') +
            tile('Cherry Byte', 'por Rafa', 'color-mix(in srgb, var(--k-danger) 34%, var(--k-surface-2))', 'color-mix(in srgb, var(--k-accent) 30%, var(--k-surface))') +
            tile('Sunset Rig', 'por Nina', 'color-mix(in srgb, var(--k-primary) 30%, var(--k-surface-2))', 'color-mix(in srgb, var(--k-danger) 28%, var(--k-surface))')
          ) +
          '<div style="padding:18px 4px 10px"><h4 class="k-h3">Roupas em alta</h4>' +
          '<p class="k-small k-muted" style="margin-top:2px">O que os jogadores estão vestindo nesta semana.</p></div>' +
          grid(
            tile('Hoodie Grafite', 'por Laby', 'color-mix(in srgb, var(--k-text) 22%, var(--k-surface-2))', 'color-mix(in srgb, var(--k-surface-2) 80%, var(--k-bg))') +
            tile('Jaqueta Lima', 'por Bia', 'color-mix(in srgb, var(--k-accent) 36%, var(--k-surface-2))', 'color-mix(in srgb, var(--k-success) 30%, var(--k-surface))') +
            tile('Boné Coral', 'por Caio', 'color-mix(in srgb, var(--k-danger) 30%, var(--k-surface-2))', 'color-mix(in srgb, var(--k-primary) 30%, var(--k-surface))') +
            tile('Mochila Azul', 'por Dudu', 'color-mix(in srgb, var(--k-primary) 34%, var(--k-surface-2))', 'color-mix(in srgb, var(--k-accent) 26%, var(--k-surface))')
          ) +
          '</div>';
        return block('Role o quadro — a barra e o menu ficam fixos', '<div class="k-floatbar-demo">' + nav + body + '</div>');
      },
    },
    {
      id: 'sidebar',
      group: 'Navegação',
      title: 'Menu lateral',
      desc: 'Variantes de navegação lateral: filete discreto, rail fixo, abertura por botão externo, rail expansível e fixo expandido. Demonstração em mini páginas.',
      code:
        '<aside class="k-sidebar k-sidebar--rail">\n' +
        '  <a class="k-sidebar__item is-active" href="#" aria-label="Início">' + icon('home') + '</a>\n' +
        '  <a class="k-sidebar__item" href="#" aria-label="Arquivos">' + icon('folder') + '</a>\n' +
        '  <a class="k-sidebar__item" href="#" aria-label="Ajustes">' + icon('settings') + '</a>\n' +
        '</aside>\n\n' +
        '<button class="k-btn k-btn--icon k-btn--secondary" type="button" data-sb-toggle="sb-demo">' + icon('menu') + '</button>\n' +
        '<aside class="k-sidebar k-sidebar--panel" id="sb-demo">…</aside>',
      demo: () => {
        const sbItem = (ic, label, badge) =>
          '<a class="k-sidebar__item" href="#" aria-label="' + label + '">' +
          icon(ic) + '<span class="k-sidebar__item__label">' + label + '</span>' +
          (badge ? '<span class="k-badge">' + badge + '</span>' : '') + '</a>';
        const items = () =>
          sbItem('home', 'Início') +
          sbItem('chart', 'Métricas') +
          sbItem('folder', 'Projetos', '7') +
          sbItem('comment', 'Comentários') +
          sbItem('settings', 'Ajustes');
        const mini = (label, note, inner, demoCls = '', contentCls = '') =>
          block(label,
            '<div class="k-sb-demo' + (demoCls ? ' ' + demoCls : '') + '">' + inner +
            '<div class="k-sb-demo__content' + (contentCls ? ' ' + contentCls : '') + '"><div class="k-sb-demo__text">' + note + '</div></div></div>'
          );

        const fillet =
          '<div class="k-sb-fillet" data-sb-fillet>' +
            '<aside class="k-sidebar k-sidebar--rail k-sidebar--fillet" aria-label="Menu lateral filete">' +
              items() +
            '</aside>' +
          '</div>';

        const railFixed =
          '<aside class="k-sidebar k-sidebar--rail" aria-label="Menu lateral compacto">' + items() + '</aside>';

        const external =
          '<button class="k-btn k-btn--icon k-btn--secondary k-sb-trigger" type="button" data-sb-open="sb-ext" aria-label="Abrir menu">' + icon('menu') + '</button>' +
          '<div class="k-sb-overlay" data-sb-overlay="sb-ext">' +
            '<div class="k-sb-overlay__scrim" data-sb-close="sb-ext"></div>' +
            '<aside class="k-sidebar k-sidebar--panel" id="sb-ext" aria-label="Menu lateral completo">' +
              '<div class="k-sidebar__head"><span class="k-sidebar__head__title">Menu</span>' +
              '<button class="k-btn k-btn--icon k-btn--ghost k-btn--sm" type="button" data-sb-close="sb-ext" aria-label="Fechar menu">' + icon('close') + '</button></div>' +
              items() +
            '</aside>' +
          '</div>';

        const railExpand =
          '<aside class="k-sidebar k-sidebar--rail k-sidebar--expand" aria-label="Menu lateral expansível">' + items() + '</aside>';

        const fixedExpanded =
          '<aside class="k-sidebar k-sidebar--push" aria-label="Menu lateral expandido">' + items() + '</aside>';

        const collapseGroup = (id, label, open) =>
          '<div class="k-sb-group' + (open ? ' is-open' : '') + '">' +
            '<button class="k-sb-group__head" type="button" data-sb-collapse="' + id + '" aria-expanded="' + (open ? 'true' : 'false') + '">' +
              '<span>' + label + '</span>' + icon('chevron-down', 'k-sb-group__chev') +
            '</button>' +
            '<div class="k-sb-group__body" id="' + id + '"' + (open ? '' : ' hidden') + '>' +
              sbItem('home', 'Início') + sbItem('folder', 'Projetos', '7') + sbItem('comment', 'Comentários') +
            '</div>' +
          '</div>';
        const collapsible =
          '<aside class="k-sidebar" aria-label="Menu com grupos recolhíveis">' +
            collapseGroup('sb-g1', 'Geral', true) +
            collapseGroup('sb-g2', 'Sistema', false) +
          '</aside>';

        const withFooter =
          '<aside class="k-sidebar k-sidebar--full" aria-label="Menu com cabeçalho e rodapé">' +
            '<div class="k-sidebar__profile"><span class="k-sb-avatar">K</span><div><div class="k-sidebar__profile__name">KitUI</div><div class="k-sidebar__profile__meta">Painel</div></div></div>' +
            '<div class="k-sidebar__label">Navegação</div>' + items() +
            '<div class="k-sidebar__footer">' + sbItem('settings', 'Configurações') + sbItem('help', 'Sair') + '</div>' +
          '</aside>';

        const railTipItem = (ic, label) =>
          '<div class="k-tip k-tip--right k-sb-tip">' +
            '<a class="k-sidebar__item" href="#" aria-label="' + label + '">' + icon(ic) + '</a>' +
            '<span class="k-tip__bubble" role="tooltip">' + label + '</span>' +
          '</div>';
        const railTooltip =
          '<aside class="k-sidebar k-sidebar--rail" aria-label="Menu rail com tooltip">' +
            railTipItem('home', 'Início') + railTipItem('chart', 'Métricas') + railTipItem('folder', 'Projetos') + railTipItem('comment', 'Comentários') + railTipItem('settings', 'Ajustes') +
          '</aside>';

        const rightDrawer =
          '<button class="k-btn k-btn--icon k-btn--secondary k-sb-trigger k-sb-trigger--right" type="button" data-sb-open="sb-right" aria-label="Abrir menu direito">' + icon('menu') + '</button>' +
          '<div class="k-sb-overlay k-sb-overlay--right" data-sb-overlay="sb-right">' +
            '<div class="k-sb-overlay__scrim" data-sb-close="sb-right"></div>' +
            '<aside class="k-sidebar k-sidebar--panel k-sidebar--panel-right" id="sb-right" aria-label="Menu lateral direito">' +
              '<div class="k-sidebar__head"><span class="k-sidebar__head__title">Menu</span>' +
              '<button class="k-btn k-btn--icon k-btn--ghost k-btn--sm" type="button" data-sb-close="sb-right" aria-label="Fechar menu">' + icon('close') + '</button></div>' +
              items() +
            '</aside>' +
          '</div>';

        const flyout =
          '<aside class="k-sidebar" aria-label="Menu com submenu">' +
            sbItem('home', 'Início') +
            '<div class="k-sb-flyout">' +
              '<a class="k-sidebar__item" href="#" aria-label="Projetos">' + icon('folder') + '<span class="k-sidebar__item__label">Projetos</span>' + icon('chevron-right', 'k-sb-flyout__caret') + '</a>' +
              '<div class="k-sb-flyout__menu"><a class="k-sidebar__item" href="#">Ativos</a><a class="k-sidebar__item" href="#">Arquivados</a><a class="k-sidebar__item" href="#">Novo projeto</a></div>' +
            '</div>' +
            sbItem('chart', 'Métricas') + sbItem('settings', 'Ajustes') +
          '</aside>';

        return (
          mini('1. Filete discreto',
            '<p><strong>Mouse:</strong> aparece ao posicionar o ponteiro na zona; desaparece 2 s após se distanciar, ou imediatamente ao clicar fora.</p>' +
            '<p><strong>Touch:</strong> aparece ao arrastar para fora da área oculta; só desaparece ao tocar fora ou ao arrastar de volta para a área oculta. Sem essas interações, não retorna sozinho.</p>',
            fillet, '', 'k-sb-demo__content--fillet') +
          mini('2. Rail fixo', '<p>Menu já visível, compacto, apenas ícones. Fica sobreposto ao conteúdo.</p>', railFixed) +
          mini('3. Botão externo', '<p>O botão no canto superior esquerdo abre o menu completo e cobre o conteúdo.</p>', external, '', 'k-sb-demo__content--inset') +
          mini('4. Rail expansível', '<p>Compacto por padrão; expande ao passar o mouse ou receber foco, mostrando rótulos.</p>', railExpand) +
          mini('5. Fixo expandido', '<p>Menu já aberto com ícones e rótulos. É o único que empurra o conteúdo, sem sobrepor a página.</p>', fixedExpanded, 'k-sb-demo--push') +
          mini('6. Grupos recolhíveis', '<p>Seções com cabeçalho clicável para expandir/recolher itens.</p>', collapsible) +
          mini('7. Cabeçalho e rodapé', '<p>Menu com perfil no topo, navegação e ações fixadas no rodapé.</p>', withFooter) +
          mini('8. Rail com tooltip', '<p>Ícones compactos; ao passar o mouse ou focar, o rótulo aparece como tooltip à direita.</p>', railTooltip) +
          mini('9. Gaveta direita', '<p>Botão externo abre o menu pelo lado direito, cobrindo o conteúdo.</p>', rightDrawer, '', 'k-sb-demo__content--inset-right') +
          mini('10. Submenu flyout', '<p>Item com submenu lateral ao passar o mouse ou focar.</p>', flyout, 'k-sb-demo--overflow')
        );
      },
    },
    /* ---------------- Feedback ---------------- */
    {
      id: 'alert',
      group: 'Feedback',
      title: 'Alertas',
      desc: 'Quatro tons com ícone, título e texto. Sem fechar automaticamente.',
      code:
        '<div class="k-alert k-alert--info">\n' +
        '  <span class="k-alert__icon">…</span>\n' +
        '  <div class="k-alert__body">\n' +
        '    <div class="k-alert__title">Título</div>\n' +
        '    <div class="k-alert__text">Mensagem.</div>\n' +
        '  </div>\n' +
        '</div>',
      demo: () =>
        '<div class="k-stack">' +
        alert('info', 'help', 'Novo tema disponível', 'O estilo Claymorfismo foi adicionado ao catálogo.') +
        alert('success', 'check', 'Publicado com sucesso', 'A versão 3 do kit está disponível para o time.') +
        alert('danger', 'report', 'Falha ao exportar', 'O pacote passou de 8 MB. Reduza os ícones incluídos.') +
        '<div class="k-alert"><span class="k-alert__icon">' + icon('notifications') + '</span><div class="k-alert__body"><div class="k-alert__title">Sem estilo de tom</div><div class="k-alert__text">Usa apenas superfície e borda do tema.</div></div><button class="k-btn k-btn--ghost k-btn--sm" type="button">Dispensar</button></div>' +
        '</div>',
    },
    {
      id: 'toast',
      group: 'Feedback',
      title: 'Notificação rápida',
      desc: 'Confirmação discreta sobre o conteúdo, com ação de desfazer.',
      code:
        '<div class="k-toast">\n' +
        '  <span>Alterações salvas</span>\n' +
        '  <button class="k-toast__x">×</button>\n' +
        '</div>',
      demo: () =>
        '<div class="k-stack">' +
        '<div class="k-toast">' + icon('select-checkbox', 'k-icon--sm') + '<span class="k-grow">Tema aplicado a 12 componentes.</span><button class="k-btn k-btn--sm k-btn--ghost" type="button" style="color:inherit">Desfazer</button><button class="k-toast__x" type="button" aria-label="Fechar">' + icon('close', 'k-icon--sm') + '</button></div>' +
        '<div class="k-toast" style="background:var(--k-surface);color:var(--k-text);border:var(--k-bw) solid var(--k-border)">' + icon('notifications', 'k-icon--sm') + '<span class="k-grow">Nova versão dos ícones disponível.</span><button class="k-toast__x" type="button" aria-label="Fechar">' + icon('close', 'k-icon--sm') + '</button></div>' +
        '</div>' +
        '<div class="spec-note">Posicione no canto inferior direito com <code>position: fixed</code>.</div>',
    },
    {
      id: 'modal',
      group: 'Feedback',
      title: 'Modal',
      desc: 'Diálogo centrado com véu, cabeçalho, texto e ações.',
      code:
        '<div class="k-modal-backdrop">\n' +
        '  <div class="k-modal" role="dialog" aria-modal="true">\n' +
        '    <div class="k-modal__head">\n' +
        '      <h2 class="k-modal__title">Título</h2>\n' +
        '      <button class="k-btn k-btn--icon k-btn--ghost">×</button>\n' +
        '    </div>\n' +
        '    <div class="k-modal__foot">…</div>\n' +
        '  </div>\n' +
        '</div>',
      demo: () =>
        '<div class="k-modal-backdrop"><div class="k-modal" role="dialog" aria-modal="true" aria-labelledby="m1">' +
        '<div class="k-modal__head"><div><h2 class="k-modal__title" id="m1">Excluir componente?</h2><p class="k-modal__meta k-small k-muted">Esta ação não pode ser desfeita.</p></div><button class="k-btn k-btn--icon k-btn--ghost k-btn--sm" type="button" aria-label="Fechar">' + icon('close') + '</button></div>' +
        '<p class="k-modal__text">“Botões” será removido do catálogo e das exportações futuras.</p>' +
        '<div class="k-modal__foot"><button class="k-btn k-btn--ghost" type="button">Cancelar</button><button class="k-btn k-btn--danger" type="button">Excluir</button></div>' +
        '</div></div>',
    },
    {
      id: 'typography',
      group: 'Tipografia',
      title: 'Tipografia',
      desc: 'A fonte aplicada em negrito e nos tamanhos 1, 2 e 3. O tamanho 1 é o menor visível definido na aba Fontes; o 2 é mínimo × 1,09 e o 3 é mínimo × 1,30 — a mesma sequência dos botões compacto, mediano e grande.',
      code:
        '<p class="k-type k-type--bold">Decisões consistentes em negrito.</p>\n' +
        '<p class="k-type k-type--1">Tamanho 1 · menor visível.</p>\n' +
        '<p class="k-type k-type--2">Tamanho 2 · texto do corpo.</p>\n' +
        '<p class="k-type k-type--3">Tamanho 3 · destaque.</p>',
      demo: () =>
        block('Negrito', '<p class="k-type k-type--bold">Interfaces prontas para uso.</p>') +
        block('Tamanho 1 · menor visível', '<p class="k-type k-type--1">O mesmo tamanho da amostra na aba Fontes.</p>') +
        block('Tamanho 2 · ×1,09', '<p class="k-type k-type--2">Texto padrão do corpo da interface.</p>') +
        block('Tamanho 3 · ×1,30', '<p class="k-type k-type--3">Título de destaque.</p>'),
    },
  ];

  /* helpers que precisam de strings com interpolação tardia */
  function btnX() {
    return '<button class="k-tag__x" type="button" aria-label="Remover">' + icon('close', 'k-icon--sm') + '</button>';
  }
  function statCard(label, value, delta, bars, down) {
    return (
      '<div class="k-card k-card--flat"><div class="k-stat"><span class="k-stat__label">' + label + '</span><span class="k-stat__value">' + value + '</span>' +
      '<span class="k-stat__delta' + (down ? ' k-stat__delta--down' : '') + '">' + (down ? '▼' : '▲') + ' ' + delta + '</span>' +
      '<div class="k-spark">' + bars.map((h, i) => '<i class="' + (i > bars.length - 3 ? 'on' : '') + '" style="height:' + h + '%"></i>').join('') + '</div></div></div>'
    );
  }
  function row(name, initials, status, tone, tokens, when) {
    const badge = tone === 'ok' ? 'k-badge--success' : tone === 'warn' ? 'k-badge--primary' : 'k-badge--outline';
    return (
      '<tr><td><div class="k-row k-row--tight"><span class="k-avatar k-avatar--sm">' + initials + '</span><span class="k-strong">' + name + '</span></div></td>' +
      '<td class="k-small k-muted">' + initials + '</td>' +
      '<td><span class="k-badge ' + badge + '">' + status + '</span></td>' +
      '<td class="k-num">' + tokens + '</td><td class="k-num k-small k-muted">' + when + '</td></tr>'
    );
  }
  function listItem(initials, title, meta, when, tone) {
    return (
      '<li class="k-list__item"><span class="k-avatar k-avatar--sm">' + initials + '</span>' +
      '<div class="k-list__main"><div class="k-list__title">' + title + '</div><div class="k-list__meta">' + meta + '</div></div>' +
      '<span class="k-badge ' + (tone === 'ok' ? 'k-badge--success' : tone === 'warn' ? 'k-badge--primary' : 'k-badge--outline') + '">' + (tone === 'ok' ? 'Concluído' : tone === 'warn' ? 'Em revisão' : 'Pendente') + '</span>' +
      '<span class="k-small k-muted k-mono">' + when + '</span></li>'
    );
  }
  function alert(tone, ic, title, text) {
    return (
      '<div class="k-alert k-alert--' + tone + '"><span class="k-alert__icon">' + icon(ic) + '</span>' +
      '<div class="k-alert__body"><div class="k-alert__title">' + title + '</div><div class="k-alert__text">' + text + '</div></div>' +
      '<button class="k-btn k-btn--ghost k-btn--sm k-btn--icon" type="button" aria-label="Fechar">' + icon('close', 'k-icon--sm') + '</button></div>'
    );
  }
  function chart() {
    return (
      '<svg class="k-chart" viewBox="0 0 340 120" role="img" aria-label="Gráfico de linha">' +
      '<defs></defs>' +
      '<g>' + [20, 50, 80, 110].map((y) => '<line class="k-chart__grid" x1="0" y1="' + y + '" x2="340" y2="' + y + '" />').join('') + '</g>' +
      '<path class="k-chart__area" d="M0,92 C30,88 45,70 70,72 C95,74 110,48 140,52 C170,56 185,34 215,40 C245,46 258,22 288,26 C312,29 326,18 340,16 L340,120 L0,120 Z" />' +
      '<path class="k-chart__line" d="M0,92 C30,88 45,70 70,72 C95,74 110,48 140,52 C170,56 185,34 215,40 C245,46 258,22 288,26 C312,29 326,18 340,16" />' +
      '<path class="k-chart__line k-chart__line--alt" d="M0,104 C34,100 56,94 78,96 C104,98 120,82 148,86 C176,90 196,72 222,76 C250,80 268,62 296,66 C318,69 330,60 340,58" stroke-dasharray="4 5" />' +
      '<circle class="k-chart__dot" cx="288" cy="26" r="4.5" />' +
      '<g class="k-chart__axis"><text x="0" y="118">jan</text><text x="80" y="118">fev</text><text x="160" y="118">mar</text><text x="240" y="118">abr</text><text x="315" y="118">mai</text></g>' +
      '</svg>'
    );
  }

  window.KIT_COMPONENTS = {
    components,
    groups: ['Ações', 'Formulários', 'Exibição', 'Navegação', 'Feedback', 'Tipografia'],
    all: components,
    icon,
    esc,
    block,
    statCard,
    row,
    alert,
    chart,
  };
})();
