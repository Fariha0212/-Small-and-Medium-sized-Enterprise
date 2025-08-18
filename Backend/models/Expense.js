const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
