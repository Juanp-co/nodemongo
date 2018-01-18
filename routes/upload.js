var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');


app.use(fileUpload());

app.put('/:tipo/:id', (req, res) => {

    var tipo = req.params.tipo;
    var id =  req.params.id;

    if (!req.files){
        return res.status(400).json({
            ok: false,
            message: 'No subiste ningun archivo'
        });
    }

    var folders = [ 'hospitales', 'usuarios', 'medicos' ];
    
    if( folders.indexOf(tipo) < 0 ){
        return res.status(400).json({
            ok: false,
            message: 'Carpetas permitidas ' + folders.join(', ')
        });
    }
    
    // Extencion imagen
    var file = req.files.imagen;
    var nombreFile = file.name.split('.');
    var extencion = nombreFile[ nombreFile.length - 1 ]
    var nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extencion}`;

    // Extenciones permitidas
    var extenciones = [ 'png', 'jpg', 'jpeg', 'gif' ];
    if( extenciones.indexOf(extencion) < 0 ){
        return res.status(400).json({
            ok: false,
            message: 'Estenciones permitidas' + extenciones.join(', ')
        });
    }
    var path = `upload/${tipo}/${nombreArchivo}`;

    file.mv( path, (err)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error al guardar el archivo',
                errors: { message: err }
            });
        }
     
    subirPorTipo(id, tipo, nombreArchivo, res);
        
       
    })
});


function subirPorTipo(id, tipo, nombreArchivo, res ){
  

    if( tipo === 'usuarios' ) {

        Usuario.findById(id, (err, usuarioFind)=>{
            
            if(!usuarioFind){
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                })
            }
            // Verificar si el archivo existe
            borrarArchivo(tipo, usuarioFind);

            usuarioFind.img = nombreArchivo;
            usuarioFind.save( (err, usuarioSave)=>{

                usuarioSave.password = ':)'

                return res.status('200').json({
                    Estado: 'ok',
                    Titilo: 'Imagen actualizada',
                    Usuario: usuarioSave
                })
            })

        })

    } else if( tipo === 'hospitales' ){

        Hospital.findById(id, (err, hospitalFind)=>{

            if(!hospitalFind){
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Hospital no existe',
                    errors: { message: 'Hospital no existe' }
                })
            }
            // Verificar si el archivo existe
            borrarArchivo(tipo, hospitalFind);

            hospitalFind.img = nombreArchivo;

            hospitalFind.save( (err, hospitalSave)=>{
                return res.status(200).json({
                    Estado: 'ok',
                    Titilo: 'Imagen actualizada',
                    Usuario: hospitalSave
                })
            })
        })

    } else if( tipo === 'medicos' ){

        Medico.findById( id, (err, medicoFind)=>{
            if(!medicoFind){
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Medico no existe',
                    errors: { message: 'Medico no existe' }
                })
            }
            borrarArchivo(tipo, medicoFind);

            medicoFind.img = nombreArchivo;
            medicoFind.save( (err, medicoSave)=>{
                return res.status(200).json({
                    Estado: 'ok',
                    Titilo: 'Imagen actualizada',
                    Usuario: medicoSave
                })
            })
        })
        
    }

}

function borrarArchivo(tipo, hospitalFind){
    var pathViejo = `./upload/${tipo}/` + hospitalFind.img;
    if( fs.existsSync(pathViejo) ){
        fs.unlink(pathViejo)
    }
}

module.exports = app;