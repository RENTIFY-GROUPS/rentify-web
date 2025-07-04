import React, { useState, useEffect } from 'react';
import API from '../../utils/api';

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        // This endpoint would ideally fetch payments for the logged-in tenant
        const response = await API.get('/transactions/my-payments'); 
        setPayments(response.data.payments);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch payment history:', err);
        setError('Failed to load payment history. Please try again later.');
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-xl text-blue-600">Loading payment history...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-xl text-red-600">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Your Payment History</h1>

      {payments.length === 0 && (
        <p className="text-center text-xl text-gray-600">No payment records found.</p>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Property</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Amount</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Date</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-800">{payment.propertyTitle || 'N/A'}</td>
                <td className="py-3 px-4 text-gray-800">₦{payment.amount.toLocaleString()}</td>
                <td className="py-3 px-4 text-gray-800">{new Date(payment.date).toLocaleDateString()}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {payment.receiptUrl ? (
                    <a href={payment.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Receipt</a>
                  ) : (
                    <span>N/A</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Payment Reminders</h2>
        <p className="text-blue-700">You will receive email and in-app notifications for upcoming rent payments. Ensure your contact details are up-to-date in your profile.</p>
        {/* Future: Display upcoming payments here */}
      </div>
    </div>
  );
}
