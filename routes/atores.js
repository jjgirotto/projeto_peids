const express = require('express');
const router = express.Router();

// importando controlador
const atorController = require('../controllers/atorController');
const protegerRota = require('../controllers/middleware/auth');

// Rotas

// GET /api/atores
router.get('/', atorController.buscarAtores);

//POST /api/atores
router.post('/', protegerRota, atorController.criarAtor);

// GET /api/atores/id
router.get('/:id', atorController.buscarAtorPorId);

// PUT /api/atores/id
router.put('/:id', protegerRota, atorController.atualizarAtor);

// DELETE /api/atores/id
router.delete('/:id', protegerRota, atorController.removerAtor);

module.exports = router;