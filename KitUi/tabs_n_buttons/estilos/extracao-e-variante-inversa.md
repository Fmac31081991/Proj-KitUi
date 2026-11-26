# Guia resumido para extrair estilos de sites e criar a variante inversa no Kit UI

**Propósito:** transformar a aparência de um site em um estilo do Kit UI e entender a variante clara/escura criada pelo botão **Escuro / Claro**. É consulta rápida para o processo de importação; a aplicação não lê este arquivo.

## 1. Fluxo em quatro passos

1. Abra o site no Chrome, pressione `F12` → aba **Console**.
2. Cole todo o conteúdo de `KitUi/tabs_n_buttons/import/extract-style.js` e pressione `Enter`. O script imprime o JSON, tenta copiá-lo e também o guarda em `window.__kitStyle`.
3. Se a cópia falhar: `copy(JSON.stringify(window.__kitStyle, null, 2))`.
4. No Kit UI, clique em **Importar** no cabeçalho, mantenha o tipo **Estilos**, cole o JSON e clique em **Importar**. O estilo é aplicado na hora e salvo em `tabs_n_buttons/estilos/importados/`.

O script **somente lê** estilos computados: não altera a página, não envia dados e não entra em iframes de terceiros.

## 2. O que é capturado

Cores de fundo/superfície/texto/borda, cor de marca, acentos, raios, espessura da borda, densidade, espaçamentos, tipografia (família, escala, pesos, entrelinha, entreletra), sombras, blur/saturação e durações/curvas de transição — como tokens `--k-*`.

O resultado é uma **aproximação controlada**, não uma cópia do CSS do site: os componentes do Kit UI usam os tokens extraídos, não as classes originais.

## 3. Regras para normalizar o JSON

- Responda apenas JSON válido, sem markdown, comentários ou texto fora das chaves.
- Preserve **todas as chaves `--k-*` e seus valores exatamente** como vieram. Não invente cores, medidas, fontes ou sombras.
- Ajuste somente os campos descritivos:
  - `id`: slug minúsculo (letras, números e hífens), até 42 caracteres;
  - `name`: até 48 caracteres;
  - `family`: `"Importado"`;
  - `note`: uma frase objetiva sobre a aparência;
  - `swatch`: exatamente 3 cores legíveis `[primária, superfície, texto]`;
  - `font`: `null` ou um `id` existente em `tabs_n_buttons/fontes/fonts.js`;
  - `radius`: `sharp|soft|round|pill`;
  - `density`: `compact|regular|comfortable`.
- Use o domínio de `meta.source` para nomear quando o nome estiver genérico.
- Não acrescente tokens. Se faltar algo essencial, avise ao usuário em vez de inventar.
- Não inclua `meta`, URLs completas, dados pessoais nem texto da página.

A IA integrada ao navegador não lê CSS computado nem executa JavaScript na página: ela serve apenas para **revisar/normalizar** o JSON depois da extração.

## 4. Formatos aceitos no botão Importar

- objeto completo gerado por `extract-style.js`;
- `tokens.json` exportado pelo Kit UI (usa `cssVariables`);
- mapa plano de variáveis, por exemplo `{"primary": "#6750A4", "--k-bg": "#fff"}`.

Nomes repetidos recebem sufixo (`linear`, `linear-2`); tokens desconhecidos são descartados; valores ficam limitados a 400 caracteres.

## 5. Tema claro/escuro e variante inversa

O extrator lê **um tema por vez**. Para guardar os dois, rode uma vez em cada tema e importe como dois estilos. Cada importação gera **um único estilo**; a variante oposta é criada na prévia pelo botão **Escuro / Claro**, sem gravar JSON e sem entrar no ZIP.

Regra da variante inversa:

- **Classificação:** `L(cor) = (0,2126R + 0,7152G + 0,0722B) / 255`; média entre `--k-bg` e `--k-surface`; escuro se `< 0,45`, claro se `≥ 0,45`. Cor ilegível conta como `0,5`; o alfa é preservado (ex.: `#FFFFFFC7`).
- **Estados:** `themeMode` pode ser `auto` (original), `dark` (força escura) ou `light` (força clara). O botão alterna entre `auto` e o modo alvo — `dark` para estilos claros e `light` para estilos escuros — e o segundo clique restaura o original.
- **Conversão:** texto e acentos vão em uma direção, superfícies na oposta; intensidade de 88% para texto e superfícies e 30% para acentos; demais tokens ficam como estão.
- **Borda:** recalculada depois da conversão, a partir do fundo, com 33% de afastamento na direção oposta (`BORDER_SHIFT = 0,33` em `kitui_app/core.js`). A espessura continua `--k-bw`.
- **Botão:** nome fixo **Escuro / Claro**, apenas classe `minibtn`, sem `minibtn--accent`.
- **Limite da ação:** é só prévia — não grava JSON, não altera estilos padrão/importados, não muda a moldura `--u-*` nem os tamanhos `--k-fs*`; o ZIP leva o estilo original.

## 6. Limitações a comunicar ao usuário

- iframes de outro domínio, canvas, vídeo e WebGL não expõem o conteúdo interno; shadow DOM fechado não é percorrido;
- o resultado depende da viewport e do estado da página — menus fechados, modais e abas ocultas não entram na amostra;
- páginas muito grandes passam por um limite de cerca de 8.000 elementos (`meta.truncated`);
- cores `oklch()`/`display-p3` são convertidas via canvas quando o navegador suporta;
- nada é enviado a servidores: o JSON fica no console, na área de transferência e no `localStorage` do Kit UI.
