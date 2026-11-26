# `fontes/padroes` — acervo da aba Fontes

## O que fica aqui

Arquivos `.woff2` das 55 famílias do catálogo, nos subconjuntos `latin` e `latin-ext`. São servidos pelo próprio projeto.

| Arquivo | Papel |
| :--- | :--- |
| `fonts.css` | Declara os `@font-face` que apontam para os arquivos desta pasta. |
| `<familia>-<peso>-<estilo>-<subconjunto>.woff2` | Um arquivo por peso e subconjunto: inter-400-normal-latin.woff2, fira-code-700-normal-latin-ext.woff2 etc. |

## Como é usado

Este acervo vem com o Kit UI e é **somente leitura**. A aplicação carrega estes arquivos pelo `index.html` e eles alimentam `window.KIT_CORE.T.FONTS`, a partir do catálogo `../fonts.js`.

As 3 fontes usadas pelos botões do Kit UI ficam em `kitui_interface/fontes/`, separadas deste catálogo.

Para acrescentar um item, adicione o arquivo aqui e cadastre-o no catálogo da aba. Para conteúdo trazido pelo usuário, use `../importados/`.
