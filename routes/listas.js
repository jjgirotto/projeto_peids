const express = require('express');
const router = express.Router();
const listasController = require('../controllers/listasController');
const protegerRota = require('../controllers/middleware/auth');

router.use(protegerRota);

//GET /api/listas
router.get('/', listasController.verMinhaLista);

//POST /api/listas
router.post('/', listasController.adicionarALista);

//DELETE /api/listas/:id_filme
router.delete('/:id_filme', listasController.removerDaLista);

module.exports = router;