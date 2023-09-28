var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const ObjectID = mongoose.Schema.Types.ObjectId;

var SecuenciaSchema = new Schema({
    _id: {
        type: ObjectID,
        auto: true
    },
    tiempo: {
        type: String,
    },
    led: {
        type: Number,
    },
}, { versionKey: false });

// Exportar el modelo
module.exports = mongoose.model('Secuencia', SecuenciaSchema);
/*
Id_secuencia: String
tiempo: String
led: Number
*/