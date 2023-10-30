const express = require("express");
const JugadorController = require("../controller/jugador.controller");
const auth = require("../middleware/auth");

const router = express.Router();
const jugadorController = new JugadorController();

router.get("/list", auth, jugadorController.getAll);
router.get("/details/:id", jugadorController.getById);
router.post("/add", auth, jugadorController.add);
router.put("/update/:id", auth, jugadorController.update);
router.delete("/delete/:id", auth, jugadorController.deleteById);

router.put("/addResultado", auth, jugadorController.asignarResultado);
router.put("/addRutina", auth, jugadorController.asignarRutina);
/*
 * TODO: obtener rutinas, obtener resultados
 */

module.exports = router;
