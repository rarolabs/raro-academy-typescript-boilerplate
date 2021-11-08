# Raro Academy Boilerplate

Boilerplate para a construção do projeto final da turma de nodejs da Raro Academy, edição 1.

## Pré-requisitos

Para rodar esta aplicação, você precisará:

- git
- nodejs. Sugiro que esteja na versão LTS
- sugiro o uso do `npm`, para controle de pacotes. Mas se preferir, o `yarn` também pode ser utilizado.
- sugiro um editor de texto que dê bom suporte ao desenvolvimento com typescript.

## Instalação

> Atenção: Antes de dar qualquer passo da instalação descrita abaixo, sugere-se visitar o arquivo package.json, e alterar as descrições de boilerplate para o seu projeto em específico. Sugere-se também, ao final desta configuração, uma revisão deste próprio readme, apropriando ele para seu projeto em específico.

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

### lint
Revisa seu código, procurando por possíveis "code smells". Caso encontre algum problema de qualidade, segundo as especificações do nosso lint, ele deverá reportar para você.

### lint:fix
Revisa seu código, procurando por possíveis "code smells". Caso encontre algum problema de qualidade, segundo as especificações do nosso lint, ele deverá reportar para você. Nesta opção de execução do lint, o script tentará corrigir todos os code smells que possam ser alterados de forma automática.

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
- typedi

A tecnologia de armazenamento de dados utilizado será o mariadb.

## Estrutura do projeto

Este projeto foi estruturado para trabalhar com as camadas `routers`, `controllers`, `services`, `clients`, `repositories` e `models`. Cada uma destas estruturas conta com uma pasta, dentro de `src`. As comunicações de todas estas camadas devem, ao máximo possível, serem feitas via interfaces, que deverão estar descritas na pasta de `@types`, nas subpastas específicas para cada estrutura (ex.: para repositories, deve-se criar uma interface em `@types/repositories`)

## Criando um novo resource
Quando você precisar criar um novo resouce (ou seja, um novo conjunto de ações para uma entidade da sua aplicação), será necessário construir todas as camadas de comunicação. Para servir de exemplo, temos um resource de `users`, que deverá consumir um repository de nosso banco de dados, e um de `enderecos`, que deverá consumir um service externo. Vamos utilizar estes dois para descrever o processo de criação de cada um deles.

> importante: Os conceitos de "Resource consumidor de repository" e "Resource consumidor de cliente" são simplificacões, admitidas para descrever melhor a estrutura proposta. Um mesmo serviço, se for necessário, poderá consumir services ou repositories diversos.

### Resource consumidor de repository

1. Criar a entidade. Para detalhes. ex.: `src/models/UserEntity.ts`
1. Criar a interface do repository. ex.: `src/@types/repositories/IUserRepository.ts`. A princípio, sugiro não se preocupar demais com as operações que a interface deve possuir. Concentre-se, por agora, na estrutura. Os métodos podem ser descritos na interface sob demanda ao repository.
1. Criar a classe concreta do repository que extenda sua interface. ex.: `src/repositories/UserRepository.ts`
1. adicionar a construção deste repository no injetor de dependências. ex.: `src/config/dependencies/createInjector.ts`
1. Criar a interface do service. ex.: `src/@types/services/IUserService.ts`
1. Criar a classe concreta do service. ex.: `src/services/UserService.ts`. Não se esqueça de declarar esta classe como um `@Service` injetável do typedi.
1. Importar esta classe no `src/config/dependencies/createInjector.ts`. Isto permitirá o projeto reconhecer que esta dependência é injetável.
1. Criar a classe de controller. ex.: `src/controllers/UserController.ts`. A princípio, esta classe não demandou injeção, então não me preocupei em criar todo o esquema de abstração dela.
1. Criar o router deste resource. Ex.: `src/routers/userRouter.ts`
1. Adicionar o novo router no arquivo de listagem de routers `src/routers/index.ts`
1. Todas as estruturas estão montadas. Já pode-se escrever as regras de negócios. Possíveis DTOs poderão ser criados em `src/@types/dto`

### Resource consumidor de client
1. Criar a interface do client. ex.: `src/@types/clients/IEnderecoClient.ts`. A princípio, sugiro não se preocupar demais com as operações que a interface deve possuir. Concentre-se, por agora, na estrutura. Os métodos podem ser descritos na interface sob demanda ao client.
1. Criar a classe concreta do client que extenda sua interface. ex.: `src/clients/EnderecoClient.ts`. Não se esqueça de declarar esta classe como um `@Service` injetável do typedi.
1. Importar esta classe no `src/config/dependencies/createInjector.ts`. Isto permitirá o projeto reconhecer que esta dependência é injetável.
1. Criar a interface do service. ex.: `src/@types/services/IEnderecoService.ts`
1. Criar a classe concreta do service. ex.: `src/services/EnderecoService.ts`. Não se esqueça de declarar esta classe como um `@Service` injetável do typedi.
1. Importar esta classe no `src/config/dependencies/createInjector.ts`. Isto permitirá o projeto reconhecer que esta dependência é injetável.
1. Criar a classe de controller. ex.: `src/controllers/EnderecoController.ts`. A princípio, esta classe não demandou injeção, então não me preocupei em criar todo o esquema de abstração dela.
1. Criar o router deste resource. Ex.: `src/routers/enderecoRouter.ts`
1. Adicionar o novo router no arquivo de listagem de routers `src/routers/index.ts`
1. Todas as estruturas estão montadas. Já pode-se escrever as regras de negócios. Possíveis DTOs poderão ser criados em `src/@types/dto`

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
