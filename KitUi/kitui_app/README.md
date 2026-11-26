# Pasta `kitui_app` — o cérebro da aplicação

Aqui ficam os dois arquivos que coordenam o Kit UI por dentro. Eles **não desenham nada na tela**: quem desenha são os módulos de cada aba (`tabs_n_buttons/<aba>/interface_actions.js`) e a moldura (`kitui_interface/`).

Pense nesta pasta como a **gerência**: ela sabe qual aba está aberta, qual estilo foi escolhido e o que fazer quando você clica.

## Arquivos

| Arquivo | Papel em palavras simples |
| :--- | :--- |
| `core.js` | A **memória e a caixa de ferramentas**. Guarda o estado (aba ativa, estilo, zoom, modo claro/escuro, grade, cores ajustadas), salva e recupera do navegador, conhece os acervos, faz contas de cor — incluindo `colorToText()` (hex com alfa), `styleIsDark()` (classificação por luminosidade) e `displayTokens()` (variante inversa da prévia) — e oferece funções usadas por todas as abas. É exposto como `window.KIT_CORE`. |
| `app.js` | O **coordenador**. Liga a aplicação quando a página abre (busca os estilos no servidor local), escuta cliques e teclas, cuida do seletor de cores, das janelinhas flutuantes, da importação e dos ajustes/remoções. Quando precisa de algo das abas ou da exportação, chama o módulo responsável. |

## O que não fica aqui

| Assunto | Onde está |
| :--- | :--- |
| Layout das 9 abas | `tabs_n_buttons/<aba>/interface_actions.js` |
| Aparência da moldura | `kitui_interface/estilos/shell.css` |
| Ações da moldura | `kitui_interface/estruturas/interface_actions.js` |
| Geração do ZIP e da folha de exportação | `tabs_n_buttons/export/exportar.js` |
| Escritor do ZIP | `tabs_n_buttons/export/zipper.js` |

## Como as partes conversam

`app.js` entrega ao módulo da moldura um conjunto de funções (clique, digitação, renderização e outras) **antes** de iniciá-la. Depois disso, a moldura avisa `app.js` quando algo muda e `app.js` repassa para a aba ativa. Com a exportação funciona igual: o coordenador só delega — abre a folha, repassa as ações e pede o código atual quando o inspetor mostra HTML/CSS.

## Ordem de carregamento

No `index.html`, `core.js` entra depois dos acervos e antes da moldura. `app.js` entra por último, depois dos 9 módulos de aba e de `exportar.js`. Essa ordem importa: cada arquivo usa o que já foi carregado.
