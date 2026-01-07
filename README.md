# MANUAL TÉCNICO

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
- Ao executar o servidor, a API estará disponível no link: http://localhost:8080 (ou na porta definida no seu .env).
- A aplicação possui uma interface web (Frontoffice e Backoffice). Não é necessário utilizar ferramentas externas como o Postman para o uso regular. Porém, algumas funcionalidades estão disponíveis apenas no backoffice na API.
- Neste repositório há uma coleção para ser importada no Postman que contém todos os endpoints preparados para serem acedidos, aqui: [coleção](https://github.com/jjgirotto/projeto_peids/blob/main/docs/filmes-séries.postman_collection.json)

## Consumo
1. Login (Backoffice): Para acessar as funcionalidades de gestão (criar/editar/remover filmes), crie um novo utilizador na interface de registo.
2. Realize o login.
3. Funcionalidades Disponíveis na Interface:
- Visualizar catálogo de filmes e séries;
- Pesquisar e filtrar conteúdos;
- Importar filmes e séries da API do TMDB;
- Criar conta, editar dados da conta;
- Login e logout;
- Adicionar e remover filmes/séries de favoritos e listas personalizadas;
- Escrever, visualizar reviews e votar como útil;
- Gerir o acervo de filmes, gêneros, atores e diretores;

## Endpoints

URL = localhost:8080/api/{endpoint}

| Categoria |Método HTTP| Endpoint        | Ação                       | Autenticação | Interface | 
|-------|---------------|----------------|----------------------------|--------------|------------|
|Utilizadores|GET|utilizadores|Busca todos os utilizadores|Sim|Não|
|Utilizadores|GET|utilizadores/{id}|Busca utilizador por id|Sim|Não|
|Utilizadores|POST|utilizadores|Cria novo utilizador|Não|Sim|
|Utilizadores|POST|utilizadores/login|Login|Não|Sim|
|Utilizadores|PUT|utilizadores/{id}|Edita utilizador por id|Sim|Sim|
|Utilizadores|PUT|utilizadores/alterarSenha/{id}|Altera senha|Sim|Sim|
|Utilizadores|DELETE|utilizadores/{id}|Remove utilizador por id|Sim|Não|
|API TMDB|GET|tmdb/search?query={filme/serie}&tipo={tipo}|Pesquisa filme/série na API|Sim|Sim|
|API TMDB|POST|tmdb/import|Importa filme/série no banco de dados|Sim|Sim|
|Géneros|GET|generos|Busca todos os géneros|Não|Sim|
|Géneros|GET|generos/{id}|Busca utilizador por id|Sim|Não|
|Géneros|POST|generos|Cria novo género|Sim|Sim|
|Géneros|PUT|generos/{id}|Edita género por id|Sim|Sim|
|Géneros|DELETE|generos/{id}|Remove género por id|Sim|Sim|
|Diretores|GET|diretores|Busca todos os diretores|Não|Sim|
|Diretores|GET|diretores/{id}|Busca diretor por id|Sim|Não|
|Diretores|POST|diretores|Cria novo diretor|Sim|Sim|
|Diretores|PUT|diretores/{id}|Edita diretor por id|Sim|Sim|
|Diretores|DELETE|diretores/{id}|Remove diretor por id|Sim|Sim|
|Atores|GET|atores|Busca todos os atores|Não|Sim|
|Atores|GET|atores/{id}|Busca ator por id|Sim|Não|
|Atores|POST|atores|Cria novo ator|Sim|Sim|
|Atores|PUT|atores/{id}|Edita ator por id|Sim|Sim|
|Atores|DELETE|atores/{id}|Remove ator por id|Sim|Sim|
|Filmes/Séries|GET|filmes-series|Busca todos os filmes/séries|Não|Sim|
|Filmes/Séries|GET|filmes-series/filmes|Busca todos os filmes|Não|Sim|
|Filmes/Séries|GET|filmes-series/series|Busca todos as séries|Não|Sim|
|Filmes/Séries|GET|filmes-series/titulo/{titulo}|Busca filme/série por título|Não|Sim|
|Filmes/Séries|GET|filmes-series/{id}|Busca filme/série por id|Não|Sim|
|Filmes/Séries|POST|filmes-series|Cria novo filme/série|Sim|Sim|
|Filmes/Séries|PUT|filmes-series/{id}|Edita filme/série por id|Sim|Sim|
|Filmes/Séries|DELETE|filmes-series/{id}|Remove filme/série por id|Sim|Sim|
|Filmes/Séries|POST|filmes-series/{id}/generos|Adiciona género ao filme/série por id|Sim|Sim|
|Filmes/Séries|DELETE|filmes-series/{id}/generos/{id_genero}|Remove género do filme/série por id|Sim|Sim|
|Filmes/Séries|POST|filmes-series/{id}/atores|Adiciona ator ao filme/série por id|Sim|Sim|
|Filmes/Séries|DELETE|filmes-series/{id}/atores/{id_ator}|Remove ator do filme/série por id|Sim|Sim|
|Favoritos|GET|favoritos|Busca favoritos do utilizador autenticado|Sim|Sim|
|Favoritos|POST|favoritos|Adiciona filme/série aos favoritos do utilizador autenticado|Sim|Sim|
|Favoritos|DELETE|favoritos/{id_filme}|Remove filme/série dos favoritos do utilizador autenticado por id do filme|Sim|Sim|
|Listas|GET|listas|Busca lista do utilizador autenticado|Sim|Sim|
|Listas|POST|listas|Adiciona filme/série à lista do utilizador autenticado|Sim|Sim|
|Listas|DELETE|listas/{id_filme}|Remove filme/série da lista do utilizador autenticado por id do filme|Sim|Sim|
|Reviews|GET|reviews|Busca todas as reviews|Não|Não|
|Reviews|GET|reviews/{id}|Busca ator por id|Não|Não|
|Reviews|GET|reviews/filmeserie/{idfilmeserie}|Busca review por id do filme/série|Não|Sim|
|Reviews|POST|reviews|Cria nova review|Sim|Sim|
|Reviews|PUT|reviews/{id}|Edita review por id|Sim|Não|
|Reviews|DELETE|reviews/{id}|Remove review por id|Sim|Não|
|Reviews|POST|reviews/{id}/votar|Votar review|Sim|Sim|






