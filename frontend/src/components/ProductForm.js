import React, { useState } from "react";
import axios from "../axios";

const ProductForm = ({ onProductAdded }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
    minStock: 5,
  });

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        name: form.name.trim(),
        price: Number(form.price),
        quantity: Number(form.quantity),
        category: form.category.trim(),
        minStock: Number(form.minStock),
      };
      const res = await axios.post("/products", body);
      onProductAdded(res.data.product);
      setForm({ name: "", price: "", quantity: "", category: "", minStock: 5 });
      alert("Product added");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error adding product");
    }
  };

  return (
    <form className="card" onSubmit={submit}>
      <h2>Add Product</h2>
      <div className="grid">
        <input name="name" placeholder="Name" value={form.name} onChange={change} required />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={change} required />
        <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={change} required />
        <input name="category" placeholder="Category" value={form.category} onChange={change} required />
        <input name="minStock" type="number" placeholder="Low-stock threshold" value={form.minStock} onChange={change} />
      </div>
      <button type="submit">Add</button>
    </form>
  );
};

export default ProductForm;
