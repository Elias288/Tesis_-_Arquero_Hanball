const BaseRepository = require('./base.repository');
const secuencia = require('../models/secuencia.model');

class SecuenciaRepository extends BaseRepository {
    constructor() {
        super(secuencia);
    }
}

module.exports = SecuenciaRepository;