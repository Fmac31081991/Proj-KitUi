# Pasta `tabs_n_buttons/emojis` — aba Emojis

## O que aparece na tela

| Bloco | Nome no código | Conteúdo |
| :--- | :--- | :--- |
| Esquerda | `panel` → `#panelBody` | As **9 bibliotecas locais** (Twemoji, Noto, Fluent Emoji, Fluent Emoji Flat, Fluent Emoji High Contrast, OpenMoji, Emoji One Colored, Emoji One Monotone e Firefox OS Emoji), com total de SVGs e licença. Não há mais “Todos/Rostos/Gestos/…” nesta lista. |
| Centro | `canvas` → `#viewport` → `#kit` | Emojis da biblioteca em prévia, agrupados nas 8 categorias do guia (Rostos e Emoções, Pessoas e Gestos, Animais e Natureza, Comidas e Bebidas, Viagens e Lugares, Atividades e Esportes, Objetos e Símbolos e Bandeiras) em **rolagem virtual**: só as linhas visíveis existem no DOM. |
| Direita | `inspector` → `#inspectorBody` | Prévia do SVG, nome do arquivo, Unicode, codepoint, categoria, HTML de uso e botões **Copiar HTML**, **Copiar caminho SVG** e **Usar esta biblioteca no kit**. |

## Arquivos

| Arquivo / pasta | Papel |
| :--- | :--- |
| `interface_actions.js` | Interface da aba: registra `panel`, `canvas` e `inspector` em `window.KIT_TAB_UI.emojis`. |
| `bibliotecas.js` | Catálogo gerado com `window.KIT_EMOJI_LIBS`: ordem das bibliotecas, nome, autor, licença, total e tuplas `[arquivo, hexcode, categoria]`. |
| `LICENCAS.md` | Licenças e créditos consolidados; entra na raiz do ZIP exportado. |
| `padroes/emojis.js` | Adaptador que transforma o catálogo em `window.KIT_EMOJIS` para `window.KIT_CORE.E`. |
| `twemoji/`, `noto/`, `fluent-emoji/`, `fluent-emoji-flat/`, `fluent-emoji-high-contrast/`, `openmoji/`, `emojione/`, `emojione-monotone/`, `fxemoji/` | Uma pasta por biblioteca, com todos os SVGs, `README.md` e `unicode-map.json`. |
| `importados/` | Reservado para emojis trazidos pelo usuário. |

## De onde vêm os dados

Os SVGs são locais, servidos por `https://i.allsvgicons.com/<biblioteca>/<nome>.svg` no download inicial e entregues pelo servidor local em `tabs_n_buttons/emojis/<biblioteca>/<nome>.svg`. Ao todo são **24.400 arquivos**: Twemoji 3.988, Noto 3.729, Fluent Emoji 3.126, Fluent Flat 3.145, Fluent High Contrast 1.595, OpenMoji 4.546, Emoji One Colored 1.834, Emoji One Monotone 1.403 e Firefox OS 1.034.

Arquivos SVG não carregam o Unicode que representam. Cada pasta tem um **`unicode-map.json`** com `{ "hex", "unicode", "categoria" }` para cada arquivo — é o marcador técnico exigido para ligar o SVG ao seu Unicode. A categoria vem do **guia visual de 8 grupos** fornecido para o projeto: ele é a fonte autoritativa para os emojis que lista (corações em Rostos e Emoções, dança em Pessoas e Gestos, naipes em Atividades e Esportes, setas e formas em Símbolos e Bandeiras). Para os demais, o fallback usa os grupos oficiais `emojibase-data`/`iamcal emoji-data` com correspondência um para um; o índice do All SVG Icons e o `FirefoxEmoji.json` da Mozilla complementam os aliases.

## Ligação com o resto

A biblioteca em prévia na aba não altera o estilo. A escolha que vale para o kit é feita em **Propriedades → Biblioteca do estilo**: por padrão todos os estilos usam **Fluent Emoji**. O estado fica em `state.emojiLibByStyle`, gravado no `localStorage`, e é lido por `CORE.emojiLibForStyle()`.

Na exportação, `exportar.js` busca os SVGs da biblioteca do estilo atual e inclui em `emojis/<biblioteca>/`: os arquivos `.svg`, o `README.md`, o `unicode-map.json` e, na raiz do ZIP, `LICENCAS.md`. O HTML copiado referencia `emojis/<biblioteca>/<arquivo>.svg`. A aba não altera tokens; emojis só entram no material exportado quando usados em um padrão ou componente — ou quando a biblioteca é associada ao estilo, caso em que todo o acervo da biblioteca acompanha o kit.

## Exibição de grandes acervos

O antigo botão **Ver mais** acrescentava 120 células ao DOM a cada clique e nunca liberava as anteriores. Ele foi removido. A grade agora usa **windowing**:

- `.emoji-vspacer` reserva a altura total (`linhas × 92px`), mantendo a barra de rolagem real;
- `.emoji-vwindow` recebe só as linhas visíveis mais 4 de buffer, reposicionadas por `transform: translateY()`;
- cada `<img>` recebe o `src` quando entra na viewport (`IntersectionObserver` com `rootMargin` de 160px) e volta a um GIF transparente ao sair, liberando o bitmap decodificado;
- `contain: layout paint style`, `will-change: transform` e `decoding="async"` evitam trabalho de pintura fora da área visível;
- `ResizeObserver` recalcula o número de colunas, e a atualização durante a rolagem é feita em `requestAnimationFrame`.

Com isso, mesmo uma biblioteca com 4.546 SVGs mantém algumas dezenas de nós no DOM. Quando bibliotecas animadas forem adicionadas, o ponto de pausa/ativação já está no `IntersectionObserver`: basta trocar a versão estática pela animada somente enquanto o item está visível.
