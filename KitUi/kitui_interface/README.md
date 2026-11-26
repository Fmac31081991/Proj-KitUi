# Pasta `kitui_interface` — a ferramenta em si

Aqui ficam os recursos da **moldura fixa**: a aparência e o comportamento do próprio Kit UI. É a camada imutável — trocar o estilo selecionado nunca altera esta pasta. Ela usa as variáveis `--u-*`; o conteúdo das abas usa `--k-*`.

Os recursos foram separados por tipo para facilitar a manutenção:

```
kitui_interface/
├── icones/       ← 18 ícones usados pela ferramenta
├── fontes/       ← 3 fontes usadas pela ferramenta
├── estilos/      ← aparência da moldura
└── estruturas/   ← ações da moldura
```

| Pasta | Conteúdo | Guia |
| :--- | :--- | :--- |
| `icones/` | `icons.js` — os ícones pequenos de botões, trilha, cabeçalho etc. Não são os 473 ícones do catálogo. | [`icones/README.md`](icones/README.md) |
| `fontes/` | `fonts.css` e os arquivos `.woff2` da interface. | [`fontes/README.md`](fontes/README.md) |
| `estilos/` | `shell.css` — cores, espaços e medidas fixos da ferramenta (alturas, raio da marca e os três tamanhos de fonte). | [`estilos/README.md`](estilos/README.md) |
| `estruturas/` | `interface_actions.js` — o que acontece quando você clica no cabeçalho, ajusta zoom, troca aba etc. | [`estruturas/README.md`](estruturas/README.md) |

## Os três blocos da tela

Os nomes abaixo são os **nomes definidos no código** e são usados também no contrato das 9 abas:

| O que você vê | Nome genérico | Nome no código |
| :--- | :--- | :--- |
| Esquerda — lista de ativos | painel de ativos | `panel` → `#panelBody` |
| Centro — onde aparece a prévia | área de trabalho / prévia | `canvas` → `#viewport` → `#kit` |
| Direita — propriedades | inspetor | `inspector` → `#inspectorBody` |

O centro tem três camadas: `canvas` é a coluna inteira (inclui os botões flutuantes de zoom, grade e retrato), `viewport` é a janela com rolagem e `kit` é a caixa onde o ativo é desenhado de fato. Só o `#kit` recebe os tokens `--k-*` do estilo escolhido.

## Elementos ao redor

- `#stage` — o palco, fundo que envolve tudo;
- `#app` — a aplicação dentro do palco;
- `.topbar` — cabeçalho, com a marca, a trilha de abas (`.rail`) e os botões **Importar** / **Exportar**;
- `.statusbar` — rodapé com contadores do acervo e a versão da aplicação;
- `#sheet` / `#scrim` — janela que abre e fundo escurecido atrás dela.

## Como se liga ao resto

A moldura recebe as funções do coordenador (`kitui_app/app.js`) e chama a aba ativa para desenhar painel, canvas e inspetor. Ela não conhece os acervos: quem conhece é `kitui_app/core.js`.
