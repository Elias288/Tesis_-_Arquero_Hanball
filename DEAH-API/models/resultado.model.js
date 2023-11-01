var mongoose = require("mongoose");

var Schema = mongoose.Schema;

const ObjectID = mongoose.Schema.Types.ObjectId;

var ResultadoSchema = new Schema(
  {
    _id: {
      type: ObjectID,
      auto: true,
    },
    id_jugador: {
      type: ObjectID,
      ref: "Jugador",
    },
    id_rutina: {
      type: ObjectID,
      ref: "Rutina",
    },
    secuencias: { 
        type: String,
    },
  },
  { versionKey: false }
);

// Exportar el modelo
module.exports = mongoose.model("Resultado", ResultadoSchema);
/*
Id_resultado: String
Id_jugador: String
Id_rutina: String
Secuencias: Array<Id_secuencia>
*/
