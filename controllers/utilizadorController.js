const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const buscarUtilizadores = (req, res) => {
    db.query('SELECT id_utilizadores, nome, email FROM utilizadores', (err, results) => {
        if (err) {
            console.error('Erro ao listar utilizadores:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        res.status(200).json(results);
    });
};

const criarUtilizador = (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }
    bcrypt.hash(senha, 10, (err, hash) => {
        if (err) {
            console.error('Erro ao encriptar senha:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        db.query('INSERT INTO utilizadores (nome, email, senha) VALUES (?, ?, ?)', 
            [nome, email, hash], 
            (err, results) => {
                if (err) {
                    console.error('Erro ao criar utilizador:', err);
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(409).json({ message: 'Esse email já possui registo.' });
                    }
                    return res.status(500).json({ message: 'Erro no servidor' });
                }
                res.status(201).json({
                    message: 'Utilizador criado com sucesso!',
                    id_criado: results.insertId,
                    nome: nome,
                    email: email
                });
        });
    });
};

const buscarUtilizadorPorId = (req, res) => {
    const { id } = req.params;
    db.query('SELECT id_utilizadores, nome, email FROM utilizadores WHERE id_utilizadores = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar utilizador:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Utilizador não encontrado.' });
        }
        res.status(200).json(results[0]);
    });
};

const atualizarUtilizador = (req, res) => {
    const { id } = req.params;
    const { nome, email } = req.body;
    if (!nome || !email) {
        return res.status(400).json({ message: 'Nome e email são obrigatórios.' });
    }
    db.query('UPDATE utilizadores SET nome = ?, email = ? WHERE id_utilizadores = ?', 
        [nome, email, id], 
        (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ message: 'Esse email já possui registo.' });
                }
                console.error('Erro ao atualizar utilizador:', err);
                return res.status(500).json({ message: 'Erro no servidor' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Utilizador não encontrado.' });
            }
            res.status(200).json({ message: 'Utilizador atualizado com sucesso!' });
    });
};

const removerUtilizador = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM utilizadores WHERE id_utilizadores = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao remover utilizador:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Utilizador não encontrado.' });
        }
        res.status(204).send();
    });
};

const alterarSenha = (req, res) => {
    const { id } = req.params;
    const { senhaAntiga, novaSenha } = req.body;
    if (!senhaAntiga || !novaSenha) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórias.' });
    }
    db.query('SELECT senha FROM utilizadores WHERE id_utilizadores = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar utilizador:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Utilizador não encontrado.' });
        }
        const senhaAtual = results[0].senha;
        bcrypt.compare(senhaAntiga, senhaAtual, (err, isMatch) => {
            if (err) {
                console.error('Erro ao comparar senhas:', err);
                return res.status(500).json({ message: 'Erro no servidor' });
            }
            if (!isMatch) {
                return res.status(401).json({ message: 'Senha incorreta.' });
            }
            bcrypt.hash(novaSenha, 10, (err, hash) => {
                if (err) {
                    console.error('Erro ao encriptar nova senha:', err);
                    return res.status(500).json({ message: 'Erro no servidor' });
                }
                db.query('UPDATE utilizadores SET senha = ? WHERE id_utilizadores = ?', [hash, id], (err, results) => {
                    if (err) {
                        console.error('Erro ao atualizar senha:', err);
                        return res.status(500).json({ message: 'Erro no servidor' });
                    }
                    res.status(200).json({ message: 'Senha alterada com sucesso!' });
                });
            });
        });
    });
};

const loginUtilizador = (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }
    db.query('SELECT id_utilizadores, nome, email, senha FROM utilizadores WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Erro ao fazer login:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }
        const utilizador = results[0];
        bcrypt.compare(senha, utilizador.senha, (err, isMatch) => {
            if (err) {
                console.error('Erro ao comparar senhas:', err);
                return res.status(500).json({ message: 'Erro no servidor' });
            }
            if (!isMatch) {
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
                { expiresIn: '2h' }
            );
            res.status(200).json({token: token});
        });
    });
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