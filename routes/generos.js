const express = require('express');
const router = express.Router();

// importando controlador
const generoController = require('../controllers/generoController');

// Rotas

// GET /api/generos
router.get('/', generoController.buscarGeneros);

//POST /api/generos
router.post('/', generoController.criarGenero);

module.exports = router;