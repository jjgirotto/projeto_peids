const db = require('../config/db');

const buscarDiretores = (req, res) => {
    db.query('SELECT * FROM diretores', (err, results) => {
        if (err) {
            console.error('Erro ao listar diretores:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        res.status(200).json(results);
    });
};

const criarDiretor = (req, res) => {
    const nome = req.body.nome;
    if (!nome) {
        return res.status(400).json({ message: "O campo 'nome' é obrigatório." });
    }
    db.query('INSERT INTO diretores (nome) VALUES (?)', [nome], (err, results) => {
        if (err) {
            console.error('Erro ao criar diretor:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Esse diretor já existe.' });
            }
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        res.status(201).json({
            message: 'Diretor criado com sucesso!',
            id_criado: results.insertId,
            nome: nome
        });
    });
};

const buscarDiretorPorId = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM diretores WHERE id_diretores = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar diretor:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Diretor não encontrado.' });
        }
        res.status(200).json(results[0]);
    });
};

const atualizarDiretor = (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;
    if (!nome) {
        return res.status(400).json({ message: 'O campo nome é obrigatório.' });
    }
    db.query('UPDATE diretores SET nome = ? WHERE id_diretores = ?', [nome, id], (err, results) => {
        if (err) {
            console.error('Erro ao atualizar diretor:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Esse diretor já possui registo.' });
            }
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Diretor não encontrado.' });
        }
        res.status(200).json({
            message: 'Diretor atualizado com sucesso!',
            id: id,
            nome: nome
        });
    });
};

const removerDiretor = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM diretores WHERE id_diretores = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao remover diretor:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Diretor não encontrado.' });
        }
        res.status(204).send();
    });
};

module.exports = {
    buscarDiretores,
    criarDiretor,
    buscarDiretorPorId,
    atualizarDiretor,
    removerDiretor
};