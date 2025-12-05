const express = require('express');
const router = express.Router();

// importando controlador
const reviewController = require('../controllers/reviewController');

// Rotas

// GET /api/reviews
router.get('/', reviewController.buscarReviews);

//POST /api/reviews
router.post('/', reviewController.criarReview);

// GET /api/reviews/id
router.get('/:id', reviewController.buscarReviewPorId);

// GET /api/reviews/filmeserie/idfilmeserie
router.get('/filmeserie/:id', reviewController.buscarReviewPorFilmeSerie);

// PUT /api/reviews/id
router.put('/:id', reviewController.atualizarReview);

// DELETE /api/reviews/id
router.delete('/:id', reviewController.removerReview);

module.exports = router;