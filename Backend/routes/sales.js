const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");
const Product = require("../models/Product");

// GET all sales
router.get("/", async (_req, res) => {
  try {
    const sales = await Sale.find().populate("items.product").sort({ createdAt: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving sales", error: err.message });
  }
});

// RECORD a sale & deduct stock
router.post("/", async (req, res) => {
  try {
    const { items } = req.body; // [{ product: id, quantity }]
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No sale items provided" });
    }

    // validate & compute totals, also ensure stock
    let totalAmount = 0;
    const saleItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.product}` });

      const qty = Number(item.quantity || 0);
      if (qty < 1) return res.status(400).json({ message: `Invalid quantity for ${product.name}` });

      if (product.quantity < qty) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      // deduct stock
      product.quantity -= qty;
      await product.save();

      const lineAmount = product.price * qty;
      totalAmount += lineAmount;

      saleItems.push({
        product: product._id,
        quantity: qty,
        priceAtSale: product.price,
      });
    }

    const sale = new Sale({ items: saleItems, totalAmount });
    await sale.save();

    res.status(201).json({ message: "Sale recorded", sale });
  } catch (err) {
    res.status(500).json({ message: "Error recording sale", error: err.message });
  }
});

module.exports = router;
