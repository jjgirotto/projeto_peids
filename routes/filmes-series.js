const express = require('express');
const router = express.Router();

// importando controlador
const filmesSeriesController = require('../controllers/filmesSeriesController');

// Rotas

// GET /api/filmes-series
router.get('/', filmesSeriesController.buscarFilmesSeries);

//POST /api/filmes-series
router.post('/', filmesSeriesController.criarFilmeSerie);

// GET /api/filmes-series/filmes
router.get('/filmes', filmesSeriesController.buscarFilmes);

// GET /api/filmes-series/series
router.get('/series', filmesSeriesController.buscarSeries);

// GET /api/filmes-series/id
router.get('/:id', filmesSeriesController.buscarFilmeSeriePorId);

//GET /api/filmes-series/titulo/:titulo
router.get('/titulo/:titulo', filmesSeriesController.buscarFilmeSeriePorTitulo);

// PUT /api/filmes-series/id
router.put('/:id', filmesSeriesController.atualizarFilmeSerie);

// DELETE /api/filmes-series/id
router.delete('/:id', filmesSeriesController.removerFilmeSerie);

// POST /api/filmes-series/:id/generos (adiciona gêneros ao filme/série)
router.post('/:id/generos', filmesSeriesController.adicionarGenerosAFilmeSerie);

// DELETE /api/filmes-series/:id/generos/:id_genero (remove gênero do filme/série)
router.delete('/:id/generos/:id_genero', filmesSeriesController.removerGeneroDeFilmeSerie);

// POST /api/filmes-series/:id/atores (adiciona atores ao filme/série)
router.post('/:id/atores', filmesSeriesController.adicionarAtoresAFilmeSerie);

// DELETE /api/filmes-series/:id/atores/:id_ator (remove ator do filme/série)
router.delete('/:id/atores/:id_ator', filmesSeriesController.removerAtorDeFilmeSerie);

module.exports = router;