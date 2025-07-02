import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CheckoutForm from '../../components/CheckoutForm';
import Modal from '../../components/Modal';

export default function TenantDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CheckoutForm amount={1000} propertyId="some-property-id" landlordId="some-landlord-id" />
      </Modal>
    </div>
  );
}