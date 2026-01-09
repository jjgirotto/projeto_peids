const jwt = require('jsonwebtoken');

const protegerRota = (req, res, next) => {
    // get token do header formato "Bearer [token]"
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (token == null) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' }); 
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, utilizador) => { 
        if (err) {
            return res.status(403).json({ message: 'Token inválido ou expirado.' }); 
        }
        req.utilizador = utilizador;
        next(); 
    });
};

module.exports = protegerRota;