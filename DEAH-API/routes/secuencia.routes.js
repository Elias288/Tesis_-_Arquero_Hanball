const express = require('express');
const SecuenciaController = require('../controller/secuencia.controller');

const router = express.Router();
const secuenciaController = new SecuenciaController();

router.get('/list',secuenciaController.getAll);
router.get('/details/:id',secuenciaController.getById);
router.post('/add',secuenciaController.add);
router.put('/update/:id',secuenciaController.update);
router.delete('/delete/:id',secuenciaController.deleteById);

module.exports = router;