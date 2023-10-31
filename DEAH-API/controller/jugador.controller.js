const JugadorRepository = require('../repositories/jugador.repository');
const BaseController = require('./base.controller');
const JugadorSchema = require('../models/jugador.model')
const UsuarioSchema = require('../models/usuario.model')

class JugadorController extends BaseController {
    constructor() {
        super(JugadorRepository);
    }
    add = async (req, res) => {
        const body = req.body;
        const { user_id } = req;

        try {
            const usuario = await UsuarioSchema.findById(user_id)
            const jugador = new JugadorSchema({ ...body })
            //console.log("usuario: ", usuario)

            const savedJugador = await jugador.save()
            usuario.jugadores.push(savedJugador._id)
            await usuario.save()

            //console.log("jugador: ",savedJugador)
            res.status(201).send(savedJugador)
        } catch (error) {
            //console.log("error: ",error);
            res.status(404).send(error)
        }
    }
    asignarRutina(req, res) {
        return JugadorSchema.findOneAndUpdate(
            { _id: req.body.id_jugador },
            {
                $push: {
                    rutinas: req.body.rutinaId
                }
            }).then(result => {
                res.status(200).json({ message: "Rutina asignada con exito" });
            })
    }
    asignarResultado(req, res) {
        return JugadorSchema.findOneAndUpdate(
            { _id: req.body.id_jugador },
            {
                $push: {
                    resultados: req.body.resultadoId
                }
            }).then(result => {
                res.status(200).json({ message: "Resultado asignada con exito" });
            })
    }
    getrutinas(req, res) {
        return JugadorSchema.findOne(
            { _id: req.body.id_jugador }
        ).populate('rutinas').then(result => {
            res.status(200).json({ result })
        })
    }
    getresultados(req, res) {
        return JugadorSchema.findOne(
            { _id: req.body.id_jugador }
        ).populate('resultados').then(result => {
            res.status(200).json({ result })
        })
    }
}
module.exports = JugadorController;