const express = require('express');
const router = express.Router();

// importando controlador
const utilizadorController = require('../controllers/utilizadorController');

// Rotas

// GET /api/utilizadores
router.get('/', utilizadorController.buscarUtilizadores);

//POST /api/utilizadores
router.post('/', utilizadorController.criarUtilizador);

// GET /api/utilizadores/id
router.get('/:id', utilizadorController.buscarUtilizadorPorId);

// PUT /api/utilizadores/id
router.put('/:id', utilizadorController.atualizarUtilizador);

// DELETE /api/utilizadores/id
router.delete('/:id', utilizadorController.removerUtilizador);

// PUT /api/utilizadores/alterarSenha/id
router.put('/alterarSenha/:id', utilizadorController.alterarSenha);

//POST /api/utilizadores/login
router.post('/login', utilizadorController.loginUtilizador);

module.exports = router;