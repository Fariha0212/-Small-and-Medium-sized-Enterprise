import React from 'react';
import Inventory from './components/Inventory';
import Sales from './components/sales';
import './App.css';

function App() {
  return (
    <div className="container">
      <h1 className="title">Inventory Management System</h1>
      <div className="box">
        <Inventory />
      </div>
      <div className="box">
        <Sales />
      </div>
    </div>
  );
}

export default App;
