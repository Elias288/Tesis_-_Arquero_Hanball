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
      required: true,
    },
    createDate: {
      type: Date,
      required: true,
    },
    id_jugador: {
      type: ObjectID,
      ref: "Jugador",
      required: true,
    },
    id_rutina: {
      type: ObjectID,
      ref: "Rutina",
      required: true,
    },
    secuencias: {
      type: String,
      required: true,
    },
    playedDate: {
      type: Date,
      required: true,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Resultado", ResultadoSchema);
