const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const buscarUtilizadores = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id_utilizadores, nome, email FROM utilizadores');
        res.status(200).json(rows);
    } catch (err) {
        console.error('Erro ao listar utilizadores:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const criarUtilizador = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        if (!nome || !email || !senha) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios." });
        }
        // gero um salt (um custo de processamento) com valor de 10 é o padrão 
        const salt = await bcrypt.genSalt(10);
        // crio o hash da senha
        const senhaEncriptada = await bcrypt.hash(senha, salt);
        const [row] = await db.query('INSERT INTO utilizadores (nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, senhaEncriptada]);
        res.status(201).json({
            message: 'Utilizador criado com sucesso!',
            id_criado: row.insertId,
            nome: nome,
            email: email
        });
    } catch (err) {
        console.error('Erro ao criar utilizador:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Esse email já possui registo.' });
        }
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const buscarUtilizadorPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT id_utilizadores, nome, email FROM utilizadores WHERE id_utilizadores = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Utilizador não encontrado.' });
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error('Erro ao buscar utilizador:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const atualizarUtilizador = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email } = req.body;
        if (!nome || !email) {
            return res.status(400).json({ message: 'Nome e email são obrigatórios.' });
        }
        const [result] = await db.query('UPDATE utilizadores SET nome = ?, email = ? WHERE id_utilizadores = ?',
            [nome, email, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Utilizador não encontrado.' });
        }
        res.status(200).json({ message: 'Utilizador atualizado com sucesso!' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Esse email já possui registo.' });
        }
        console.error('Erro ao atualizar utilizador:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }   
};

const removerUtilizador = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM utilizadores WHERE id_utilizadores = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Utilizador não encontrado.' });
        }
        res.status(204).send();
    } catch (err) {
        console.error('Erro ao remover utilizador:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const alterarSenha = async (req, res) => {
    try {
        const { id } = req.params;
        const { senhaAntiga, novaSenha } = req.body;
        if (!senhaAntiga || !novaSenha) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórias.' });
        }
        const [row] = await db.query('SELECT senha FROM utilizadores WHERE id_utilizadores = ?', [id]);
        if (row.length === 0) {
            return res.status(404).json({ message: 'Utilizador não encontrado.' });
        }
        const senhaAtual = row[0].senha;
        const senhaCorreta = await bcrypt.compare(senhaAntiga, senhaAtual);
        if (!senhaCorreta) {
            return res.status(401).json({ message: 'Senha incorreta.' });
        }
        const salt = await bcrypt.genSalt(10);
        const novaSenhaEncriptada = await bcrypt.hash(novaSenha, salt);
        await db.query('UPDATE utilizadores SET senha = ? WHERE id_utilizadores = ?', [novaSenhaEncriptada, id]);
        res.status(200).json({ message: 'Senha alterada com sucesso!' });
    } catch (err) {
        console.error('Erro ao alterar senha:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }       
};

const loginUtilizador = async (req, res) => {
    try {
        const { email, senha } = req.body;
        if (!email || !senha) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
        }
        const [row] = await db.query('SELECT id_utilizadores, nome, email, senha FROM utilizadores WHERE email = ?', [email]);
        if (row.length === 0) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }  
        const utilizador = row[0];
        const senhaCorreta = await bcrypt.compare(senha, utilizador.senha);
        const emailCorreto = email === utilizador.email;
        if (!senhaCorreta || !emailCorreto) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }
        const payload = {
            id: utilizador.id_utilizadores,
            nome: utilizador.nome,
            email: utilizador.email
        };
        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET,
            { expiresIn: '2h' } // expira em 2h
        );  
        res.status(200).json({
            message: 'Login bem-sucedido!',
            token: token,
            utilizador: {
                id_utilizadores: utilizador.id_utilizadores,
                nome: utilizador.nome,
                email: utilizador.email
            }
        });
    } catch (err) {
        console.error('Erro ao fazer login:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }   
};

module.exports = {
    buscarUtilizadores,
    criarUtilizador,
    buscarUtilizadorPorId,
    atualizarUtilizador,
    removerUtilizador,
    alterarSenha,
    loginUtilizador
};
