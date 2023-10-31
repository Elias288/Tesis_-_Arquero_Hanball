const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

router.use('/jugador', require('./jugador.routes'));
router.use('/resultado', require('./resultado.routes'));
router.use('/rutina', require('./rutina.routes'));
router.use('/usuario', require('./usuario.routes'));

module.exports = router;