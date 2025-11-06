const express = require('express');
const router = express.Router();

// importando controlador
const diretorController = require('../controllers/diretorController');

// Rotas

// GET /api/diretores
router.get('/', diretorController.buscarDiretores);

//POST /api/diretores
router.post('/', diretorController.criarDiretor);

module.exports = router;