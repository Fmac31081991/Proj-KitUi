/* emojis.js — adapta o catálogo gerado (bibliotecas.js) ao formato usado pelo núcleo.
   Os 136 emojis Unicode foram removidos: cada item agora é um arquivo SVG de uma
   das 9 bibliotecas, com o Unicode correspondente vindo de unicode-map.json. */
(function () {
  'use strict';

  var L = window.KIT_EMOJI_LIBS || { padrao: 'fluent-emoji', categorias: [], ordem: [], bibliotecas: {} };
  var cats = (L.categorias || []).slice();
  var padrao = L.padrao || 'fluent-emoji';
  var libs = L.bibliotecas || {};

  function rotulo(nome) {
    return String(nome || '')
      .split('-')
      .filter(Boolean)
      .map(function (p) { return p.charAt(0).toUpperCase() + p.slice(1); })
      .join(' ');
  }

  function charsDe(hex) {
    try {
      return String(hex || '').split('-').map(function (c) {
        return String.fromCodePoint(parseInt(c, 16));
      }).join('');
    } catch (e) {
      return '';
    }
  }

  function itemsFor(id) {
    var b = libs[id];
    if (!b) return [];
    return (b.itens || []).map(function (row) {
      var hex = row[1] || '';
      return {
        e: row[0],
        name: rotulo(row[0]),
        cat: cats[row[2]] || cats[0] || '',
        keys: row[0] + ' ' + hex + ' ' + charsDe(hex),
        hex: hex,
        unicode: charsDe(hex),
        lib: id
      };
    });
  }

  window.KIT_EMOJIS = {
    categories: cats,
    ordem: (L.ordem || []).slice(),
    padrao: padrao,
    bibliotecas: libs,
    items: itemsFor(padrao),
    itemsFor: itemsFor,
    meta: { count: (libs[padrao] || {}).total || 0 }
  };
})();
