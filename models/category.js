let mongoose = require('mongoose');
require('dotenv').config();

let Schema = mongoose.Schema;

let CategorySchema = new Schema(
    {
        name: {type: String, required: true},
        description: {type: String, required: true},
        type: {type: String, required: true, enum: ['Bike', 'Component', 'Accessory'], default: 'Component'},
    }
)

CategorySchema
.virtual('url')
.get(function () {
  return '/inventory/category/' + this._id;
});


module.exports = mongoose.model('Category', CategorySchema);