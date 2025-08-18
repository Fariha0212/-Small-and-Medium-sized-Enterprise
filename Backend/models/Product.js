const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    // low-stock threshold (shop owner can set per product)
    minStock: { type: Number, default: 5, min: 0 },
    // keep optional image string if you ever want to show one
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
