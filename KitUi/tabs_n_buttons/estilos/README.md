# Pasta `tabs_n_buttons/estilos` — funcionamento completo

Este documento descreve **exatamente** o que existe dentro de `tabs_n_buttons/estilos`, para que serve cada arquivo/pasta e como o aplicativo usa esse conteúdo desde a abertura até a importação, remoção e exportação de um estilo.

---

## 1. Visão geral

A pasta `tabs_n_buttons/estilos` é a **fonte da verdade dos estilos do Kit UI**.

A regra central é **um estilo por arquivo**. Cada arquivo é um JSON com:

- metadados (`id`, `name`, `family`, `note`, `swatch`, `font`, `radius`, `density`, `meta`);
- o mapa completo de variáveis CSS `--k-*` que aquele estilo define (`tokens`).

Não existe mais um array `STYLES` com os estilos embutidos no código, nem o arquivo `seed-styles.js`. Os estilos são lidos do disco pelo servidor local e entregues ao navegador por uma API.

A **aplicação de importação desta aba** fica em `importar.js`, dentro desta pasta. É a única aba que grava arquivos em `importados/`; as demais mantêm os itens importados no navegador. O extrator usado no site de origem fica em `tabs_n_buttons/import/` e a exportação, por ser global, fica em `tabs_n_buttons/export/`.

> **Consequência importante:** sem o servidor local (`servir.js` ou `servir.py`), os estilos padrão **não carregam**. `tokens.js` exporta `STYLES = []` e o antigo gerador de sementes foi removido. O `localStorage` continua existindo apenas como fallback para estilos importados em sessões anteriores.

---

## 2. Árvore da pasta

```
tabs_n_buttons/estilos/
├── README.md              ← este documento
├── interface_actions.js   ← painel, canvas e inspetor da aba (window.KIT_TAB_UI.styles)
├── importar.js            ← aplicação de importação da aba Estilos
├── estilo.schema.json     ← contrato formal do JSON de estilo
├── tokens.js              ← modelo base exportado em window.KIT_TOKENS
├── padroes/               ← 20 estilos nativos (somente leitura pelo app)
│   ├── aurora_padrao.json
│   ├── bento_padrao.json
│   ├── ...
│   ├── matrix-skylines_padrao.json
│   └── spatial_padrao.json
└── importados/            ← estilos criados pelo botão Importar (vazio no estado atual)
    └── <id>_import.json
```

| Entrada | Tipo | Papel |
| :--- | :--- | :--- |
| `README.md` | arquivo | Documentação da pasta (você está lendo). |
| `interface_actions.js` | arquivo JS | Interface da aba: registra `panel`, `canvas` e `inspector` em `window.KIT_TAB_UI.styles`. |
| `importar.js` | arquivo JS | Aplicação de importação: prompt, dicas, normalização e gravação dos estilos. |
| `estilo.schema.json` | arquivo | Define os campos obrigatórios, os tipos e os limites do JSON de estilo. |
| `tokens.js` | arquivo JS | Modelo base de tokens, escalas e papéis de cor; não contém mais os estilos. |
| `padroes/` | pasta | Estilos que acompanham o aplicativo. Nomes terminam em `_padrao.json`. |
| `importados/` | pasta | Estilos importados pelo usuário. Nomes terminam em `_import.json`. |

A nomenclatura é `<id>_padrao.json` ou `<id>_import.json`, onde `<id>` é o slug do estilo: minúsculas, sem acentos, palavras separadas por `-` (ex.: `pixel-lab`, `retro-y2k`). O mesmo `id` não deve existir nas duas pastas ao mesmo tempo.

---

## 3. Arquivos da raiz

### 3.1 `tokens.js`

Carregado por `index.html` **antes** de `kitui_app/app.js`. Envolve tudo em uma IIFE e expõe um único objeto global:

```js
window.KIT_TOKENS = {
  BASE,          // mapa com todos os tokens --k-* padrão
  STYLES,        // [] — vazio; os estilos vêm da API
  RADIUS_SETS,   // sharp | soft | round | pill
  DENSITIES,     // compact | regular | comfortable
  COLOR_ROLES,   // papéis de cor do inspetor (bg, surface, text, primary, ...)
  styleById,     // (id) => STYLES.find(...) || STYLES[0]
};
```

- `BASE`: valores neutros de partida (`--k-bg`, `--k-primary`, `--k-radius-*`, `--k-fs`, `--k-shadow-*`, etc.). É usado como camada inferior na hora de resolver os tokens efetivos.
- `STYLES`: declarado como `const STYLES = [];`. É preenchido em memória por `bootstrap()` depois que a API responde; nunca é gravado em disco.
- `RADIUS_SETS` e `DENSITIES`: escalas usadas pelo inspetor e por `resolvedTokens()` para sobrescrever tokens de raio/densidade sem alterar o arquivo do estilo.
- `COLOR_ROLES`: lista os papéis de cor editáveis em Propriedades e o nome da variável correspondente.

### 3.2 `estilo.schema.json`

Contrato JSON Schema (draft 2020-12) do arquivo de estilo. Campos obrigatórios: `id`, `name`, `family`, `tokens`. Campos adicionais são proibidos (`additionalProperties: false`). Principais restrições:

| Campo | Regra |
| :--- | :--- |
| `id` | `^[a-z0-9-]{1,42}$` |
| `name` | texto de 1 a 48 caracteres |
| `family` | `Padrão` ou `Importado` |
| `note` | até 160 caracteres |
| `swatch` | exatamente 3 strings de até 60 caracteres |
| `font` | string de até 80 caracteres ou `null` |
| `radius` | `sharp`, `soft`, `round` ou `pill` |
| `density` | `compact`, `regular` ou `comfortable` |
| `tokens` | objeto com pelo menos uma chave `--k-*`; valores strings de até 400 caracteres |
| `meta` | `source`, `importedAt` e `elements` |

### 3.3 `README.md`

Este arquivo. Não é lido pelo aplicativo; é documentação humana.

### 3.4 `importar.js` — aplicação de importação da aba

Carregado por `index.html` depois de `tokens.js` e antes de `app.js`. Expõe `window.KIT_IMPORT_ESTILOS` e concentra tudo o que é específico da importação de estilos:

| Exportado | Papel |
| :--- | :--- |
| `id`, `label` | Identificação do módulo (`styles` / `Estilos`). |
| `hint` | `{ label, placeholder, html }` usado na janela de importação. |
| `steps` | HTML do passo a passo “Como extrair”. |
| `prompt` | Prompt copiado pelo botão **Copiar prompt p/ IA**. |
| `normalize(input, opts)` | Valida e converte o JSON; `opts.preserveId` mantém o id do arquivo. |
| `listar()` | `GET /api/estilos`. |
| `gravar(style)` | `POST /api/estilos/importados`. |
| `remover(id)` | `POST /api/estilos/importados/remover`. |
| `importar(texto, ids)` | Parse → normalização → gravação; devolve `{ ok, style, file, error }`. |

O `app.js` ficou como orquestrador: ele abre a janela, repassa o texto digitado e a lista de ids existentes, e aplica o resultado na memória. As chamadas à API de estilos saíram do `app.js`.

Esse contrato foi pensado para ser replicado: cada aba terá um `tabs_n_buttons/<aba>/importar.js` com as mesmas funções, e o `app.js` escolherá o módulo pela aba ativa.

### 3.5 `interface_actions.js` — interface da aba

Carregado por `index.html` depois de `core.js` e de `kitui_interface/estruturas/interface_actions.js`, antes de `app.js`. Expõe:

```js
window.KIT_TAB_UI.styles = { panel, canvas, inspector };
```

- `panel()` — renderiza a lista de estilos em `#panelBody`;
- `canvas()` — monta a vitrine do estilo ativo em `#kit`;
- `inspector()` — devolve o HTML de Propriedades (cores, forma, tipografia e efeitos).

O `app.js` apenas despacha para o módulo da aba ativa. Os dados vêm de `window.KIT_CORE` e a importação continua em `importar.js`.

---

## 4. Pasta `padroes/`

Contém os **37 estilos nativos**. São criados pelo projeto, não pelo usuário, e o aplicativo nunca grava nem remove arquivos dessa pasta. Todos têm `family: "Padrão"`.

| Arquivo | `id` | `name` | Qtd. de tokens |
| :--- | :--- | :--- | ---: |
| `aurora_padrao.json` | `aurora` | Aurora UI | 18 |
| `bento_padrao.json` | `bento` | Bento UI | 30 |
| `clay_padrao.json` | `clay` | Claymorfismo | 31 |
| `dark-contrast_padrao.json` | `dark-contrast` | Dark Mode / High-Contrast | 22 |
| `editorial_padrao.json` | `editorial` | Design Editorial / Tipográfico | 28 |
| `flat-2_padrao.json` | `flat-2` | Flat 2.0 | 17 |
| `flat_padrao.json` | `flat` | Flat Design | 26 |
| `fluent_padrao.json` | `fluent` | Fluent Design | 19 |
| `glass_padrao.json` | `glass` | Glassmorfismo | 35 |
| `kitui_padrao.json` | `kitui` | Lemon Crispy | 45 |
| `material_padrao.json` | `material` | Material Design | 29 |
| `matrix-skylines_padrao.json` | `matrix-skylines` | Matrix Skylines | 53 |
| `maximalism_padrao.json` | `maximalism` | Maximalismo | 21 |
| `minimalism_padrao.json` | `minimalism` | Minimalismo | 31 |
| `neobrutalism_padrao.json` | `neobrutalism` | Neobrutalismo | 43 |
| `neumorphism_padrao.json` | `neumorphism` | Neumorfismo | 29 |
| `pixel-lab_padrao.json` | `pixel-lab` | Pixel Lab | 60 |
| `retro-y2k_padrao.json` | `retro-y2k` | Retrô / Vaporwave / Y2K | 24 |
| `skeuominimalism_padrao.json` | `skeuominimalism` | Skeuominimalismo | 22 |
| `skeuomorphism_padrao.json` | `skeuomorphism` | Skeuorfismo | 21 |
| `spatial_padrao.json` | `spatial` | Design Espacial | 21 |
| `kyrb-rosa-creme_padrao.json` | `kyrb-rosa-creme` | Kyrb Rosa Creme | 20 |
| `joomlaplus-teal_padrao.json` | `joomlaplus-teal` | JoomlaPlus Teal | 16 |
| `independent-vivid_padrao.json` | `independent-vivid` | Independent Vivid | 16 |
| `flat-sage-dark_padrao.json` | `flat-sage-dark` | Flat Sage Dark | 20 |
| `khop-pastel_padrao.json` | `khop-pastel` | Khop Pastel | 20 |
| `flat-rose-clay_padrao.json` | `flat-rose-clay` | Flat Rose Clay | 16 |
| `warm-tone-amber_padrao.json` | `warm-tone-amber` | Warm Tone Amber | 16 |
| `bright-flat-ux_padrao.json` | `bright-flat-ux` | Bright Flat UX | 20 |
| `neutral-blue-sage_padrao.json` | `neutral-blue-sage` | Neutral Blue Sage | 16 |
| `flat-design-cinq_padrao.json` | `flat-design-cinq` | Flat Design Cinq | 20 |
| `happy-mom-blush_padrao.json` | `happy-mom-blush` | Happy Mom Blush | 20 |
| `purple-dress-plum_padrao.json` | `purple-dress-plum` | Purple Dress Plum | 16 |
| `phaedra-citrus_padrao.json` | `phaedra-citrus` | Phaedra Citrus | 16 |
| `ocean-sunset-dusk_padrao.json` | `ocean-sunset-dusk` | Ocean Sunset Dusk | 16 |
| `flat-ember-sand_padrao.json` | `flat-ember-sand` | Flat Ember Sand | 20 |
| `vitamin-c-pop_padrao.json` | `vitamin-c-pop` | Vitamin C Pop | 16 |

`kitui_padrao.json` é especial: além de aparecer na lista, seus tokens são usados como os **tokens fixos da moldura** (cabeçalho, rodapé, painéis). A caixa central `#kit` recebe os tokens do estilo selecionado; a moldura não muda quando você troca de estilo.

---

## 5. Pasta `importados/`

Contém os estilos criados pelo botão **Importar**. Nomes terminam em `_import.json` e `family` é `Importado`.

No estado atual a pasta está **vazia**. Durante os testes de verificação da API, os arquivos `teste-api_import.json` e `teste-py_import.json` foram criados e removidos; nada ficou para trás.

Estilos importados:

- aparecem na lista em ordem alfabética, junto dos padrões;
- podem ser selecionados e aplicados normalmente;
- podem ser removidos em **Propriedades → Remover**, o que apaga também o arquivo do disco;
- são gravados no `localStorage` apenas como cópia de fallback.

---

## 6. Formato do arquivo de estilo

Exemplo completo (trecho real de `kitui_padrao.json` reduzido):

```json
{
  "id": "kitui",
  "name": "Lemon Crispy",
  "family": "Padrão",
  "note": "Amarelo-limão sobre grafite, com cantos duros e contraste alto.",
  "swatch": ["#C6F24E", "#07080B", "#F5F7FA"],
  "font": "Inter",
  "radius": "sharp",
  "density": "regular",
  "tokens": {
    "--k-bg": "#07080B",
    "--k-surface": "#11151B",
    "--k-primary": "#C6F24E",
    "--k-text": "#F5F7FA"
  },
  "meta": {
    "source": "",
    "importedAt": "",
    "elements": null
  }
}
```

### Campo a campo

| Campo | Tipo | Quem preenche | Efeito |
| :--- | :--- | :--- | :--- |
| `id` | string slug | autor do JSON / `IMP.normalize()` | Identificador único; compõe o nome do arquivo. |
| `name` | string | autor do JSON / `IMP.normalize()` | Nome exibido na lista e no toast. |
| `family` | `Padrão` / `Importado` | `IMP.normalize()` | Define se o item é removível. |
| `note` | string | autor do JSON / extração | Texto informativo do estilo. |
| `swatch` | 3 strings | autor do JSON / derivado dos tokens | As três cores mostradas na lista. |
| `font` | string ou `null` | autor do JSON / `IMP.normalize()` | ID de uma fonte do acervo (`T.FONTS`); vira `--k-font`. |
| `radius` | enum | autor do JSON / `IMP.normalize()` | Define as escalas de `--k-radius-*` quando aplicável. |
| `density` | enum | autor do JSON / `IMP.normalize()` | Define altura de controles, paddings e fonte. |
| `tokens` | objeto `--k-*` | autor do JSON / extrator | **Parte essencial**: os valores efetivos do tema. |
| `meta.source` | string | extração | URL de origem; usada para inferir o host no `note`. |
| `meta.importedAt` | string | `IMP.normalize()` / servidor | Data ISO de importação. |
| `meta.elements` | número ou `null` | extração | Quantidade de elementos lidos no site de origem. |

Se `swatch` não vier com pelo menos 3 cores, `IMP.normalize()` deriva uma paleta a partir de `--k-primary`, `--k-surface` e `--k-text`. Se `font` não corresponder a uma fonte do acervo, ele é descartado (`null`).

---

## 7. Como os arquivos viram aparência

### 7.1 Abertura (`bootstrap()`)

`kitui_app/app.js` não monta a moldura diretamente. O ponto de entrada é `bootstrap()`, que registra os callbacks em `window.KIT_SHELL_UI.configure()` e chama `window.KIT_SHELL_UI.init()`:

1. Chama `IMP.listar()` (`GET /api/estilos`), onde `IMP` é `window.KIT_IMPORT_ESTILOS`.
2. Para cada item de `padroes`, aplica `IMP.normalize(item, { preserveId: true })` e acrescenta a `T.STYLES`.
3. Para cada item de `importados`, aplica `IMP.normalize(item, { preserveId: true })`, força `family = 'Importado'`, guarda em `customStyles` e em `T.STYLES`.
4. Marca `stylesFromFiles = true` se pelo menos um estilo veio da API.
5. Se nada veio da API, tenta `loadCustomStyles()` (`localStorage`) e `seedStyles()` (que não faz nada, pois `window.KIT_SEED_STYLES` não existe mais).
6. Ordena a lista com `sortStyles()` (locale `pt-BR`, sem sensibilidade a caixa) e só então inicia a moldura, que chama o `renderAll()` do orquestrador.

O parâmetro `preserveId = true` é usado na leitura dos arquivos para **manter o `id` gravado**. Na importação manual ele não é passado, e aí entra a geração de sufixos (ver §8).

### 7.2 Resolução dos tokens (`resolvedTokens()`)

A cada renderização, os tokens efetivos são montados nesta ordem (camadas posteriores sobrescrevem as anteriores):

1. `T.BASE` — valores neutros;
2. `st.tokens` — o JSON do estilo ativo;
3. ajustes do inspetor, quando presentes: `radius`, `density`, `bw`, sombras, `blur`, `font`, `weight`, `track`, transformação em maiúsculas, textura, opacidade da textura, fundo do palco, cor do fundo e escala de fontes;
4. `overrides.colors` — cores editadas em Propriedades.

### 7.3 Aplicação (`applyTokens()`)

- **Raiz e moldura:** recebem `SHELL_TOKENS`, calculado uma única vez a partir de `T.BASE` + tokens de `kitui`. Como os estilos chegam pela API, esse cálculo é feito na primeira chamada de `applyTokens()` — depois do `bootstrap()` — para não cair no `BASE` vazio. Quaisquer `--k-*` dinâmicos deixados por chamadas anteriores são removidos.
- **Palco (`.stage`):** recebe somente `--k-stage-bg`, `--k-stage-vignette`, `--k-texture`, `--k-texture-size`, `--k-texture-opacity` e `--k-text`.
- **Caixa central (`#kit`):** recebe todos os tokens resolvidos.
- `document.body.dataset.kitStyle` recebe o `id` do estilo ativo.

### 7.4 Exportação

`tokensJSON()` gera um objeto com `name` (`<nome> — ajustado`), `base` (`id`), `generated`, `grid: 8`, seções `colors`, `shape`, `space`, `type`, `effects`, `backdrop` e o mapa completo em `cssVariables`. Esse objeto é usado pelo exportador de ZIP/HTML e é um dos formatos aceitos de volta pela importação.

---

## 8. Fluxo de importação

Ao colar um JSON e clicar em **Importar** com o tipo **Estilos** selecionado:

1. `app.js` repassa o texto digitado e a lista de ids existentes para `IMP.importar(texto, ids)`.
2. Dentro de `importar.js`, `JSON.parse()` converte o texto; JSON inválido gera erro na própria janela.
3. `normalize(data, { existingIds })` valida o objeto. Aceita `tokens`, `cssVariables` (formato do `tokens.json` exportado), um mapa plano de `--k-*`, ou as seções `colors`, `shape`, `space`, `type`, `effects`, `backdrop`.
4. Como `preserveId` **não** é passado aqui, o `id` passa por `uniqueStyleId()`: se o id já existir na lista recebida, ganha sufixo `-2`, `-3`, ... Por isso **reimportar o mesmo estilo cria um novo arquivo** (`meu-estilo-2_import.json`), em vez de sobrescrever o original.
5. `IMP.gravar(st)` envia `POST /api/estilos/importados` com o objeto normalizado.
6. O servidor sanitiza novamente o conteúdo, gera o slug do id e grava `tabs_n_buttons/estilos/importados/<id>_import.json`.
7. Se a gravação falhar, a importação é **recusada** — memória e disco não ficam divergentes. A mensagem orienta a iniciar com `servir.js` ou `servir.py`.
8. O módulo devolve `{ ok, style, file }`. O `app.js` coloca o estilo sanitizado em `customStyles` e `T.STYLES`, substituindo a entrada de mesmo id na memória, ordena a lista, aplica o estilo (`setStyle()`) e mostra o nome do arquivo no toast.
9. `saveCustomStyles()` ainda espelha a lista no `localStorage` como cache de fallback.

> O servidor é a fonte da verdade. O `localStorage` (`kitui.styles.v1`) não decide quais arquivos existem.

---

## 9. Fluxo de remoção

Somente estilos com `family: "Importado"` podem ser removidos. Em **Propriedades → Remover**:

1. `removeCustomStyle(id)` pede confirmação (“Remover o estilo ... e seu arquivo em importados?”).
2. Chama `IMP.remover(id)`, que envia `POST /api/estilos/importados/remover` com `{ "id": "..." }`.
3. O servidor apaga `importados/<id>_import.json`.
4. Se o arquivo não existir ou a API falhar, nada é removido da memória e um aviso é exibido.
5. Com sucesso, o estilo sai de `customStyles` e de `T.STYLES`. Se era o estilo ativo, o aplicativo volta para o primeiro da lista e limpa os ajustes.
6. O toast final confirma: “Estilo e arquivo removidos”.

Estilos de `padroes/` não têm o botão de remoção disponível. Para removê-los é preciso editar a pasta manualmente.

---

## 10. API local

Implementada de forma equivalente em `servir.js` (Node) e `servir.py` (Python). Ambos escutam apenas em `127.0.0.1` na porta `8080` por padrão (variável `PORT` altera a porta).

| Método | Rota | Corpo | Resposta |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/estilos` | — | `{ "padroes": [...], "importados": [...] }` |
| `POST` | `/api/estilos/importados` | objeto do estilo | `{ "ok": true, "file": "...", "style": {...} }` |
| `POST` | `/api/estilos/importados/remover` | `{ "id": "..." }` | `{ "ok": true, "file": "..." }` |

Erros retornam `{ "ok": false, "error": "..." }` com status `400` (JSON inválido / sem tokens), `404` (arquivo não encontrado) ou `500` (falha de gravação/remoção).

Do lado do navegador, essas três chamadas são feitas por `importar.js` (`listar`, `gravar` e `remover`). O servidor continua implementando as rotas em `servir.js` e `servir.py`.

### Sanitização no servidor

Aplicada tanto na leitura dos arquivos quanto no recebimento de um POST:

- **tokens:** só chaves que batem com `^--k-[a-z0-9-]+$`; valores string ou número, aparados, com até 400 caracteres. O resto é descartado.
- **textos (`name`, `note`, `family`, `source`, `font`):** `<` e `>` removidos, espaços colapsados, tamanhos limitados.
- **`swatch`:** no máximo 3 cores, cada uma com até 60 caracteres.
- **`radius` / `density`:** apenas valores enumerados; fora disso, `soft` / `regular`.
- **`family`:** padrão `Importado` quando vazio.
- **`id`:** slug — minúsculas, sem acentos, não-alfanuméricos viram `-`, no máximo 42 caracteres; fallback `estilo`.
- **`meta.importedAt`:** até 40 caracteres, ou data atual se ausente.
- ** corpo da requisição:** limite de 2 MB.

O servidor também bloqueia tentativas de sair da raiz do projeto (`path.resolve` + checagem de prefixo) ao servir arquivos estáticos.

### Inicialização

- `servir.bat` detecta Node ou Python e chama `node servir.js` ou `python servir.py`.
- `python -m http.server 8080` **não serve mais**, porque não implementa as rotas `/api/estilos`.
- `NO_OPEN=1` impede a abertura automática do navegador.

---

## 11. Persistência e limitações

| Situação | Comportamento |
| :--- | :--- |
| Arquivo alterado manualmente | É preciso recarregar a página. O `GET /api/estilos` lê os arquivos a cada requisição, então não é necessário reiniciar o servidor. |
| Sem servidor local (abrir `index.html` direto) | `STYLES` fica vazio e os estilos padrão não aparecem; só há fallback se já existirem estilos no `localStorage`. |
| Importar sem API | Recusado, com mensagem explicando que é preciso usar `servir.js`/`servir.py`. |
| Reimportar o mesmo id | Gera sufixo `-2`, `-3`, ... e um novo arquivo. |
| ids duplicados entre pastas | Na leitura, o estilo de `importados` é ignorado se o id já existir (o padrão vence). |
| Ajustes feitos em Propriedades | São `overrides` em memória/sessão; **não** são gravados de volta no JSON. Use a exportação para capturá-los. |
| Estilo padrão indesejado | Remova o arquivo `_padrao.json` manualmente e recarregue. |
| Tamanho do JSON | Limite de 2 MB por requisição. |
| Controle de versão | O projeto não é um repositório Git; alterações em arquivos não têm histórico automático. |

---

## 12. Como criar ou editar um estilo manualmente

1. Copie um JSON existente de `padroes/` ou `importados/` como base.
2. Defina `id` em minúsculas/slug e `name` com o nome de exibição.
3. Ajuste `family` conforme a pasta (`Padrão` ou `Importado`).
4. Preencha `tokens` com as variáveis `--k-*` desejadas; o que não for informado vem de `T.BASE`.
5. Ajuste `swatch` (3 cores), `font` (id válido do acervo), `radius` e `density`.
6. Valide o JSON contra `estilo.schema.json`.
7. Salve com o nome correto: `<id>_padrao.json` em `padroes/` ou `<id>_import.json` em `importados/`.
8. Recarregue a página (o servidor lê os arquivos a cada `GET /api/estilos`).

---

## 13. Solução de problemas

| Sintoma | Causa provável | Solução |
| :--- | :--- | :--- |
| Lista de estilos vazia | `index.html` aberto direto ou servidor estático simples | Usar `servir.js` ou `servir.py`. |
| “Não foi possível gravar o arquivo do estilo” | API indisponível ou corpo acima de 2 MB | Iniciar o servidor local; reduzir o JSON. |
| Arquivo importado não aparece | `id` duplicado (padrão vence) ou JSON sem tokens válidos | Renomear o `id` ou conferir as chaves `--k-*`. |
| Ao importar de novo aparece `-2` | `uniqueStyleId()` evita colisão | Comportamento esperado; remover o arquivo antigo se quiser o id original. |
| Remoção falha | Arquivo já apagado ou API fora do ar | Verificar `importados/` e reiniciar o servidor. |
| Mudança no JSON não aparece | Navegador em cache | Recarregar a página; a API usa `no-store`. |

---

## 14. Variante inversa — botão `Escuro / Claro`

Em **Propriedades → Modo** há um botão de nome fixo **Escuro / Claro**. Ele é um
`minibtn` comum, sem `minibtn--accent`: nunca muda de cor nem ganha destaque
fluorescente. O texto avisa qual variante foi ativada, mas o botão em si não muda.

O botão alterna entre o estilo original e a **versão inversa** da prévia. Ele não
grava nada: `displayTokens()` em `kitui_app/core.js` deriva os tokens na hora.

| Estilo | Direção da variante |
| :--- | :--- |
| Claro (15 estilos) | Fundos escurecem e textos clareiam |
| Escuro (5 estilos: `dark-contrast`, `kitui`, `maximalism`, `retro-y2k`, `pixel-lab`) | Fundos clareiam e textos escurecem |

Um segundo clique restaura o estilo original. A classificação é objetiva: média da
luminosidade de `--k-bg` e `--k-surface`, com limiar em `0,45`. Serve também para
estilos importados.

**Contorno de cards e linhas:** na variante, `--k-border` é recalculado a partir do
fundo já convertido com 33% de afastamento na direção oposta (`BORDER_SHIFT` em
`core.js`). Fundo escuro recebe linha 33% mais clara; fundo claro recebe linha 33%
mais escura. Isso evita que cards e linhas desapareçam quando fundo e borda são
empurrados para o mesmo extremo.

Consequências práticas:

- os arquivos `padroes/*_padrao.json` e `importados/*_import.json` não mudam;
- a exportação usa `resolvedTokens()`, então o kit ZIP continua com o estilo original;
- o estado `themeMode` fica no `localStorage` (`auto` = original, `dark` = variante escura, `light` = variante clara);
- a variante é só prévia: não vira um segundo estilo salvo nem entra no ZIP.

O guia resumido — conta de luminosidade, conversão de cores, por que a importação
traz apenas um estilo aproximado e o detalhe dos 33% — está em
[`extracao-e-variante-inversa.md`](extracao-e-variante-inversa.md).
