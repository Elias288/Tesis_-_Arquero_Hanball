const express = require("express");
const ResultadoController = require("../controller/resultado.controller");
const auth = require("../middleware/auth");

const router = express.Router();
const resultadoController = new ResultadoController();

router.get("/list", auth, resultadoController.getAll);
router.get("/details/:id", auth, resultadoController.getById);
router.post("/add", auth, resultadoController.add);
router.put("/update/:id", auth, resultadoController.update);
router.delete("/delete/:id", auth, resultadoController.deleteById);

//router.put("/addRutina", auth, resultadoController.asignarRutina);
//router.put("/addSecuencia", auth, resultadoController.asignarSecuencia);
router.get('/getjugador', auth, resultadoController.getjugador);


module.exports = router;
