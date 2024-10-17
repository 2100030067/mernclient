// src/BillForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Import the CSS file for this component

const BillForm = () => {
  const [id, setId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Offline'); // Default to Offline
  const [time, setTime] = useState('');
  const [error, setError] = useState(''); // State for error messages
  const [bills, setBills] = useState([]); // State for bills
  const [showBills, setShowBills] = useState(false); // State to toggle bills table

  // Set current time when the component mounts
  useEffect(() => {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTime(currentTime);
    fetchBills(); // Fetch bills when component mounts
  }, []);

  const fetchBills = async () => {
    try {
      const response = await axios.get('https://svpd2024.onrender.com/api/bills'); // Fetch all bills
      setBills(response.data);
    } catch (err) {
      console.error('Error fetching bills:', err);
      setError('Error fetching bills');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const billData = { id, amount, paymentMethod, time };

    console.log('Submitting Bill Data:', billData); // Log data being submitted

    try {
      // Clear any previous error messages
      setError('');
      await axios.post('https://svpd2024.onrender.com/api/bills', billData); // Ensure the correct server port
      alert('Bill saved successfully');
      // Clear form after submission
      setId('');
      setAmount('');
      setPaymentMethod('Offline'); // Resetting to default value
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      fetchBills(); // Fetch updated bills after submission
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data.message) {
        setError(err.response.data.message); // Set the error message from the server
      } else {
        setError('Error saving bill');
      }
    }
  };

  const toggleBillsTable = () => {
    setShowBills((prev) => !prev); // Toggle the visibility of the bills table
  };

  const totalAmount = bills.reduce((acc, bill) => acc + bill.amount, 0); // Calculate total amount

  return (
    <center> 
    <div className="bill-form-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Bill ID"
          required
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Bill Amount"
          required
        />
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="Offline">Offline</option>
          <option value="PhonePay">PhonePay</option>
        </select>
        <input
          type="text"
          value={time}
          readOnly
        />
        <button type="submit">Submit Bill</button>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message if any */}
      </form>
      <button onClick={toggleBillsTable}>
        {showBills ? 'Hide My Bills' : 'View My Bills'}
      </button>
      {showBills && (
        <div>
          <h2>My Bills</h2>
          <table>
            <thead>
              <tr>
                <th>Bill ID</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Time</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill._id}>
                  <td>{bill.id}</td>
                  <td>{bill.amount}</td>
                  <td>{bill.paymentMethod}</td>
                  <td>{bill.time}</td>
                  <td>{new Date(bill.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Total Amount ₹: {totalAmount}</h3>
        </div>
      )}
    </div>
    </center>
  );
};

export default BillForm;
