const RutinaRepository = require("../repositories/rutina.repository");
const BaseController = require("./base.controller");
const RutinaSchema = require("../models/rutina.model");

class RutinaController extends BaseController {
  constructor() {
    super(RutinaRepository);
  }
}
module.exports = RutinaController;
