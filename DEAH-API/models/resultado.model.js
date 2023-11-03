var mongoose = require("mongoose");

var Schema = mongoose.Schema;

const ObjectID = mongoose.Schema.Types.ObjectId;

var ResultadoSchema = new Schema(
  {
    _id: {
      type: ObjectID,
      auto: true,
    },
    titulo: {
      type: String,
    },
    createDate: {
      type: Date,
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


module.exports = mongoose.model("Resultado", ResultadoSchema);
