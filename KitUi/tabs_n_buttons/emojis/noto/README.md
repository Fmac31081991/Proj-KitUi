# Biblioteca Noto Emoji (`noto`)

Detalhada e literal; aparência Android/Chrome.

| Dado | Valor |
| :--- | :--- |
| Identificador | `noto` |
| Autor / mantenedor | Google Inc. |
| Licença | [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0) |
| Obrigação | Preservar o aviso de direitos autorais e o texto da licença; crédito visível não é exigido. |
| Arquivos SVG | 3729 |
| Página de origem | https://allsvgicons.com/pack/noto/ |
| CDN dos SVGs | `https://i.allsvgicons.com/noto/<nome>.svg` |

## Como usar no Kit UI

1. Aba **Emojis** → selecione **Noto Emoji** na lista à esquerda.
2. Escolha um emoji na caixa central (as 8 categorias aparecem agrupadas).
3. Use o botão **Usar esta biblioteca no kit** no inspetor à direita para associar esta biblioteca ao estilo atual. Por padrão, todos os estilos usam **Fluent Emoji**.
4. Ao exportar, o `kit.zip` leva os SVGs em `emojis/noto/` e o arquivo `LICENCAS.md` na raiz.

Fora do Kit UI, basta referenciar o SVG:

```html
<img src="emojis/noto/grinning-face.svg" width="32" height="32" alt="Emoji">
```

## Mapeamento SVG → Unicode

Arquivos SVG não carregam o Unicode do emoji que representam. O arquivo **`unicode-map.json`** desta pasta é o marcador técnico: para cada `nome.svg` ele registra o código hexadecimal, o caractere Unicode e a categoria no formato:

```json
"grinning-face": { "hex": "1F600", "unicode": "😀", "categoria": "Rostos e Emoções" }
```

Origem do mapeamento: índice oficial `/emoji-map.json` do All SVG Icons (quando disponível), `FirefoxEmoji.json` do projeto Mozilla, e os datasets `emojibase-data` / `iamcal emoji-data` para aliases e categorias. Nenhum dos 24.400 arquivos ficou sem mapeamento.

## Licença e crédito

Apache 2.0 — Google Inc.. Texto completo e condições em https://www.apache.org/licenses/LICENSE-2.0. Preservar o aviso de direitos autorais e o texto da licença; crédito visível não é exigido.

O Kit UI não altera os SVGs; apenas os distribui. Se você modificar os arquivos, registre a alteração conforme exigido pela licença acima.
