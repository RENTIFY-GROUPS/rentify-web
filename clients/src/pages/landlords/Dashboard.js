import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import PropertyCard from '../../components/PropertyCard';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function LandlordDashboard() {
  const [landlordData, setLandlordData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [referralCode, setReferralCode] = useState('');
  const [referralCredit, setReferralCredit] = useState(0);

  const handleClaimCredit = async () => {
    setLoading(true);
    try {
      const response = await api.post('/referrals/claim-credit');
      toast.success(response.data.message);
      setReferralCredit(0); // Reset credit after claiming
    } catch (err) {
      console.error('Error claiming referral credit:', err);
      toast.error(err.response?.data?.message || 'Failed to claim referral credit.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchLandlordData = async () => {
      try {
        const res = await api.get('/profile/landlord-dashboard');
        setLandlordData(res.data);
        setReferralCode(res.data.referralCode);
        setReferralCredit(res.data.referralCredit);

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

      <div className="mb-6">
        <Link to="/settings/2fa" className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition duration-200">
          Manage Two-Factor Authentication
        </Link>
      </div>

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
          <p className="text-3xl font-bold text-purple-600">{referralCode}</p>
          <p className="text-sm text-gray-600">Share this code with friends to earn rewards!</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Referral Credit</h2>
          <p className="text-3xl font-bold text-green-600">₦{referralCredit.toLocaleString()}</p>
          {referralCredit > 0 && (
            <button
              onClick={handleClaimCredit}
              className="mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Claiming...' : 'Claim Credit'}
            </button>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Your Badges</h2>
          {landlordData.badges && landlordData.badges.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {landlordData.badges.map((badge, index) => (
                <span key={index} className="bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {badge}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No badges earned yet.</p>
          )}
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
