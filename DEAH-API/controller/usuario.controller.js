const UsuarioRepository = require('../repositories/usuario.repository');
const BaseController = require('./base.controller');
const UsuarioSchema = require('../models/usuario.model')
const RutinaSchema = require('../models/rutina.model')

var bcrypt = require('bcrypt');

const jwt = require("jsonwebtoken");

const JWebToken = process.env.JWT_Secret;

class UsuarioController extends BaseController {
    constructor() {
        super(UsuarioRepository);
    }
    login = (req, res, next) => {
        UsuarioSchema.findOne({ username: req.body.username }).then(
            (usuario) => {
                if (!usuario) {
                    return res.status(401).json({
                        error: new Error({ msg: 'Usuario no encontrado' })
                    });
                }
                bcrypt.compare(req.body.contrasenia, usuario.contrasenia).then(
                    (valid) => {
                        if (!valid) {
                            return res.status(401).json({
                                error: new Error({ msg: 'Contrasenia incorrecta' })
                            });
                        }
                        const token = jwt.sign(
                            { userID: usuario._id },
                            JWebToken,
                            { expiresIn: '24h' });
                        res.status(200).json({
                            userID: usuario._id,
                            token: token
                        });
                    }
                )
            }
        )
    }
    asignarRutina = async (req, res) => {
        const { user_id } = req;

        try {
            const loggedUser = await UsuarioSchema.findById(user_id)

            const rutina = await RutinaSchema.findById(req.body.id_rutina)

            loggedUser.rutinas.push(rutina._id)
            res.status(201).send(loggedUser)
        } catch (error) {
            res.status(404).send(error)
        }
    }
    jugadorlist(req, res) {
        const { user_id } = req;
        return UsuarioSchema.findOne(
            { _id: user_id }
        ).populate('jugadores').then(result => {
            res.status(200).json({ result })
        })
    }
    rutinalist(req, res) {
        const { user_id } = req;
        return UsuarioSchema.findOne(
            { _id: user_id }
        ).populate('rutinas').then(result => {
            res.status(200).json({ result })
        })
    }
}
module.exports = UsuarioController;