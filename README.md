# zellomobile

## Dependencies
```
paulooliver2/zello (api)
nodejs
npm
@ionic\cli

```
## Install libs
```
npm install
```

## Starter serve
```
ionic serve -l
```
## Formato das mensagens de commit ↗️

Nós temos regras muito precisas sobre a forma como são nossas mensagens de commit no git, pode ser formatado. Isto leva a mensagens mais legíveis que são fáceis de seguir quando se olha através do histórico do projeto.

`tipo(escopo): motivo`

#### Tipo
Devem ser:

* **fix**: Correção de BUG
* **feat**: Novo recurso
* **docs**: Somente mudança na documentação
* **style**: Mudanças que não afetam o código (formatação, faltando ponto e vírgula, espaço em branco, etc)
* **refactor**: Melhorias de código
* **perf**: Alteração que melhora desempenho
* **test**: Adição de testes
* **chore**: Mudanças no processo de build, atualização de bibliotecas ...

#### Escopo
Lugar(componente, classe ...) onde a mudança é realizada. Por exemplo `jspdf`, `saldo`, etc...

#### Motivo
O motivo deve ser claro e sucinto

* não capitalizar a letra
* não adicionar ponto final

---

