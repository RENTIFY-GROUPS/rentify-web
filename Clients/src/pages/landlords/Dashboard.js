import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import PropertyCard from '../../components/PropertyCard';

export default function LandlordDashboard() {
  const [landlordData, setLandlordData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLandlordData = async () => {
      try {
        const res = await api.get('/profile/landlord-dashboard');
        setLandlordData(res.data);

        const reviewsRes = await api.get(`/reviews/landlord/${res.data._id}`);
        setReviews(reviewsRes.data);

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch landlord data or reviews:', err);
        setError('Failed to load landlord data or reviews. Please try again later.');
        setLoading(false);
      }
    };
    fetchLandlordData();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-xl text-blue-600">Loading landlord dashboard...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-xl text-red-600">{error}</p>;
  }

  if (!landlordData) {
    return <p className="text-center mt-10 text-xl text-gray-600">No landlord data found.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Landlord Dashboard</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Listing Progress</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold">Profile Complete: {landlordData.listingProgress.profileComplete ? '✅' : '❌'}</p>
            <p className="text-sm text-gray-600">Complete your profile information.</p>
          </div>
          <div>
            <p className="font-semibold">KYC Approved: {landlordData.listingProgress.kycApproved ? '✅' : '❌'}</p>
            <p className="text-sm text-gray-600">Submit your KYC documents for approval.</p>
          </div>
          <div>
            <p className="font-semibold">First Property Listed: {landlordData.listingProgress.firstPropertyListed ? '✅' : '❌'}</p>
            <p className="text-sm text-gray-600">List your first property to get started.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Total Properties</h2>
          <p className="text-3xl font-bold text-blue-600">{landlordData.portfolio.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Total Transactions</h2>
          <p className="text-3xl font-bold text-green-600">{landlordData.transactionHistory.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Your Referral Code</h2>
          <p className="text-3xl font-bold text-purple-600">{landlordData.referralCode}</p>
          <p className="text-sm text-gray-600">Share this code with friends to earn rewards!</p>
        </div>
        {/* Add more analytics here */}
      </div>

      <h2 className="text-2xl font-bold mb-4 text-gray-800">My Properties</h2>
      {landlordData.portfolio.length === 0 ? (
        <p>You have no properties listed yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landlordData.portfolio.map(property => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}

      <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">Transaction History</h2>
      {landlordData.transactionHistory.length === 0 ? (
        <p>No transaction history available.</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {landlordData.transactionHistory.map(transaction => (
                <tr key={transaction._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{transaction.property.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₦{transaction.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(transaction.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">Reviews Received</h2>
      {reviews.length === 0 ? (
        <p>No reviews received yet.</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          {reviews.map(review => (
            <div key={review._id} className="border-b pb-4 mb-4 last:border-b-0 last:pb-0">
              <p><strong>From: {review.tenant.name}</strong></p>
              <p>Rating: {review.rating}/5</p>
              <p>Comment: {review.comment}</p>
              <p className="text-sm text-gray-500">On: {new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
