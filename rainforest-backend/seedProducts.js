const { connectDB } = require('./db');
const Product = require('./models/product');
const fs = require('fs');
const path = require('path');

const sampleProducts = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8')
);

async function seed() {
  try {
    await connectDB();
    await Product.deleteMany({});
    const created = await Product.insertMany(sampleProducts);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
