const express = require('express');
const UsuarioController = require('../controller/usuario.controller');

const router = express.Router();
const usuarioController = new UsuarioController();

router.get('/list', usuarioController.getAll);
router.get('/details/:id', usuarioController.getById);
router.post('/add', usuarioController.add);
router.put('/update/:id', usuarioController.update);
router.delete('/delete/:id', usuarioController.deleteById);
router.post('/login', usuarioController.login);

router.put('/addRutina', usuarioController.asignarRutina);

module.exports = router;