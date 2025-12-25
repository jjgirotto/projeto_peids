const db = require('../config/db');

const buscarReviews = (req, res) => {
    db.query('SELECT * FROM reviews', (err, results) => {
        if (err) {
            console.error('Erro ao listar reviews:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        res.status(200).json(results);
    });
};

const criarReview = (req, res) => {
    const id_utilizador = req.utilizador.id;
    const { id_filme_serie, classificacao, critica } = req.body;
    
    if (!classificacao || !critica || !id_filme_serie) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }
    if (classificacao < 1 || classificacao > 5) {
        return res.status(400).json({ message: "A classificação deve ser entre 1 e 5." });
    }
    db.query('INSERT INTO reviews (classificacao, critica, votos, id_utilizador, id_filme_serie) VALUES (?, ?, ?, ?, ?)', 
        [classificacao, critica, 0, id_utilizador, id_filme_serie], 
        (err, results) => {
            if (err) {
                console.error('Erro ao criar review:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ message: 'Essa review já existe.' });
                }
                if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                    return res.status(409).json({ message: 'Esse filme/série não existe.' });
                }
                return res.status(500).json({ message: 'Erro no servidor' });
            }
            res.status(201).json({
                message: 'Review criada com sucesso!',
                id_review: results.insertId,
                classificacao: classificacao,
                critica: critica
            });
    });
};

const buscarReviewPorId = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM reviews WHERE id_reviews = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar review:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Review não encontrada.' });
        }
        res.status(200).json(results[0]);
    });
};

const buscarReviewPorFilmeSerie = (req, res) => {
    const { id } = req.params;
    db.query('SELECT r.*, u.nome as nome_utilizador FROM reviews r JOIN utilizadores u ON r.id_utilizador = u.id_utilizadores WHERE r.id_filme_serie = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar reviews do filme:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        res.status(200).json(results);
    });
};

const atualizarReview = (req, res) => {
    const id_utilizador = req.utilizador.id;
    const { id } = req.params;
    const { classificacao, critica } = req.body;

    if (!classificacao || !critica) {
        return res.status(400).json({ message: 'Classificação e crítica são obrigatórios.' });
    }

    db.query('UPDATE reviews SET classificacao = ?, critica = ? WHERE id_reviews = ? AND id_utilizador = ?',
        [classificacao, critica, id, id_utilizador],
        (err, results) => {
            if (err) {
                console.error('Erro ao atualizar review:', err);
                return res.status(500).json({ message: 'Erro no servidor' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Review não encontrada.' });
            }
            res.status(200).json({ 
                message: 'Review atualizada com sucesso!',
                id: id,
                classificacao: classificacao,
                critica: critica
            });
    });
};

const removerReview = (req, res) => {
    const id_utilizador = req.utilizador.id;
    const { id } = req.params;
    
    db.query('DELETE FROM reviews WHERE id_reviews = ? AND id_utilizador = ?', [id, id_utilizador], (err, results) => {
        if (err) {
            console.error('Erro ao remover review:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Review não encontrada.' });
        }
        res.status(204).send();
    });
};

const votarReview = (req, res) => {
    const { id } = req.params;

    // A lógica é simples: Incrementa 1 ao valor atual
    const query = 'UPDATE reviews SET votos = votos + 1 WHERE id_reviews = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erro ao votar na review:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Review não encontrada.' });
        }

        res.status(200).json({ message: 'Voto registado com sucesso!' });
    });
};

module.exports = {
    buscarReviewPorId,
    buscarReviews,
    criarReview,
    atualizarReview,
    removerReview,
    buscarReviewPorFilmeSerie,
    votarReview
};