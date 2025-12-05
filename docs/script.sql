-- ==========================================================
-- SCRIPT MESTRE: GESTÃO DE FILMES E SÉRIES
-- Data: 03/12/2025
-- ==========================================================

-- 1. RESET E CRIAÇÃO DA BASE DE DADOS
-- ----------------------------------------------------------
DROP DATABASE IF EXISTS `gestao-filmes-series`;
CREATE DATABASE `gestao-filmes-series`;
USE `gestao-filmes-series`;

-- 2. CRIAÇÃO DA ESTRUTURA (CREATE TABLES)
-- ----------------------------------------------------------

-- Tabela: Utilizadores
CREATE TABLE `utilizadores` (
  `id_utilizadores` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  PRIMARY KEY (`id_utilizadores`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Tabela: Géneros
CREATE TABLE `generos` (
  `id_generos` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  PRIMARY KEY (`id_generos`),
  UNIQUE KEY `unique_nome` (`nome`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Tabela: Diretores
CREATE TABLE `diretores` (
  `id_diretores` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  PRIMARY KEY (`id_diretores`),
  UNIQUE KEY `unique_nome` (`nome`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Tabela: Atores
CREATE TABLE `atores` (
  `id_atores` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  PRIMARY KEY (`id_atores`),
  UNIQUE KEY `unique_nome` (`nome`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Tabela: Filmes e Séries (Principal)
CREATE TABLE `filmes_series` (
  `id_filmes_series` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) DEFAULT NULL,
  `tipo` enum('filme','serie') NOT NULL,
  `sinopse` varchar(1000) DEFAULT NULL,
  `duracao` int DEFAULT NULL,
  `ano_lancamento` int DEFAULT NULL,
  `id_diretor` int DEFAULT NULL,
  `classificacao_idade` int DEFAULT NULL,
  PRIMARY KEY (`id_filmes_series`),
  KEY `fk_filmes_series_diretores1_idx` (`id_diretor`),
  CONSTRAINT `fk_filme_diretor` FOREIGN KEY (`id_diretor`) REFERENCES `diretores` (`id_diretores`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Tabela de Junção: Géneros dos Filmes
CREATE TABLE `genero_filme_serie` (
  `id_filme_serie` int NOT NULL,
  `id_genero` int NOT NULL,
  PRIMARY KEY (`id_filme_serie`,`id_genero`),
  KEY `fk_genero_idx` (`id_genero`),
  CONSTRAINT `fk_gf_filme` FOREIGN KEY (`id_filme_serie`) REFERENCES `filmes_series` (`id_filmes_series`) ON DELETE CASCADE,
  CONSTRAINT `fk_gf_genero` FOREIGN KEY (`id_genero`) REFERENCES `generos` (`id_generos`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Tabela de Junção: Elenco Principal
CREATE TABLE `elenco_principal` (
  `id_ator` int NOT NULL,
  `id_filme_serie` int NOT NULL,
  PRIMARY KEY (`id_ator`,`id_filme_serie`),
  KEY `fk_elenco_filme_idx` (`id_filme_serie`),
  CONSTRAINT `fk_elenco_ator` FOREIGN KEY (`id_ator`) REFERENCES `atores` (`id_atores`) ON DELETE CASCADE,
  CONSTRAINT `fk_elenco_filme` FOREIGN KEY (`id_filme_serie`) REFERENCES `filmes_series` (`id_filmes_series`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Tabela: Reviews
CREATE TABLE `reviews` (
  `id_reviews` int NOT NULL AUTO_INCREMENT,
  `data` datetime DEFAULT CURRENT_TIMESTAMP,
  `classificacao` int DEFAULT NULL,
  `critica` varchar(1000) DEFAULT NULL,
  `votos` int DEFAULT 0,
  `id_utilizador` int NOT NULL,
  `id_filme_serie` int NOT NULL,
  PRIMARY KEY (`id_reviews`),
  KEY `fk_reviews_user_idx` (`id_utilizador`),
  KEY `fk_reviews_filme_idx` (`id_filme_serie`),
  CONSTRAINT `fk_reviews_filme` FOREIGN KEY (`id_filme_serie`) REFERENCES `filmes_series` (`id_filmes_series`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_user` FOREIGN KEY (`id_utilizador`) REFERENCES `utilizadores` (`id_utilizadores`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Tabela: Favoritos
CREATE TABLE `favoritos` (
  `id_utilizador` int NOT NULL,
  `id_filmes_series` int NOT NULL,
  PRIMARY KEY (`id_utilizador`,`id_filmes_series`),
  CONSTRAINT `fk_fav_filme` FOREIGN KEY (`id_filmes_series`) REFERENCES `filmes_series` (`id_filmes_series`) ON DELETE CASCADE,
  CONSTRAINT `fk_fav_user` FOREIGN KEY (`id_utilizador`) REFERENCES `utilizadores` (`id_utilizadores`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Tabela: Listas Personalizadas
CREATE TABLE `listas_personalizadas` (
  `id_lista` int NOT NULL AUTO_INCREMENT,
  `id_utilizador` int NOT NULL,
  `id_filme_serie` int NOT NULL,
  PRIMARY KEY (`id_lista`),
  KEY `fk_lista_user_idx` (`id_utilizador`),
  KEY `fk_lista_filme_idx` (`id_filme_serie`),
  CONSTRAINT `fk_lista_filme` FOREIGN KEY (`id_filme_serie`) REFERENCES `filmes_series` (`id_filmes_series`) ON DELETE CASCADE,
  CONSTRAINT `fk_lista_user` FOREIGN KEY (`id_utilizador`) REFERENCES `utilizadores` (`id_utilizadores`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


-- 3. INSERÇÃO DE DADOS (POPULAÇÃO INICIAL)
-- ----------------------------------------------------------

-- Utilizadores
INSERT INTO `utilizadores` VALUES (1,'Juliana Leite','juliana@email.com','$2b$10$977OdCc2Vcwz8Y0OkShFEu9D7hM9x5xc4VAq8fpGGLNNdhRaodErG');

-- Géneros (Dados do TMDB)
INSERT INTO `generos` VALUES 
(1,'Action'),(2,'Adventure'),(3,'Animation'),(4,'Comedy'),(5,'Crime'),
(6,'Documentary'),(7,'Drama'),(8,'Family'),(9,'Fantasy'),(10,'History'),
(11,'Horror'),(12,'Music'),(13,'Mystery'),(14,'Romance'),(15,'Science Fiction'),
(16,'TV Movie'),(17,'Thriller'),(18,'War'),(19,'Western'),(20,'Action & Adventure'),
(21,'Kids'),(22,'News'),(23,'Reality'),(24,'Sci-Fi & Fantasy'),(25,'Soap'),
(26,'Talk'),(27,'War & Politics');

-- Diretores
INSERT INTO `diretores` VALUES 
(1,'Christopher Nolan'),(2,'Greta Gerwig'),(3,'Martin Scorsese'),(4,'Denis Villeneuve'),
(5,'Quentin Tarantino'),(6,'Steven Spielberg'),(7,'James Cameron'),(8,'Robert Zemeckis'),
(9,'Bong Joon-ho'),(10,'Tim  Burton'),(11,'Ridley Scott'),(12,'Clint Eastwood'),
(13,'David Fincher'),(14,'Alfred Hitchcock'),(15,'Stanley Kubrick'),(16,'Akira Kurosawa'),
(17,'Hayao Miyazaki'),(18,'Francis Ford Coppola'),(19,'Peter Jackson'),(20,'Eric Tignini'),
(21,'Vince Gilligan');

-- Atores
INSERT INTO `atores` VALUES 
(1,'Tom Hanks'),(2,'Robin Wright'),(3,'Gary Sinise'),(4,'Sally Field'),(5,'Mykelti Williamson'),
(6,'Timothée Chalamet'),(7,'Zendaya'),(8,'Rebecca Ferguson'),(9,'Bryan Cranston'),
(10,'Aaron Paul'),(11,'Anna Gunn');

-- Filmes e Séries
INSERT INTO `filmes_series` VALUES 
(1,'Forrest Gump','filme','Um homem com QI baixo realiza grandes feitos e está presente em eventos históricos significativos.',142,1994,8,12),
(2,'Dune','filme','Paul Atreides viaja para o planeta mais perigoso do universo para garantir o futuro da sua família.',155,2021,4,14),
(3,'Breaking Bad','serie','Um professor de química diagnosticado com cancro pulmonar incurável vira-se para uma vida de crime, produzindo e vendendo metanfetaminas.',49,2008,21,16);

-- Ligações: Géneros dos Filmes
INSERT INTO `genero_filme_serie` VALUES 
(1,4),(1,7),(1,14), -- Forrest Gump: Comedy, Drama, Romance
(2,2),(2,7),(2,15), -- Dune: Adventure, Drama, Sci-Fi
(3,5),(3,7);        -- Breaking Bad: Crime, Drama

-- Ligações: Elenco Principal
INSERT INTO `elenco_principal` VALUES 
(1,1),(2,1),(3,1),(4,1),(5,1), -- Forrest Gump Cast
(6,2),(7,2),(8,2),             -- Dune Cast
(9,3),(10,3),(11,3);           -- Breaking Bad Cast