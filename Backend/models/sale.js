const mongoose = require("mongoose");

const saleItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: [1, "Quantity must be at least 1"] },
  priceAtSale: { type: Number, required: true, min: 0 }, // snapshot of product price
});

const saleSchema = new mongoose.Schema(
  {
    items: [saleItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sale", saleSchema);
