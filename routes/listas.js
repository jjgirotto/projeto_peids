const express = require('express');
const router = express.Router();
const listasController = require('../controllers/listasController');
const protegerRota = require('../controllers/middleware/auth');

router.use(protegerRota);

//GET /api/listas
router.get('/', listasController.verMinhaLista);

//POST /api/listas
router.post('/', listasController.adicionarALista);

//DELETE /api/listas/:id_filme-serie
router.delete('/:id_filme-serie', listasController.removerDaLista);

module.exports = router;