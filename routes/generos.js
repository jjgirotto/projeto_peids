const express = require('express');
const router = express.Router();

// importando controlador
const generoController = require('../controllers/generoController');

// Rotas

// GET /api/generos
router.get('/', generoController.buscarGeneros);

//POST /api/generos
router.post('/', generoController.criarGenero);

// GET /api/generos/id
router.get('/:id', generoController.buscarGeneroPorId);

// PUT /api/generos/id
router.put('/:id', generoController.atualizarGenero);

// DELETE /api/generos/id
router.delete('/:id', generoController.removerGenero);

module.exports = router;