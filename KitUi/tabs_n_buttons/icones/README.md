# Pasta `tabs_n_buttons/icones` — aba Ícones

## O que aparece na tela

| Bloco | Nome no código | Conteúdo |
| :--- | :--- | :--- |
| Esquerda | `panel` → `#panelBody` | “Todos” + 18 categorias com contagem. Busca por id, rótulo, categoria e aliases. |
| Centro | `canvas` → `#viewport` → `#kit` | Grade com os 473 ícones desenhados em SVG, filtrada pela categoria ou busca. |
| Direita | `inspector` → `#inspectorBody` | Prévia ampliada, controles de tamanho, campos de id/rótulo/categoria, código SVG e botão **Copiar SVG**. |

O cabeçalho do canvas mostra apenas o título “Biblioteca de ícones”. A caixa de contagem de vetores e os textos sobre “24×24 / currentColor”, “Pacote 473 ícones autorais...”, “Herda a cor do texto...” e “Aliases: ...” foram removidos por serem repetitivos. A busca continua usando aliases — eles só não aparecem mais como texto no inspetor.

## Arquivos

| Arquivo / pasta | Papel |
| :--- | :--- |
| `interface_actions.js` | Interface da aba: registra `panel`, `canvas` e `inspector` em `window.KIT_TAB_UI.icons`. |
| `icons-data.js` | Catálogo gerado a partir dos SVGs — é o que a aplicação carrega. |
| `padroes/*.svg` | 473 arquivos individuais, um por ícone. São a fonte do catálogo. |
| `padroes/` | Guia do acervo. |
| `importados/` | Reservado para ícones trazidos pelo usuário. |

## Padrão de desenho

Grade de 24 × 24, traço de 2 pixels, `currentColor` (o ícone herda a cor do texto). São 18 categorias: modelagem 3D, edição, navegação, forma, texto, mídia e outras. Não há dependência de biblioteca externa nem de ícones de terceiros.

## Diferença dos ícones da ferramenta

Os 18 ícones pequenos dos botões do Kit UI ficam em `kitui_interface/icones/icons.js`. Eles vestem a ferramenta; os 473 daqui são o acervo oferecido ao usuário.

## Ligação com o resto

`icons-data.js` alimenta `window.KIT_CORE.IC`. Os SVGs são incorporados ao HTML/CSS exportado, então o kit final funciona sem conexão.
