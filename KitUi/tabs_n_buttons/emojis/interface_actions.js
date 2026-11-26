/* interface_actions.js — aplicação da aba Emojis.
   Registra em window.KIT_TAB_UI.emojis o painel, o canvas e o inspetor. */
(function () {
  'use strict';

  const CORE = window.KIT_CORE;
  const E = CORE.E, UI = CORE.UI;
  const state = CORE.state, els = CORE.els;
  const esc = CORE.esc, currentQuery = CORE.currentQuery;
  const matchesQuery = CORE.matchesQuery, specHead = CORE.specHead, sec = CORE.sec;

  function filteredEmojis() {
    const q = currentQuery();
    return E.items.filter((i) => {
      if (state.emojiCat !== 'all' && i.cat !== state.emojiCat) return false;
      return matchesQuery(q, [i.name, i.keys, i.cat, i.e]);
    });
  }

  function panel() {
    const q = currentQuery();
    const base = E.items.filter((i) => matchesQuery(q, [i.name, i.keys, i.cat, i.e]));
    const cats = ['all'].concat(E.categories);
    els.panel.innerHTML = cats
      .map((c) => {
        const n = c === 'all' ? base.length : base.filter((i) => i.cat === c).length;
        return (
          '<button class="pitem' + (state.emojiCat === c ? ' is-active' : '') + '" data-emojicat="' + c + '"' + (n ? '' : ' disabled') + '>' +
          '<span class="pitem__name">' + (c === 'all' ? 'Todos' : c) + '</span></button>'
        );
      })
      .join('');
  }

  function canvas() {
    const list = filteredEmojis();
    const groups = E.categories
      .map(function (cat) {
        const items = list.filter((i) => i.cat === cat);
        if (!items.length) return '';
        return (
          '<div class="emoji-group">' +
          '<div class="emoji-group__head"><span class="emoji-group__title">' + cat + '</span>' +
          '<span class="emoji-group__count">' + items.length + '</span></div>' +
          '<div class="emoji-grid">' +
          items
            .map(
              (i) =>
                '<button class="emoji-cell' + (i.e === state.emoji ? ' is-active' : '') + '" data-emoji="' +
                esc(i.e) + '" title="' + esc(i.name) + '" aria-label="' + esc(i.name) + '">' +
                '<span class="emoji-cell__glyph">' + i.e + '</span><span class="emoji-cell__name">' + esc(i.name) + '</span></button>'
            )
            .join('') +
          '</div></div>'
        );
      })
      .join('');
    els.kit.innerHTML =
      '<div class="spec">' +
      specHead('Biblioteca de emojis', E.meta.count + ' caracteres', 'Glifos nativos do sistema, organizados por categoria. Clique para inspecionar e copiar o caractere.') +
      '<div class="emoji-groups">' + (groups || '<p class="k-muted">Nenhum emoji encontrado.</p>') + '</div>' +
      '</div>';
  }

  function inspector() {
    const emoji = E.items.find((i) => i.e === state.emoji) || E.items[0];
    const siblings = E.items.filter((i) => i.cat === emoji.cat);
    return (
      sec('Emoji', '<div class="emoji-preview">' + emoji.e + '</div>' +
        '<div class="rowk"><label>caractere</label><span class="val">' + esc(emoji.e) + '</span></div>' +
        '<div class="rowk"><label>nome</label><span class="val">' + esc(emoji.name) + '</span></div>' +
        '<div class="rowk"><label>categoria</label><span class="val">' + esc(emoji.cat) + '</span></div>' +
        '<div class="rowk"><label>na categoria</label><span class="val">' + siblings.length + '</span></div>', true) +
      sec('Uso', '<div class="sec__hint">Emojis são caracteres Unicode: cole diretamente no HTML, sem imagem nem sprite. A aparência final depende da fonte de emoji do sistema.</div>' +
        '<pre class="codeblock">' + esc('<span aria-hidden="true">' + emoji.e + '</span>\n' + '<span class="sr-only">' + emoji.name + '</span>') + '</pre>' +
        '<div class="minibtns"><button class="minibtn minibtn--accent" data-act="copy-emoji">' + UI.icon('copy') + 'Copiar emoji</button>' +
        '<button class="minibtn" data-act="copy-emoji-html">' + UI.icon('component') + 'Copiar HTML</button></div>', true) +
      sec('Acessibilidade', '<div class="sec__hint">Emojis decorativos levam <span class="k-mono" style="color:#B9C4D6">aria-hidden="true"</span>. Quando carregam significado, ofereça um rótulo em texto para leitores de tela.</div>' +
        (emoji.keys ? '<div class="sec__hint">Termos de busca: ' + esc(emoji.keys) + '</div>' : ''))
    );
  }

  window.KIT_TAB_UI = window.KIT_TAB_UI || {};
  window.KIT_TAB_UI.emojis = { panel, canvas, inspector };
})();
