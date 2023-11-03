const httpStatusCodes = require('http-status-codes');
const ResultadoRepository = require('../repositories/resultado.repository');
const BaseController = require('./base.controller');
const ResultadoSchema = require('../models/resultado.model');

class ResultadoController extends BaseController {
    constructor() {
        super(ResultadoRepository);
    }
    asignarRutina(req, res) {
        return ResultadoSchema.findOneAndUpdate(
            { _id: req.body.id_resultado },
            {
                $push: {
                    id_rutina: req.body.rutinaId
                }
            }).then(result => {
                res.status(200).json({ message: "Rutina asignada con exito" });
            })
    }
    getjugador(req, res) {
        return ResultadoSchema.findOne(
            { _id: req.body.id_resultado }
        ).populate('id_jugador').then(result => {
            res.status(200).json({ result })
        })
    }
    getRutina(req, res) {
        return ResultadoSchema.findOne(
            { _id: req.body.id_resultado }
        ).populate('id_rutina').then(result => {
            res.status(200).json({ result })
        })
    }
    getById = (req, res) => {
        let id = req.params.id;
        this.repo.findById(id).populate("id_jugador").then(doc => {
            return res.status(httpStatusCodes.OK).send(doc);
        }).catch(err => {
            console.log(err);
            return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send(err);
        })
    }
}
module.exports = ResultadoController;