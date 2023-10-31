const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ObjectID = mongoose.Schema.Types.ObjectId;

var JugadorSchema = new Schema(
  {
    _id: {
      type: ObjectID,
      auto: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    cedula: {
      type: String,
    },
    fechaCreación: {
      type: Date,
      require: true,
    },
    localidad: {
      type: String,
    },
    resultados: [{ type: ObjectID, ref: "Resultado" }],
  },
  { versionKey: false }
);

module.exports = mongoose.model("Jugador", JugadorSchema);
