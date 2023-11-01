var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var Schema = mongoose.Schema;

const ObjectID = mongoose.Schema.Types.ObjectId;

var UsuarioSchema = new Schema(
  {
    _id: {
      type: ObjectID,
      auto: true,
    },
    username: {
      type: String,
      required: true,
      validate: [
        function (name) {
          return name.length <= 50;
        },
        "El nombre no deberia exceder los 50 caracteres ",
      ],
    },
    contrasenia: {
      type: String,
      required: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    rutinas: [{ type: ObjectID, ref: "Rutina" }],
    jugadores: [{ type: ObjectID, ref: "Jugador" }],
  },
  { versionKey: false }
);

UsuarioSchema.pre("save", function (next) {
  if (!this.isModified("contrasenia")) {
    return next();
  }
  bcrypt.hash(this.contrasenia, 10, (err, passwordHash) => {
    if (err) {
      return next(err);
    }
    this.contrasenia = passwordHash;
    next();
  });
});

UsuarioSchema.methods.compare = function (password) {
  bcrypt.compare(password, this.contrasenia, (err, isMatch) => {
    if (err) {
      return cb(err);
    } else {
      if (!isMatch) {
        return cb(null, isMatch);
      }
      return cb(null, this);
    }
  });
};

module.exports = mongoose.model("Usuario", UsuarioSchema);
