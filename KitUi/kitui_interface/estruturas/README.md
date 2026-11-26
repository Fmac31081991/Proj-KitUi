# `kitui_interface/estruturas` — ações da moldura

## O que fica aqui

| Arquivo | Papel |
| :--- | :--- |
| `interface_actions.js` | Monta e controla a parte fixa da tela: cabeçalho, trilha de abas, rodapé, painel, canvas e inspetor. |

## O que ele faz

- cria os elementos da moldura e preenche os contadores do rodapé;
- aplica as cores fixas da ferramenta;
- cuida do seletor de cor flutuante e das janelas flutuantes (“Interface de sistema” e “Interface de ajustes”);
- registra cliques, digitação, teclas, redimensionamento e rolagem;
- troca de aba, de estilo, de zoom, de orientação e a exibição da grade.

## Contrato

O arquivo expõe `window.KIT_SHELL_UI` com duas funções:

| Função | Para que serve |
| :--- | :--- |
| `configure(handlers)` | Recebe do coordenador as funções que deve chamar quando algo acontece. |
| `init()` | Monta a moldura e começa a escutar os eventos. |

O coordenador chama `configure()` **antes** de `init()`. Se chamar só `init()`, a moldura não tem as funções para avisar de volta e a aplicação quebra.

## Rodapé e zoom

O rodapé mostra os contadores do acervo à esquerda e `ver.2026.11.21` à direita. O nome do estilo, `1280 × 600` e `8pt grid` saíram dessa área.

O zoom começa em **100%** (`DEFAULTS.zoom`) no modo paisagem. No retrato, `init()` e `toggleOrient()` forçam **80%**: a aplicação abre em 80% quando a sessão estava em retrato e entrar nesse modo também ajusta para 80%. O botão central `#resetZoom` restaura 80% em retrato e 100% em paisagem; seu texto e acessibilidade acompanham o valor em uso.
