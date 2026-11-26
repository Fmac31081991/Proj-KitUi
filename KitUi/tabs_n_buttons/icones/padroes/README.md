# `icones/padroes` — acervo da aba Ícones

## O que fica aqui

473 arquivos `.svg` individuais, um por ícone, em 18 categorias. Seguem grade 24 × 24, traço 2 e `currentColor`.

| Arquivo | Papel |
| :--- | :--- |
| `<id>.svg` | Um arquivo por ícone: menu, search, home, settings e todos os demais. |

## Como é usado

Este acervo vem com o Kit UI e é **somente leitura**. A aplicação carrega estes arquivos pelo `index.html` e eles alimentam `window.KIT_ICONS`, por meio do catálogo gerado `../icons-data.js`.

Os SVGs daqui são a fonte do `icons-data.js`. O gerador manual `build-icons.mjs` fica fora da aplicação, na raiz de `Proj KitUi`.

Para acrescentar um item, adicione o arquivo aqui e cadastre-o no catálogo da aba. Para conteúdo trazido pelo usuário, use `../importados/`.
