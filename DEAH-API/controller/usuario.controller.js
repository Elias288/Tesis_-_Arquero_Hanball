const UsuarioRepository = require("../repositories/usuario.repository");
const BaseController = require("./base.controller");
const UsuarioSchema = require("../models/usuario.model");
const RutinaSchema = require("../models/rutina.model");
const { StatusCodes } = require("http-status-codes");

var bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const JWebToken = process.env.JWT_Secret;

class UsuarioController extends BaseController {
  constructor() {
    super(UsuarioRepository);
  }
  login = (req, res, next) => {
    UsuarioSchema.findOne({ username: req.body.username }).then((usuario) => {
      if (!usuario) {
        return res.status(StatusCodes.NOT_FOUND).json({
          res: "error",
          error: "Usuario no encontrado",
        });
      }
      bcrypt
        .compare(req.body.contrasenia, usuario.contrasenia)
        .then((valid) => {
          if (!valid) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
              res: "error",
              error: "Contraseña incorrecta",
            });
          }
          const token = jwt.sign({ userID: usuario._id }, JWebToken, {
            expiresIn: "24h",
          });
          res.status(StatusCodes.OK).json({
            res: "0",
            message: {
              userID: usuario._id,
              token: token,
            },
          });
        });
    });
  };
  asignarRutina = async (req, res) => {
    const { user_id } = req;

    try {
      const loggedUser = await UsuarioSchema.findById(user_id);

      const rutina = await RutinaSchema.findById(req.body.id_rutina);

      await loggedUser.rutinas.push(rutina._id);
      await loggedUser.save()
      res.status(StatusCodes.CREATED).send({ res: "0", message: loggedUser });
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).send({ res: "error", message: error });
    }
  };
  jugadorlist(req, res) {
    const { user_id } = req;
    return UsuarioSchema.findOne({ _id: user_id })
      .populate("jugadores")
      .then((result) => {
        res.status(StatusCodes.OK).json({ res: "0", message: result });
      });
  }
  rutinalist(req, res) {
    const { user_id } = req;
    return UsuarioSchema.findOne({ _id: user_id })
      .populate("rutinas")
      .then((result) => {
        res.status(StatusCodes.OK).json({ res: "0", message: result });
      });
  }
}
module.exports = UsuarioController;
