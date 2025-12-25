const express = require('express');
const router = express.Router();
const protegerRota = require('../controllers/middleware/auth');
const reviewController = require('../controllers/reviewController');

// Rotas

// GET /api/reviews
router.get('/', reviewController.buscarReviews);

//POST /api/reviews
router.post('/', protegerRota, reviewController.criarReview);

// GET /api/reviews/id
router.get('/:id', reviewController.buscarReviewPorId);

// GET /api/reviews/filmeserie/idfilmeserie
router.get('/filmeserie/:id', reviewController.buscarReviewPorFilmeSerie);

// PUT /api/reviews/id
router.put('/:id', protegerRota, reviewController.atualizarReview);

// DELETE /api/reviews/id
router.delete('/:id', protegerRota, reviewController.removerReview);

// POST /api/reviews/:id/votar
router.post('/:id/votar', protegerRota, reviewController.votarReview);

module.exports = router;