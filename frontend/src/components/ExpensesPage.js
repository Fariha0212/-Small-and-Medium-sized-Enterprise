import React, { useEffect, useState } from "react";
import axios from "../axios";
import Papa from "papaparse";
import * as XLSX from "xlsx";

// colors you used before
const COLORS = ["#845EC2", "#FFC75F", "#FF6F91", "#2C73D2", "#0081CF", "#00C9A7"];

/* ---------- Tiny pie chart (no libraries) ---------- */
function polarToCartesian(cx, cy, r, angleDeg) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}
function arcPath(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} L ${cx} ${cy} Z`;
}
function SimplePie({ data, size = 220, innerRadius = 0 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total <= 0) return <div style={{ color: "#777" }}>No data to chart</div>;

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;

  let start = 0;
  const slices = data.map((d, i) => {
    const angle = (d.value / total) * 360;
    const end = start + angle;
    const path = arcPath(cx, cy, r, start, end);
    const el = <path key={i} d={path} fill={COLORS[i % COLORS.length]} />;
    start = end;
    return el;
  });

  // optional donut “hole”
  const hole =
    innerRadius > 0 ? (
      <circle cx={cx} cy={cy} r={innerRadius} fill="#ffffffff" />
    ) : null;

  return (
    <svg width="100%" height={size} viewBox={`0 0 ${size} ${size}`} role="img">
      <g>{slices}{hole}</g>
    </svg>
  );
}
/* --------------------------------------------------- */

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ category: "", amount: "", date: "", note: "" });
  const [loading, setLoading] = useState(false);

  const loadExpenses = () => {
    axios
      .get("/expenses")
      .then((res) => setExpenses(Array.isArray(res.data) ? res.data : []))
      .catch(console.error);
  };

  useEffect(() => { loadExpenses(); }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.category || !form.amount) {
      alert("Category and Amount are required");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        category: form.category,
        amount: Number(form.amount),
        date: form.date || undefined,
        note: form.note || "",
      };
      await axios.post("/expenses", payload);
      setForm({ category: "", amount: "", date: "", note: "" });
      loadExpenses();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  // totals per category for chart/legend
  const totalsByCategory = Object.values(
    (expenses || []).reduce((acc, e) => {
      const key = e?.category || "Uncategorized";
      acc[key] = acc[key] || { name: key, value: 0 };
      acc[key].value += Number(e?.amount) || 0;
      return acc;
    }, {})
  );

  // export
  const exportExpenses = (data, type) => {
    const rows = (data || []).map((e) => ({
      date: e?.date ? new Date(e.date).toISOString() : "",
      category: e?.category || "",
      amount: Number(e?.amount) || 0,
      note: e?.note || "",
    }));
    if (type === "csv") {
      const csv = Papa.unparse(rows);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "expenses.csv";
      a.click();
    } else {
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Expenses");
      XLSX.writeFile(wb, "expenses.xlsx");
    }
  };

  return (
    <div className="card">
      <h2>Expenses</h2>

      <form className="form" onSubmit={onSubmit} style={{ marginBottom: 16 }}>
        <div className="row">
          <input name="category" placeholder="Category" value={form.category} onChange={onChange} />
          <input name="amount" type="number" placeholder="Amount" value={form.amount} onChange={onChange} />
          <input name="date" type="date" value={form.date} onChange={onChange} />
          <input name="note" placeholder="Note" value={form.note} onChange={onChange} />
          <button type="submit" disabled={loading}>{loading ? "Saving..." : "Add Expense"}</button>
        </div>
      </form>

      <div className="actions" style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => exportExpenses(expenses, "csv")}>Export CSV</button>
        <button onClick={() => exportExpenses(expenses, "xlsx")}>Export Excel</button>
      </div>

      {(expenses || []).length === 0 ? (
        <p>No expenses</p>
      ) : (
        <table className="table">
          <thead>
            <tr><th>Date</th><th>Category</th><th style={{ textAlign: "right" }}>Amount (৳)</th><th>Note</th></tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e._id}>
                <td>{e?.date ? new Date(e.date).toLocaleDateString() : "-"}</td>
                <td>{e?.category}</td>
                <td style={{ textAlign: "right" }}>{Number(e?.amount) || 0}</td>
                <td>{e?.note || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Category chart (pure SVG, no external libs, no refs) */}
      {totalsByCategory.length > 0 && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3>Expenses by Category</h3>
          <div style={{ width: "100%", maxWidth: 520, margin: "0 auto" }}>
            <SimplePie data={totalsByCategory} size={240} innerRadius={60} />
          </div>
          {/* simple legend */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8 }}>
            {totalsByCategory.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  width: 12, height: 12, background: COLORS[i % COLORS.length],
                  display: "inline-block", borderRadius: 2
                }} />
                <span>{d.name}: ৳{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesPage;
