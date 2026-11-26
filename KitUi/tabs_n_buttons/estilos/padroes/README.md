# `estilos/padroes` — acervo da aba Estilos

## O que fica aqui

20 arquivos JSON — um estilo por arquivo, nomeados `<id>_padrao.json`. Cada um traz metadados (nome, família, cor de amostra, fonte, raio e densidade) e o mapa completo de variáveis `--k-*`.

| Arquivo | Papel |
| :--- | :--- |
| `<id>_padrao.json` | Um arquivo por estilo nativo: aurora, bento, clay, dark-contrast, editorial, flat, lemon-crispy, matrix-skylines, pixel-lab e os demais. |

## Como é usado

Este acervo vem com o Kit UI e é **somente leitura**. A aplicação carrega estes arquivos pelo `index.html` e eles alimentam `window.KIT_CORE.T`, entregue pela API `/api/estilos` do servidor local.

O formato dos JSON é descrito em `../estilo.schema.json` e no guia completo `../README.md`. Sem o servidor local, estes arquivos não carregam.

Para acrescentar um item, adicione o arquivo aqui e cadastre-o no catálogo da aba. Para conteúdo trazido pelo usuário, use `../importados/`.
