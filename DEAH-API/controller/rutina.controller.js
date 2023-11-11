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

    const loggedUser = await UsuarioSchema.findById(user_id);
    console.log(body);
    const rutina = new RutinaSchema(body);

    try {
      const savedRutina = await rutina.save();
      loggedUser.rutinas.push(savedRutina._id);
      await loggedUser.save();
      console.log("new rutina added");
      res.status(StatusCodes.CREATED).send({ res: "0", message: savedRutina });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ res: "error", message: error });
    }
  };
  deleteById = async (req, res) => {
    let rutinaId = req.params.id;
    const { user_id } = req;

    if (rutinaId.trim() === "")
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ res: "error", message: "invalid param" });

    if (process.env.develop) console.log("deleted rutinaID: " + rutinaId);
    try {
      const usuario = await UsuarioSchema.findById(user_id);
      usuario.rutinas = usuario.rutinas.filter(
        (rutina_id) => rutina_id.toString() !== rutinaId
      );

      RutinaSchema.findByIdAndDelete(rutinaId).then((doc) => {
        return res.status(StatusCodes.OK).send({ res: "0", message: doc });
      });

      await usuario.save();
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  };
}
module.exports = RutinaController;
