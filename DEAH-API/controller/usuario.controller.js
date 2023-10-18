const UsuarioRepository = require('../repositories/usuario.repository');
const BaseController = require('./base.controller');
const UsuarioSchema = require('../models/usuario.model')

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
                //console.log(usuario);
                if (!usuario) {
                    //console.log('Usuario no encontrado');
                    return res.status(401).json({
                        error: new Error({ msg: 'Usuario no encontrado' })
                    });
                }
                //console.log('req.body.contrasenia: ', req.body.contrasenia, '\n');
                //console.log('usuario.contrasenia: ', usuario.contrasenia, '\n');
                bcrypt.compare(req.body.contrasenia, usuario.contrasenia).then(
                    (valid) => {
                        //console.log('valid: ', valid);
                        if (!valid) {
                            //console.log('Contrasenia incorrecta');
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
}
module.exports = UsuarioController;