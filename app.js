var express = require('express');
var mongosee= require('mongoose');

var app = express();

mongosee.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res)=>{
    if( err) {throw err}
    console.log('Corriendo base de datos: \x1b[32m%s\x1b[0m','online');

});

app.get( '/', (req, res, next) => {
    res.status('200').json({
        Estado: 'ok',
        Titilo: 'Entonces'
    })
});

app.listen(3000, () => {
    console.log('Corriendo en el puerto 3000: \x1b[32m%s\x1b[0m','online');
});