var mongosee = require('mongoose');
var Schema = mongosee.Schema;

var HospitalSchema = new Schema({
    nombre: { type: String, required: [ true, 'El nombre es necesario' ] },
    img: { type:String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'hospitales' });

module.exports = mongosee.model('Hospital', HospitalSchema);