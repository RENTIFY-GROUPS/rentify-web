import React, { useState, useEffect } from 'react';
import API from '../../utils/api';
import { toast } from 'react-toastify';

export default function AdminDashboard() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllProperties();
  }, []);

  const fetchAllProperties = async () => {
    setLoading(true);
    try {
      const response = await API.get('/properties'); // Admin can fetch all properties
      setProperties(response.data.properties);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (propertyId, newStatus) => {
    setLoading(true);
    try {
      await API.put(`/properties/${propertyId}/status`, { status: newStatus });
      toast.success(`Property ${propertyId} ${newStatus} successfully!`);
      fetchAllProperties(); // Refresh the list
    } catch (err) {
      console.error(`Error updating property ${propertyId} status to ${newStatus}:`, err);
      toast.error(err.response?.data?.message || 'Failed to update property status.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFlag = async (propertyId) => {
    setLoading(true);
    try {
      await API.put(`/properties/${propertyId}/clear-flag`); // New endpoint needed
      toast.success(`Flag for property ${propertyId} cleared successfully!`);
      fetchAllProperties(); // Refresh the list
    } catch (err) {
      console.error(`Error clearing flag for property ${propertyId}:`, err);
      toast.error(err.response?.data?.message || 'Failed to clear property flag.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-xl text-blue-600">Loading pending properties...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-xl text-red-600">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Admin Dashboard</h1>

      {loading && <p className="text-center mt-10 text-xl text-blue-600">Loading properties...</p>}
      {error && <p className="text-center mt-10 text-xl text-red-600">{error}</p>}

      {!loading && !error && properties.length === 0 ? (
        <p className="text-center text-gray-600">No properties to display.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {properties.map((property) => (
            <div key={property._id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">{property.title}</h2>
              <p className="text-gray-700 mb-4">{property.description}</p>
              <p className="text-gray-600">Location: {property.location}</p>
              <p className="text-gray-600">Price: ${property.price}</p>
              <p className="text-gray-600">Landlord: {property.landlord.name} ({property.landlord.email})</p>
              <p className="text-gray-600">Status: {property.status}</p>
              {property.flaggedReason && (
                <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                  <p className="font-semibold">Flagged Reason:</p>
                  <p>{property.flaggedReason}</p>
                </div>
              )}
              <div className="mt-4 space-x-4">
                <button
                  onClick={() => handleStatusChange(property._id, 'approved')}
                  className="bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50"
                  disabled={loading}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusChange(property._id, 'rejected')}
                  className="bg-red-600 text-white p-2 rounded hover:bg-red-700 disabled:opacity-50"
                  disabled={loading}
                >
                  Reject
                </button>
                {property.flaggedReason && (
                  <button
                    onClick={() => handleClearFlag(property._id)}
                    className="bg-yellow-600 text-white p-2 rounded hover:bg-yellow-700 disabled:opacity-50"
                    disabled={loading}
                  >
                    Clear Flag
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
