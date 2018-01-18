var express = require('express');
var app = express();

var Medico = require('../models/medico');
var verToken = require('../middlewares/auth');


app.get('/', (req, res)=>{

    var desde = req.query.desde;
    desde = Number(desde);

    Medico.find({}, 'nombre img hospital usuario')
    .skip(desde)
    .limit(5)
    .populate('usuario', 'email nombre')
    .populate('hospital', 'nombre')
    .exec( (req, medicos)=>{

        Medico.count({}, (err, total)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    message: 'Error interno base de datos',
                    errors: { message: err }
                })
            }
            res.status(200).json({
                ok: true,
                medicos: medicos,
                total: total
            })
        })

    })
})

app.post('/', verToken.verificarMyToken ,(req, res)=>{
    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospital
    })
    medico.save( (err, medicoFind)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error interno base de datos',
                errors: { message: err }
            })
        }
        res.status(201).json({
            ok: true,
            medico: medicoFind,
            message: 'Medico guardado'
        })
    })  
})

app.put('/:medicoId', verToken.verificarMyToken ,(req, res)=>{
    var id = req.params.medicoId;
    var body = req.body;
    
    Medico.findById( id,(err, medicoFind)=>{
        
        if(!medicoFind){
            return res.status(404).json({
                ok: false,
                message: 'No se enecontro medico con este ID'
            })
        }
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error en interno desde actualizar medico'
            })
        }

        medicoFind.nombre = body.nombre;
        medicoFind.img = body.img;
        medicoFind.hospital = body.hospital;
        medicoFind.usuario = req.usuario._id;

        medicoFind.save( (err, medicoSave)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    message: 'Error en interno desde actualizar medico'
                })
            }
            res.status(200).json({
                ok: true,
                message:'Medico actualizado',
                medico: medicoSave
            })
        })
    })
})


app.delete('/:medicoId', verToken.verificarMyToken, (req, res)=>{
    var id = req.params.medicoId;
    var body = req.body;

    Medico.findByIdAndRemove( id, (err, medicoDeleted)=>{
        if(!medicoDeleted){
            return res.status(404).json({
                ok: false,
                message: 'No se enecontro medico con este ID'
            })
        }
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error en interno desde eliminar medico'
            })
        }
        res.status(200).json({
            ok: true,
            message:'Medico eliminado',
            medico: medicoDeleted
        })
    })

})

module.exports = app;