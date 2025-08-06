// Backend/routes/sales.js
const express = require('express');
const router = express.Router();
const Sale = require('../models/sale');
const Product = require('../models/Product');

// Record a sale and deduct stock
router.post('/', async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);

  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (product.quantity < quantity) return res.status(400).json({ message: 'Not enough stock' });

  product.quantity -= quantity;
  await product.save();

  const sale = new Sale({
    product: product.name,
    quantity,
    total: product.price * quantity
  });
  await sale.save();

  res.json(sale);
});

// Get sales history
router.get('/', async (req, res) => {
  const sales = await Sale.find();
  res.json(sales);
});

module.exports = router;

