const SecuenciaRepository = require('../repositories/secuencia.repository');
const BaseController = require('./base.controller');

class SecuenciaController extends BaseController{
    constructor() {
        super(SecuenciaRepository);
    }
}
module.exports = SecuenciaController;