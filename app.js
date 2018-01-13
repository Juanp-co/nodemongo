var express = require('express');
var mongosee= require('mongoose');
var bodyParser = require('body-parser');

var app = express();


// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Importar rutas
var appRouter = require('./routes/app');
var usuariosRouter = require('./routes/usuario');
var loginRouter = require('./routes/login');

mongosee.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res)=>{
    if( err) {throw err}
    console.log('Corriendo base de datos: \x1b[32m%s\x1b[0m','online');

});

// Rutas
app.use('/usuarios', usuariosRouter);
app.use('/login', loginRouter);
app.use('/', appRouter);


app.listen(3000, () => {
    console.log('Corriendo en el puerto 3000: \x1b[32m%s\x1b[0m','online');
});