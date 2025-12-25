# Gestão de filmes e séries

## Autoras
- [Juliana Girotto Leite](https://github.com/jjgirotto)
- [Aisha Jua](https://github.com/aishinha)

## Sobre
O projeto consiste em uma aplicação web para a gestão e catálogo de Filmes e Séries. A aplicação é construída com Node.js, utilizando o framework Express.js para a criação de uma API REST robusta, e utiliza MySQL para o gerenciamento de banco de dados relacional. As funcionalidades principais do sistema incluem a autenticação segura de utilizadores, gestão completa de acervo (filmes, séries, atores, diretores e géneros) e a criação de listas personalizadas e favoritos. A aplicação também integra um sistema de Reviews e Classificações, além de consumir a API externa do TMDB para importação e enriquecimento dos dados.

## Modelagem Entidade Relacional
![Modelagem Entidade Relacional](/docs/mer.png)

## Tecnologias utilizadas
- **Node.js**: Um ambiente de execução JavaScript construído sobre o motor V8 do Chrome, utilizado para o desenvolvimento do backend escalável e performático.
- **Express.js**: Um framework web minimalista e flexível para Node.js, utilizado para estruturar a arquitetura API REST, gerir rotas, requisições e middlewares.
- **MySQL**: Sistema de gerenciamento de banco de dados relacional amplamente utilizado para armazenar e gerenciar dados em aplicações web.
- **JWT (JSON Web Tokens)**: Padrão aberto utilizado para criar tokens de acesso que permitem a autenticação segura e stateless dos utilizadores.
- **Bcrypt**: Biblioteca utilizada para o hashing seguro de senhas, garantindo a proteção das credenciais dos utilizadores na base de dados.
- **HTML**: Linguagem de marcação utilizada para estruturar o conteúdo da web, permitindo a criação de páginas e componentes de interface de usuário.
- **TMDB API**: Serviço externo consumido pela aplicação para importar e enriquecer a base de dados com informações reais sobre filmes, séries, atores e géneros.

**IDE: Visual Studio Code**

## Requisitos

Para utilizar o projeto na sua máquina, é necessário ter as seguintes ferramentas instaladas e configuradas:

- Node.js (recomenda-se a versão LTS mais recente)
- npm (gerenciador de pacotes, normalmente incluído com o Node.js)
- MySQL (Servidor de Banco de Dados)
- MySQL Workbench (ou outro cliente SQL para importar o script)

## Guia de instalação

Siga os passos abaixo para baixar, configurar e executar o projeto no seu ambiente:
1. Clone o repositório:
```bash
git clone https://github.com/jjgirotto/projeto_peids.git
cd projeto_peids
npm install
```
2. Configure o arquivo .env: Crie um arquivo chamado .env na raiz do projeto (pode duplicar o .env.example se existir) e configure as credenciais do seu banco de dados e a chave de segurança:
```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=gestao-filmes-series
PORT=8080
JWT_SECRET=coloque_aqui_uma_frase_secreta_e_segura
TMDB_API_KEY=tua_chave_aqui_do_site_tmdb
TMDB_BASE_URL=https://api.themoviedb.org/3
```
3. Configuração do Banco de Dados: Este projeto não utiliza migrações automáticas. Foi gerado um script SQL completo para configurar a estrutura e os dados iniciais.
- Localize o arquivo script.sql que se encontra na pasta docs deste projeto.
[script.sql](https://github.com/jjgirotto/projeto_peids/blob/main/docs/script.sql)
- Abra o seu cliente MySQL (ex: MySQL Workbench).
- Execute o script completo. Ele irá criar o banco gestao-filmes-series, as tabelas necessárias e inserir dados de teste (filmes, géneros, utilizadores).

1. Execute o servidor: Para iniciar o servidor:
```bash
node index.js
```
Ao executar o servidor, a API estará disponível no link: http://localhost:8080 (ou na porta definida no seu .env).
A aplicação possui uma interface web completa (Frontoffice e Backoffice). Não é necessário utilizar ferramentas externas como o Postman para o uso regular.

## Consumo
1. Login (Backoffice): Para acessar as funcionalidades de gestão (criar/editar/remover filmes), crie um novo utilizador na interface de registo.
2. Realize o login.
3. Funcionalidades Disponíveis na Interface:
- Visualizar catálogo de Filmes e Séries.
- Pesquisar e filtrar conteúdos.
- Criar conta e fazer Login.
- Adicionar filmes aos Favoritos e Listas Personalizadas.
- Escrever e visualizar Reviews.
- Gerir o acervo de filmes, gêneros, atores e diretores.

## Endpoints

| Categoria |Método HTTP| Endpoint        | Ação                       | Autenticação |
|-----------|-----------|-----------------|----------------------------|--------------|

