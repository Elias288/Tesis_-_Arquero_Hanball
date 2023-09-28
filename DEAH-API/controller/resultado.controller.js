const ResultadoRepository = require('../repositories/resultado.repository');
const BaseController = require('./base.controller');

class ResultadoController extends BaseController{
    constructor() {
        super(ResultadoRepository);
    }
}
module.exports = ResultadoController;