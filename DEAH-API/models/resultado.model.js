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
      require: true,
    },
    createDate: {
      type: Date,
      require: true,
    },
    id_jugador: {
      type: ObjectID,
      ref: "Jugador",
      require: true,
    },
    id_rutina: {
      type: ObjectID,
      ref: "Rutina",
      require: true,
    },
    secuencias: {
      type: String,
      require: true,
    },
    playedDate: {
      type: Date,
      require: true,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Resultado", ResultadoSchema);
