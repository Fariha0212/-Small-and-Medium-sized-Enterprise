import React, { useState } from "react";
import axios from "../axios";
import BarcodeImage from "./BarcodeImage";

const ProductList = ({ products, onProductUpdated, onProductDeleted }) => {
  const [editingId, setEditingId] = useState(null);
  const [edit, setEdit] = useState({
    name: "",
    price: 0,
    quantity: 0,
    category: "",
    minStock: 5,
  });

  const startEdit = (p) => {
    setEditingId(p._id);
    setEdit({
      name: p.name || "",
      price: p.price ?? 0,
      quantity: p.quantity ?? 0,
      category: p.category || "",
      minStock: p.minStock ?? 5,
    });
  };

  const saveEdit = async (id) => {
    try {
      const payload = {
        name: edit.name,
        price: Number(edit.price),
        quantity: Number(edit.quantity),
        category: edit.category,
        minStock: Number(edit.minStock),
      };
      const res = await axios.put(`/products/${id}`, payload);
      onProductUpdated(res.data.product || res.data);
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`/products/${id}`);
      onProductDeleted(id);
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="card">
      <h2>Product List</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Min</th>
            <th>Edit</th>
            <th>Delete</th>
            <th>Barcode</th>
          </tr>
        </thead>

        <tbody>
          {(products || []).map((p) => {
            const low = p.quantity <= (p.minStock ?? 5);
            const isEditing = editingId === p._id;

            return (
              <tr key={p._id} className={low ? "low" : ""}>
                <td>
                  {isEditing ? (
                    <input
                      value={edit.name}
                      onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                    />
                  ) : (
                    p.name
                  )}
                </td>

                <td>
                  {isEditing ? (
                    <input
                      value={edit.category}
                      onChange={(e) =>
                        setEdit({ ...edit, category: e.target.value })
                      }
                    />
                  ) : (
                    p.category
                  )}
                </td>

                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      value={edit.price}
                      onChange={(e) =>
                        setEdit({ ...edit, price: e.target.value })
                      }
                    />
                  ) : (
                    p.price
                  )}
                </td>

                <td>
                  {isEditing ? (
                    <input
                      className="qty-input"
                      type="number"
                      value={edit.quantity}
                      onChange={(e) =>
                        setEdit({ ...edit, quantity: e.target.value })
                      }
                    />
                  ) : (
                    p.quantity
                  )}
                </td>

                <td>
                  {isEditing ? (
                    <input
                      className="qty-input"
                      type="number"
                      value={edit.minStock}
                      onChange={(e) =>
                        setEdit({ ...edit, minStock: e.target.value })
                      }
                    />
                  ) : (
                    p.minStock ?? 5
                  )}
                </td>

                <td>
                  {isEditing ? (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => saveEdit(p._id)}>Save</button>
                      <button className="ghost" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => startEdit(p)}>Edit</button>
                  )}
                </td>

                <td>
                  {!isEditing && (
                    <button className="danger" onClick={() => del(p._id)}>
                      Delete
                    </button>
                  )}
                </td>

                {/* Barcode moved to the last column */}
                <td>
                  <div
                    style={{
                      width: 120,
                      overflow: "hidden",
                    }}
                  >
                    <BarcodeImage
                      value={p._id}
                      height={38}
                      displayValue={false}
                      barWidth={1}
                    />
                  </div>
                </td>
              </tr>
            );
          })}

          {(!products || products.length === 0) && (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No products
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
