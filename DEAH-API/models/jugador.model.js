const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ObjectID = mongoose.Schema.Types.ObjectId;

var JugadorSchema = new Schema({
  _id: {
    type: ObjectID,
    auto: true
  },
  nombre: {
    type: String,
    required: true
  },
  localidad: {
    type: String,
  },
  rutinas: { type: ObjectID, ref: 'Rutina' },
  resultados: { type: ObjectID, ref: 'Resultado' },
}, { versionKey: false });

// Exportar el modelo
module.exports = mongoose.model('Jugador', JugadorSchema);
/*
Id_jugador: String
Nombre: String
Localidad: String
Rutinas: Array<Id_rutina>
Resultados: Array<Id_resultaddo>
*/