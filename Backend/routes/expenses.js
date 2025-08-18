const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// GET all expenses
router.get("/", async (_req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving expenses", error: err.message });
  }
});

// ADD expense
router.post("/", async (req, res) => {
  try {
    const { category, amount, date, note } = req.body;
    if (!category || amount == null) {
      return res.status(400).json({ message: "Category and amount are required" });
    }
    if (amount < 0) {
      return res.status(400).json({ message: "Amount must be non-negative" });
    }
    const expense = new Expense({ category, amount, date, note });
    await expense.save();
    res.status(201).json({ message: "Expense added", expense });
  } catch (err) {
    res.status(500).json({ message: "Error adding expense", error: err.message });
  }
});

module.exports = router;
