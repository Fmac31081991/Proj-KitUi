# Biblioteca Fluent Emoji Flat (`fluent-emoji-flat`)

Versão plana do Fluent Emoji, ideal para tamanhos pequenos.

| Dado | Valor |
| :--- | :--- |
| Identificador | `fluent-emoji-flat` |
| Autor / mantenedor | Microsoft Corporation |
| Licença | [MIT](https://opensource.org/licenses/MIT) |
| Obrigação | Incluir o aviso de copyright e o texto da licença MIT; crédito visível não é exigido. |
| Arquivos SVG | 3145 |
| Página de origem | https://allsvgicons.com/pack/fluent-emoji-flat/ |
| CDN dos SVGs | `https://i.allsvgicons.com/fluent-emoji-flat/<nome>.svg` |

## Como usar no Kit UI

1. Aba **Emojis** → selecione **Fluent Emoji Flat** na lista à esquerda.
2. Escolha um emoji na caixa central (as 8 categorias aparecem agrupadas).
3. Use o botão **Usar esta biblioteca no kit** no inspetor à direita para associar esta biblioteca ao estilo atual. Por padrão, todos os estilos usam **Fluent Emoji**.
4. Ao exportar, o `kit.zip` leva os SVGs em `emojis/fluent-emoji-flat/` e o arquivo `LICENCAS.md` na raiz.

Fora do Kit UI, basta referenciar o SVG:

```html
<img src="emojis/fluent-emoji-flat/grinning-face.svg" width="32" height="32" alt="Emoji">
```

## Mapeamento SVG → Unicode

Arquivos SVG não carregam o Unicode do emoji que representam. O arquivo **`unicode-map.json`** desta pasta é o marcador técnico: para cada `nome.svg` ele registra o código hexadecimal, o caractere Unicode e a categoria no formato:

```json
"grinning-face": { "hex": "1F600", "unicode": "😀", "categoria": "Rostos e Emoções" }
```

Origem do mapeamento: índice oficial `/emoji-map.json` do All SVG Icons (quando disponível), `FirefoxEmoji.json` do projeto Mozilla, e os datasets `emojibase-data` / `iamcal emoji-data` para aliases e categorias. Nenhum dos 24.400 arquivos ficou sem mapeamento.

## Licença e crédito

MIT — Microsoft Corporation. Texto completo e condições em https://opensource.org/licenses/MIT. Incluir o aviso de copyright e o texto da licença MIT; crédito visível não é exigido.

O Kit UI não altera os SVGs; apenas os distribui. Se você modificar os arquivos, registre a alteração conforme exigido pela licença acima.
