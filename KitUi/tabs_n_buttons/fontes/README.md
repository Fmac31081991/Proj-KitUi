# Pasta `tabs_n_buttons/fontes` — aba Fontes

## O que aparece na tela

| Bloco | Nome no código | Conteúdo |
| :--- | :--- | :--- |
| Esquerda | `panel` → `#panelBody` | A fonte do estilo aparece primeiro, no grupo “Fonte do estilo”; depois vêm as 55 famílias em Sans, Serif, Mono, Display e Pixel. Cada rótulo usa a própria fonte. Busca por nome, categoria e stack. |
| Centro | `canvas` → `#viewport` → `#kit` | “Aa” grande, nome da família, aviso de prévia e stack CSS; tabela completa de caracteres (maiúsculas, minúsculas, números, pontuação e acentos), frase de exemplo e um campo de texto com 4 linhas. Todos os cards têm a mesma borda arredondada e sombra. |
| Direita | `inspector` → `#inspectorBody` | “Fonte em uso” mostra só os botões “Usar esta fonte” e “Remover fonte do estilo atual”, ambos com ícone; depois de aplicar, “Configurações de uso” com peso dos títulos, escala, entreletra e “Menor visível” (campo, diminuir/aumentar e aplicar). A remoção de fonte do acervo aparece como “Remover esta fonte do Kit UI”, com a nota antes do botão. |

## Arquivos

| Arquivo / pasta | Papel |
| :--- | :--- |
| `interface_actions.js` | Interface da aba: registra `panel`, `canvas` e `inspector` em `window.KIT_TAB_UI.fonts`. |
| `fonts.js` | Catálogo das 55 famílias, com nome, categoria, stack CSS e menor visível padrão (11,5 px). |
| `padroes/fonts.css` | Declara os `@font-face` que apontam para os arquivos daqui. |
| `padroes/*.woff2` | Arquivos das fontes, nos subconjuntos `latin` e `latin-ext`. |
| `padroes/` | Guia do acervo. |
| `importados/` | Reservado para fontes trazidas pelo usuário. |

## Prévia x aplicação

Clicar em uma fonte na lista da esquerda **só mostra a prévia** no centro; `state.fontPreview` vive em memória e `save()` nunca o grava no `localStorage`. A fonte do estilo muda somente com **Usar esta fonte**, no inspetor. O botão **Remover fonte do estilo atual** volta a usar a fonte definida no estilo e também limpa peso, escala e entreletra ajustados ali.

Cada fonte entra no acervo com um **menor visível padrão de 11,5 px**, definido pelo Kit UI. Ao aplicar a fonte ao estilo, esse valor pode ser redefinido em **Configurações de uso** (campo numérico em px, botões Diminuir/Aumentar e Aplicar). A sequência é proporcional: **tamanho 1 = mínimo**, **tamanho 2 = mínimo × 1,09** e **tamanho 3 = mínimo × 1,30** (padrão: 11,5 / 12,5 / 15 px). A mesma sequência comanda os botões compacto/mediano/grande (`--k-fs-compact`, `--k-fs-sm`, `--k-fs`) e o componente **Tipografia**. A escala (`NUM_CFG.fsScale`, 85–120%) continua como ajuste fino multiplicador. O “Aa” do card principal permanece grande; o menor visível aparece na tabela de caracteres e na frase de exemplo.

## De onde vêm os dados

`fonts.js` alimenta `window.KIT_CORE.T.FONTS`. Os arquivos são servidos pelo próprio projeto: não há Google Fonts, CDN nem host externo. A maioria mantém a licença SIL Open Font License ou Apache 2.0.

## Como ampliar o acervo

1. coloque o `.woff2` em `padroes/` com nome em minúsculas e hífens;
2. adicione o `@font-face` em `padroes/fonts.css`;
3. cadastre a família em `fonts.js` para que apareça na aba.

## Diferença das fontes da ferramenta

As 3 fontes usadas nos botões e painéis do Kit UI ficam em `kitui_interface/fontes/`. Inter e JetBrains Mono existem nos dois lugares de propósito: lá vestem a ferramenta; aqui são ativos do catálogo.
