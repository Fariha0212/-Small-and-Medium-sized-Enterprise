import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Inventory() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', quantity: '', category: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch {
      alert('Error fetching products');
    }
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const addProduct = async () => {
    if (!form.name || !form.price || !form.quantity || !form.category) {
      alert('Please fill all fields');
      return;
    }
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/products/${editId}`, form);
        setEditId(null);
      } else {
        await axios.post('http://localhost:5000/api/products', form);
      }
      setForm({ name: '', price: '', quantity: '', category: '' });
      fetchProducts();
    } catch {
      alert('Error saving product');
    }
  };

  const editProduct = (p) => {
    setForm({ name: p.name, price: p.price, quantity: p.quantity, category: p.category });
    setEditId(p._id);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure to delete?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
    } catch {
      alert('Error deleting product');
    }
  };

  return (
    <div>
      <h2>Products</h2>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} />
      <input type="number" name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} />
      <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
      <button onClick={addProduct}>{editId ? 'Update Product' : 'Add Product'}</button>

      <ul>
        {products.map(p => (
          <li key={p._id} className="product-card">
            {p.name} | ₹{p.price} | Qty: {p.quantity} | {p.category}
            <div>
              <button onClick={() => editProduct(p)}>Edit</button>
              <button onClick={() => deleteProduct(p._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Inventory;
