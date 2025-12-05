const db = require('../config/db');

const buscarAtores = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM atores');
        res.status(200).json(rows);
    } catch (err) {
        console.error('Erro ao listar atores:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const criarAtor = async (req, res) => {
    try {
        const nome = req.body.nome; 
        if (!nome) {
            return res.status(400).json({ message: "O campo 'nome' é obrigatório." });
        }
        const [row] = await db.query('INSERT INTO atores (nome) VALUES (?)', [nome]);
        res.status(201).json({
            message: 'Ator criado com sucesso!',
            id_criado: row.insertId,
            nome: nome
        });
    } catch (err) {
        console.error('Erro ao criar ator:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Esse ator já existe.' });
        }
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const buscarAtorPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM atores WHERE id_atores = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Ator não encontrado.' });
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error('Erro ao buscar ator:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const atualizarAtor = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome } = req.body;
        if (!nome ) {
            return res.status(400).json({ message: 'O campo nome é obrigatório.' });
        }
        const [result] = await db.query('UPDATE atores SET nome = ? WHERE id_atores = ?',
            [nome, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Ator não encontrado.' });
        }
        res.status(200).json({ 
            message: 'Ator atualizado com sucesso!',
            id: id,
            nome: nome
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Esse ator já possui registo.' });
        }
        console.error('Erro ao atualizar ator:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }   
};

const removerAtor = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM atores WHERE id_atores = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Ator não encontrado.' });
        }
        res.status(204).send();
    } catch (err) {
        console.error('Erro ao remover ator:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

module.exports = {
    buscarAtores,
    criarAtor,
    buscarAtorPorId,
    atualizarAtor,
    removerAtor
};
