const JugadorRepository = require('../repositories/jugador.repository');
const BaseController = require('./base.controller');
const JugadorSchema = require('../models/jugador.model')

class JugadorController extends BaseController {
    constructor() {
        super(JugadorRepository);
    }
    asignarRutina(req, res) {
        return JugadorSchema.findOneAndUpdate(
            { _id: req.body.id_jugador },
            {
                $push: {
                    rutinas: req.body.rutinaId
                }
            }).then(result => {
                res.status(200).json({ message: "Rutina asignada con exito" });
            })
    }
    asignarResultado(req, res) {
        return JugadorSchema.findOneAndUpdate(
            { _id: req.body.id_jugador },
            {
                $push: {
                    resultados: req.body.resultadoId
                }
            }).then(result => {
                res.status(200).json({ message: "Resultado asignada con exito" });
            })
    }
}
module.exports = JugadorController;