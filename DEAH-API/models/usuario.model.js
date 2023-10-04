var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const ObjectID = mongoose.Schema.Types.ObjectId;

var UsuarioSchema = new Schema({
    _id: {
        type: ObjectID,
        auto: true
    },
    username: {
        type: String,
        required: true,
        validate: [
            function (name) {
                return name.length <= 50;
            },
            'El nombre no deberia exceder los 50 caracteres '],
    },
    contrasenia: {
        type: String,
        required: true,
    },
    nombre: {
        type: String,
    },
    rutinas: { type: ObjectID, ref: 'Rutina' },
}, { versionKey: false });

// Exportar el modelo
module.exports = mongoose.model('Usuario', UsuarioSchema);
/*
Id_usuario: String
Nombre: String
Rutinas: Array<Id_rutina>
*/