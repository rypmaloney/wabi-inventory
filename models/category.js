let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let CategorySchema = new Schema(
    {
        name: {type: String, required: true},
        description: {type: String, required: true},
        type: {type: String, required: true, enum: ['Bike', 'Component', 'Accessory'], default: 'Component'},
    }
)


module.exports = mongoose.model('Category', CategorySchema);