const BaseRepository = require('./base.repository');
const usuario = require('../models/usuario.model');

class UsuarioRepository extends BaseRepository {
    constructor() {
        super(usuario);
    }
}

module.exports = UsuarioRepository;