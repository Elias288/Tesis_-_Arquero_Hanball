const { StatusCodes } = require("http-status-codes");
const ResultadoRepository = require("../repositories/resultado.repository");
const BaseController = require("./base.controller");
const ResultadoSchema = require("../models/resultado.model");

class ResultadoController extends BaseController {
  constructor() {
    super(ResultadoRepository);
  }
  add = (req, res) => {
    const body = req.body;

    try {
      if (body.titulo.trim() === "")
        return res.status(StatusCodes.BAD_GATEWAY).send({ res: 'error', message: 'invalid Titulo' })

      if (body.createDate === undefined)
        return res.status(StatusCodes.BAD_GATEWAY).send({ res: 'error', message: 'invalid createDate' })

      if (body.playedDate.trim() === "")
        return res.status(StatusCodes.BAD_GATEWAY).send({ res: 'error', message: 'invalid ' })
      // TODO: comprobar jugador existente
      if (body.id_jugador.trim() === "") {
        return res.status(StatusCodes.BAD_GATEWAY).send({ res: 'error', message: 'invalid id_jugador' })
      }

      if (body.id_rutina.trim() === "") {
        // TODO: comprobar rutina existente
        return res.status(StatusCodes.BAD_GATEWAY).send({ res: 'error', message: 'invalid id_rutina' })
      }

      const resultado = new ResultadoSchema({ ...body })

      return res.status(StatusCodes.CREATED).send({ res: "0", message: doc });

    } catch (error) {
      console.log(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send();
    }
  };
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
        res.status(StatusCodes.OK).json({ res: "0", message: result.id_jugador });
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
          .send();
      });
  };
}
module.exports = ResultadoController;
