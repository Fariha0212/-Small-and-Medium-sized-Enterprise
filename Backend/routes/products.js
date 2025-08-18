const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET all products
router.get("/", async (_req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving products", error: err.message });
  }
});

// GET low-stock products
router.get("/low-stock", async (_req, res) => {
  try {
    const low = await Product.find({ $expr: { $lte: ["$quantity", "$minStock"] } });
    res.json(low);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving low stock", error: err.message });
  }
});

// ADD new product
router.post("/", async (req, res) => {
  try {
    const { name, price, quantity, category, minStock } = req.body;
    if (!name || price == null || quantity == null || !category) {
      return res.status(400).json({ message: "All fields (name, price, quantity, category) are required" });
    }
    if (price < 0 || quantity < 0) {
      return res.status(400).json({ message: "Price and quantity must be non-negative" });
    }

    const newProduct = new Product({ name, price, quantity, category, minStock });
    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    res.status(500).json({ message: "Error adding product", error: err.message });
  }
});

// EDIT product
router.put("/:id", async (req, res) => {
  try {
    const { name, price, quantity, category, minStock } = req.body;
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, quantity, category, minStock },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product updated", product: updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating product", error: err.message });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const del = await Product.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err.message });
  }
});

module.exports = router;
