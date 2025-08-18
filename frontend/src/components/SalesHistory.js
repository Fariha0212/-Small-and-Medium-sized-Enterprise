import React, { useEffect, useState } from "react";
import axios from "../axios";

const SalesHistory = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    axios.get("/sales").then((res)=>setSales(res.data)).catch(console.error);
  }, []);

  return (
    <div className="card">
      <h2>Sales History</h2>
      <table className="table">
        <thead>
          <tr><th>Date</th><th>Items</th><th>Total (৳)</th></tr>
        </thead>
        <tbody>
          {sales.map((s) => (
            <tr key={s._id}>
              <td>{new Date(s.date).toLocaleString()}</td>
              <td>
                {s.items.map((it) => (
                  <div key={it._id}>
                    {it.product?.name || "Deleted Product"} × {it.quantity} @ ৳{it.priceAtSale}
                  </div>
                ))}
              </td>
              <td>{s.totalAmount}</td>
            </tr>
          ))}
          {sales.length === 0 && <tr><td colSpan="3" style={{textAlign:"center"}}>No sales</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default SalesHistory;
