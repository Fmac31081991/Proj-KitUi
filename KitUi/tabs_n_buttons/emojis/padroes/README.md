# `emojis/padroes` — adaptador do acervo da aba Emojis

## O que fica aqui

| Arquivo | Papel |
| :--- | :--- |
| `emojis.js` | Converte `window.KIT_EMOJI_LIBS` (gerado em `../bibliotecas.js`) em `window.KIT_EMOJIS`, no formato consumido por `window.KIT_CORE.E`. |

Os 136 emojis Unicode anteriores foram removidos. Cada item agora representa um arquivo SVG local e traz:

```js
{ e: 'grinning-face', name: 'Grinning Face', cat: 'Rostos e Emoções',
  keys: '...', hex: '1F600', unicode: '😀', lib: 'fluent-emoji' }
```

`cat` vem do índice da categoria no catálogo e `hex`/`unicode` vêm do `unicode-map.json` da respectiva biblioteca. Há também `E.itemsFor(id)`, usado para trocar a biblioteca em prévia e para montar o ZIP com a biblioteca associada ao estilo.

## Como é usado

O `index.html` carrega `../bibliotecas.js` antes deste arquivo. Este acervo é **somente leitura** e não altera tokens nem o estilo. Para conteúdo trazido pelo usuário, use `../importados/`.
