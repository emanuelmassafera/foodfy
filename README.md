<h1 align="center">
    <img alt="Chef" src="./public/assets/chef.png" width="150px" />
</h1>

<h1 align="center">Foodfy</h1>

<p align="center">🍴 Site de receitas chamado Foodfy 🍴</p>

<h4 align="center">🚧   Em construção 🚀 🚧</h4>

---

Tabela de conteúdos
=================
<!--ts-->
   * [Sobre o projeto](#-sobre-o-projeto)
   * [Tecnologias](#-tecnologias)
   * [Funcionalidades](#-funcionalidades)
   * [Layout](#-layout)
   * [Como executar o projeto](#-como-executar-o-projeto)
   * [Autor](#-autor)
   * [Licença](#-licenca)
<!--te-->

---

## Sobre o projeto <a name="-sobre-o-projeto" style="text-decoration:none"></a>

Foodfy é um site de receitas completo, que conta com parte de visita ao público e parte administrativa. Nele é possível cadastrar usuários, chefs e, claro, receitas! Foi desenvolvido com JavaScript em toda stack e utiliza o banco de dados relacional PostgreSQL. O escopo e as orientações para realização deste projeto são do Bootcamp LaunchBase, da Rocketseat.

---

## Tecnologias <a name="-tecnologias" style="text-decoration:none"></a>

- **[NodeJS](https://nodejs.org/en/)**
- **[Express](https://expressjs.com/)**
- **[Express Session](https://github.com/expressjs/session)**
- **[Method Override](https://github.com/expressjs/method-override)**
- **[Multer](https://github.com/expressjs/multer)**
- **[PG](https://github.com/brianc/node-postgres/tree/master/packages/pg)**
- **[Connect PG Simple](https://www.npmjs.com/package/connect-pg-simple)**
- **[Bcrypt](https://github.com/dcodeIO/bcrypt.js)**
- **[Nodemailer](https://nodemailer.com/about/)**
- **[Nunjucks](https://github.com/mozilla/nunjucks)**

---

## Funcionalidades <a name="-funcionalidades" style="text-decoration:none"></a>

- [x] Controle de sessão (login e logout)
- [x] Cadastro de usuários
- [x] Edição de usuários
- [x] Remoção de usuários
- [x] Listagem de usuários
- [x] Recuperação de senha
- [x] Cadastro de chefs
- [x] Edição de chefs
- [x] Remoção de chefs
- [x] Listagem de chefs
- [x] Cadastro de receitas
- [x] Edição de receitas
- [x] Remoção de receitas
- [x] Listagem de receitas
- [x] Pesquisa de receitas

---

## Layout <a name="-layout" style="text-decoration:none"></a>

### Seção de acesso público

<h1 align="center">
    <img alt="Gif" src="./public/assets/publicSection.gif" width="800px" />
</h1>

### Seção de acesso privado

<h1 align="center">
    <img alt="Gif Responsividade" src="./public/assets/privateSection.gif" width="800px" />
</h1>

---

## Como executar o projeto <a name="-como-executar-o-projeto" style="text-decoration:none"></a>

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com) e [Node.js](https://nodejs.org/en/). Para trabalhar com o código, é recomendável o uso de um bom editor, como o [VSCode](https://code.visualstudio.com/).

### O primeiro passo é clonar este repositório

#### Clonando o repositório

```bash

# Clone este repositório
$ git clone https://github.com/emanuelmassafera/foodfy.git

# Acesse a pasta do projeto pelo terminal/cmd
$ cd foodfy

# Instale as dependências
$ npm install

```

### O passo seguinte é configurar o banco de dados

#### Configurando o banco de dados

Instale em seu computador o [PostgreSQL](https://www.postgresql.org/download/). Finalizando a instalação, ligue-o. 

No Windows, o processo para ligá-lo segue os seguintes passos:

```bash

# Abra o Powershell como administrador, e navegue até a pasta de instalação
$ cd "C:\Program Files\PostgreSQL\12\bin\"

# Inicie o postgres com o comando abaixo
$ .\pg_ctl.exe -D "C:\Program Files\PostgreSQL\12\data" start

# Após o uso, o camando para desligá-lo é
$ .\pg_ctl.exe -D "C:\Program Files\PostgreSQL\12\data" stop

```

Depois de ligar o PostgreSQL, acesse o pgAdmin (o programa é instalado junto com o postgres) e crie um banco de dados com o nome de foodfy. Feito isso, clique na opção Restore do banco e carregue o arquivo [foodfy.sql](https://github.com/emanuelmassafera/foodfy/blob/master/src/foodfy.sql) presente neste respositório. Você pode checar se o banco foi restaurado verificando suas tabelas. Se tudo deu certo até aqui, o seu banco de dados já está criado. Caso queira, acesse o arquivo [pgAdmin.md](https://github.com/emanuelmassafera/foodfy/blob/master/pgAdmin.md) para ver as imagens destes passos.

#### Observações

Pode ser que durante este processo de configuração do banco de dados uma senha do postgres seja pedida. Em alguns casos a senha padrão é *admin*.

### Por fim, o último passo é configurar o Mailtrap

O Mailtrap será responsável por simular uma caixa de e-mails para as funcionalidade de criar um usuário e de recuperar a senha. 

#### Configurando o Mailtrap

Entre no site do [Mailtrap](https://mailtrap.io/) e faça seu cadastro. Quando já estiver cadastrado, acesse a aba Inboxes, crie uma nova inbox com o nome de foodfy, entre no seção SMTP Settings e mude Integrations para Nodemailer. Agora copie o código gerado, cole no arquivo [mailer.js](https://github.com/emanuelmassafera/foodfy/blob/master/src/lib/mailer.js) e faça algumas pequenas alterações para que fique semelhante a este:

```javascript

const nodemailer = require("nodemailer");

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "64c928ef98456a",
        pass: "b296d458814028"
    }
});

```

É importante que o código preenchido no aquivo mailer.js seja o gerado em sua conta do Mailtrap, caso contrário você não receberá os e-mails corretamente.

### Executar o projeto.

Finalizando todos os passos descritos acima com sucesso, agora podemos executar o projeto.

#### Executando o projeto

```bash

# Acesse a pasta do projeto pelo terminal/cmd
$ cd foodfy

# Execute a aplicação
$ npm start

# O servidor inciará na porta:3000 - acesse http://localhost:3000

```

#### Observações

Ao acessar *localhost:3000* você estará na seção pública do foodfy. Para ter acesso ao setor administrativo entre em *localhost:3000/admin*. O administrador padrão do sitema tem o email *admin@admin.com* e senha *admin*.

---

## Autor <a name="-autor" style="text-decoration:none"></a>

<img style="border-radius: 50%;" src="https://avatars1.githubusercontent.com/u/65625500?s=460&u=eb9e300de61698fc8531949a451ce2f0e9da46f9&v=4" width="100px;" alt=""/>
<sub>Emanuel Massafera</sub>

<b></b>

[![Badge](https://img.shields.io/static/v1?label=&message=Emanuel&color=blue&style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/emanuelmassafera/)](https://www.linkedin.com/in/emanuelmassafera/) [![Badge](https://img.shields.io/static/v1?label=&message=emanuel301@live.com&color=0078D4&style=flat-square&logo=Microsoft-Outlook&logoColor=white&link=mailto:emanuel301@live.com)](mailto:emanuel301@live.com)

---

## Licença <a name="-licenca" style="text-decoration:none"></a>

Esse repositório está licenciado pela **MIT LICENSE**. Para informações detalhadas, leia o arquivo [LICENSE](https://github.com/emanuelmassafera/rick-and-morty-tracker/blob/master/LICENSE). 

Made with ♥ by Emanuel Massafera :wave: [Get in touch!](https://www.linkedin.com/in/emanuelmassafera/)
