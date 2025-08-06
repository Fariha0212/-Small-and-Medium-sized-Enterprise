// Backend/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
  category: String
});

module.exports = mongoose.model('Product', productSchema);
