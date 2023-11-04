const RutinaRepository = require("../repositories/rutina.repository");
const BaseController = require("./base.controller");
const RutinaSchema = require("../models/rutina.model");
const UsuarioSchema = require("../models/usuario.model");

const { StatusCodes } = require("http-status-codes");

class RutinaController extends BaseController {
  constructor() {
    super(RutinaRepository);
  }
  add = async (req, res) => {
    const body = req.body;
    const { user_id } = req;

    try {
      const loggedUser = await UsuarioSchema.findById(user_id);
      const rutina = new RutinaSchema({ ...body });

      rutina.id_usuario = loggedUser._id;

      const savedRutina = await rutina.save();
      await loggedUser.rutinas.push(savedRutina._id);
      await loggedUser.save();

      res.status(StatusCodes.CREATED).send({ res: "0", message: savedRutina });
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  };
}
module.exports = RutinaController;
