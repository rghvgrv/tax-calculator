import { useState, useEffect } from 'react';
import { Analytics } from "@vercel/analytics/react"
import Confetti from 'react-confetti';
import './App.css';

const TaxCalculator = () => {
  const [income, setIncome] = useState('');
  const [fullIncome, setFullIncome] = useState(0);
  const [tax, setTax] = useState(null);
  const [taxableIncome, setTaxableIncome] = useState(null);
  const [cess, setCess] = useState(null);
  const [taxPayable, setTaxPayable] = useState(null);
  const [error, setError] = useState('');
  const [isSalaried, setIsSalaried] = useState(true);
  const [marginalSalary, setMarginalSalary] = useState(0);
  const [showTaxFreeMessage, setShowTaxFreeMessage] = useState(false);
  const [showDeductionMessage, setShowDeductionMessage] = useState(false);
  const [showGraffeti, setShowGraffeti] = useState(false);

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
    // if (rawValue > 5000000) {
    //   alert(`You have inputed salary ${rawValue} greater than 50L  `);
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
      setShowGraffeti(false);
      return;
    }
    if (totalIncome >= 5000000) {
      setError('You have entered more than 50L, we are yet to include surcharge.');
      setTax(null);
      setTaxableIncome(null);
      setShowTaxFreeMessage(false);
      setShowGraffeti(false);
      return;
    }

    const standardDeduction = isSalaried ? 75000 : 0;
    const calculatedTaxableIncome = parseInt(income) > 75000 ? totalIncome - standardDeduction : 0;
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

    let differenceAmount = totalIncome - taxPayable;

    if (differenceAmount <= 1275000 & totalIncome > 1275000 & isSalaried) {
      let extraAmount = totalIncome - 1275000;
      setTaxPayable(extraAmount);
      setMarginalSalary(taxPayable - extraAmount);

      const cess = extraAmount * 0.04;
      setCess(cess);

      const totalTax = extraAmount + cess;
      setTax(totalTax);
      setIncome('');
      setError('');
    }
    else if (differenceAmount <= 1200000 & totalIncome > 1200000 & !isSalaried) {
      let extraAmount = totalIncome - 1200000;
      setTaxPayable(extraAmount);
      setMarginalSalary(taxPayable - extraAmount);

      const cess = extraAmount * 0.04;
      setCess(cess);

      const totalTax = extraAmount + cess;
      setTax(totalTax);
      setIncome('');
      setError('');
    }
    else {
      setTaxPayable(taxPayable);
      setMarginalSalary(0);

      const cess = taxPayable * 0.04;
      setCess(cess);

      const totalTax = taxPayable + cess;
      setTax(totalTax);
      setIncome('');
      setError('');
    }
    setShowTaxFreeMessage(isEligibleForTaxRelief(totalIncome));
    setShowGraffeti(isEligibleForTaxRelief(totalIncome));

    setShowDeductionMessage(isSalaried && totalIncome > 75000);

    setFullIncome(parseFloat(income));
  };

  useEffect(() => {
    if (showGraffeti) {
      setShowGraffeti(true)
      setTimeout(() => {
        setShowGraffeti(false)
      }, 2500)
    } else {
      setShowGraffeti(false);
    }
  });

  const isEligibleForTaxRelief = (totalIncome) => {
    if ((totalIncome <= 1275000 && isSalaried) || (!isSalaried && totalIncome <= 1200000)) {
      return true;
    }
    return false;
  }

  return (
    <div className="App">
      <Analytics />
      <h1>Income Tax Calculator 2026-27</h1>
      <p className="subtitle">New Tax Regime &middot; FY 2026-27 (AY 2027-28)</p>
      <div className="segmented">
        <label>
          <input
            type="radio"
            name="employmentType"
            value="salaried"
            checked={isSalaried}
            onChange={() => setIsSalaried(true)}
          />
          Salaried
        </label>
        <label>
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
      <div className="input-row">
        <input
          id="salary"
          type="text"
          value={formatToINR(income)}
          onChange={handleChange}
          placeholder="Enter your salary"
        />
        <button onClick={calculateTax}>Calculate Tax</button>
      </div>

      {error && <p className="error">{error}</p>}

      {tax !== null && (
        <div className="table-wrap">
        <table>
          <thead>
            {showTaxFreeMessage && (
              <tr className="success-row">
                <td colSpan="3">
                  <strong>Congrats 🎉</strong> You have to pay 0 Tax
                </td>
              </tr>
            )}
            <tr className="summary-row">
              <td colSpan="2"><strong>Your Income </strong></td>
              <td><strong>{formatINR(fullIncome)}</strong></td>
            </tr>
            {showDeductionMessage && (
              <tr className="summary-row">
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
            <tr className="summary-row">
              <td colSpan="2"><strong>Marginal Relief </strong></td>
              <td><strong>{formatINR(marginalSalary)}</strong></td>
            </tr>
            <tr className="summary-row">
              <td colSpan="2"><strong>Total Tax </strong></td>
              <td><strong>{formatINR(taxPayable)}</strong></td>
            </tr>
            <tr className="summary-row">
              <td colSpan="2"><strong>Cess (4%)</strong></td>
              <td><strong>{formatINR(cess)}</strong></td>
            </tr>
            <tr className="total-row">
              <td colSpan="2"><strong>Total Tax Payable (Total Tax + Cess)</strong></td>
              <td><strong>{formatINR(tax)}</strong></td>
            </tr>
          </tbody>
        </table>
        </div>
      )}
      {showGraffeti && <Confetti />}
      <div className='disclaimer'>
        <strong>Disclaimer:</strong>
        <ul>
          <li>This assumes you&apos;re an Indian resident below 60 years of age, who uses the New Tax Regime.</li>
          <li>The calculations may not be accurate - use at your own risk.</li>
          <li>This tool runs entirely in your browser. No data is stored or shared, and we do not use analytics.</li>
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
