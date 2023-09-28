const BaseRepository = require('./base.repository');
const jugador = require('../models/jugador.model');

class JugadorRepository extends BaseRepository {
    constructor() {
        super(jugador);
    }
}

module.exports = JugadorRepository;