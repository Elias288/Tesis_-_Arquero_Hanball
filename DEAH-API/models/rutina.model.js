var mongoose = require("mongoose");

var Schema = mongoose.Schema;

const ObjectID = mongoose.Schema.Types.ObjectId;

var RutinaSchema = new Schema(
  {
    _id: {
      type: ObjectID,
      auto: true,
    },
    titulo: {
      type: String,
      required: true,
    },
    fechaDeCreación: {
      type: Date,
      required: true,
    },
    secuencias: {
      type: String,
      required: true,
    },
    id_usuario: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Rutina", RutinaSchema);
