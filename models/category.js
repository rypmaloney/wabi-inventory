let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let itemSchema = new Schema(
    {
        name: {type: String, required: true},
        description: {type: String, required: true},
        category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
        type: {type: String, required: true, enum: ['Bike', 'Component', 'Accessory'], default: 'Component'},
        size: String,
        color: String, 
        price: { type: Number, min: 0, max: 10000, required: true }, 
        stock: { type: Number, min: 0, max: 10000, required: true }, 
    }
)