const BaseRepository = require('./base.repository');
const RutinaSchema = require('../models/rutina.model');

class RutinaRepository extends BaseRepository {
    constructor() {
        super(RutinaSchema);
    }
    asignarSecuencia(id_rutina, secuencia) {
        RutinaSchema.findOne({ _id: id_rutina }).then(
            (rutina) => {
                rutina.secuencias.concat(secuencia);
                return this.collection.findByIdAndUpdate(id_rutina, rutina);
            })
    }
}

module.exports = RutinaRepository;