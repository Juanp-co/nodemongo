var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

exports.verificarMyToken = function (req, res, next){
    var mytok = req.query.token;

    jwt.verify(mytok , SEED, (err, decode)=>{
        if(err) {
            return res.status(401).json({
                ok: false,
                message: 'Token incorrectos',
                errors : err
            })
        }

        req.usuario = decode.usuario;

        next();
        // res.status(200).json({
        //     ok: true,
        //     decode: decode
        // })
    });
}
