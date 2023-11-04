const JugadorRepository = require("../repositories/jugador.repository");
const BaseController = require("./base.controller");
const JugadorSchema = require("../models/jugador.model");
const UsuarioSchema = require("../models/usuario.model");
const { StatusCodes } = require("http-status-codes");

class JugadorController extends BaseController {
  constructor() {
    super(JugadorRepository);
  }
  add = async (req, res) => {
    const body = req.body;
    const { user_id } = req;

    try {
      const usuario = await UsuarioSchema.findById(user_id);
      const jugador = new JugadorSchema({ ...body });

      const savedJugador = await jugador.save();
      usuario.jugadores.push(savedJugador._id);
      await usuario.save();

      res.status(StatusCodes.CREATED).send({ res: "0", message: savedJugador });
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).send();
    }
  };
  asignarResultado(req, res) {
    return JugadorSchema.findOneAndUpdate(
      { _id: req.body.id_jugador },
      {
        $push: {
          resultados: req.body.resultadoId,
        },
      }
    ).then(() => {
      res
        .status(StatusCodes.OK)
        .json({ message: "Resultado asignada con exito", result: error });
    });
  }
  getresultados(req, res) {
    return JugadorSchema.findOne({ _id: req.body.id_jugador })
      .populate("resultados")
      .then((result) => {
        res.status(StatusCodes.OK).json({ res: "0", message: result });
      });
  }
  deleteById = async (req, res) => {
    let jugadorId = req.params.id;
    const { user_id } = req;

    if (jugadorId.trim() === "")
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ res: "error", message: "invalid param" });

    try {
      const usuario = await UsuarioSchema.findById(user_id);
      usuario.jugadores = usuario.jugadores.filter(
        (jugador_id) => jugador_id.toString() !== jugadorId
      );

      JugadorSchema.findByIdAndDelete(jugadorId).then((doc) => {
        return res.status(StatusCodes.OK).send({ res: "0", message: doc });
      });

      await usuario.save();
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  };
}
module.exports = JugadorController;
