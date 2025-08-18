import React, { useEffect, useState } from "react";
import axios from "../axios";

const ProfitLoss = () => {
  const [profitLoss, setProfitLoss] = useState({ profit: 0, loss: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/dashboard/profitloss");
        setProfitLoss(res.data);
      } catch (err) {
        console.error("Error fetching profit/loss", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container">
      <h2>Daily Profit / Loss</h2>
      <p>Profit: ${profitLoss.profit}</p>
      <p>Loss: ${profitLoss.loss}</p>
    </div>
  );
};

export default ProfitLoss;
