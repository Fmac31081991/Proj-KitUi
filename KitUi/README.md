# Kit UI

Catálogo e ferramenta de design system que **monta, testa e exporta interfaces** inteiramente no navegador. Não há backend remoto nem etapa de build: a aplicação é HTML, CSS e JavaScript estáticos. O servidor local apenas entrega os arquivos e oferece a API que lê e grava os estilos.

## Como executar

O Kit UI roda como aplicação de desenvolvimento, servida localmente:

- **Com Node.js ou Python**: no Windows, dê duplo clique em `servir.bat` — ele detecta o runtime disponível, inicia o servidor e abre o navegador em `http://localhost:8080` automaticamente. Em outros sistemas, rode `node servir.js` ou `python servir.py` e abra o endereço.

A exportação que incorpora fontes depende do servidor local; abrir `index.html` direto do disco não é uma forma de execução suportada.

## O que é este aplicativo

O Kit UI é um **laboratório de temas para componentes e telas**. Ele separa duas camadas com funções distintas:

1. **Moldura do aplicativo (imutável)** — é a própria ferramenta, com o tema fixo *Lemon Crispy* (grafite, lima elétrico e tipografia de ferramenta). É composta por:

   - **Cabeçalho**: identidade do Kit UI, as abas de navegação e os botões **Importar** e **Exportar**.
   - **Rodapé**: contadores do acervo à esquerda e a versão da aplicação (`ver.2026.11.21`) à direita.
   - **Caixa esquerda (`panel`)**: a lista de itens da aba ativa, com busca no topo. Conforme a aba, os itens vêm agrupados por categoria (ícones, emojis, fontes, texturas, componentes, padrões) ou em grupos fixos (tokens).
   - **Caixa direita — Propriedades**: apresenta as configurações do item selecionado na lista. Conforme a aba, ela expõe tokens e cores do estilo, parâmetros do componente ou do padrão, opções do ícone, da fonte, da textura, do fundo e do emoji, além do código correspondente. No fim da rolagem há **Remover**, que exclui o item importado selecionado após confirmação; para itens do acervo local, o botão fica desativado e traz o aviso “Os itens padrões do Kitui não podem ser removidos”. A aparência do painel permanece fixa; os valores exibidos refletem a seleção atual.
   - **Palco**: fica atrás da moldura e envolve toda a aplicação.

   A moldura usa `--u-*` e os tokens fixos do tema *Lemon Crispy*. **Trocar de estilo nunca altera essa camada.**

2. **Caixa central (`canvas`)** — é a área de demonstração. Ela tem três camadas: `canvas` (a coluna inteira, com os controles flutuantes de zoom, grade e orientação), `viewport` (a janela com rolagem) e `#kit` (a caixa onde o ativo é desenhado de fato). Todo o seu conteúdo consome os tokens `--k-*` do estilo selecionado e reage imediatamente a ele: cores, fontes, raios, bordas, sombras, densidade e espaçamento. É nela que cada item das abas é apresentado.

O palco acompanha o estilo ativo, os fundos e as texturas escolhidos, sem modificar os quatro blocos da ferramenta. O zoom começa em **100%** no modo paisagem. No modo retrato a aplicação abre em **80%**, entrar em retrato também usa 80% e o botão de zoom central restaura 80% nesse modo (100% em paisagem).

Na aba **Estilos**, o botão **Escuro / Claro** alterna entre o estilo original e a versão inversa da prévia. Ele é um botão comum, sem destaque de cor, e seu nome não muda: quem informa a variante ativada é o aviso na tela. O guia resumido — incluindo a importação de um único estilo aproximado e o contorno de cards e linhas — está em [`tabs_n_buttons/estilos/extracao-e-variante-inversa.md`](tabs_n_buttons/estilos/extracao-e-variante-inversa.md). Nada é gravado nos JSONs nem entra no kit exportado.

## Abas

| Aba | O que mostra |
| :--- | :--- |
| **Estilos** | Temas selecionáveis — entre eles *Lemon Crispy* e *Pixel Lab*. Permite editar tokens, ajustar cores, forma, espaço, tipografia e efeitos. A importação de um estilo extraído de um site é feita pelo botão **Importar** no cabeçalho. |
| **Componentes** | Biblioteca de elementos reutilizáveis: botões, campos, tabelas, janelas, navegação e outros. O **Equalizador Gráfico** (Frequency Ranger) traz faders verticais em 6, 15 e 31 bandas, com detent em 0 dB, alcance ±6/±12 dB, Bypass, Reset/Flat e Output Gain; os filtros `peaking` ficam em cascata e a resposta é plana com todas as bandas zeradas. Os botões têm três tamanhos para todas as variantes — compacto (sem ícone e sem negrito), mediano e grande (proporções de Salvar alterações) — com geometria derivada da menor fonte aplicada ao estilo: altura, margens, paddings e ícones escalam com o valor em px definido nas configurações da fonte e aplicado em Propriedades. As regras ficam em um card técnico na parte inferior da demonstração. Selecionar um item abre o exemplo na caixa central e suas opções em Propriedades. O **Seletor de cor flutuante** é uma janela com espectro amplo e faixa de matiz escolhidos pelo ponteiro, campo de texto em RGB/HEX/CMYK com botões de copiar/colar ao lado e fechamento ao clicar fora; o botão **Reabrir caixas**, à direita das abas e fora do palco pontilhado, traz a janela ativa de volta sem criar outra. A demonstração traz três abas de tamanho (grande, mediana e compacta); cada janela tem a área de seleção 100% quadrada, alongada verticalmente, e o switch de ícone único, com o mesmo padrão dos botões RGB/HEX/CMYK, alterna espectro retangular e anel cromático com triângulo sem mudar o tamanho da janela — a roda triangular fica centralizada no espaço extra. No modo triangular o anel tem 10% de inset (cerca de 30% mais fino), o marcador do matiz fica no meio da espessura do anel, o triângulo é 5% menor que a abertura do anel e o marcador da cor fica acima do recorte, visível nos vértices. A amostra de cor, o campo de texto e os botões de copiar/colar têm a mesma altura nas três janelas (26 px na grande/mediana e 22 px na compacta). A compacta tem borda fina, a descrição aparece em uma linha única e a divisória entre descrição e abas foi removida. Há só dois raios de canto: o da janela e o menor para todos os elementos internos, com valores mínimos na compacta. Reabrir mantém o modo e a cor configurados pelo usuário, conforme o atributo `data-cp-note` que acompanha o markup exportado; nada disso grava JSONs ou altera tokens. |
| **Padrões** | Telas montadas a partir dos componentes. Inclui a **Moldura de aplicação**, com paleta escura isolada, três abas genéricas e controles apenas visuais. **Interface de sistema** e **Interface de ajustes** também são padrões desta aba, não parte da moldura fixa. |
| **Ícones** | Acervo vetorial em SVG. Cada ícone pode ser inspecionado, dimensionado e copiado; o mesmo acervo está disponível como arquivos `.svg` individuais em `tabs_n_buttons/icones/padroes/`. |
| **Fontes** | Acervo tipográfico com amostras por categoria. A fonte escolhida é aplicada ao conteúdo da caixa central. |
| **Texturas** | Padrões aplicados atrás da moldura, no palco. Podem ser filtrados por categoria e combinados com qualquer fundo. |
| **Fundos** | Gradientes e cores do palco, independentes das texturas. A opção “Do estilo” usa o fundo definido pelo tema ativo. |
| **Emojis** | Nove bibliotecas locais de SVG (Twemoji, Noto, Fluent Emoji e suas variações, OpenMoji, Emoji One e Firefox OS). A lista à esquerda escolhe a biblioteca em prévia; a caixa central mantém as 8 categorias do guia em rolagem virtual (só os itens visíveis são desenhados); a direita mostra o SVG, o Unicode/codepoint e permite copiar ou aplicar a biblioteca ao estilo atual. |
| **Tokens** | Referência visual das variáveis `--k-*` do estilo ativo, separadas por categoria. No rodapé há uma nota não editável com as regras universais de layout e os parâmetros técnicos por estilo. |

O rodapé exibe os contadores de estilos, componentes, padrões, ícones, fontes, emojis, texturas e fundos. A lista cresce conforme novos itens são adicionados ao acervo.

As abas são separadas em dois grupos no cabeçalho:

- **Assets** — Estilos, Ícones, Fontes, Emojis, Texturas e Fundos. Servem para consultar o acervo, selecionar um item e preparar estilos e ativos para importação e exportação.
- **Consulta e teste** — Componentes, Padrões e Tokens. Servem para testar e inspecionar o que será exportado; não são acervos independentes.

## Acervo local

Cada categoria tem sua própria pasta dentro de `tabs_n_buttons/`. O projeto não depende de URLs externas:

- `tabs_n_buttons/estilos/` — estilos, escalas e a aplicação de importação da aba;
- `tabs_n_buttons/componentes/padroes/` — componentes e o CSS do kit;
- `tabs_n_buttons/padroes/padroes/` — telas compostas a partir dos componentes;
- `tabs_n_buttons/icones/` — `icons-data.js` (catálogo) e `padroes/` com um `.svg` por ícone;
- `tabs_n_buttons/fontes/` — `fonts.css`, `fonts.js` e `padroes/` com os arquivos `.woff2`;
- `tabs_n_buttons/emojis/` — `bibliotecas.js` (catálogo), `LICENCAS.md` e 9 pastas com 24.400 SVGs, cada uma com `README.md` e `unicode-map.json`; `padroes/emojis.js` adapta o catálogo ao núcleo;
- `tabs_n_buttons/texturas/padroes/` — texturas do palco;
- `tabs_n_buttons/fundos/padroes/` — fundos do palco.

Os recursos da ferramenta ficam fora dos acervos: `kitui_interface/` guarda a moldura em quatro pastas — `icones/`, `fontes/`, `estilos/` e `estruturas/` — separadas dos catálogos oferecidos ao usuário; `kitui_app/` guarda o núcleo compartilhado (`core.js`) e a coordenação (`app.js`); `tabs_n_buttons/import/` guarda o extrator de estilos e `tabs_n_buttons/export/` guarda a geração do kit e o escritor ZIP.

## Como os estilos funcionam

- Um estilo é um JSON com metadados e um mapa de variáveis CSS `--k-*`. Há um arquivo por estilo em `tabs_n_buttons/estilos/padroes/` (`<id>_padrao.json`) ou `tabs_n_buttons/estilos/importados/` (`<id>_import.json`). O formato é descrito em `tabs_n_buttons/estilos/estilo.schema.json` e em `tabs_n_buttons/estilos/README.md`.
- A lista de estilos é mantida em ordem alfabética por nome, incluindo os estilos importados. A coleção atual reúne Aurora UI, Bento UI, Claymorfismo, Dark Mode / High-Contrast, Design Editorial / Tipográfico, Design Espacial, Flat 2.0, Flat Design, Fluent Design, Glassmorfismo, Lemon Crispy, Material Design, Maximalismo, Minimalismo, Neobrutalismo, Neumorfismo, Pixel Lab, Retrô / Vaporwave / Y2K, Skeuominimalismo e Skeuorfismo.
- `resolvedTokens()` combina o estilo base com os ajustes feitos em Propriedades.
- `applyTokens()` grava:
  - os tokens do **Lemon Crispy** na raiz (moldura fixa);
  - os tokens do estilo ativo apenas em `#kit` (conteúdo);
  - tokens de palco e textura no `.stage`.
- Estilos importados são gravados pelo servidor local em `tabs_n_buttons/estilos/importados/` e podem ser removidos em **Propriedades → Remover**, o que também apaga o arquivo. O `localStorage` (`kitui.styles.v1`) funciona apenas como cache de fallback se a API não responder. O fluxo e as regras para assistentes de IA estão resumidos em [`tabs_n_buttons/estilos/extracao-e-variante-inversa.md`](tabs_n_buttons/estilos/extracao-e-variante-inversa.md).
- O botão **Importar** do cabeçalho abre a janela de importação. Os seis tipos trazem o botão **Copiar prompt p/ IA**, cada um com instruções próprias para a IA. Esses comandos não aparecem mais na lista de estilos.

## Importação por tipo de ativo

O botão **Importar** fica no cabeçalho, à esquerda de **Exportar**. Ele usa o desenho de seta para cima (ícone `download` da moldura), enquanto **Exportar** usa o de seta para baixo (ícone `export`). Os ids são históricos e não seguem o nome do botão — o que vale é o desenho exibido. Ambos abrem janelas com o mesmo formato. A janela de importação tem seis tipos, selecionáveis no topo:

| Tipo | Formato aceito |
| :--- | :--- |
| **Estilos** | Objeto do extrator (`tabs_n_buttons/import/extract-style.js`), um `tokens.json` com `cssVariables` ou um mapa de `--k-*`. A importação grava `<id>_import.json` em `tabs_n_buttons/estilos/importados/`. |
| **Ícones** | `{ id, label, category, svg, aliases }` — `svg` é o conteúdo interno da tag. Scripts, eventos `on*` e `javascript:` são removidos. |
| **Fontes** | `{ id, name, stack, cat, data }` — `data` é opcional; se trouxer um data URI `font/...`, a `@font-face` é registrada na hora. |
| **Emojis** | `{ e, name, cat, keys }` — itens extras do usuário; `e` é o identificador do SVG e `name` é o nome exibido. As 9 bibliotecas locais não são importadas: vêm em `tabs_n_buttons/emojis/<biblioteca>/`. |
| **Texturas** | `{ id, name, cat, desc, tokens }` — `tokens` precisa conter `--k-texture` e pode incluir `--k-texture-size`. |
| **Fundos** | `{ id, name, desc, tone, value }` — `value` aceita cor ou gradiente CSS local; URLs externas são rejeitadas. |

Cada tipo aceita um objeto ou uma lista em `items` e tem seu próprio prompt no botão **Copiar prompt p/ IA**: estilos normalizam o JSON do extrator; ícones filtram SVGs simples e pedem confirmação; fontes e emojis organizam arquivos/caracteres entregues pelo usuário; texturas e fundos convertem CSS recebido em catálogo. Itens com o mesmo `id` são substituídos. Exceto por estilos — que gravam `<id>_import.json` em `tabs_n_buttons/estilos/importados/` pela API local —, os ativos importados ficam no `localStorage` (`kitui.assets.v1`). Eles aparecem na aba correspondente e são removidos em **Propriedades → Remover**, com confirmação; os contadores do rodapé são atualizados.

O botão **Exportar** gera um kit completo do estilo ativo, com **padrões em primeiro lugar**: o `index.html` traz as regras completas de layout, os 29 padrões (cada um com os componentes usados e compatíveis), os 39 componentes de referência, os 473 ícones e a tabela de tokens; o ZIP acrescenta `kit.css`, `tokens.json`, um README detalhado, `icons/icons.json` e um `.svg` para cada ícone. Também entram no ZIP os SVGs da biblioteca de emoji associada ao estilo em `emojis/<biblioteca>/`, o `unicode-map.json` dessa biblioteca, o `README.md` da biblioteca e `LICENCAS.md` na raiz. A biblioteca padrão é **Fluent Emoji**; a escolha é feita por estilo em **Emojis → Propriedades → Usar esta biblioteca no kit**. Cada padrão entra uma única vez — as variantes são criadas pela IA que recebe o pacote. Toda essa lógica vive em `tabs_n_buttons/export/exportar.js`, com o escritor ZIP em `zipper.js`. O coordenador apenas delega.

## Área de trabalho

O quadro é centralizado em **1280 × 600** (ou 600 × 1280 em retrato) e escalado para caber na janela, sem barras de rolagem. O palco preenche o restante da tela. Há controles flutuantes de zoom, grade, orientação e ocultação da interface.

Essas regras universais de layout e os parâmetros técnicos de cada estilo são exibidos por padrão dentro do aplicativo, como uma nota **não editável** no rodapé da caixa do visualizador de tokens (aba **Tokens**). O texto é fixo e não muda quando o estilo é trocado.

## Função e Utilidade

O Kit UI é uma ferramenta de **exploração e prototipagem** de design system. Ele é útil para:

- prototipar um tema sem escrever CSS;
- testar componentes e telas com os tokens aplicados na hora;
- usar um site como referência visual e transformar isso em tokens;
- gerar HTML, CSS, JSON ou ZIP pelo botão **Exportar** e colar o resultado em um projeto real;
- servir como biblioteca de padrões e componentes para consulta.

Não é a escolha certa se o objetivo for um design system de produção completo. Não há versionamento (o projeto não é um repositório Git), pipeline de tokens, publicação de pacote, integração com Figma nem testes automatizados. O estado fica no navegador e o estilo importado é uma aproximação do site de origem. Para produção, o material exportado deve ser integrado ao processo normal do projeto.

> a aplicação cumpre bem o papel de laboratório e gerador de material inicial, o arquivo exportado é util como insumo para projetos reais, e o resto do rigor vem do processo de engenharia do time de desenvolvimento

## Estrutura

- `index.html` — estrutura da moldura e do palco, e ordem de carregamento dos módulos.
- [`kitui_app/`](kitui_app/README.md) — `core.js` (memória e ferramentas compartilhadas, `window.KIT_CORE`) e `app.js` (coordenação: bootstrap, eventos, seletor de cor, importação e delegação às abas e à exportação).
- [`kitui_interface/`](kitui_interface/README.md) — a ferramenta em si, dividida em `icones/`, `fontes/`, `estilos/` e `estruturas/`. Nunca muda com o estilo escolhido.
- [`tabs_n_buttons/`](tabs_n_buttons/README.md) — as 9 abas, cada uma com `interface_actions.js`, `padroes/` e `importados/`.
- [`tabs_n_buttons/import/`](tabs_n_buttons/import/README.md) — `extract-style.js`, extrator executado no console do site de origem.
- [`tabs_n_buttons/export/`](tabs_n_buttons/export/README.md) — `exportar.js` (folha, HTML, CSS, tokens e ZIP) e `zipper.js` (escritor ZIP).
- `servir.js` / `servir.py` / `servir.bat` — servidor local sem dependências, com a API de estilos.
- Fora do projeto, em `Proj KitUi/`: `build-css.mjs` e `build-icons.mjs` — geram o CSS incorporado e o catálogo de ícones. Execução: `node build-css.mjs` / `node build-icons.mjs` a partir da raiz do workspace.
- Em `tabs_n_buttons/estilos/`: [`extracao-e-variante-inversa.md`](tabs_n_buttons/estilos/extracao-e-variante-inversa.md) — guia único de extração, normalização e variante inversa.

Cada uma das 37 pastas da aplicação tem um `README.md` próprio explicando o que fica nela, o que aparece na tela e como ela se liga ao resto. Os guias das abas estão linkados na [pasta `tabs_n_buttons`](tabs_n_buttons/README.md).

### Organização de importação e exportação

Cada aba tem a sua pasta e, dentro dela, a sua **interface** (`tabs_n_buttons/<aba>/interface_actions.js`). A aplicação de importação de estilos fica em `tabs_n_buttons/estilos/importar.js`; o extrator que roda no site de origem fica separado, em `tabs_n_buttons/import/extract-style.js`.

A **exportação** é global e fica em `tabs_n_buttons/export/`: o botão do cabeçalho gera um kit final com regras de layout, padrões únicos (com seus componentes usados/compatíveis), componentes de referência, o pacote de ícones e os tokens do estilo escolhido, usando `zipper.js` para montar o arquivo.

### Contrato de módulos

O desmembramento do `app.js` está concluído, sem mudança de comportamento:

- `window.KIT_CORE` — estado, storage, tokens, acervos e helpers compartilhados;
- `window.KIT_SHELL_UI` — moldura fixa, com `configure()` e `init()`;
- `window.KIT_TAB_UI` — registro das nove abas, cada uma com `panel`, `canvas` e `inspector`;
- `window.KIT_EXPORTAR` — geração de HTML, CSS, tokens, ZIP e folha de exportação, em `tabs_n_buttons/export/exportar.js`.

| Chave | Arquivo |
|---|---|
| `styles` | `tabs_n_buttons/estilos/interface_actions.js` |
| `components` | `tabs_n_buttons/componentes/interface_actions.js` |
| `patterns` | `tabs_n_buttons/padroes/interface_actions.js` |
| `icons` | `tabs_n_buttons/icones/interface_actions.js` |
| `emojis` | `tabs_n_buttons/emojis/interface_actions.js` |
| `textures` | `tabs_n_buttons/texturas/interface_actions.js` |
| `stages` | `tabs_n_buttons/fundos/interface_actions.js` |
| `tokens` | `tabs_n_buttons/tokens/interface_actions.js` |
| `fonts` | `tabs_n_buttons/fontes/interface_actions.js` |

O orquestrador só despacha para o módulo da aba ativa e para `KIT_EXPORTAR`; a moldura chama o `renderAll()` registrado por `configure()`. Assim, uma aba nova entra apenas pela pasta dela, e trocar a moldura ou a exportação não afeta o conteúdo das abas.

## Limitações

- Projeto sem repositório Git; as alterações não estão versionadas.
- Todo o estado fica no `localStorage` do navegador.
- O extrator de estilos lê apenas estilos computados acessíveis; iframes de outro domínio, canvas e WebGL não são inspecionados.
