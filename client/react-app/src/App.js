// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import BillForm from './BillForm';
import './App.css'

const App = () => {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === '2085') {
      setIsAuthenticated(true);
    } else {
      
      alert('Incorrect PIN');
    }
  };

  return (
    <Router>
      <center>

    
      <div>
        {!isAuthenticated ? (
          <form onSubmit={handlePinSubmit}>
            <input
              type="Number"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN"
            />
            <button type="submit">Submit</button>
          </form>
        ) : (
          <Routes>
            <Route path="/billform" element={<BillForm />} />
            <Route path="*" element={<Navigate to="/billform" />} />
          </Routes>
        )}
      </div>
      </center>
    </Router>
  );
};

export default App;
