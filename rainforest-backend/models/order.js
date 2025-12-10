
// models/order.js
const { Schema, model, Types } = require('mongoose');

const OrderItemSchema = new Schema({
    productId: { type: Number, requried: true }, 
    name: { type: String, required: true }, 
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 }, 
});

const OrderSchema = new Schema({
    orderNumber: { type: String, required: true, unique: true, index: true },
    date: { type: Date, default: Date.now }, 
    orderItems: { type: [OrderItemSchema], required: true },
    customerData: { 
        firstName: { type: String, required: true },
        lastName: { type: String },
        email: { type: String, required: true }, 
        address: { 
            street: {type: String, required: true},
            line2: {type: String},
            city: {type: String, required: true},
            zipCode: {type: String, required: true},
            country: {type: String, requried: true}
        }
    },
}, { timestamps: true });

module.exports = model('Order', OrderSchema);