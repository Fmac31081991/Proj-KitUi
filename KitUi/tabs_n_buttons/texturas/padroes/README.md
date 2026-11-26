# `texturas/padroes` — acervo da aba Texturas

## O que fica aqui

19 padrões de textura com SVG embutido, divididos entre Básico, Técnico, Orgânico, Decorativo e Infantil.

| Arquivo | Papel |
| :--- | :--- |
| `textures.js` | Lista de texturas com id, nome, categoria, descrição e as variáveis `--k-texture*`. |

## Como é usado

Este acervo vem com o Kit UI e é **somente leitura**. A aplicação carrega estes arquivos pelo `index.html` e eles alimentam `window.KIT_CORE.T.TEXTURES` e `TEXTURE_LIST`.

A textura aparece atrás do conteúdo, em conjunto com o fundo escolhido na aba Fundos.

Para acrescentar um item, adicione o arquivo aqui e cadastre-o no catálogo da aba. Para conteúdo trazido pelo usuário, use `../importados/`.
