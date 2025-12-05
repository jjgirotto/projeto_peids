const express = require('express');
const router = express.Router();

// importando controlador
const atorController = require('../controllers/atorController');

// Rotas

// GET /api/atores
router.get('/', atorController.buscarAtores);

//POST /api/atores
router.post('/', atorController.criarAtor);

// GET /api/atores/id
router.get('/:id', atorController.buscarAtorPorId);

// PUT /api/atores/id
router.put('/:id', atorController.atualizarAtor);

// DELETE /api/atores/id
router.delete('/:id', atorController.removerAtor);

module.exports = router;