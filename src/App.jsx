import React, { useState } from 'react';
import './App.css';

const TaxCalculator = () => {
  const [income, setIncome] = useState('');
  const [tax, setTax] = useState(null);
  const [taxableIncome, setTaxableIncome] = useState(null);
  const [error, setError] = useState('');

  // Function to calculate tax
  const calculateTax = () => {
    const totalIncome = parseFloat(income);

    if (isNaN(totalIncome) || totalIncome <= 0) {
      setError('Please enter a valid income');
      setTax(null);
      setTaxableIncome(null);
      return;
    }

    const standardDeduction = 75000;
    let calculatedTaxableIncome = totalIncome - standardDeduction;
    
    if (totalIncome <= 1275000) {
      calculatedTaxableIncome = 0;
    }
    
    setTaxableIncome(calculatedTaxableIncome);

    let taxPayable = 0;

    if (totalIncome <= 1275000) {
      taxPayable = 0;
    } else {
      // Tax calculation based on slabs
      if (calculatedTaxableIncome <= 400000) {
        taxPayable = 0;
      } else if (calculatedTaxableIncome <= 800000) {
        taxPayable = (calculatedTaxableIncome - 400000) * 0.05;
      } else if (calculatedTaxableIncome <= 1200000) {
        taxPayable = 400000 * 0.05 + (calculatedTaxableIncome - 800000) * 0.10;
      } else if (calculatedTaxableIncome <= 1600000) {
        taxPayable = 400000 * 0.05 + 400000 * 0.10 + (calculatedTaxableIncome - 1200000) * 0.15;
      } else if (calculatedTaxableIncome <= 2000000) {
        taxPayable = 400000 * 0.05 + 400000 * 0.10 + 400000 * 0.15 + (calculatedTaxableIncome - 1600000) * 0.20;
      } else if (calculatedTaxableIncome <= 2400000) {
        taxPayable = 400000 * 0.05 + 400000 * 0.10 + 400000 * 0.15 + 400000 * 0.20 + (calculatedTaxableIncome - 2000000) * 0.25;
      } else {
        taxPayable = 400000 * 0.05 + 400000 * 0.10 + 400000 * 0.15 + 400000 * 0.20 + 400000 * 0.25 + (calculatedTaxableIncome - 2400000) * 0.30;
      }
    }

    const cess = taxPayable * 0.04;
    const totalTax = taxPayable + cess;

    setTax(totalTax);
    setError('');
  };

  return (
    <div className="App">
      <h1>Income Tax Calculator 2025-26</h1>
      <input
        id="salary"
        type="number"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
        placeholder="Enter your salary"
      />
      <button onClick={calculateTax}>Calculate Tax</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {tax !== null && (
        <div>
          {income <= 1275000 && (
            <p style={{ color: 'green', fontWeight: 'bold' }}>No Tax for income up to ₹12.75L</p>
          )}
          <table>
            <thead>
              <tr>
                <th>Income Range</th>
                <th>Tax Rate</th>
                <th>Tax Payable</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>₹0 - ₹4L</td>
                <td>NIL</td>
                <td>₹{income <= 1275000 ? 0 : 0}</td>
              </tr>
              <tr>
                <td>₹4L - ₹8L</td>
                <td>5%</td>
                <td>₹{income <= 1275000 ? 0 : Math.max(0, Math.min(800000, taxableIncome) - 400000) * 0.05}</td>
              </tr>
              <tr>
                <td>₹8L - ₹12L</td>
                <td>10%</td>
                <td>₹{income <= 1275000 ? 0 : Math.max(0, Math.min(1200000, taxableIncome) - 800000) * 0.10}</td>
              </tr>
              <tr>
                <td>₹12L - ₹16L</td>
                <td>15%</td>
                <td>₹{income <= 1275000 ? 0 : Math.max(0, Math.min(1600000, taxableIncome) - 1200000) * 0.15}</td>
              </tr>
              <tr>
                <td>₹16L - ₹20L</td>
                <td>20%</td>
                <td>₹{income <= 1275000 ? 0 : Math.max(0, Math.min(2000000, taxableIncome) - 1600000) * 0.20}</td>
              </tr>
              <tr>
                <td>₹20L - ₹24L</td>
                <td>25%</td>
                <td>₹{income <= 1275000 ? 0 : Math.max(0, Math.min(2400000, taxableIncome) - 2000000) * 0.25}</td>
              </tr>
              <tr>
                <td>Above ₹24L</td>
                <td>30%</td>
                <td>₹{income <= 1275000 ? 0 : Math.max(0, taxableIncome - 2400000) * 0.30}</td>
              </tr>
              <tr>
                <td colSpan="2"><strong>Cess (4%)</strong></td>
                <td><strong>₹{income <= 1275000 ? 0 : (tax * 0.04).toFixed(2)}</strong></td>
              </tr>
              <tr>
                <td colSpan="2"><strong>Total Tax Payable</strong></td>
                <td><strong>₹{income <= 1275000 ? 0 : tax.toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <div>
      <TaxCalculator />
    </div>
  );
}

export default App;
