const BaseRepository = require('./base.repository');
const ResultadoSchema = require('../models/resultado.model');

const Secuencia = require('../models/secuencia.model');

class ResultadoRepository extends BaseRepository {
    constructor() {
        super(ResultadoSchema);
    }
    asignarSecuencia(id_resultado, secuencia) {
        ResultadoSchema.findOne({ _id: req.body.id_resultado }).then(
            (resultado) => {
                resultado.secuencias.concat(secuencia);
                return this.collection.findByIdAndUpdate(id_resultado, resultado);
            })
    }
}

module.exports = ResultadoRepository;