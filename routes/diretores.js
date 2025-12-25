const express = require('express');
const router = express.Router();

// importando controlador
const diretorController = require('../controllers/diretorController');
const protegerRota = require('../controllers/middleware/auth');

// Rotas

// GET /api/diretores
router.get('/', diretorController.buscarDiretores);

//POST /api/diretores
router.post('/', protegerRota, diretorController.criarDiretor);

// GET /api/diretores/id
router.get('/:id', diretorController.buscarDiretorPorId);

// PUT /api/diretores/id
router.put('/:id', protegerRota, diretorController.atualizarDiretor);

// DELETE /api/diretores/id
router.delete('/:id', protegerRota, diretorController.removerDiretor);

module.exports = router;