const express = require('express');
const cors = require('cors');
const fs = require("fs");
const Product = require('./models/product');
const Order = require('./models/order');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const products = require("./products.json");
const orders = require("./orders.json");

connectionDB();

app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.send(products);
});

app.post('/api/submit-order', async (req, res) => {
    const orderData = req.body;
    const orderNumber = `ORD${Math.floor(Math.random() * 10000)}`;
    const orderDate = Date().toString();

    const orderItems = await Promise.all(
        orderData.items.map(async (item) => {
            const product = await Product.findOne({id: item.id});
            return {
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: item. quantity
            };
        })
    );
    
    const order = new Order ({
        "orderNumber": orderNumber,
        "date": orderDate,
        "customerData": orderData.customerData,
        "orderItems": orderItems
    });
    
    await order.save();
    console.log('Order saved to MongoDB');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});