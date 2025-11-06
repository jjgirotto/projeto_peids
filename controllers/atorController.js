const db = require('../config/db');

// busca todos os atores
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

module.exports = {
    buscarAtores,
    criarAtor
};
