# `tokens/padroes` — acervo da aba Tokens

## O que fica aqui

Pasta reservada ao acervo de tokens. Hoje os tokens base vivem em `tabs_n_buttons/estilos/tokens.js`.

| Arquivo | Papel |
| :--- | :--- |
| `(vazia)` | A pasta existe para seguir o mesmo padrão das outras abas. |

## Como é usado

Este acervo vem com o Kit UI e é **somente leitura**. A aplicação carrega estes arquivos pelo `index.html` e eles alimentam `window.KIT_CORE` — `resolvedTokens()` combina o estilo base com os ajustes feitos em Propriedades.

A aba Tokens é somente leitura e mostra o resultado já resolto das variáveis.

Para acrescentar um item, adicione o arquivo aqui e cadastre-o no catálogo da aba. Para conteúdo trazido pelo usuário, use `../importados/`.
