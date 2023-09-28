const express = require('express');
const JugadorController = require('../controller/jugador.controller');

const router = express.Router();
const jugadorController = new JugadorController();

router.get('/list',jugadorController.getAll);
router.get('/details/:id',jugadorController.getById);
router.post('/add',jugadorController.add);
router.put('/update/:id',jugadorController.update);
router.delete('/delete/:id',jugadorController.deleteById);

module.exports = router;