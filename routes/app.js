var express = require('express');
var app = express();

app.get( '/', (req, res, next) => {
    res.status('200').json({
        Estado: 'ok',
        Titilo: 'Entonces'
    })
});

module.exports = app;