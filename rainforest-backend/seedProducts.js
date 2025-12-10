// seedProducts.js
const { connectDB } = require('./db');
const Product = require('./models/product');

const sampleProducts = [
{
    "id": 1,
    "name": "Sony XM4 Headphones",
    "description": "High-quality Bluetooth headphones with noise cancellation",
    "price": 199.99,
    "imageUrl": "https://m.media-amazon.com/images/I/61oqO1AMbdL._AC_UY436_QL65_.jpg",
    "category": "Electronics",
    "stock": 600
},
{
    "id": 2, 
    "name": "Apple Watch Series 11",
    "description": "Smartwatch with Jet Black Aluminum case with Blacks Sport band",
    "price": 299.99,
    "imageUrl": "https://m.media-amazon.com/images/I/6129OfG4gfL._AC_UY436_QL65_.jpg",
    "category": "Electronics",
    "stock": 700,
},
{
    "id": 3,
    "name": "Nespresso",
    "description": "Coffee and Espresso Maker",
    "price": 89.99,
    "imageUrl": "https://m.media-amazon.com/images/I/51CFNiaVRNL._AC_UL640_QL65_.jpg",
    "category": "Home & Kitchen",
    "stock": 670
},
{
    "id": 4,
    "name": "Backpack",
    "description": "Durable travel backpack with laptop compartment",
    "price": 49.99,
    "imageUrl": "https://www.lttstore.com/cdn/shop/files/PNG_Backpack_Front_-_2000px.png?v=1744226522&width=823",
    "category": "Travel",
},
{        
    "id": 5,
    "name": "Wilson NBA Basketball",
    "description": "Indoor/ Outdoor Basketball",
    "price": 29.99,
    "imageUrl": "https://m.media-amazon.com/images/I/81Wry10rGaL._AC_UL640_QL65_.jpg",
    "category": "Sports",
    "stock": 4000
}
];

async function seed() {
  try {
    await connectDB();
    await Product.deleteMany({});
    const created = await Product.insertMany(sampleProducts);
    console.log('Seeded products:', created.length);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
