const express = require('express');
const SecuenciaController = require('../controller/secuencia.controller');

const router = express.Router();
const secuenciaController = new SecuenciaController();

router.get('/list', secuenciaController.getAll);
router.get('/details/:id', secuenciaController.getById);
router.post('/add', auth, secuenciaController.add);
router.put('/update/:id', auth, secuenciaController.update);
router.delete('/delete/:id', auth, secuenciaController.deleteById);

module.exports = router;