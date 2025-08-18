import React, { useEffect, useState } from "react";
import axios from "../axios";

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [pl, setPl] = useState(null);
  const [date, setDate] = useState("");

  const loadOverview = () => axios.get("/dashboard").then((r)=>setOverview(r.data)).catch(console.error);
  const loadPL = (d) => axios.get(`/dashboard/profitloss${d?`?date=${d}`:""}`).then((r)=>setPl(r.data)).catch(console.error);

  useEffect(() => {
    loadOverview();
    loadPL("");
  }, []);

  const onDateChange = (e) => {
    const val = e.target.value;
    setDate(val);
    loadPL(val);
  };

  return (
    <div className="card">
      <h2>Dashboard</h2>

      {!overview ? <p>Loading...</p> : (
        <>
          <div className="grid four">
            <div className="stat"><div className="label">Inventory Value</div><div className="value">৳{overview.totalInventoryValue}</div></div>
            <div className="stat"><div className="label">Total Sales</div><div className="value">৳{overview.totalSalesAmount}</div></div>
            <div className="stat"><div className="label">Categories</div><div className="value">{Object.keys(overview.categoryCount).length}</div></div>
            <div className="stat"><div className="label">Low-Stock Items</div><div className="value">{overview.lowStock.length}</div></div>
          </div>

          <h3 style={{marginTop:20}}>Category-wise Stock</h3>
          <ul className="list">
            {Object.entries(overview.categoryCount).map(([cat, qty])=>(
              <li key={cat}>{cat}: {qty}</li>
            ))}
          </ul>

          <h3 style={{marginTop:20}}>Low-Stock Alerts</h3>
          {overview.lowStock.length === 0 ? <p>All good ✅</p> : (
            <table className="table">
              <thead><tr><th>Name</th><th>Qty</th><th>Min</th></tr></thead>
              <tbody>
                {overview.lowStock.map((p)=>(
                  <tr key={p._id} className="low">
                    <td>{p.name}</td>
                    <td>{p.quantity}</td>
                    <td>{p.minStock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h3 style={{marginTop:20}}>Daily Profit / Loss</h3>
          <div className="row">
            <input type="date" value={date} onChange={onDateChange} />
            {pl && (
              <div className="pl-cards">
                <div className="stat"><div className="label">Revenue</div><div className="value">৳{pl.totalRevenue}</div></div>
                <div className="stat"><div className="label">Expense</div><div className="value">৳{pl.totalExpense}</div></div>
                <div className="stat"><div className="label">Profit/Loss</div><div className="value">৳{pl.profitLoss}</div></div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
