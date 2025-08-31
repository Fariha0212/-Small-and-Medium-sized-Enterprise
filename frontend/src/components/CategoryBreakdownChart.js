import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#845EC2", "#2C73D2", "#0081CF", "#C34A36"];

export default function CategoryBreakdownChart({ data }) {
  const [chartData, setChartData] = useState([]);
  
  // Handle the case when data is invalid
  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      setChartData(data);
    } else {
      setChartData([]);
    }
  }, [data]);

  // If no valid data, return null or a message
  if (chartData.length === 0) {
    return <div className="card"><h3>No data available</h3></div>;
  }

  return (
    <div className="card">
      <h3>Category-wise Inventory Count</h3>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={85} label>
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
