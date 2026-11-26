# Pasta `tabs_n_buttons/emojis` — aba Emojis

## O que aparece na tela

| Bloco | Nome no código | Conteúdo |
| :--- | :--- | :--- |
| Esquerda | `panel` → `#panelBody` | “Todos” + 8 categorias (Rostos, Gestos, Pessoas, Natureza, Comida, Objetos, Símbolos, Bandeiras), com contagens. |
| Centro | `canvas` → `#viewport` → `#kit` | Grupos de emojis com glifo, nome e total por categoria. |
| Direita | `inspector` → `#inspectorBody` | Prévia grande, caractere, nome, categoria, HTML acessível e botões de cópia do emoji e do HTML. |

## Arquivos

| Arquivo / pasta | Papel |
| :--- | :--- |
| `interface_actions.js` | Interface da aba: registra `panel`, `canvas` e `inspector` em `window.KIT_TAB_UI.emojis`. |
| `padroes/emojis.js` | Catálogo com 136 emojis e suas categorias. |
| `padroes/` | Guia do acervo. |
| `importados/` | Reservado para emojis trazidos pelo usuário. |

## De onde vêm os dados

`emojis.js` alimenta `window.KIT_CORE.E`. O HTML gerado para cópia esconde o glifo de leitores de tela (`aria-hidden`) e inclui o nome em texto (`sr-only`).

## Ligação com o resto

É uma aba de consulta: os emojis não alteram os tokens do estilo. Eles aparecem noHTML exportado quando usados em um padrão ou componente.
