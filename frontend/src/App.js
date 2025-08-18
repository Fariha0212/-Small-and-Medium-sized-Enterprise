import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "./axios";

import Dashboard from "./components/Dashboard";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";
import SalesForm from "./components/SalesForm";
import SalesHistory from "./components/SalesHistory";
import ExpensesPage from "./components/ExpensesPage";

function App() {
  const [tab, setTab] = useState("dashboard"); // dashboard | products | sales | expenses
  const [products, setProducts] = useState([]);

  // fetch products once (used by multiple tabs)
  const loadProducts = () => {
    axios.get("/products").then((res) => setProducts(res.data)).catch(console.error);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleProductAdded = (p) => setProducts((prev) => [p, ...prev]);
  const handleProductUpdated = (p) =>
    setProducts((prev) => prev.map((x) => (x._id === p._id ? p : x)));
  const handleProductDeleted = (id) =>
    setProducts((prev) => prev.filter((x) => x._id !== id));

  return (
    <div className="container">
      <header className="topbar">
        <h1>SME Inventory BD</h1>
        <nav className="tabs">
          <button className={tab==="dashboard"?"active":""} onClick={() => setTab("dashboard")}>Dashboard</button>
          <button className={tab==="products"?"active":""} onClick={() => setTab("products")}>Products</button>
          <button className={tab==="sales"?"active":""} onClick={() => setTab("sales")}>Sales</button>
          <button className={tab==="expenses"?"active":""} onClick={() => setTab("expenses")}>Expenses</button>
        </nav>
      </header>

      {tab === "dashboard" && <Dashboard />}

      {tab === "products" && (
        <>
          <ProductForm onProductAdded={handleProductAdded} />
          <ProductList
            products={products}
            onProductUpdated={handleProductUpdated}
            onProductDeleted={handleProductDeleted}
          />
        </>
      )}

      {tab === "sales" && (
        <>
          <SalesForm onSaleDone={loadProducts} />
          <SalesHistory />
        </>
      )}

      {tab === "expenses" && <ExpensesPage />}
    </div>
  );
}

export default App;
