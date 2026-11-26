# `kitui_interface/icones` — ícones da ferramenta

## O que fica aqui

| Arquivo | Papel |
| :--- | :--- |
| `icons.js` | 18 ícones vetoriais usados nos botões da própria ferramenta: fechar, busca, download, exportar, zoom, grade, rotação, componentes etc. |

O arquivo expõe `window.KIT_UI_ICONS`. A moldura transforma esses desenhos nos ícones que você vê no cabeçalho, no painel e nos controles flutuantes.

## Diferença do catálogo

| Conjunto | Onde está | Quantidade | Para que serve |
| :--- | :--- | :--- | :--- |
| Ícones da ferramenta | `kitui_interface/icones/icons.js` | 18 | Vestem o Kit UI |
| Acervo de ícones | `tabs_n_buttons/icones/` | 473 | São oferecidos ao usuário e podem ser exportados |

Os dois conjuntos seguem o mesmo padrão de desenho — grade 24, traço 2 e `currentColor` — mas não se misturam. Trocar os ícones da ferramenta não altera o catálogo.

Os ids `export` e `download` são históricos e não combinam com o nome dos botões: `export` desenha a **seta para cima** e `download` a **seta para baixo**. Por isso o cabeçalho usa `download` no botão **Importar** e `export` no botão **Exportar**. O que importa é o desenho exibido.
