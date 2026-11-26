# Pasta `tabs_n_buttons/import` — extrator de estilos

## O que fica aqui

| Arquivo | Papel |
| :--- | :--- |
| `extract-style.js` | Código para colar no **console do navegador do site de origem**. Ele lê os estilos computados da página e devolve um objeto com variáveis CSS e metadados. |

## O que NÃO fica aqui

Este arquivo **não é carregado pelo Kit UI**. Ele não aparece no `index.html` e não roda dentro da aplicação. O fluxo é:

1. você abre o site que quer usar como referência;
2. cola o extrator no console daquele site;
3. copia o resultado;
4. volta ao Kit UI, clica em **Importar → Estilos** e cola o objeto.

A aplicação de importação que recebe esse resultado fica em `tabs_n_buttons/estilos/importar.js`. O guia resumido está em `tabs_n_buttons/estilos/extracao-e-variante-inversa.md`.

## Prompts de importação

O botão **Copiar prompt p/ IA** aparece nos seis tipos da janela **Importar** e está implementado em `kitui_app/app.js` (`IMPORT_HINTS` + `promptImportacao()`). Cada prompt explica como usar, traz regras de saída em JSON e termina com `<cole aqui>` para o material de origem:

| Tipo | O que o prompt pede à IA |
| :--- | :--- |
| **Estilos** | Normalizar o JSON do extrator sem inventar tokens (prompt em `tabs_n_buttons/estilos/importar.js`). |
| **Ícones** | Filtrar SVGs simples, remover scripts/URLs e listar aprovados e descartados para conferência. |
| **Fontes** | Organizar `{ id, name, stack, cat, data }`; `data` só quando vier um data URI real. |
| **Emojis** | Catalogar caracteres Unicode com nome, categoria e termos de busca — não arte vetorial. |
| **Texturas** | Converter CSS de textura em `{ id, name, cat, desc, tokens }`, sem `url()` externa. |
| **Fundos** | Converter cor ou gradiente em `{ id, name, desc, tone, value }`, sem imagem externa. |

A resposta da IA é colada no campo da janela **Importar**. O tipo **Tokens** não tem importação: apenas resume o que será exportado.
