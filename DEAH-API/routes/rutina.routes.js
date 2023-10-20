const express = require('express');
const RutinaController = require('../controller/rutina.controller');

const router = express.Router();
const rutinaController = new RutinaController();

router.get('/list', rutinaController.getAll);
router.get('/details/:id', rutinaController.getById);
router.post('/add', rutinaController.add);
router.put('/update/:id', rutinaController.update);
router.delete('/delete/:id', rutinaController.deleteById);

router.put('/addSecuencia', rutinaController.asignarSecuencia);

module.exports = router;