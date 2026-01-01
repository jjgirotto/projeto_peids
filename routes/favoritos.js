const express = require('express');
const router = express.Router();
const favoritosController = require('../controllers/favoritosController');
const protegerRota = require('../controllers/middleware/auth');
router.use(protegerRota);

// GET /api/favoritos
router.get('/', favoritosController.listarFavoritos);

// POST /api/favoritos
router.post('/', favoritosController.adicionarFavorito);

// DELETE /api/favoritos/:id_filme
router.delete('/:id_filme', favoritosController.removerFavorito);

module.exports = router;