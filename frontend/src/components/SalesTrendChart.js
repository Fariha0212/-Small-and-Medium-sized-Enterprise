import React, { useEffect, useState } from "react";
import axios from "../axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function SalesTrendChart() {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    axios.get("/sales").then(res => {
      // aggregate totalAmount per day (yyyy-mm-dd)
      const map = new Map();
      res.data.forEach(s => {
        const d = new Date(s.date);
        const key = d.toISOString().slice(0,10);
        map.set(key, (map.get(key) || 0) + (Number(s.totalAmount)||0));
      });
      const arr = Array.from(map.entries()).sort((a,b)=>a[0].localeCompare(b[0]))
        .map(([date, total]) => ({ date, total }));
      setPoints(arr);
    }).catch(console.error);
  }, []);

  if (points.length === 0) return null;

  return (
    <div className="card">
      <h3>Sales Trend (Daily)</h3>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <LineChart data={points}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#0088FE" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
