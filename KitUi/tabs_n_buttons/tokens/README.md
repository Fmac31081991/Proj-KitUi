# Pasta `tabs_n_buttons/tokens` — aba Tokens

## O que aparece na tela

| Bloco | Nome no código | Conteúdo |
| :--- | :--- | :--- |
| Esquerda | `panel` → `#panelBody` | 6 grupos fixos (Cores, Tipografia, Espaço, Forma, Sombras, Fundo) que levam a rolagem até a seção correspondente. |
| Centro | `canvas` → `#viewport` → `#kit` | Mapa visual das variáveis resolvidas: chips de 13 cores, amostras de tamanhos, barras de espaçamento de 8 pontos, raios, sombras e prévia do fundo com textura. |
| Direita | `inspector` → `#inspectorBody` | Somente leitura: número de variáveis, estilo atual, ícones embutidos e o passo a passo “Como consumir”. |

No fim do conteúdo há uma nota **não editável** com as regras universais de layout e os parâmetros técnicos por estilo. Ela não muda quando você troca de tema.

## Arquivos

| Arquivo / pasta | Papel |
| :--- | :--- |
| `interface_actions.js` | Interface da aba: registra `panel`, `canvas` e `inspector` em `window.KIT_TAB_UI.tokens`. |
| `padroes/` | Reservado ao acervo de tokens. |
| `importados/` | Reservado para tokens trazidos pelo usuário. |

## De onde vêm os dados

Os tokens base (`BASE`, `COLOR_ROLES`, `RADIUS_SETS`, `DENSITIES`) estão em `tabs_n_buttons/estilos/tokens.js`. A combinação do estilo base com os ajustes feitos em Propriedades é feita por `resolvedTokens()`, em `kitui_app/core.js`.

## Estado atual

Esta aba é de **consulta**. Não há `importar.js` aqui: os tokens entram na aplicação junto com o estilo, pelo botão **Importar → Estilos**. A pasta existe e segue o mesmo padrão das outras, pronta para abrigar uma aplicação de importação própria no futuro.
