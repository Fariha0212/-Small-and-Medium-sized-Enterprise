import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Sales() {
  const [products, setProducts] = useState([]);
  const [salesItems, setSalesItems] = useState([{ productId: '', quantity: '' }]);
  const [salesHistory, setSalesHistory] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchSales();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch {
      alert('Error fetching products');
    }
  };

  const fetchSales = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/sales');
      setSalesHistory(res.data);
    } catch {
      alert('Error fetching sales');
    }
  };

  const handleSalesItemChange = (index, e) => {
    const newSalesItems = [...salesItems];
    newSalesItems[index][e.target.name] = e.target.value;
    setSalesItems(newSalesItems);
  };

  const addSalesItem = () => {
    setSalesItems([...salesItems, { productId: '', quantity: '' }]);
  };

  const removeSalesItem = (index) => {
    setSalesItems(salesItems.filter((_, i) => i !== index));
  };

  const recordSale = async () => {
    for (const item of salesItems) {
      if (!item.productId || !item.quantity || Number(item.quantity) <= 0) {
        alert('Please fill all sales items correctly');
        return;
      }
    }
    try {
      await axios.post('http://localhost:5000/api/sales', { items: salesItems });
      alert('Sale recorded!');
      setSalesItems([{ productId: '', quantity: '' }]);
      fetchSales();
      fetchProducts(); // Update stock
    } catch {
      alert('Error recording sale');
    }
  };

  return (
    <div>
      <h2>Daily Sales</h2>
      {salesItems.map((item, idx) => (
        <div key={idx} style={{ marginBottom: '10px' }}>
          <select
            name="productId"
            value={item.productId}
            onChange={(e) => handleSalesItemChange(idx, e)}
            style={{ width: '50%', marginRight: '8px' }}
          >
            <option value="">Select Product</option>
            {products.map(p => (
              <option key={p._id} value={p._id}>
                {p.name} (Stock: {p.quantity})
              </option>
            ))}
          </select>
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={item.quantity}
            onChange={(e) => handleSalesItemChange(idx, e)}
            style={{ width: '30%', marginRight: '8px' }}
          />
          {salesItems.length > 1 && (
            <button
              onClick={() => removeSalesItem(idx)}
              style={{ backgroundColor: '#ef4444', color: 'white', borderRadius: '6px', padding: '6px 10px', border: 'none' }}
            >
              X
            </button>
          )}
        </div>
      ))}
      <button onClick={addSalesItem} style={{ marginBottom: '10px' }}>
        + Add Item
      </button>
      <button onClick={recordSale}>Record Sale</button>

      <h3 style={{ marginTop: '30px', textAlign: 'center' }}>Sales History</h3>
      <ul>
        {salesHistory.map((sale) => (
          <li key={sale._id} className="product-card">
            <div>
              {sale.items.map((item, i) => (
                <div key={i}>
                  Product: {products.find(p => p._id === item.productId)?.name || 'Unknown'} | Qty: {item.quantity}
                </div>
              ))}
              <small>Date: {new Date(sale.createdAt).toLocaleString()}</small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sales;
