var express = require('express');
var app = express();
var Hospital = require('../models/hospital');
var VerToken = require('../middlewares/auth');

app.get('/', (req, res)=>{

    var desde = req.query.desde;
    desde = Number(desde);

    Hospital.find({}, 'nombre img usuario')
    .skip(desde)
    .limit(5)
    .populate('usuario', 'email nombre')
    .exec( (err, hospitales)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error interno al llamar hospitales',
                error: err
            })
        }
        Hospital.count({}, (err, total)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    message: 'Error interno al contar hospitales',
                    error: err
                })
            }
            res.status(200).json({
                ok: true,
                hospitales: hospitales,
                total: total
            })
        })

    })
})

app.post('/', VerToken.verificarMyToken ,(req, res)=>{
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario
    })
    hospital.save( (err, hospitalSave)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error interno al crear hospital',
                error: err
            })
        }
        res.status(201).json({
            ok: true,
            message: 'Creado con exito',
            hospital: hospitalSave
        })
    })
});

app.put('/:id', VerToken.verificarMyToken ,(req, res)=>{
    var body = req.body;
    var id = req.params.id;
    Hospital.findById(id, (err, myHospital)=>{
        if(!myHospital){
            return res.status(404).json({
                ok: false,
                message: 'Ningun hospital con ese ID',
                errors: { message: 'Ningun hospital con ese ID' }
            })
        }
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error interno al buscar y actualizar hospital',
                error: err
            })
        }

        myHospital.nombre = body.nombre;
        myHospital.img = body.img;
        myHospital.usuario = req.usuario;

        myHospital.save( (err, hospitalUpdate)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    message: 'Error al actualizar hospital',
                    error: err
                })
            }
            res.status(201).json({
                ok: true,
                message: 'Hospital actualizado con exito',
                hospital: hospitalUpdate
            })
        })
    })
})

app.delete('/:id', VerToken.verificarMyToken ,(req, res)=>{

    var body = req.body;
    var id = req.params.id;

    Hospital.findByIdAndRemove( id, (err, hospitalDeleted)=>{
        if(!hospitalDeleted){
            return res.status(404).json({
                ok: false,
                message: 'Ningun hospital con ese ID',
                errors: { message: 'Ningun hospital con ese ID' }
            })
        }
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error al eliminar hospital',
                error: err
            })
        }
        
        res.status(200).json({
            ok: true,
            message: 'Hospital eliminado con exito',
            hospital: hospitalDeleted
        })

    })

})

module.exports = app;