import React, { useEffect, useState } from "react";
import axios from "../axios";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios.get("/sales").then((res) => setSales(res.data)).catch(console.error);
  }, []);

  const filterSales = () => {
    return sales.filter((s) => {
      const isValidSale = s && s.items && Array.isArray(s.items);
      if (!isValidSale) return false;
      const isWithinDateRange =
        (startDate ? new Date(s.date) >= new Date(startDate) : true) &&
        (endDate ? new Date(s.date) <= new Date(endDate) : true);
      const isProductMatch = s.items.some((item) =>
        item?.product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return isWithinDateRange && isProductMatch;
    });
  };

  const toFlatRows = (list) => {
    const rows = [];
    (list || []).forEach((s) => {
      (s?.items || []).forEach((it) => {
        rows.push({
          saleId: s?._id || "",
          date: s?.date ? new Date(s.date).toISOString() : "",
          product: it?.product?.name || "Deleted Product",
          quantity: Number(it?.quantity) || 0,
          priceAtSale: Number(it?.priceAtSale) || 0,
          lineTotal: (Number(it?.quantity) || 0) * (Number(it?.priceAtSale) || 0),
          saleTotal: Number(s?.totalAmount) || 0,
        });
      });
    });
    return rows;
  };

  const exportSales = (rows, type) => {
    if (!rows || rows.length === 0) {
      alert("No data to export.");
      return;
    }
    if (type === "csv") {
      const csv = Papa.unparse(rows);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "sales.csv";
      a.click();
    } else {
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sales");
      XLSX.writeFile(wb, "sales.xlsx");
    }
  };

  const filtered = filterSales();

  return (
    <div className="card">
      <h2>Sales History</h2>
      <div className="filters">
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <input type="text" placeholder="Search by product name" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      <div className="actions" style={{ display: "flex", gap: 8, margin: "8px 0" }}>
        <button onClick={() => exportSales(toFlatRows(filtered), "csv")}>Export CSV</button>
        <button onClick={() => exportSales(toFlatRows(filtered), "xlsx")}>Export Excel</button>
      </div>

      <table className="table">
        <thead>
          <tr><th>Date</th><th>Items</th><th>Total (৳)</th></tr>
        </thead>
        <tbody>
          {filtered.map((s) => (
            <tr key={s._id}>
              <td>{new Date(s.date).toLocaleString()}</td>
              <td>
                {(s.items || []).map((it, idx) => (
                  <div key={it?._id || idx} style={{ display:"flex", alignItems:"center", gap:8 }}>
                    {it?.product?.image ? (
                      <img src={it.product.image} alt={it.product.name} className="thumb-sm" onError={(e)=>{e.currentTarget.style.display='none';}} />
                    ) : null}
                    <span>
                      {it?.product?.name || "Deleted Product"} × {it?.quantity} @ ৳{it?.priceAtSale}
                    </span>
                  </div>
                ))}
              </td>
              <td>{s.totalAmount}</td>
            </tr>
          ))}
          {sales.length === 0 && (
            <tr><td colSpan="3" style={{ textAlign: "center" }}>No sales</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SalesHistory;
