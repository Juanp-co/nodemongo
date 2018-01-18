var express = require('express');
var app = express();
var mongoose= require('mongoose');
var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Importar rutas
var appRouter = require('./routes/app');
var medicoRouter = require('./routes/medico');
var usuariosRouter = require('./routes/usuario');
var loginRouter = require('./routes/login');
var hospitalRouter = require('./routes/hospital');
var busquedaRouter = require('./routes/busqueda');
var uploadRouter = require('./routes/upload');
var imgRouter = require('./routes/img');


// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

// Como ver imagenes desde la web con el FileSystem
//============================
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/upload', serveIndex(__dirname + '/upload'));


// Rutas
app.use('/usuarios', usuariosRouter);
app.use('/login', loginRouter);
app.use('/hospital', hospitalRouter);
app.use('/medico', medicoRouter);
app.use('/busqueda', busquedaRouter);
app.use('/upload', uploadRouter);
app.use('/img', imgRouter);
app.use('/', appRouter);


app.listen(3000, () => {
    console.log('Corriendo en el puerto 3000: \x1b[32m%s\x1b[0m','online');
});