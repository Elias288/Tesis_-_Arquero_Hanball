const BaseRepository = require('./base.repository');
const rutina = require('../models/rutina.model');

class RutinaRepository extends BaseRepository {
    constructor() {
        super(rutina);
    }
}

module.exports = RutinaRepository;