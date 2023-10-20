const express = require('express');
const ResultadoController = require('../controller/resultado.controller');

const router = express.Router();
const resultadoController = new ResultadoController();

router.get('/list', resultadoController.getAll);
router.get('/details/:id', resultadoController.getById);
router.post('/add', resultadoController.add);
router.put('/update/:id', resultadoController.update);
router.delete('/delete/:id', resultadoController.deleteById);

router.put('/addSecuencia', resultadoController.asignarSecuencia);

module.exports = router;