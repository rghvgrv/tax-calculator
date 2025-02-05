import React, { useState } from 'react';
import { Analytics } from "@vercel/analytics/react"
import './App.css';

const TaxCalculator = () => {
  const [income, setIncome] = useState('');
  const [fullIncome,setFullIncome] = useState(0);
  const [tax, setTax] = useState(null);
  const [taxableIncome, setTaxableIncome] = useState(null);
  const [surCharge, setSurcharge] = useState(null);  
  const [cess, setCess] = useState(null);
  const [taxPayable, setTaxPayable] = useState(null);
  const [error, setError] = useState('');
  const [isSalaried, setIsSalaried] = useState(true);
  const [marginalSalary, setMarginalSalary] = useState(0);
  const [showTaxFreeMessage, setShowTaxFreeMessage] = useState(false);
  const [showDeductionMessage, setShowDeductionMessage] = useState(false);

  const formatINR = (amount) => {
    return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
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
    // if (rawValue > 9000000) {
    //   alert("Are you kidding me? 😂 , Contact your CA for this !!!");
    //   setIncome(""); // Reset input
    //   return;
    // }
    setIncome(rawValue);
  };
  
  // Function to calculate tax
  const calculateTax = () => {
    const totalIncome = parseFloat(income);
    
    if (isNaN(totalIncome) || totalIncome <= 0) {
      setError('Please enter a valid income');
      setTax(null);
      setTaxableIncome(null);
      setShowTaxFreeMessage(false);
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
    let surCharge = 0;
    if(totalIncome >= 5000000 & totalIncome< 10000000){
      surCharge = parseInt(taxPayable) * 0.1;
      setSurcharge(surCharge);
    }
    else if(totalIncome >= 10000000 & totalIncome < 20000000){
      surCharge = parseInt(taxPayable) * 0.15;
      setSurcharge(surCharge);
    }
    else if(totalIncome >= 20000000 & totalIncome < 50000000){
      surCharge = parseInt(taxPayable) * 0.25;
      setSurcharge(surCharge);
    }
    else if(totalIncome >= 50000000){
      surCharge = parseInt(taxPayable) * 0.37;
      setSurcharge(surCharge);
    }
    else{
      setSurcharge(surCharge)
    }        
    let differenceAmount = totalIncome - taxPayable;
    
    if(differenceAmount <= 1275000 & totalIncome > 1275000 & isSalaried){ 
      let extraAmount = totalIncome - 1275000;
      setTaxPayable(extraAmount);
      setMarginalSalary(taxPayable - extraAmount);
      const totalTaxBeforeCess = extraAmount + surCharge;

      const cess = totalTaxBeforeCess * 0.04;
      setCess(cess);
      const totalTax = extraAmount + cess + surCharge;
      setTax(totalTax);
      setIncome('');
      setError('');
    }
    else if(differenceAmount <= 1200000 & totalIncome > 1200000 & !isSalaried){
      let extraAmount = totalIncome - 1200000;
      setTaxPayable(extraAmount);
      setMarginalSalary(taxPayable - extraAmount);
      const totalTaxBeforeCess = extraAmount + surCharge;
      const cess = totalTaxBeforeCess * 0.04;
      setCess(cess);

      const totalTax = extraAmount + cess + surCharge;
      setTax(totalTax);
      setIncome('');
      setError('');
    }
    else{
      setTaxPayable(taxPayable);
      setMarginalSalary(0);
      const totalTaxBeforeCess = taxPayable + surCharge;
      const cess = totalTaxBeforeCess * 0.04;
      setCess(cess);
  
      const totalTax = taxPayable + cess + surCharge; 
      setTax(totalTax);
      setIncome('');
      setError('');
    }
    setShowTaxFreeMessage(
      (totalIncome <= 1275000 && isSalaried) || (!isSalaried && totalIncome <= 1200000)
    );

    setShowDeductionMessage(isSalaried && totalIncome > 75000);

    setFullIncome(parseFloat(income));
  };

  return (
    <div className="App">
      <Analytics />
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
              <td colSpan="2"><strong>Your Income </strong></td>
              <td><strong>{formatINR(fullIncome)}</strong></td>
            </tr>
            {showDeductionMessage && (
          <tr>
              <td colSpan="2"><strong>Your Taxable Income (Total Income - Standard Deduction) </strong></td>
              <td><strong>{formatINR(taxableIncome)}</strong></td>
            </tr>
            )}
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
              <td colSpan="2"><strong>Marginal Relief </strong></td>
              <td><strong>{formatINR(marginalSalary)}</strong></td>
            </tr>
            <tr>
              <td colSpan="2"><strong>Surcharge </strong></td>
              <td><strong>{formatINR(surCharge)}</strong></td>
            </tr>
            <tr>
              <td colSpan="2"><strong>Base Tax </strong></td>
              <td><strong>{formatINR(taxPayable)}</strong></td>
            </tr>
            <tr>
              <td colSpan="2"><strong>Cess (4%)</strong></td>
              <td><strong>{formatINR(cess)}</strong></td>
            </tr>
            <tr>
              <td colSpan="2"><strong>Total Tax Payable (Total Tax + Cess)</strong></td>
              <td><strong>{formatINR(tax)}</strong></td>
            </tr>        
            {showTaxFreeMessage && (
            <tr>
              <td colSpan="3" style={{ color: 'green', border: '2px solid green', textAlign: 'center' }}>
                <strong>Congrats 🎉</strong> You have to pay 0 Tax
              </td>
            </tr>
          )}
          </tbody>
        </table>
      )}
      <div style={{ marginTop: '20px', fontSize: '14px', color: 'gray' }}>
        <ul style={{ paddingLeft: '20px' }}>
        <strong>Disclaimer:</strong><br></br>
          This assumes you're an Indian resident below 60 years of age, who uses the New Tax Regime.<br></br>
          The calculations may not be accurate - use at your own risk.<br></br>
          This tool runs entirely in your browser. No data is stored or shared, and we do not use analytics.<br></br>
          If your income is over ₹50 LPA,Hoping you have a CA to help you out.<br></br>
        </ul>
      </div>
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
