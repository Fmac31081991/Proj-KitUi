# Pasta `tabs_n_buttons/padroes` — aba Padrões

## O que aparece na tela

| Bloco | Nome no código | Conteúdo |
| :--- | :--- | :--- |
| Esquerda | `panel` → `#panelBody` | 29 padrões filtráveis, agrupados em Essenciais, Mídia, Aplicativos, Sistema, Web e produto. |
| Centro | `canvas` → `#viewport` → `#kit` | A tela completa do padrão escolhido — visão geral, painel, login, player etc. |
| Direita | `inspector` → `#inspectorBody` | Código HTML/CSS do padrão, botões de cópia e notas de uso e acessibilidade. |

## Arquivos

| Arquivo / pasta | Papel |
| :--- | :--- |
| `interface_actions.js` | Interface da aba: registra `panel`, `canvas` e `inspector` em `window.KIT_TAB_UI.patterns`. |
| `padroes/patterns.js` | Catálogo das telas, montadas a partir dos componentes. |
| `padroes/` | Guia do acervo. |
| `importados/` | Reservado para padrões trazidos pelo usuário. |

> O caminho `padroes/padroes/` tem o nome repetido porque a aba chama-se “Padrões” e o acervo nativo também está em `padroes/`. Não é um erro.

## De onde vêm os dados

`patterns.js` alimenta `window.KIT_CORE.P`. As telas reutilizam os componentes de `tabs_n_buttons/componentes/padroes/components.js`.

## Ligação com o resto

A tela “Visão geral” desta aba é usada como prévia na aba **Estilos**. As janelas flutuantes **Interface de sistema** e **Interface de ajustes** são padrões daqui — fazem parte do conteúdo testável, não da moldura fixa.

A **Moldura de aplicação** (`id: app-frame`, grupo Sistema) é o padrão inspirado na aplicação exemplar. Seu CSS vive dentro do próprio `demo()` e usa apenas seletores `.dm-frame` e variáveis `--dm-*`: nada altera os tokens `--k-*` do estilo escolhido nem a moldura `--u-*` da ferramenta. Os botões de zoom, orientação e tema aparecem só como parte da cena. O padrão declara `uses` e `compatible`; a exportação usa essas listas para descrever os componentes do padrão no catálogo e no README do ZIP.
