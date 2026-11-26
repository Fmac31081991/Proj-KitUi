# `componentes/importados` — conteúdo trazido pelo usuário

## O que fica aqui

Pasta reservada para os ativos de **componentes** que você traz pelo botão **Importar** no cabeçalho.

## Estado atual

Vazia. Reservada para componentes trazidos pelo usuário. Hoje os itens importados ficam apenas no navegador (`localStorage`); nenhum arquivo é gravado aqui ainda.

## Por que a pasta existe

Todas as abas seguem o mesmo desenho: `padroes/` guarda o acervo nativo e `importados/` guarda o que vier de fora. Assim, quando um tipo passar a gravar arquivos, o lugar já está definido — sem mudar a estrutura da aplicação.

## Como se liga ao resto

Depois de importado, o item aparece na lista da aba, entra nos contadores do rodapé e pode ser incluído na exportação. Quando houver remoção disponível, ela fica em **Propriedades → Remover**.
