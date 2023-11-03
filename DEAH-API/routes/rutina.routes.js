const express = require('express');
const RutinaController = require('../controller/rutina.controller');
const auth = require("../middleware/auth");

const router = express.Router();
const rutinaController = new RutinaController();

router.get('/list', rutinaController.getAll);
router.get('/details/:id', rutinaController.getById);
router.post('/add', auth, rutinaController.add);
router.put('/update/:id', auth, rutinaController.update);
router.delete('/delete/:id', auth, rutinaController.deleteById);

//router.put('/addSecuencia', auth, rutinaController.asignarSecuencia);

module.exports = router;