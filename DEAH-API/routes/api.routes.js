const express = require('express');
const router = express.Router();

router.use('/jugador', require('./jugador.routes'));
router.use('/resultado', require('./resultado.routes'));
router.use('/rutina', require('./rutina.routes'));
router.use('/secuencia', require('./secuencia.routes'));
router.use('/usuario', require('./usuario.routes'));

module.exports = router;