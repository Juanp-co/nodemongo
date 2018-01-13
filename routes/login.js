var express = require('express');
var bcrypt = require('bcryptjs');
var Usuario = require('../models/usuario');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

app.post('/', (req, res)=>{

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, userDB)=>{

        if(err) {
            return res.status(500).json({
                ok: false,
                message: 'Error interno del server',
                errors : err
            })
        }
        if(!userDB){
            return res.status(400).json({
                ok: false,
                message: 'Error de credenciales - email',
            }) 
        }
        if(!bcrypt.compareSync( body.password, userDB.password )){
            return res.status(400).json({
                ok: false,
                message: 'Error de credenciales - password',
            }) 
        }

        // Crear un token
        //============================
        userDB.password = ':)';
        var token = jwt.sign({ usuario: userDB }, SEED, { expiresIn: 14400 }) //14400 son 4 horas para expirar

        res.status(200).json({
            ok: true,
            usuario: userDB,
            token: token,
            id: userDB._id
        })
    

    })


})



module.exports = app;