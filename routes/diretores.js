const express = require('express');
const router = express.Router();

// importando controlador
const diretorController = require('../controllers/diretorController');

// Rotas

// GET /api/diretores
router.get('/', diretorController.buscarDiretores);

//POST /api/diretores
router.post('/', diretorController.criarDiretor);

// GET /api/diretores/id
router.get('/:id', diretorController.buscarDiretorPorId);

// PUT /api/diretores/id
router.put('/:id', diretorController.atualizarDiretor);

// DELETE /api/diretores/id
router.delete('/:id', diretorController.removerDiretor);

module.exports = router;