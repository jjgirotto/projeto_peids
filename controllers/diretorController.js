const db = require('../config/db');

const buscarDiretores = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM diretores');
        res.status(200).json(rows);
    } catch (err) {
        console.error('Erro ao listar diretores:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const criarDiretor = async (req, res) => {
    try {
        const nome = req.body.nome; 
        if (!nome) {
            return res.status(400).json({ message: "O campo 'nome' é obrigatório." });
        }
        const [row] = await db.query('INSERT INTO diretores (nome) VALUES (?)', [nome]);
        res.status(201).json({
            message: 'Diretor criado com sucesso!',
            id_criado: row.insertId,
            nome: nome
        });
    } catch (err) {
        console.error('Erro ao criar diretor:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Esse diretor já existe.' });
        }
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const buscarDiretorPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM diretores WHERE id_diretores = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Diretor não encontrado.' });
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error('Erro ao buscar diretor:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const atualizarDiretor = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome } = req.body;
        if (!nome ) {
            return res.status(400).json({ message: 'O campo nome é obrigatório.' });
        }
        const [result] = await db.query('UPDATE diretores SET nome = ? WHERE id_diretores = ?',
            [nome, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Diretor não encontrado.' });
        }
        res.status(200).json({ 
            message: 'Diretor atualizado com sucesso!',
            id: id,
            nome: nome
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Esse diretor já possui registo.' });
        }
        console.error('Erro ao atualizar diretor:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }   
};

const removerDiretor = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM diretores WHERE id_diretores = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Diretor não encontrado.' });
        }
        res.status(204).send();
    } catch (err) {
        console.error('Erro ao remover diretor:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

module.exports = {
    buscarDiretores,
    criarDiretor,
    buscarDiretorPorId,
    atualizarDiretor,
    removerDiretor
};
