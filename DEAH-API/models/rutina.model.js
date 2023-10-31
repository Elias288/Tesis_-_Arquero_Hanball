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
      require: true,
    },
    createDate: {
      type: Date,
      require: true,
    },
    secuencias: {
      type: String,
      require: true,
    },
    createDate: {
      type: Date,
    },
    id_usuario: {
      type: String,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Rutina", RutinaSchema);
