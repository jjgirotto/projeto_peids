const db = require('../config/db');

const buscarFilmesSeries = (req, res) => {
    db.query('SELECT fs.*, d.nome AS nome_diretor FROM filmes_series fs LEFT JOIN diretores d ON fs.id_diretor = d.id_diretores', (err, results) => {
        if (err) {
            console.error('Erro ao listar filmes e séries:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        res.status(200).json(results);
    });
};

const criarFilmeSerie = (req, res) => {
    const { nome, tipo, sinopse, duracao, ano_lancamento, id_diretor, classificacao_idade } = req.body;
    if (!nome || !tipo || !sinopse || isNaN(parseInt(duracao)) || isNaN(parseInt(ano_lancamento)) || isNaN(parseInt(id_diretor)) || isNaN(parseInt(classificacao_idade))) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios. Duração, ano, diretor e classificação devem ser números inteiros." });
    }
    if (tipo !== 'filme' && tipo !== 'serie') {
        return res.status(400).json({ message: "O campo 'tipo' deve ser 'filme' ou 'serie'." });
    }
    db.query('INSERT INTO filmes_series (nome, tipo, sinopse, duracao,  ano_lancamento, id_diretor, classificacao_idade ) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [nome, tipo, sinopse, duracao, ano_lancamento, id_diretor, classificacao_idade], 
        (err, results) => {
            if (err) {
                console.error('Erro ao criar filme/série:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ message: 'Esse filme/série já existe.' });
                }
                if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                     return res.status(404).json({ message: 'Erro: O id_diretor fornecido não existe.' });
                }
                return res.status(500).json({ message: 'Erro no servidor' });
            }
            res.status(201).json({
                message: 'Filme/série criado com sucesso!',
                id_criado: results.insertId,
                nome: nome,
                tipo: tipo,
                sinopse: sinopse,
                duracao: duracao,
                ano_lancamento: ano_lancamento,
                id_diretor: id_diretor,
                classificacao_idade: classificacao_idade
            });
    });
};

const buscarFilmeSeriePorId = (req, res) => {
    const { id } = req.params;
    const queryFilme = `
        SELECT fs.id_filmes_series, fs.nome, fs.tipo, fs.sinopse, fs.duracao, 
               fs.ano_lancamento, fs.classificacao_idade, d.nome AS diretor 
        FROM filmes_series fs 
        LEFT JOIN diretores d ON fs.id_diretor = d.id_diretores 
        WHERE fs.id_filmes_series = ?`;
    
    db.query(queryFilme, [id], (err, resultsFilme) => {
        if (err) {
            console.error('Erro ao buscar filme/série:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        if (resultsFilme.length === 0) {
            return res.status(404).json({ message: 'Filme/série não encontrado.' });
        }

        const filme = resultsFilme[0];
        const queryGeneros = `
            SELECT g.nome 
            FROM generos g 
            JOIN genero_filme_serie gfs ON g.id_generos = gfs.id_genero 
            WHERE gfs.id_filme_serie = ?`;

        db.query(queryGeneros, [id], (err, resultsGeneros) => {
            if (err) {
                console.error('Erro ao buscar gêneros:', err);
                return res.status(500).json({ message: 'Erro no servidor' });
            }
            filme.generos = resultsGeneros.map(g => g.nome);
            const queryAtores = `
                SELECT a.nome 
                FROM atores a 
                JOIN elenco_principal ep ON a.id_atores = ep.id_ator 
                WHERE ep.id_filme_serie = ?`;

            db.query(queryAtores, [id], (err, resultsAtores) => {
                if (err) {
                    console.error('Erro ao buscar atores:', err);
                    return res.status(500).json({ message: 'Erro no servidor' });
                }
                filme.elenco = resultsAtores.map(a => a.nome);
                res.status(200).json(filme);
            });
        });
    });
};

const buscarFilmes = (req, res) => {
    db.query("SELECT fs.*, d.nome AS diretor_nome FROM filmes_series fs LEFT JOIN diretores d ON fs.id_diretor = d.id_diretores WHERE fs.tipo = 'filme'", (err, results) => {
        if (err) {
            console.error('Erro ao buscar filmes:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Filmes não encontrados.' });
        }
        res.status(200).json(results);
    });
};

const buscarSeries = (req, res) => {
    db.query("SELECT fs.*, d.nome AS diretor_nome FROM filmes_series fs LEFT JOIN diretores d ON fs.id_diretor = d.id_diretores WHERE fs.tipo = 'serie'", (err, results) => {
        if (err) {
            console.error('Erro ao buscar séries:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Séries não encontradas.' });
        }
        res.status(200).json(results);
    });
};

const buscarFilmeSeriePorTitulo = (req, res) => {
    const { titulo } = req.params; 
    if (!titulo) {
        return res.status(400).json({ message: "Digite um titulo para pesquisar." });
    }
    const nome = `%${titulo}%`;
    const query = `
        SELECT fs.id_filmes_series, fs.nome, fs.tipo, fs.ano_lancamento, fs.duracao,
        fs.classificacao_idade, d.nome AS diretor 
        FROM filmes_series fs 
        LEFT JOIN diretores d ON fs.id_diretor = d.id_diretores 
        WHERE fs.nome LIKE ?`;
    db.query(query, [nome], (err, results) => {
        if (err) {
            console.error('Erro na pesquisa:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        res.status(200).json(results);
    });
};

const atualizarFilmeSerie = (req, res) => {
    const { id } = req.params;
    const { nome, tipo, sinopse, duracao, ano_lancamento, id_diretor, classificacao_idade } = req.body;
    if (!nome || !tipo || !sinopse || isNaN(parseInt(duracao)) || isNaN(parseInt(ano_lancamento)) || isNaN(parseInt(id_diretor)) || isNaN(parseInt(classificacao_idade))) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios. Duração, ano, diretor e classificação devem ser números inteiros.' });
    }
    if (tipo !== 'filme' && tipo !== 'serie') {
        return res.status(400).json({ message: "O campo 'tipo' deve ser 'filme' ou 'serie'." });
    }
    db.query('UPDATE filmes_series SET nome = ?, tipo = ?, sinopse = ?, duracao = ?, ano_lancamento = ?, id_diretor = ?, classificacao_idade = ? WHERE id_filmes_series = ?',
        [nome, tipo, sinopse, duracao, ano_lancamento, id_diretor, classificacao_idade, id],
        (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ message: 'Esse filme/série já possui registo.' });
                }
                if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                     return res.status(404).json({ message: 'Erro: O id_diretor fornecido não existe.' });
                }
                console.error('Erro ao atualizar filme/série:', err);
                return res.status(500).json({ message: 'Erro no servidor' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Filme/série não encontrado.' });
            }
            res.status(200).json({ message: 'Filme/série atualizado com sucesso!' });
    });
};

const removerFilmeSerie = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM filmes_series WHERE id_filmes_series = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao remover filme/série:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Filme/série não encontrado.' });
        }
        res.status(204).send();
    });
};

const adicionarGenerosAFilmeSerie = (req, res) => {
    const { id } = req.params; 
    const { ids_generos } = req.body;
    if (!ids_generos || !Array.isArray(ids_generos) || ids_generos.length === 0) {
        return res.status(400).json({ message: "O 'ids_generos' é obrigatório e deve ser um array (lista) de IDs." });
    }
    const dadosParaInserir = ids_generos.map(id_genero => [id, id_genero]);
    db.query('INSERT INTO genero_filme_serie (id_filme_serie, id_genero) VALUES ?', [dadosParaInserir], (err, results) => {
        if (err) {
            console.error('Erro ao adicionar gêneros ao filme:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Este filme já possui este gênero.' });
            }
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                 return res.status(404).json({ message: 'Erro: O filme ou o gênero especificado não existe.' });
            }
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        res.status(201).json({
            message: 'Gêneros adicionados ao filme/série com sucesso!',
            id_filme_serie: id,
            ids_generos_adicionados: ids_generos
        });
    });
};

const removerGeneroDeFilmeSerie = (req, res) => {
    const { id, id_genero } = req.params;
    db.query('DELETE FROM genero_filme_serie WHERE id_filme_serie = ? AND id_genero = ?', [id, id_genero], (err, results) => {
        if (err) {
            console.error('Erro ao remover gênero do filme/série:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Gênero não encontrado para o filme/série especificado.' });
        }
        res.status(204).send();
    });
};

const adicionarAtoresAFilmeSerie = (req, res) => {
    const { id } = req.params; 
    const { ids_atores } = req.body;
    if (!ids_atores || !Array.isArray(ids_atores) || ids_atores.length === 0) {
        return res.status(400).json({ message: "O 'ids_atores' é obrigatório e deve ser um array (lista) de IDs." });
    }
    const dadosParaInserir = ids_atores.map(id_ator => [id, id_ator]);
    db.query('INSERT INTO elenco_principal (id_filme_serie, id_ator) VALUES ?', [dadosParaInserir], (err, results) => {
        if (err) {
            console.error('Erro ao adicionar atores ao filme:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Este filme já possui este ator.' });
            }
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                 return res.status(404).json({ message: 'Erro: O filme ou o ator especificado não existe.' });
            }
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        res.status(201).json({
            message: 'Atores adicionados ao filme/série com sucesso!',
            id_filme_serie: id,
            ids_atores_adicionados: ids_atores
        });
    });
};

const removerAtorDeFilmeSerie = (req, res) => {
    const { id, id_ator } = req.params;
    db.query('DELETE FROM elenco_principal WHERE id_filme_serie = ? AND id_ator = ?', [id, id_ator], (err, results) => {
        if (err) {
            console.error('Erro ao remover ator do filme/série:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Ator não encontrado para o filme/série especificado.' });
        }
        res.status(204).send();
    });
};

module.exports = {
    buscarFilmesSeries,
    criarFilmeSerie,
    buscarFilmeSeriePorId,
    atualizarFilmeSerie,
    removerFilmeSerie,
    adicionarGenerosAFilmeSerie,
    removerGeneroDeFilmeSerie,
    adicionarAtoresAFilmeSerie,
    removerAtorDeFilmeSerie,
    buscarFilmes,
    buscarSeries,
    buscarFilmeSeriePorTitulo
};