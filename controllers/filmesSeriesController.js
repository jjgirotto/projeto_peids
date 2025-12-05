const db = require('../config/db');

const buscarFilmesSeries = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT fs.*, d.nome AS nome_diretor FROM filmes_series fs LEFT JOIN diretores d ON fs.id_diretor = d.id_diretores');
        res.status(200).json(rows);
    } catch (err) {
        console.error('Erro ao listar filmes e séries:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const criarFilmeSerie = async (req, res) => {
    try {
        const { nome, tipo, sinopse, duracao, ano_lancamento, id_diretor, classificacao_idade } = req.body;
        if (!nome || !tipo || !sinopse || isNaN(parseInt(duracao)) || isNaN(parseInt(ano_lancamento)) || isNaN(parseInt(id_diretor)) || isNaN(parseInt(classificacao_idade))) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios. Duração, ano, diretor e classificação devem ser números inteiros." });
        }
        if (tipo !== 'filme' && tipo !== 'serie') {
            return res.status(400).json({ message: "O campo 'tipo' deve ser 'filme' ou 'serie'." });
        }
        const [row] = await db.query('INSERT INTO filmes_series (nome, tipo, sinopse, duracao,  ano_lancamento, id_diretor, classificacao_idade ) VALUES (?, ?, ?, ?, ?, ?, ?)', [nome, tipo, sinopse, duracao, ano_lancamento, id_diretor, classificacao_idade]);
        res.status(201).json({
            message: 'Filme/série criado com sucesso!',
            id_criado: row.insertId,
            nome: nome,
            tipo: tipo,
            sinopse: sinopse,
            duracao: duracao,
            ano_lancamento: ano_lancamento,
            id_diretor: id_diretor,
            classificacao_idade: classificacao_idade
        });
    } catch (err) {
        console.error('Erro ao criar filme/série:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Esse filme/série já existe.' });
        }
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
             return res.status(404).json({ message: 'Erro: O id_diretor fornecido não existe.' });
        }
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const buscarFilmeSeriePorId = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT fs.*, d.nome AS nome_diretor FROM filmes_series fs LEFT JOIN diretores d ON fs.id_diretor = d.id_diretores WHERE fs.id_filmes_series = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Filme/série não encontrado.' });
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error('Erro ao buscar filme/série:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const buscarFilmes = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT fs.*, d.nome AS diretor_nome FROM filmes_series fs LEFT JOIN diretores d ON fs.id_diretor = d.id_diretores WHERE fs.tipo = 'filme'");
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Filmes não encontrados.' });
        }
        res.status(200).json(rows);
    } catch (err) {
        console.error('Erro ao buscar filmes:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const buscarSeries = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT fs.*, d.nome AS diretor_nome FROM filmes_series fs LEFT JOIN diretores d ON fs.id_diretor = d.id_diretores WHERE fs.tipo = 'serie'");
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Séries não encontradas.' });
        }
        res.status(200).json(rows);
    } catch (err) {
        console.error('Erro ao buscar séries:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const atualizarFilmeSerie = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, tipo, sinopse, duracao, ano_lancamento, id_diretor, classificacao_idade } = req.body;
        if (!nome || !tipo || !sinopse || isNaN(parseInt(duracao)) || isNaN(parseInt(ano_lancamento)) || isNaN(parseInt(id_diretor)) || isNaN(parseInt(classificacao_idade))) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios. Duração, ano, diretor e classificação devem ser números inteiros.' });
        }
        if (tipo !== 'filme' && tipo !== 'serie') {
            return res.status(400).json({ message: "O campo 'tipo' deve ser 'filme' ou 'serie'." });
        }
        const [result] = await db.query('UPDATE filmes_series SET nome = ?, tipo = ?, sinopse = ?, duracao = ?, ano_lancamento = ?, id_diretor = ?, classificacao_idade = ? WHERE id_filmes_series = ?',
            [nome, tipo, sinopse, duracao, ano_lancamento, id_diretor, classificacao_idade, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Filme/série não encontrado.' });
        }
        res.status(200).json({ message: 'Filme/série atualizado com sucesso!' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Esse filme/série já possui registo.' });
        }
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
             return res.status(404).json({ message: 'Erro: O id_diretor fornecido não existe.' });
        }
        console.error('Erro ao atualizar filme/série:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }   
};

const removerFilmeSerie = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM filmes_series WHERE id_filmes_series = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Filme/série não encontrado.' });
        }
        res.status(204).send();
    } catch (err) {
        console.error('Erro ao remover filme/série:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const adicionarGenerosAFilmeSerie = async (req, res) => {
    try {
        const { id } = req.params; 
        const { ids_generos } = req.body;
        if (!ids_generos || !Array.isArray(ids_generos) || ids_generos.length === 0) {
            return res.status(400).json({ message: "O 'ids_generos' é obrigatório e deve ser um array (lista) de IDs." });
        }
        const dadosParaInserir = ids_generos.map(id_genero => [id, id_genero]);
        await db.query('INSERT INTO genero_filme_serie (id_filme_serie, id_genero) VALUES ?', [dadosParaInserir]);
        res.status(201).json({
            message: 'Gêneros adicionados ao filme/série com sucesso!',
            id_filme_serie: id,
            ids_generos_adicionados: ids_generos
        });
    } catch (err) {
        console.error('Erro ao adicionar gêneros ao filme:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Este filme já possui este gênero.' });
        }
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
             return res.status(404).json({ message: 'Erro: O filme ou o gênero especificado não existe.' });
        }
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const removerGeneroDeFilmeSerie = async (req, res) => {
    try {
        const { id, id_genero } = req.params;
        const [result] = await db.query('DELETE FROM genero_filme_serie WHERE id_filme_serie = ? AND id_genero = ?', [id, id_genero]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Gênero não encontrado para o filme/série especificado.' });
        }
        res.status(204).send();
    } catch (err) {
        console.error('Erro ao remover gênero do filme/série:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const adicionarAtoresAFilmeSerie = async (req, res) => {
    try {
        const { id } = req.params; 
        const { ids_atores } = req.body;
        if (!ids_atores || !Array.isArray(ids_atores) || ids_atores.length === 0) {
            return res.status(400).json({ message: "O 'ids_atores' é obrigatório e deve ser um array (lista) de IDs." });
        }
        const dadosParaInserir = ids_atores.map(id_ator => [id, id_ator]);
        await db.query('INSERT INTO elenco_principal (id_filme_serie, id_ator) VALUES ?', [dadosParaInserir]);
        res.status(201).json({
            message: 'Atores adicionados ao filme/série com sucesso!',
            id_filme_serie: id,
            ids_atores_adicionados: ids_atores
        });
    } catch (err) {
        console.error('Erro ao adicionar atores ao filme:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Este filme já possui este ator.' });
        }
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
             return res.status(404).json({ message: 'Erro: O filme ou o ator especificado não existe.' });
        }
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const removerAtorDeFilmeSerie = async (req, res) => {
    try {
        const { id, id_ator } = req.params;
        const [result] = await db.query('DELETE FROM elenco_principal WHERE id_filme_serie = ? AND id_ator = ?', [id, id_ator]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Ator não encontrado para o filme/série especificado.' });
        }
        res.status(204).send();
    } catch (err) {
        console.error('Erro ao remover ator do filme/série:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
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
    buscarSeries
};
