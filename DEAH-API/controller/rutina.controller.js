const RutinaRepository = require('../repositories/rutina.repository');
const BaseController = require('./base.controller');
const RutinaSchema = require('../models/rutina.model')

class RutinaController extends BaseController {
    constructor() {
        super(RutinaRepository);
    }
    /*
    asignarSecuencia(req, res) {
        return RutinaSchema.findOneAndUpdate(
            { _id: req.body.id_rutina },
            {
                $push: {
                    secuencias: req.body.secuenciaId
                }
            }).then(result => {
                res.status(200).json({ message: "Secuencia asignada con exito" });
            })
    }
    */
}
module.exports = RutinaController;