const express = require('express');
const router = express.Router();
const tmdbController = require('../controllers/tmdbController');
const protegerRota = require('../controllers/middleware/auth');

// GET /api/tmdb/search?query=Batman&tipo=filme
router.get('/search', tmdbController.pesquisarNoTmdb);

// POST /api/tmdb/import
router.post('/import', protegerRota, tmdbController.importarFilmeSerie);

module.exports = router;