# `kitui_interface/estilos` — aparência da moldura

## O que fica aqui

| Arquivo | Papel |
| :--- | :--- |
| `shell.css` | Todo o visual fixo da ferramenta: cores do tema *Lemon Crispy*, cabeçalho, trilha de abas, painel, canvas, inspetor, rodapé, janelas, botões e barras de rolagem. |

## Como funciona

Este arquivo usa as variáveis `--u-*` (grafite, lima elétrico e tipografia de ferramenta). Elas são gravadas na raiz da página e **não mudam** quando você escolhe outro estilo na aba **Estilos**.

As variáveis `--k-*` do estilo selecionado são aplicadas apenas dentro de `#kit`, a caixa central. Essa separação é o que permite testar um tema sem deformar a própria ferramenta.

## Medidas oficiais da moldura

Estes números vivem no `:root` de `shell.css`. Se precisar alterar a interface, mude **a variável**, não os valores espalhados pelos seletores.

| Variável | Valor | Onde aparece |
| :--- | :--- | :--- |
| `--u-h-topbar` | `46px` | Altura do cabeçalho (barra superior) |
| `--u-h-statusbar` | `23px` | Altura do rodapé (barra de status) |
| `--u-size-brand` | `28px` | Largura e altura do ícone da marca Kit UI |
| `--u-radius-brand` | `50%` | Raio do ícone da marca — **círculo**, não quadrado arredondado |
| `--u-fs-1` | `10px` | Menor fonte: rodapé, rótulos técnicos e valores compactos |
| `--u-fs-2` | `11.5px` | Fonte padrão: listas, botões, campos e inspetor |
| `--u-fs-3` | `13px` | Maior fonte: nome da marca e títulos |

O grid da aplicação usa `var(--u-h-topbar) minmax(0, 1fr) var(--u-h-statusbar)`. Assim, cabeçalho e rodapé mantêm sempre a mesma altura e o meio absorve o restante da janela.

### Tipografia: no máximo três tamanhos

Toda a interface (cabeçalho, rodapé, painel esquerdo, inspetor e janelas) usa **somente** `--u-fs-1`, `--u-fs-2` e `--u-fs-3`. O rodapé usa o menor, `--u-fs-1`.

**Não padronize o conteúdo do expositor.** Os tamanhos dentro de `#kit` — `.spec-*`, `.tex-*`, `.icon-*`, `.emoji-*`, `.font-hero*` e `.tok-*` — pertencem aos estilos apresentados e continuam livres, usando `--k-fs*` ou valores próprios. A regra dos três tamanhos é só para a moldura da ferramenta.

## O que não mexer sem motivo

Alterar `shell.css` muda a aparência do Kit UI inteiro, não apenas de uma aba. Se o objetivo for mudar o conteúdo mostrado em uma aba, edite o `interface_actions.js` daquela aba em `tabs_n_buttons/<aba>/`.

Antes de ajustar qualquer medida ou fonte, compare com a tabela acima. Mudanças pequenas (2 ou 3 px) são perceptíveis e quebram a compatibilidade com os guias das outras pastas.
