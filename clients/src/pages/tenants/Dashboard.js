import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CheckoutForm from '../components/CheckoutForm';
import Modal from '../components/Modal';
import API from '../../utils/api';
import { toast } from 'react-toastify';

export default function TenantDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wishlist, setWishlist] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [referralCode, setReferralCode] = useState('');
  const [referralCredit, setReferralCredit] = useState(0);

  const handleClaimCredit = async () => {
    try {
      const response = await API.post('/referrals/claim-credit');
      toast.success(response.data.message);
      setReferralCredit(0); // Reset credit after claiming
    } catch (err) {
      console.error('Error claiming referral credit:', err);
      toast.error(err.response?.data?.message || 'Failed to claim referral credit.');
    }
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await API.get('/wishlists');
        setWishlist(res.data);
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
        toast.error('Failed to fetch wishlist.');
      }
    };

    const fetchUserProfile = async () => {
      try {
        const res = await API.get('/profile');
        setUserProfile(res.data);
        setReferralCode(res.data.referralCode);
        setReferralCredit(res.data.referralCredit);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    };

    fetchWishlist();
    fetchUserProfile();
  }, []);

  const handleShareWishlist = () => {
    if (wishlist && wishlist.properties.length > 0) {
      const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
      const shareableLink = `${window.location.origin}/shared-wishlist/${userId}`;

      // For email
      const emailSubject = 'Check out my Rentify Wishlist!';
      const emailBody = `Hey, I thought you might be interested in my Rentify wishlist: ${shareableLink}`;
      window.location.href = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

      // For SMS (Note: SMS links are highly dependent on device/OS and may not work universally)
      // const smsBody = `Check out my Rentify wishlist: ${shareableLink}`;
      // window.location.href = `sms:?body=${encodeURIComponent(smsBody)}`;

      toast.info('Wishlist share options opened.');
    } else {
      toast.warn('Your wishlist is empty. Add some properties first!');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Tenant Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">My Saved Searches</h2>
          <p className="text-gray-600 mb-4">View and manage your saved property searches.</p>
          <Link to="/saved-searches" className="text-blue-600 hover:underline font-medium">Go to Saved Searches</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Payment History</h2>
          <p className="text-gray-600 mb-4">Track your rent payments and view receipts.</p>
          <Link to="/tenant/payment-history" className="text-blue-600 hover:underline font-medium">View Payment History</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Pay Rent</h2>
          <p className="text-gray-600 mb-4">Pay your rent securely online.</p>
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium">Pay Rent</button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">My Wishlist</h2>
          <p className="text-gray-600 mb-4">View and share your favorite properties.</p>
          <Link to="/wishlist" className="text-blue-600 hover:underline font-medium">View Wishlist</Link>
          <button onClick={handleShareWishlist} className="ml-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 font-medium">Share Wishlist</button>
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
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Claim Credit
            </button>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Your Badges</h2>
          {userProfile && userProfile.badges && userProfile.badges.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {userProfile.badges.map((badge, index) => (
                <span key={index} className="bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {badge}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No badges earned yet.</p>
          )}
        </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Rent Affordability Calculator</h2>
          <p className="text-gray-600 mb-4">Calculate your affordable rent based on your income.</p>
          <Link to="/tenant/rent-calculator" className="text-blue-600 hover:underline font-medium">Use Calculator</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Moving Checklist</h2>
          <p className="text-gray-600 mb-4">Get organized for your move with our comprehensive checklist.</p>
          <Link to="/tenant/moving-checklist" className="text-blue-600 hover:underline font-medium">View Checklist</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Roommate Matching</h2>
          <p className="text-gray-600 mb-4">Find compatible roommates based on your preferences.</p>
          <Link to="/tenant/roommate-questionnaire" className="text-blue-600 hover:underline font-medium">Create Profile</Link>
          <Link to="/tenant/roommate-matches" className="ml-4 text-blue-600 hover:underline font-medium">View Matches</Link>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CheckoutForm amount={1000} propertyId="some-property-id" landlordId="some-landlord-id" />
      </Modal>
    </div>
  );
}