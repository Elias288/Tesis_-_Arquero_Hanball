const BaseRepository = require('./base.repository');
const resultado = require('../models/resultado.model');

class ResultadoRepository extends BaseRepository {
    constructor() {
        super(resultado);
    }
}

module.exports = ResultadoRepository;