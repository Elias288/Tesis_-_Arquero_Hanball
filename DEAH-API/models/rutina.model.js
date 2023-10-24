var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const ObjectID = mongoose.Schema.Types.ObjectId;

var RutinaSchema = new Schema({
    _id: {
        type: ObjectID,
        auto: true
    },
    fecha: {
        type: Date,
    },
    id_usuario: {
        type: String,
    },
    id_jugador: {
        type: String,
    },
    secuencias: { type: ObjectID, ref: 'Secuencia' },//Array<Id_secuencia>
}, { versionKey: false });

// Exportar el modelo
module.exports = mongoose.model('Rutina', RutinaSchema);
/*
Id_rutina: String
Fecha: Date
Id_Usuario: String
Id_Jugador: String
Secuencias: Array<Id_secuencia>

*******IMPORTANT*******
-----------------------------------------------------------
const { Schema, model } = require('mongoose')

const matchSchema = new Schema({
    id: String,
    players: [
        { type: Schema.Types.ObjectId, ref: 'Player' }
    ],
    winner: { type: Schema.Types.ObjectId, ref: 'Player' },
    points: Number
    
}, { versionKey: false })

module.exports = model('Match', matchSchema)
-----------------------------------------------------------

*/