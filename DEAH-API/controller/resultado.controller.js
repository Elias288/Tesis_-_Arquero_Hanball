const { StatusCodes } = require("http-status-codes");
const ResultadoRepository = require("../repositories/resultado.repository");
const BaseController = require("./base.controller");
const ResultadoSchema = require("../models/resultado.model");

class ResultadoController extends BaseController {
  constructor() {
    super(ResultadoRepository);
  }
  asignarRutina(req, res) {
    return ResultadoSchema.findOneAndUpdate(
      { _id: req.body.id_resultado },
      {
        $push: {
          id_rutina: req.body.rutinaId,
        },
      }
    ).then(() => {
      res
        .status(StatusCodes.OK)
        .json({ res: "0", message: "Rutina asignada con exito" });
    });
  }
  getjugador(req, res) {
    return ResultadoSchema.findOne({ _id: req.body.id_resultado })
      .populate("id_jugador")
      .then((result) => {
        res.status(StatusCodes.OK).json({ res: "0", message: result });
      });
  }
  getRutina(req, res) {
    return ResultadoSchema.findOne({ _id: req.body.id_resultado })
      .populate("id_rutina")
      .then((result) => {
        res.status(StatusCodes.OK).json({ res: "0", message: result });
      });
  }
  getById = (req, res) => {
    let id = req.params.id;
    this.repo
      .findById(id)
      .populate("id_jugador")
      .then(
        (doc) => {
          return res.status(StatusCodes.OK).send({ res: "0", message: doc });
        },
        (error) => {
          return res
            .status(StatusCodes.NOT_FOUND)
            .send({ res: "error", message: error });
        }
      )
      .catch((err) => {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ res: "error", message: err });
      });
  };
}
module.exports = ResultadoController;
