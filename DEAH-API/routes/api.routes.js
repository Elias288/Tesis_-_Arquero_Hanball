const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

router.use('/jugador', auth, require('./jugador.routes'));
router.use('/resultado', auth, require('./resultado.routes'));
router.use('/rutina', auth, require('./rutina.routes'));
router.use('/secuencia', auth, require('./secuencia.routes'));
router.use('/usuario', require('./usuario.routes'));
//router.use('/Login', require('./login.routes'));

module.exports = router;