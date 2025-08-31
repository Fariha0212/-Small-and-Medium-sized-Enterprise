import React, { useState } from "react";
import axios from "../axios";
import JsBarcode from "jsbarcode";

const ProductForm = ({ onProductAdded }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
    minStock: 5,
    image: "" // NEW optional field
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const generateBarcode = (text) => {
    try {
      const canvas = document.createElement("canvas");
      JsBarcode(canvas, text || " ", { format: "CODE128", width: 2, height: 40, displayValue: false });
      return canvas.toDataURL("image/png");
    } catch {
      return "";
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.quantity || !form.category) {
      alert("Please fill name, price, quantity, and category.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        price: Number(form.price),
        quantity: Number(form.quantity),
        category: form.category,
        minStock: Number(form.minStock) || 5,
        image: form.image || undefined, // pass only if provided
      };
      const res = await axios.post("/products", payload);
      onProductAdded && onProductAdded(res.data.product || res.data);
      setForm({ name: "", price: "", quantity: "", category: "", minStock: 5, image: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const barcodeSrc = generateBarcode(form.name);

  return (
    <div className="card">
      <h2>Add Product</h2>
      <form className="form" onSubmit={onSubmit}>
        <div className="row">
          <input name="name" placeholder="Name" value={form.name} onChange={onChange} />
          <input name="price" type="number" placeholder="Price" value={form.price} onChange={onChange} />
          <input name="quantity" type="number" placeholder="Qty" value={form.quantity} onChange={onChange} />
          <input name="category" placeholder="Category" value={form.category} onChange={onChange} />
          <input name="minStock" type="number" placeholder="Min" value={form.minStock} onChange={onChange} />
        </div>

        {/* NEW: Image URL input */}
        <div className="row">
          <input
            name="image"
            placeholder="Image URL (optional)"
            value={form.image}
            onChange={onChange}
          />
          {form.image ? (
            <img src={form.image} alt="preview" className="thumb" onError={(e)=>{e.currentTarget.style.display='none';}} />
          ) : null}
        </div>

        {/* Existing barcode preview (kept) */}
        {barcodeSrc ? (
          <div className="row" style={{ alignItems: "center" }}>
            <img src={barcodeSrc} alt="barcode" />
            <span style={{ color: "#777" }}>Auto barcode (based on name)</span>
          </div>
        ) : null}

        <div className="row">
          <button type="submit" disabled={loading}>{loading ? "Saving..." : "Add Product"}</button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
