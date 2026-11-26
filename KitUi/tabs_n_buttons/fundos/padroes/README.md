# `fundos/padroes` — acervo da aba Fundos

## O que fica aqui

10 fundos prontos — cores e gradientes locais — com nome, descrição e tom (claro ou escuro).

| Arquivo | Papel |
| :--- | :--- |
| `stages.js` | Lista de presets usados no palco e na aba Fundos. |

## Como é usado

Este acervo vem com o Kit UI e é **somente leitura**. A aplicação carrega estes arquivos pelo `index.html` e eles alimentam `window.KIT_CORE.T.STAGE_PRESETS` e `STAGE_LIST`.

A opção “Do estilo” usa a variável `--k-stage-bg` do tema ativo.

Para acrescentar um item, adicione o arquivo aqui e cadastre-o no catálogo da aba. Para conteúdo trazido pelo usuário, use `../importados/`.
