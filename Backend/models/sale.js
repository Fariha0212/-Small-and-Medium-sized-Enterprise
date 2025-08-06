// Backend/models/Sale.js
const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  product: String,
  quantity: Number,
  total: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sale', saleSchema);
