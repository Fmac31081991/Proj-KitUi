# Pasta `tabs_n_buttons/fundos` — aba Fundos

## O que aparece na tela

| Bloco | Nome no código | Conteúdo |
| :--- | :--- | :--- |
| Esquerda | `panel` → `#panelBody` | 10 fundos filtráveis por nome, descrição, tom e id, mais um item “Personalizado” quando você escolhe uma cor própria. |
| Centro | `canvas` → `#viewport` → `#kit` | Cartões de prévia: “Do estilo”, “Personalizado” (quando ativo) e os presets de cor/gradiente. |
| Direita | `inspector` → `#inspectorBody` | Prévia com a textura sobre o fundo, seletor de cor, botões para limpar a cor e restaurar o preset. |

## Arquivos

| Arquivo / pasta | Papel |
| :--- | :--- |
| `interface_actions.js` | Interface da aba: registra `panel`, `canvas` e `inspector` em `window.KIT_TAB_UI.stages`. |
| `padroes/stages.js` | Catálogo dos 10 fundos com nome, descrição, tom e valor CSS. |
| `padroes/` | Guia do acervo. |
| `importados/` | Reservado para fundos trazidos pelo usuário. |

## De onde vêm os dados

`stages.js` alimenta `window.KIT_CORE.T.STAGE_LIST` e `STAGE_PRESETS`. A opção “Do estilo” usa `--k-stage-bg` do tema ativo.

## Ligação com o resto

O fundo fica no palco (`.stage`), atrás da moldura. A textura da aba **Texturas** é aplicada por cima dele. Nenhuma das duas altera as cores fixas da ferramenta.
