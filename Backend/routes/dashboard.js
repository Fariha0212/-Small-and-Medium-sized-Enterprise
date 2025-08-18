const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Sale = require("../models/Sale");
const Expense = require("../models/Expense");

// Overview: inventory value, total sales, category counts, low-stock list
router.get("/", async (_req, res) => {
  try {
    const products = await Product.find();
    const sales = await Sale.find();

    const totalInventoryValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const totalSalesAmount = sales.reduce((sum, s) => sum + s.totalAmount, 0);

    const categoryCount = {};
    products.forEach((p) => {
      categoryCount[p.category] = (categoryCount[p.category] || 0) + p.quantity;
    });

    const lowStock = products.filter((p) => p.quantity <= p.minStock);

    res.json({ totalInventoryValue, totalSalesAmount, categoryCount, lowStock });
  } catch (err) {
    res.status(500).json({ message: "Error fetching dashboard", error: err.message });
  }
});

// Profit/Loss for a date (default: today)
router.get("/profitloss", async (req, res) => {
  try {
    const dateStr = req.query.date; // optional YYYY-MM-DD
    const d = dateStr ? new Date(dateStr) : new Date();
    const start = new Date(d); start.setHours(0, 0, 0, 0);
    const end = new Date(d); end.setHours(23, 59, 59, 999);

    const sales = await Sale.find({ date: { $gte: start, $lte: end } });
    const expenses = await Expense.find({ date: { $gte: start, $lte: end } });

    const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const profitLoss = totalRevenue - totalExpense;

    res.json({ date: start.toISOString(), totalRevenue, totalExpense, profitLoss });
  } catch (err) {
    res.status(500).json({ message: "Error fetching profit/loss", error: err.message });
  }
});

module.exports = router;
