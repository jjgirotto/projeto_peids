const db = require('../config/db');

const adicionarFavorito = (req, res) => {
    const id_utilizador = req.utilizador.id;
    const { id_filme_serie } = req.body;

    if (!id_filme_serie) {
        return res.status(400).json({ message: "O ID do filme/série é obrigatório." });
    }

    const query = 'INSERT INTO favoritos (id_utilizador, id_filmes_series) VALUES (?, ?)';

    db.query(query, [id_utilizador, id_filme_serie], (err, results) => {
        if (err) {
            console.error('Erro ao adicionar favorito:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Este filme já está nos favoritos.' });
            }
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(404).json({ message: 'Filme não encontrado.' });
            }
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        res.status(201).json({ message: 'Adicionado aos favoritos com sucesso!' });
    });
};

const removerFavorito = (req, res) => {
    const id_utilizador = req.utilizador.id;
    const { id_filme } = req.params;

    const query = 'DELETE FROM favoritos WHERE id_utilizador = ? AND id_filmes_series = ?';

    db.query(query, [id_utilizador, id_filme], (err, results) => {
        if (err) {
            console.error('Erro ao remover favorito:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Filme não encontrado nos favoritos.' });
        }
        res.status(204).send();
    });
};

const listarFavoritos = (req, res) => {
    const id_utilizador = req.utilizador.id;

    const query = `
        SELECT f.id_filmes_series, f.nome, f.tipo, f.ano_lancamento 
        FROM filmes_series f
        JOIN favoritos fav ON f.id_filmes_series = fav.id_filmes_series
        WHERE fav.id_utilizador = ?
    `;

    db.query(query, [id_utilizador], (err, results) => {
        if (err) {
            console.error('Erro ao listar favoritos:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        res.status(200).json(results);
    });
};

module.exports = {
    adicionarFavorito,
    removerFavorito,
    listarFavoritos
};