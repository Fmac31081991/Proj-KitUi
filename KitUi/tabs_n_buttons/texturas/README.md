# Pasta `tabs_n_buttons/texturas` — aba Texturas

## O que aparece na tela

| Bloco | Nome no código | Conteúdo |
| :--- | :--- | :--- |
| Esquerda | `panel` → `#panelBody` | “Todos” + 5 categorias deduzidas do acervo (Básico, Técnico, Orgânico, Decorativo, Infantil), com contagens. |
| Centro | `canvas` → `#viewport` → `#kit` | Grade com 19 cartões: prévia da textura, etiqueta “liso” ou “padrão”, nome e descrição. |
| Direita | `inspector` → `#inspectorBody` | Prévia ampliada, controle de opacidade, botão de restaurar e notas sobre as variáveis usadas. |

## Arquivos

| Arquivo / pasta | Papel |
| :--- | :--- |
| `interface_actions.js` | Interface da aba: registra `panel`, `canvas` e `inspector` em `window.KIT_TAB_UI.textures`. |
| `padroes/textures.js` | Catálogo das texturas, com SVG embutido. |
| `padroes/` | Guia do acervo. |
| `importados/` | Reservado para texturas trazidas pelo usuário. |

## Variáveis envolvidas

Cada textura é descrita por `--k-texture` (a imagem), `--k-texture-size` (tamanho) e `--k-texture-opacity` (opacidade). A opacidade pode ser ajustada no inspetor.

## Ligação com o resto

`textures.js` alimenta `window.KIT_CORE.T`. A textura escolhida aparece atrás do conteúdo em conjunto com o fundo da aba **Fundos**; as duas camadas são independentes.
