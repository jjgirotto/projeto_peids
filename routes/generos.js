const express = require('express');
const router = express.Router();

// importando controlador
const generoController = require('../controllers/generoController');
const protegerRota = require('../controllers/middleware/auth');

// Rotas

// GET /api/generos
router.get('/', generoController.buscarGeneros);

//POST /api/generos
router.post('/', protegerRota, generoController.criarGenero);

// GET /api/generos/id
router.get('/:id', generoController.buscarGeneroPorId);

// PUT /api/generos/id
router.put('/:id', protegerRota, generoController.atualizarGenero);

// DELETE /api/generos/id
router.delete('/:id', protegerRota, generoController.removerGenero);

module.exports = router;