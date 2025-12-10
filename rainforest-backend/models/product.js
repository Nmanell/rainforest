const { Schema, model } = require('mongoose');

const ProductSchema = new Schema({
    id: { type: Number, required: true, index: true},
    name: { type: String, required: true, index: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, default: '' }, 
    stock: { type: Number, default: 9999, min: 0 }, 
});

module.exports = model('Product', ProductSchema);
