var express = require('express');
var bcrypt = require('bcryptjs');
var app = express();
var Usuario = require('../models/usuario');

var VerToken = require('../middlewares/auth');

// Llamar usuarios
//============================
app.get( '/', (req, res, next) => {
    Usuario.find({}, 'nombre email img rol').exec( (err , usuarios) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                message: 'errors interno del server',
                errors : err
            })
        }
        res.status(200).json({
            usuarios: usuarios
        })
    });
});



// Crear usuarios
//============================
app.post('/', VerToken.verificarMyToken ,(req, res) => {

    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password),
        img: body.img,
        rol: body.rol
    })
    usuario.save( (err, usuarioSave) =>{
        if(err) {
            return res.status(400).json({
                ok: false,
                message: 'errors al guardar',
                errors : err
            })
        }
        usuarioSave.password = ':)';
        res.status(201).json({
            usuario: usuarioSave,
            usuarioToken: req.usuario
        })
    })
});

// Actualizar usuario
//============================

app.put( '/:id', VerToken.verificarMyToken ,(req, res) => {

    var id = req.params.id
    var body = req.body

    Usuario.findById( id, ( err, usuario )=>{

        if(!usuario) {
            return res.status(400).json({
                ok: false,
                message: 'El usuario no existe con ese ID',
                errors : { message: 'El usuario no existe'}
            })
        }
        if(err) {
            return res.status(500).json({
                ok: false,
                message: 'errors al buscar id usuario',
                errors : err
            })
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.rol = body.rol;       

        usuario.save( (err, usuarioGuardado)=>{

            if(err) {
                return res.status(400).json({
                    ok: false,
                    message: 'errors al actualizar usuario',
                    errors : err
                })
            }

            usuarioGuardado.password = ':)'; 

            res.status(200).json({
                ok: true,
                user: usuarioGuardado
            })

        })
    })
});

// Eliminar usuario
//============================

app.delete( '/:id', VerToken.verificarMyToken ,(req, res)=> {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {


        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                message: 'No existe un usuario con ese id',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'errors borrar usuario',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });

});

module.exports = app;