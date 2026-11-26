# Pasta `tabs_n_buttons` — abas, importação e exportação

Esta é a pasta maior da aplicação. Cada aba tem **sua própria pasta**, com o layout da interface e os ativos que ela mostra.

## As 9 abas

| Pasta da aba | O que mostra | Guia |
| :--- | :--- | :--- |
| `estilos/` | Temas e ajustes de cores, forma, espaço, tipo e efeitos | [`estilos/README.md`](estilos/README.md) |
| `componentes/` | Botões, campos, tabelas, janelas e outros elementos reutilizáveis | [`componentes/README.md`](componentes/README.md) |
| `padroes/` | Telas completas montadas com os componentes | [`padroes/README.md`](padroes/README.md) |
| `icones/` | Acervo vetorial com 473 SVGs | [`icones/README.md`](icones/README.md) |
| `emojis/` | Glifos agrupados por categoria | [`emojis/README.md`](emojis/README.md) |
| `texturas/` | Padrões aplicados atrás do conteúdo | [`texturas/README.md`](texturas/README.md) |
| `fundos/` | Cores e gradientes do palco | [`fundos/README.md`](fundos/README.md) |
| `tokens/` | Referência visual das variáveis do estilo ativo | [`tokens/README.md`](tokens/README.md) |
| `fontes/` | Catálogo com 55 famílias tipográficas locais | [`fontes/README.md`](fontes/README.md) |

## Pastas especiais

| Pasta | Papel | Guia |
| :--- | :--- | :--- |
| `import/` | Extrator que roda no console do site de origem; não é carregado pela aplicação | [`import/README.md`](import/README.md) |
| `export/` | Geração de HTML, CSS, `tokens.json` e ZIP — é global, não pertence a uma aba | [`export/README.md`](export/README.md) |

## Padrão repetido em cada aba

```
tabs_n_buttons/<aba>/
├── README.md              ← este tipo de guia
├── interface_actions.js   ← painel, canvas e inspetor da aba
├── padroes/               ← acervo que vem com o Kit UI
└── importados/            ← conteúdo trazido pelo usuário (vazio no estado atual)
```

Cada `interface_actions.js` registra três funções em `window.KIT_TAB_UI`: `panel`, `canvas` e `inspector`. O coordenador (`kitui_app/app.js`) só chama a função da aba ativa — ele não sabe o que cada aba desenha. Assim, criar uma aba nova não exige mexer na moldura nem na exportação.

## Acervo x importado

`padroes/` é o acervo nativo, somente leitura. `importados/` recebe o que você traz pelo botão **Importar**. Hoje apenas estilos gravam arquivos nessa pasta (`<id>_import.json`); os demais tipos ficam no navegador (`localStorage`), mas as pastas já estão reservadas para o mesmo contrato.
