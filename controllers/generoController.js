const db = require('../config/db');

const buscarGeneros = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM generos');
        res.status(200).json(rows);
    } catch (err) {
        console.error('Erro ao listar gêneros:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const criarGenero = async (req, res) => {
    try {
        const nome = req.body.nome; 
        if (!nome) {
            return res.status(400).json({ message: "O campo 'nome' é obrigatório." });
        }
        const [row] = await db.query('INSERT INTO generos (nome) VALUES (?)', [nome]);
        res.status(201).json({
            message: 'Gênero criado com sucesso!',
            id_criado: row.insertId,
            nome: nome
        });
    } catch (err) {
        console.error('Erro ao criar gênero:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Esse gênero já existe.' });
        }
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const buscarGeneroPorId = async (req, res) => {
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

const atualizarGenero = async (req, res) => {
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

const removerGenero = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM generos WHERE id_generos = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Gênero não encontrado.' });
        }
        res.status(204).send();
    } catch (err) {
        console.error('Erro ao remover gênero:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

module.exports = {
    buscarGeneros,
    criarGenero,
    buscarGeneroPorId,
    atualizarGenero,
    removerGenero
};
