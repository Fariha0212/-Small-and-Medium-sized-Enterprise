// src/components/SalesForm.js
import React, { useEffect, useState } from "react";
import axios from "../axios";
import BarcodeScanner from "./BarcodeScanner"; // NEW

const SalesForm = ({ onSaleDone }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]); // {productId, name, price, qty, image?}
  const [showScanner, setShowScanner] = useState(false); // NEW

  useEffect(() => {
    axios.get("/products").then((res) => setProducts(res.data)).catch(console.error);
  }, []);

  const addItem = (productId) => {
    const p = products.find((x) => x._id === productId);
    if (!p) return;
    setCart((prev) => {
      const exists = prev.find((i) => i.productId === productId);
      if (exists) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { productId, name: p.name, price: p.price, qty: 1, image: p.image || "" }];
    });
  };

  const changeQty = (productId, qty) => {
    setCart((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, qty: Number(qty) } : i))
    );
  };

  const removeItem = (productId) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Add items first");

    try {
      const items = cart.map((i) => ({ product: i.productId, quantity: i.qty }));
      const res = await axios.post("/sales", { items });
      alert("Sale recorded. Total: " + res.data.sale.totalAmount);
      setCart([]);
      onSaleDone && onSaleDone();
    } catch (err) {
      alert(err.response?.data?.message || "Sale failed");
    }
  };

  // NEW: when a barcode is detected, try matching a product and add to cart
  const onScanDetected = (code) => {
    // Try by _id (recommended if you print labels from _id)
    let match =
      products.find(p => String(p._id) === String(code)) ||
      // optional: custom "barcode" field if you add later to your schema
      products.find(p => String(p.barcode || "") === String(code)) ||
      // fallback: by name (exact match, case-insensitive)
      products.find(p => (p.name || "").toLowerCase() === String(code).toLowerCase());

    if (match) {
      addItem(match._id);
      setShowScanner(false); // auto-close after a successful scan
    } else {
      // keep scanner open so user can try again
      console.warn("Scanned code not found:", code);
    }
  };

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="card max-w-md mx-auto p-4">
      <h2 className="text-center">New Sale</h2>

      {/* NEW: scan toggle */}
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ color: "#777" }}>Tip: Print labels in Products, then scan here to add instantly.</div>
        <button onClick={() => setShowScanner((s) => !s)}>
          {showScanner ? "Close Scanner" : "Scan"}
        </button>
      </div>
      {showScanner && <BarcodeScanner once onDetected={onScanDetected} />}

      <div className="grid two">
        <div>
          <h3>Products</h3>
          <ul className="list">
            {products.map((p) => (
              <li key={p._id}>
                <span>{p.name} — ৳{p.price} (Stock: {p.quantity})</span>
                <button onClick={() => addItem(p._id)}>Add</button>
              </li>
            ))}
            {products.length === 0 && <li style={{ color: "#777" }}>No products</li>}
          </ul>
        </div>

        <form onSubmit={submit}>
          <h3>Items in Sale</h3>
          {cart.map((i) => (
            <div className="row" key={i.productId}>
              <span>{i.name} (৳{i.price})</span>
              <input
                type="number"
                min="1"
                value={i.qty}
                onChange={(e) => changeQty(i.productId, e.target.value)}
              />
              <button type="button" className="danger" onClick={() => removeItem(i.productId)}>
                Remove
              </button>
            </div>
          ))}
          <div className="row total">
            <strong>Total:</strong>
            <span>৳{total}</span>
          </div>
          <button type="submit">Record Sale</button>
        </form>
      </div>
    </div>
  );
};

export default SalesForm;
