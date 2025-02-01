import React, { useState } from 'react';
import './App.css';

const TaxCalculator = () => {
  const [income, setIncome] = useState('');
  const [tax, setTax] = useState(null);
  const [taxableIncome, setTaxableIncome] = useState(null);
  const [cess, setCess] = useState(null);
  const [taxPayable, setTaxPayable] = useState(null);
  const [error, setError] = useState('');
  const [isSalaried, setIsSalaried] = useState(true);

  const formatINR = (amount) => {
    return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  const formatToINR = (value) => {
    if (!value) return "";
    const numericValue = value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    return Number(numericValue).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
  };

  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers
    setIncome(rawValue);
  };
  
  // Function to calculate tax
  const calculateTax = () => {
    const totalIncome = parseFloat(income);

    if (isNaN(totalIncome) || totalIncome <= 0) {
      setError('Please enter a valid income');
      setTax(null);
      setTaxableIncome(null);
      return;
    }

    const standardDeduction = isSalaried ? 75000 : 0;
    const calculatedTaxableIncome = parseInt(income) > 75000  ? totalIncome - standardDeduction : 0;
    setTaxableIncome(calculatedTaxableIncome);

    let taxPayable = 0;

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
    setTaxPayable(taxPayable);
    const cess = taxPayable * 0.04;
    setCess(cess);

    const totalTax = taxPayable + cess;

    setTax(totalTax);
    setError('');
  };

  return (
    <div className="App">
      <h1>Income Tax Calculator 2025-26</h1>
      <div style={{ display: 'flex', justifyContent: 'space-evenly'}}>
      <label style={{display: 'flex', alignItems: 'center'}}>
          <input
            type="radio"
            name="employmentType"
            value="salaried"
            checked={isSalaried}
            onChange={() => setIsSalaried(true)}
          />
          Salaried
        </label>
        <label style={{display: 'flex', alignItems: 'center'}}>
          <input
            type="radio"
            name="employmentType"
            value="nonSalaried"
            checked={!isSalaried}
            onChange={() => setIsSalaried(false)}
          />
          Non&nbsp;Salaried
        </label>
      </div>
      <input
        id="salary"
        type="text"
        value={formatToINR(income)}
        onChange={handleChange}
        placeholder="Enter your salary"
      />
      <button onClick={calculateTax}>Calculate Tax</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {tax !== null && (
        <table>
          <thead>
          <tr>
              <td colSpan="2"><strong>Your Taxable Income (Total Income - Standard Deduction) </strong></td>
              <td><strong>{formatINR(taxableIncome)}</strong></td>
            </tr>
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
              <td>₹0</td>
            </tr>
            <tr>
              <td>₹4L - ₹8L</td>
              <td>5%</td>
              <td>{formatINR(Math.floor(Math.max(0, Math.min(800000, taxableIncome) - 400000) * 0.05))}</td>
            </tr>
            <tr>
              <td>₹8L - ₹12L</td>
              <td>10%</td>
              <td>{formatINR(Math.max(0, Math.min(1200000, taxableIncome) - 800000) * 0.10)}</td>
            </tr>
            <tr>
              <td>₹12L - ₹16L</td>
              <td>15%</td>
              <td>{formatINR(Math.max(0, Math.min(1600000, taxableIncome) - 1200000) * 0.15)}</td>
            </tr>
            <tr>
              <td>₹16L - ₹20L</td>
              <td>20%</td>
              <td>{formatINR(Math.max(0, Math.min(2000000, taxableIncome) - 1600000) * 0.20)}</td>
            </tr>
            <tr>
              <td>₹20L - ₹24L</td>
              <td>25%</td>
              <td>{formatINR(Math.max(0, Math.min(2400000, taxableIncome) - 2000000) * 0.25)}</td>
            </tr>
            <tr>
              <td>Above ₹24L</td>
              <td>30%</td>
              <td>{formatINR(Math.max(0, taxableIncome - 2400000) * 0.30)}</td>
            </tr>
            <tr>
              <td colSpan="2"><strong>Cess (4%)</strong></td>
              <td><strong>{formatINR(cess)}</strong></td>
            </tr>
            <tr>
              <td colSpan="2"><strong>Total Tax </strong></td>
              <td><strong>{formatINR(taxPayable)}</strong></td>
            </tr>
            <tr>
              <td colSpan="2"><strong>Total Tax Payable (Total Tax + Cess)</strong></td>
              <td><strong>{formatINR(tax)}</strong></td>
            </tr>
            {parseInt(income) <= 1275000 && (<tr style = {{ color: 'green', border: '2px solid green' }}>
              <td colSpan="2"><strong>Tax After Deduction</strong> (If income ≤ ₹12.75L, tax is ₹0)</td>
              <td><strong>{formatINR(income <= 1275000 ? 0 : tax)}</strong></td>
            </tr>)}
          </tbody>
        </table>
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
