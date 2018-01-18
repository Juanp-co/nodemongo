var mongosee = require('mongoose');
var Schema = mongosee.Schema;

var medicoSchema = new Schema({
    nombre: { type: String, required: [ true, 'El nombre es requerido' ] } ,
    img: { type: String, required: false } ,
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true } ,
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [ true, 'El hospital es necesario' ] }
})

module.exports = mongosee.model('Medico', medicoSchema);