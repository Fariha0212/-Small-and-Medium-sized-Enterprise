import React, { useEffect, useState } from "react";
import axios from "../axios";

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ category: "", amount: "", date: "", note: "" });

  const load = () => axios.get("/expenses").then((r)=>setExpenses(r.data)).catch(console.error);
  useEffect(() => { load(); }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/expenses", {
        category: form.category,
        amount: Number(form.amount),
        date: form.date || undefined,
        note: form.note,
      });
      setForm({ category: "", amount: "", date: "", note: "" });
      setExpenses((prev) => [res.data.expense, ...prev]);
      alert("Expense added");
    } catch (err) {
      alert(err.response?.data?.message || "Expense failed");
    }
  };

  return (
    <div className="card">
      <h2>Expenses</h2>
      <form className="row" onSubmit={submit}>
        <input name="category" placeholder="Category (e.g., Rent, Electricity)" value={form.category} onChange={change} required />
        <input name="amount" type="number" placeholder="Amount" value={form.amount} onChange={change} required />
        <input name="date" type="date" value={form.date} onChange={change} />
        <input name="note" placeholder="Note (optional)" value={form.note} onChange={change} />
        <button type="submit">Add Expense</button>
      </form>

      <table className="table">
        <thead>
          <tr><th>Date</th><th>Category</th><th>Amount (৳)</th><th>Note</th></tr>
        </thead>
        <tbody>
          {expenses.map((e)=>(
            <tr key={e._id}>
              <td>{new Date(e.date).toLocaleDateString()}</td>
              <td>{e.category}</td>
              <td>{e.amount}</td>
              <td>{e.note}</td>
            </tr>
          ))}
          {expenses.length === 0 && <tr><td colSpan="4" style={{textAlign:"center"}}>No expenses</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default ExpensesPage;
