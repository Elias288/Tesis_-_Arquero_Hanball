const ResultadoRepository = require('../repositories/resultado.repository');
const BaseController = require('./base.controller');
const ResultadoSchema = require('../models/resultado.model');

class ResultadoController extends BaseController {
    constructor() {
        super(ResultadoRepository);
    }
    asignarSecuencia(req, res) {
        return ResultadoSchema.findOneAndUpdate(
            { _id: req.body.id_resultado },
            {
                $push: {
                    secuencias: req.body.secuenciaId
                }
            }).then(result => {
                res.status(200).json({ message: "Secuencia asignada con exito" });
            })
    }
}
module.exports = ResultadoController;