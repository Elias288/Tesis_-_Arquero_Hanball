const BaseRepository = require('./base.repository');
const UsuarioSchema = require('../models/usuario.model');

class UsuarioRepository extends BaseRepository {
    constructor() {
        super(UsuarioSchema);
    }
}

module.exports = UsuarioRepository;