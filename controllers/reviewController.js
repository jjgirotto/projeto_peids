const db = require('../config/db');

const buscarReviews = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM reviews');
        res.status(200).json(rows);
    } catch (err) {
        console.error('Erro ao listar reviews:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const criarReview = async (req, res) => {
    try {
        const id_utilizador = req.utilizador.id;
        const { id_filme_serie, classificacao, critica } = req.body; 
        if (!classificacao || !critica || !id_filme_serie) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios." });
        }
        if (classificacao < 1 || classificacao > 5) {
            return res.status(400).json({ message: "A classificação deve ser entre 1 e 5." });
        }
        let data = Date.now();
        const [row] = await db.query('INSERT INTO reviews (data, classificacao, critica, votos, id_utilizador, id_filme_serie) VALUES (?, ?, ?, ?, ?, ?)', [data, classificacao, critica, 0, id_utilizador, id_filme_serie]);
        res.status(201).json({
            message: 'Review criada com sucesso!',
            id_criado: row.insertId,
            classificacao: classificacao,
            critica: critica
        });
    } catch (err) {
        console.error('Erro ao criar review:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Essa review já existe.' });
        }
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const buscarReviewPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM reviews WHERE id_reviews = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Review não encontrada.' });
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error('Erro ao buscar review:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const buscarReviewPorFilmeSerie = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM generos WHERE id_generos = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Gênero não encontrado.' });
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error('Erro ao buscar gênero:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const atualizarReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome } = req.body;
        if (!nome ) {
            return res.status(400).json({ message: 'O campo nome é obrigatório.' });
        }
        const [result] = await db.query('UPDATE generos SET nome = ? WHERE id_generos = ?',
            [nome, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Gênero não encontrado.' });
        }
        res.status(200).json({ 
            message: 'Gênero atualizado com sucesso!',
            id: id,
            nome: nome
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Esse gênero já possui registo.' });
        }
        console.error('Erro ao atualizar gênero:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }   
};

const removerReview = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM reviews WHERE id_reviews = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Review não encontrada.' });
        }
        res.status(204).send();
    } catch (err) {
        console.error('Erro ao remover review:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

module.exports = {
    buscarReviewPorId,
    buscarReviews,
    criarReview,
    atualizarReview,
    removerReview,
    buscarReviewPorFilmeSerie
};
