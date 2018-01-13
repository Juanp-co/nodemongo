var mongosee = require('mongoose');
var Schema = mongosee.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var rolesValidos = {
    values: [ 'ADMIN_ROLE', 'USER_ROLE' ],
    message: '{VALUE} no es un rol valido'
};

var usuarioSchema =  new Schema({
    nombre: { type: String, required:[ true, "Nombre requerido" ] },
    email: { type: String, unique:true, required:[ true, "Email requerido" ] },
    password: { type: String, required:[ true, "Contraseña requerido" ] },    
    img: { type: String },    
    rol: { type: String, required:true, default: 'USER_ROLE' ,enum: rolesValidos }   
})

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} de ser unico, lo estas repitiendo' })

module.exports = mongosee.model( 'Usuario', usuarioSchema );