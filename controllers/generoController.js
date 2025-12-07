const db = require('../config/db');

const buscarGeneros = (req, res) => {
    db.query('SELECT * FROM generos', (err, results) => {
        if (err) {
            console.error('Erro ao listar gêneros:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        res.status(200).json(results);
    });
};

const criarGenero = (req, res) => {
    const nome = req.body.nome;
    
    if (!nome) {
        return res.status(400).json({ message: "O campo 'nome' é obrigatório." });
    }

    db.query('INSERT INTO generos (nome) VALUES (?)', [nome], (err, results) => {
        if (err) {
            console.error('Erro ao criar gênero:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Esse gênero já existe.' });
            }
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        res.status(201).json({
            message: 'Gênero criado com sucesso!',
            id_criado: results.insertId,
            nome: nome
        });
    });
};

const buscarGeneroPorId = (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM generos WHERE id_generos = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar gênero:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Gênero não encontrado.' });
        }

        res.status(200).json(results[0]);
    });
};

const atualizarGenero = (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;

    if (!nome) {
        return res.status(400).json({ message: 'O campo nome é obrigatório.' });
    }

    db.query('UPDATE generos SET nome = ? WHERE id_generos = ?', [nome, id], (err, results) => {
        if (err) {
            console.error('Erro ao atualizar gênero:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Esse gênero já possui registo.' });
            }
            return res.status(500).json({ message: 'Erro no servidor' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Gênero não encontrado.' });
        }

        res.status(200).json({
            message: 'Gênero atualizado com sucesso!',
            id: id,
            nome: nome
        });
    });
};

const removerGenero = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM generos WHERE id_generos = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao remover gênero:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Gênero não encontrado.' });
        }

        res.status(204).send();
    });
};

module.exports = {
    buscarGeneros,
    criarGenero,
    buscarGeneroPorId,
    atualizarGenero,
    removerGenero
};