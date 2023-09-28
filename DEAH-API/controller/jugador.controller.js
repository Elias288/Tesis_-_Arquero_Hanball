const JugadorRepository = require('../repositories/jugador.repository');
const BaseController = require('./base.controller');

class JugadorController extends BaseController{
    constructor() {
        super(JugadorRepository);
    }
}
module.exports = JugadorController;