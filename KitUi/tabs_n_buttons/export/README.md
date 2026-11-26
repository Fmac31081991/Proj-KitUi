# Pasta `tabs_n_buttons/export` — aplicação de exportação

Esta pasta é o lugar da **aplicação de exportação** do Kit UI.

## Decisão de arquitetura

A exportação **não** fica dentro da pasta de cada aba. O botão **Exportar** do cabeçalho produz um **kit final**, reunindo instruções, os assets disponíveis e os estilos selecionados — ou seja, é uma preocupação que atravessa todas as abas. Por isso ela tem uma pasta própria em `tabs_n_buttons/export/`, junto ao restante da aplicação.

As pastas `tabs_n_buttons/<aba>/` guardam a **interface da aba** (`interface_actions.js`), o acervo (`padroes/`) e o espaço para conteúdo trazido pelo usuário (`importados/`). Somente a aba Estilos tem, além disso, uma aplicação de importação própria (`importar.js`); os demais tipos são importados pelo coordenador e ficam no navegador. O extrator que roda no console do site de origem fica em `tabs_n_buttons/import/`.

| Pasta | Papel |
| :--- | :--- |
| `tabs_n_buttons/import/` | extrator de estilos (`extract-style.js`), executado no site de origem |
| `tabs_n_buttons/estilos/` | estilos (`importar.js`) |
| `tabs_n_buttons/icones/` | ícones |
| `tabs_n_buttons/fontes/` | fontes |
| `tabs_n_buttons/emojis/` | emojis |
| `tabs_n_buttons/texturas/` | texturas |
| `tabs_n_buttons/fundos/` | fundos |
| `tabs_n_buttons/componentes/` | componentes |
| `tabs_n_buttons/padroes/` | padrões |
| `tabs_n_buttons/tokens/` | tokens |

## Estado atual

A aplicação de exportação está toda nesta pasta:

```
tabs_n_buttons/export/
├── README.md     ← este documento
├── zipper.js     ← escritor ZIP (window.KIT_ZIP), carregado antes de core.js
└── exportar.js   ← a aplicação de exportação (window.KIT_EXPORTAR)
```

`exportar.js` gera o catálogo HTML completo, o CSS, `tokens.json`, o README do kit, o índice de ícones e o pacote ZIP; monta a folha do botão **Exportar** e concentra os manipuladores `data-act="copy-*"` / `data-act="dl-*"` em `handleAction(name, el)`, que devolve `true` quando reconhece a ação.

O `index.html` carrega `exportar.js` depois de `core.js` e dos módulos de aba, antes de `app.js`. O orquestrador apenas delega: abre e fecha a folha, repassa as ações e usa `currentCode()` / `snippetCSS()` na aba de código do inspetor.

O botão do cabeçalho continua onde está; a mudança foi apenas de localização do código, sem alterar a interface.

## O que o kit exportado contém

O botão **Exportar** produz um kit completo do estilo ativo, com as fontes incorporadas e nenhuma dependência externa. O pacote prioriza **padrões**: cada um entra uma vez, com os componentes que usa e os compatíveis; as variantes são criadas pela IA destinatária. O ZIP traz 5 arquivos base e um `.svg` por ícone do acervo ativo — 473 ícones na versão validada, totalizando 478 entradas:

| Entrada | Conteúdo |
| :--- | :--- |
| `index.html` | Catálogo navegável com instruções de interface e regras completas de layout, 29 padrões (demonstração, HTML e componentes usados/compatíveis), 39 componentes de referência, galeria com os ícones do acervo (473 na versão validada) e tabela com todos os tokens. Tem busca local para componentes, padrões e ícones. |
| `kit.css` | CSS canônico integral com as variáveis `--k-*` resolvidas no topo e as fontes do acervo local em `data:`. |
| `tokens.json` | Mapa completo das variáveis, separado por cores, forma, espaço, tipografia, efeitos, palco e textura. |
| `README.md` | Guia com instruções de interface, regras completas de layout, papéis de cor, tabela de padrões com componentes usados/compatíveis, tabela de componentes, lista dos ícones por categoria (473 na versão validada) e sugestões de combinação. |
| `icons/icons.json` | Metadados dos ícones: id, nome, categoria, aliases e arquivo correspondente. |
| `icons/<id>.svg` | Um arquivo por ícone (473 no total), envelope 24×24, traço 2 e `currentColor`. |

O HTML, o CSS e o README são gerados a partir dos mesmos acervos usados pela aplicação (`KIT_CORE.C.components`, `KIT_CORE.P.patterns`, `KIT_CORE.IC.icons` e `resolvedTokens()`), então o que aparece no catálogo corresponde ao que está na ferramenta.

`patternParts()` liga cada padrão aos componentes: usa os campos `uses`/`compatible` quando o padrão os declara e, se não houver, deduz a lista das classes `k-*` presentes no HTML de demonstração. As regras de layout exportadas ficam em `LAYOUT_RULES_ZIP` e vêm de `Guia Kit.txt` — não são as notas da moldura do Kit UI (`KIT_CORE.LAYOUT_RULES_NOTE`, usadas só no inspetor de tokens). A variante visual **Escuro / Claro** continua sendo apenas visual: ela não altera os tokens exportados nem grava nada nos arquivos.

Além das regras de layout, o guia exportado traz a regra de **redundância descritiva**: a IA destinatária não deve repetir o contexto já dado pela aba/painel, nem duplicar títulos, frases de exemplo ou o nome do contêiner, e não deve aninhar um componente igual dentro de outro (aba dentro de aba), salvo pedido explícito. Ela aparece no `index.html` (seção “Instruções de interface”) e no `README.md` do ZIP, junto às demais instruções; o original também fica registrado em `Guia Kit.txt`.
