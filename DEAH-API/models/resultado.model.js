var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const ObjectID = mongoose.Schema.Types.ObjectId;

var ResultadoSchema = new Schema({
    _id: {
        type: ObjectID,
        auto: true
    },
    id_jugador: {
        type: String,
    },
    id_rutina: {
        type: Number,
    },
    secuencias: {
        type: Array,//Array<Id_secuencia>
    },
}, { versionKey: false });

// Exportar el modelo
module.exports = mongoose.model('Resultado', ResultadoSchema);
/*
Id_resultado: String
Id_jugador: String
Id_rutina: String
Secuencias: Array<Id_secuencia>
*/