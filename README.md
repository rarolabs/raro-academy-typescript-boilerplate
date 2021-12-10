# Bolão Brasileirao

Este projeto é o resultado dos estudos da nossa turma da Raro Academy, edição 1 de nodejs. Ele implementa a API do bolão do campeonato brasileiro, disputa tradicional da Raro, que movimenta toda a torcida dos loucos por futebol.

## tabela de conteúdos

- [Bolão Brasileirao](#bol-o-brasileirao)
  * [Pré-requisitos](#pr--requisitos)
  * [Instalação](#instala--o)
  * [Comandos](#comandos)
    + [build](#build)
    + [start](#start)
    + [dev](#dev)
    + [test](#test)
    + [typeorm](#typeorm)
  * [Pacotes](#pacotes)
  * [Roadmap](#roadmap)
  * [Contributing](#contributing)
  * [License](#license)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>


## Pré-requisitos

Para rodar esta aplicação, você precisará:

- git
- nodejs. Sugiro que esteja na versão LTS
- sugiro o uso do `npm`, para controle de pacotes. Mas se preferir, o `yarn` também pode ser utilizado.
- sugiro um editor de texto que dê bom suporte ao desenvolvimento com typescript.

## Instalação

Os comandos abaixo descrevem a instalação básica do repositório. Se preferir, você pode adotar o clone via https, renomear a pasta raiz, ou o uso do `yarn`, conforme descrito acima.

```bash
git clone git@github.com:rarolabs/raro-academy-bolao-brasileirao.git
cd raro-academy-bolao-brasileirao
cp .env.example .env
# neste ponto, sugere-se preencher seu novo arquivo .env com as configurações do seu projeto
npm install
```

Atenção ao quarto comando da lista de comandos acima. Nele, você está criando seu arquivo de variáveis de ambiente. Preencha todas as variáveis com os dados adequados. Para os campos de `secret`, sugiro:
- o campo `SECRET`, preencha com uma chave aleatória bem grande. Sugiro uma chave com 256 caracteres, gerada em sites como [este](https://passwordsgenerator.net/).
- o campo `AUTH_SECRET`, preencha com uma chave aleatória. Sugiro uma chave com 64 caracteres, gerada da mesma forma que a chave anterior.
> Muita atenção com este arquivo, pois ele não deverá ser versionado, pois ele possui informações sensíveis do projeto.

## Comandos

### build
Comando para criação do bundle de produção. Este pacote será produzido na pasta `/dist`, na raiz deste projeto.

```bash
npm run build
```

### start
Comando utilizado para iniciar o projeto resultante do `build`. Ou seja, este deverá executar a aplicação em modo produção. **Importante notar que ele somente executa o bundle produzido pelo build. A atualização deste pacote requer que o comando de build seja executado.**

```bash
npm start
```

### dev
Comando utilizado para iniciar o projeto em modo de desenvolvimento

```bash
npm run dev
```

### test
Executa os testes de unidade do projeto. Existem três variações do comando, conforme descritas abaixo:

```bash
# Executa em modo single run, sem análise de cobertura
npm test

# executa em modo "live", acompanhando as mudanças do código. Muito útil em modo de desenvolvimento
npm run test:watch

# executa em modo "cobertura". Executa apenas uma vez, e gera um relatório de cobertura em testes de unidade do seu projeto
npm run test:coverage
```

### typeorm
Este comando é um atalho para o typeorm, que está instalado localmente, neste projeto. Como estamos usando o typeorm em projeto typescript, é necessário criar uma configuração de ambiente, conforme descrito [aqui](https://stackoverflow.com/a/61119284/3135441). Todos os comandos relativos ao typeorm deverão ser chamados com este atalho, e os modificadores do typeorm precedidos com `--`.
Ex.:

```bash
npm run typeorm -- migration:generate -n CreateManyCampeonatosToManyUsuarios
npm run typeorm -- migration:run
```

## Pacotes
Os principais pacotes utilizados nesse projeto são:
- typescript
- axios
- dotenv
- jsonwebtoken
- typeorm

A tecnologia de armazenamento de dados utilizado será o mariadb.

## Roadmap
- [ ] Criação de usuários
- [ ] Integração de campeonatos
- [ ] Criação de apostas
- [ ] Ranking dos apostadores

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)