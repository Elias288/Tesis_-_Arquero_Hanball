var mongoose = require("mongoose");

var Schema = mongoose.Schema;

const ObjectID = mongoose.Schema.Types.ObjectId;

var SecuenciaSchema = new Schema(
  {
    _id: {
      type: ObjectID,
      auto: true,
    },
    time: {
      type: String,
    },
    ledId: {
      type: Number,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Secuencia", SecuenciaSchema);
