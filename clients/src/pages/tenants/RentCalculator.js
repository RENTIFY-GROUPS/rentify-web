import React, { useState } from 'react';

export default function RentCalculator() {
  const [salary, setSalary] = useState('');
  const [rentBudget, setRentBudget] = useState(0);

  const calculateBudget = () => {
    const monthlySalary = parseFloat(salary);
    if (isNaN(monthlySalary) || monthlySalary <= 0) {
      setRentBudget(0);
      return;
    }
    // Common rule of thumb: rent should be no more than 30% of gross income
    setRentBudget(monthlySalary * 0.30);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Rent Affordability Calculator</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Monthly Gross Salary (₦)</label>
          <input
            type="number"
            id="salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-400 focus:border-blue-400"
            placeholder="e.g., 150000"
          />
        </div>
        <button
          onClick={calculateBudget}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
        >
          Calculate Rent Budget
        </button>
        {rentBudget > 0 && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200 text-green-800">
            <p className="font-semibold">Your estimated monthly rent budget is: ₦{rentBudget.toLocaleString()}</p>
            <p className="text-sm">This is based on the 30% rule of thumb. Consider other expenses when making your decision.</p>
          </div>
        )}
      </div>
    </div>
  );
}