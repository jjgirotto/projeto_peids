const express = require('express');
const router = express.Router();

// importando controlador
const diretorController = require('../controllers/atorController');

// Rotas

// GET /api/atores
router.get('/', diretorController.buscarAtores);

//POST /api/atores
router.post('/', diretorController.criarAtor);

module.exports = router;