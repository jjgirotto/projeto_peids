const db = require('../config/db');

const adicionarALista = (req, res) => {
    const id_utilizador = req.utilizador.id;
    const { id_filme_serie } = req.body;

    if (!id_filme_serie) {
        return res.status(400).json({ message: "O ID do filme/série é obrigatório." });
    }

    const query = 'INSERT INTO listas_personalizadas (id_utilizador, id_filme_serie) VALUES (?, ?)';

    db.query(query, [id_utilizador, id_filme_serie], (err, results) => {
        if (err) {
            console.error('Erro ao adicionar à lista:', err);
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(404).json({ message: 'Filme não encontrado.' });
            }
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        res.status(201).json({ message: 'Adicionado à tua lista com sucesso!', id_registo: results.insertId });
    });
};

const removerDaLista = (req, res) => {
    const id_utilizador = req.utilizador.id;
    const { id_filme } = req.params;

    const query = 'DELETE FROM listas_personalizadas WHERE id_utilizador = ? AND id_filme_serie = ?';

    db.query(query, [id_utilizador, id_filme], (err, results) => {
        if (err) {
            console.error('Erro ao remover da lista:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Filme não encontrado na tua lista.' });
        }
        res.status(204).send();
    });
};

const verMinhaLista = (req, res) => {
    const id_utilizador = req.utilizador.id;

    const query = `
        SELECT l.id_lista, f.id_filmes_series, f.nome, f.tipo, f.ano_lancamento 
        FROM filmes_series f
        JOIN listas_personalizadas l ON f.id_filmes_series = l.id_filme_serie
        WHERE l.id_utilizador = ?
    `;

    db.query(query, [id_utilizador], (err, results) => {
        if (err) {
            console.error('Erro ao ver lista:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        res.status(200).json(results);
    });
};

module.exports = {
    adicionarALista,
    removerDaLista,
    verMinhaLista
};