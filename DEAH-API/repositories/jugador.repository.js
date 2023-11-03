const BaseRepository = require('./base.repository');
const JugadorSchema = require('../models/jugador.model');

class JugadorRepository extends BaseRepository {
    constructor() {
        super(JugadorSchema);
    }
    asignarResultado(id_jugador, resultado) {
        JugadorSchema.findOne({ _id: req.body.id_jugador }).then(
            (jugador) => {
                jugador.resultados.concat(resultado);
                return this.collection.findByIdAndUpdate(id_jugador, jugador);
            })
    }
    /*
    asignarRutina(id_jugador, rutina) {
        JugadorSchema.findOne({ _id: req.body.id_jugador }).then(
            (jugador) => {
                jugador.rutinas.concat(rutina);
                return this.collection.findByIdAndUpdate(id_jugador, jugador);
            })
    }
    */
}

module.exports = JugadorRepository;