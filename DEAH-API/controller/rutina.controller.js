const RutinaRepository = require('../repositories/rutina.repository');
const BaseController = require('./base.controller');

class RutinaController extends BaseController{
    constructor() {
        super(RutinaRepository);
    }
}
module.exports = RutinaController;