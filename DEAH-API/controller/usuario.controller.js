const UsuarioRepository = require('../repositories/usuario.repository');
const BaseController = require('./base.controller');

class UsuarioController extends BaseController{
    constructor() {
        super(UsuarioRepository);
    }
}
module.exports = UsuarioController;