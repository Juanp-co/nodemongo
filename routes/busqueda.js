var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');

app.get('/coleccion/:colec/:term', (req, res, next)=>{

    colec = req.params.colec;
    term =  req.params.term;
    regex = new RegExp(term, 'i');

    if( colec == 'medico' ){
        buscarMedicos(term, regex).then(resultado =>{
            res.status('200').json({
            Estado: 'ok',
            Medicos: resultado
        })
        })
    } else if (colec === 'hospital') {
        buscarHospitales(term, regex).then(resultado =>{
            res.status('200').json({
            Estado: 'ok',
            Hospitales: resultado
        })
        })
    } else if (colec === 'usuario') {
        buscarusuarios(term, regex).then(resultado =>{
            res.status('200').json({
            Estado: 'ok',
            Usuarios: resultado
        })
        })
    } else {
        res.status('200').json({
            Estado: 'ok',
            mensaje: 'El termino' + term + 'no es una coleccion'
        })
    }
})

app.get( '/todo/:term', (req, res, next) => {
    term = req.params.term;
    regex = new RegExp(term, 'i');


    Promise.all( [ buscarHospitales(term, regex), buscarMedicos(term, regex), buscarusuarios(term, regex) ] )
        .then(resultado =>{

        res.status('200').json({
            Estado: 'ok',
            Hospitales: resultado[0],
            Medicos: resultado[1],
            Usuarios: resultado[2]
        })
    })   
});

function buscarHospitales(busqueda, regex ) {
    return new Promise( (resolve, reject)=>{
        Hospital.find()
        .populate('usuario', 'nombre')
        .exec({ nombre: regex }, (err, resultado)=>{
            if(err){
                reject('Error en la busqueda de hospitales', err)
            } else {
                resolve(resultado)
            }
        })
    })
}

function buscarMedicos(busqueda, regex ) {
    return new Promise( (resolve, reject)=>{
        Medico.find({ nombre: regex }, (err, resultado)=>{
            if(err){
                reject('Error en la busqueda de medicos', err)
            } else {
                resolve(resultado)
            }
        })
    })
}

function buscarusuarios(busqueda, regex ) {
    return new Promise( (resolve, reject)=>{
        Usuario.find({}, 'nombre email rol')
            .or([{ 'nombre': regex },{ 'email': regex }])
            .exec(
            (err, resultado)=>{
            if(err){
                reject('Error en la busqueda de hospitales', err)
            } else {
                resolve(resultado)
            }
        })
    })
}

module.exports = app;