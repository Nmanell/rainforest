const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');
const Product = require('./models/product');
const Order = require('./models/order');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Simulated delay to demonstrate frontend animations 
app.use((req, res, next) => {
  setTimeout(() => next(), 500);
});

connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/submit-order', async (req, res) => {
  try {
    const orderData = req.body;
    const orderNumber = `ORD${Math.floor(Math.random() * 10000)}`;
    const orderDate = new Date().toISOString();
    
    const orderItems = await Promise.all(
      orderData.items.map(async (item) => {
        const product = await Product.findOne({id: item.id});
        if (!product) {
          throw new Error(`Product with id ${item.id} not found`);
        }
        return {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: item.quantity,
          image: product.imageUrl,
        };
      })
    );

    const order = new Order({
      orderNumber,
      date: orderDate,
      customerData: orderData.customerData,
      orderItems
    });

    await order.save();

    res.json({
      orderNumber,
      date: orderDate,
      customerData: orderData.customerData,
      orderItems
    });
  } catch (err) {
    console.error('Error submitting order:', err);
    res.status(500).json({ error: err.message || 'Failed to submit order' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});