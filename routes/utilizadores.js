const express = require('express');
const router = express.Router();

// importando controlador
const utilizadorController = require('../controllers/utilizadorController');
const protegerRota = require('../controllers/middleware/auth');

// Rotas

// GET /api/utilizadores
router.get('/', protegerRota, utilizadorController.buscarUtilizadores);

//POST /api/utilizadores
router.post('/', utilizadorController.criarUtilizador);

// GET /api/utilizadores/id
router.get('/:id', protegerRota, utilizadorController.buscarUtilizadorPorId);

// PUT /api/utilizadores/id
router.put('/:id', protegerRota,utilizadorController.atualizarUtilizador);

// DELETE /api/utilizadores/id
router.delete('/:id', protegerRota, utilizadorController.removerUtilizador);

// PUT /api/utilizadores/alterarSenha/id
router.put('/alterarSenha/:id', protegerRota, utilizadorController.alterarSenha);

//POST /api/utilizadores/login
router.post('/login', utilizadorController.loginUtilizador);

module.exports = router;