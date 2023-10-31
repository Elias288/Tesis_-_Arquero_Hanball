const express = require("express");
const UsuarioController = require("../controller/usuario.controller");
const auth = require("../middleware/auth");

const router = express.Router();
const usuarioController = new UsuarioController();

router.post("/add", usuarioController.add);
router.post("/login", usuarioController.login);

router.get("/list", usuarioController.getAll);
router.get("/details/:id", auth, usuarioController.getById);
router.put("/update/:id", auth, usuarioController.update);
router.delete("/delete/:id", auth, usuarioController.deleteById);

router.put("/addRutina", auth, usuarioController.asignarRutina);
router.get("/JugadorList", auth, usuarioController.jugadorlist);
router.get("/RutinaList", auth, usuarioController.rutinalist);

module.exports = router;
