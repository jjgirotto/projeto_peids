const db = require('../config/db');

const buscarAtores = (req, res) => {
    db.query('SELECT * FROM atores', (err, results) => {
        if (err) {
            console.error('Erro ao listar atores:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        res.status(200).json(results);
    });
};

const criarAtor = (req, res) => {
    const nome = req.body.nome;
    if (!nome) {
        return res.status(400).json({ message: "O campo 'nome' é obrigatório." });
    }
    db.query('INSERT INTO atores (nome) VALUES (?)', [nome], (err, results) => {
        if (err) {
            console.error('Erro ao criar ator:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Esse ator já existe.' });
            }
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        res.status(201).json({
            message: 'Ator criado com sucesso!',
            id_criado: results.insertId,
            nome: nome
        });
    });
};

const buscarAtorPorId = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM atores WHERE id_atores = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar ator:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Ator não encontrado.' });
        }
        res.status(200).json(results[0]);
    });
};

const atualizarAtor = (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;
    if (!nome) {
        return res.status(400).json({ message: 'O campo nome é obrigatório.' });
    }
    db.query('UPDATE atores SET nome = ? WHERE id_atores = ?', [nome, id], (err, results) => {
        if (err) {
            console.error('Erro ao atualizar ator:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Esse ator já possui registo.' });
            }
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Ator não encontrado.' });
        }
        res.status(200).json({
            message: 'Ator atualizado com sucesso!',
            id: id,
            nome: nome
        });
    });
};

const removerAtor = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM atores WHERE id_atores = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao remover ator:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Ator não encontrado.' });
        }
        res.status(204).send();
    });
};

module.exports = {
    buscarAtores,
    criarAtor,
    buscarAtorPorId,
    atualizarAtor,
    removerAtor
};