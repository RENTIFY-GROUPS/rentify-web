import React, { useState, useEffect } from 'react';
import API from '../../utils/api';
import { FaTrash, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function SavedSearches() {
  const [savedSearches, setSavedSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedSearches();
  }, []);

  const fetchSavedSearches = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('/savedSearches');
      setSavedSearches(response.data);
    } catch (err) {
      console.error('Failed to fetch saved searches:', err);
      setError('Failed to load saved searches. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSearch = async (id) => {
    if (window.confirm('Are you sure you want to delete this saved search?')) {
      try {
        await API.delete(`/savedSearches/${id}`);
        fetchSavedSearches(); // Refresh the list
        toast.success('Search deleted successfully!');
      } catch (err) {
        console.error('Failed to delete saved search:', err);
        toast.error('Failed to delete saved search. Please try again.');
      }
    }
  };

  const handleApplySearch = (filters) => {
    // Convert filters object to URL query parameters
    const queryParams = new URLSearchParams();
    for (const key in filters) {
      if (Array.isArray(filters[key])) {
        filters[key].forEach(item => queryParams.append(key, item));
      } else if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    }
    navigate(`/listings?${queryParams.toString()}`);
  };

  if (loading) {
    return <p className="text-center mt-10 text-xl text-blue-600">Loading saved searches...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-xl text-red-600">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Your Saved Searches</h1>

      {savedSearches.length === 0 && (
        <p className="text-center text-xl text-gray-600">You haven't saved any searches yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedSearches.map(search => (
          <div key={search._id} className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">{search.name}</h2>
              <div className="text-gray-700 mb-4">
                {search.filters.location && <p><strong>Location:</strong> {search.filters.location}</p>}
                {search.filters.minPrice && <p><strong>Min Price:</strong> ₦{search.filters.minPrice.toLocaleString()}</p>}
                {search.filters.maxPrice && <p><strong>Max Price:</strong> ₦{search.filters.maxPrice.toLocaleString()}</p>}
                {search.filters.bedrooms && <p><strong>Bedrooms:</strong> {search.filters.bedrooms}</p>}
                {search.filters.bathrooms && <p><strong>Bathrooms:</strong> {search.filters.bathrooms}</p>}
                {search.filters.propertyType && <p><strong>Property Type:</strong> {search.filters.propertyType}</p>}
                {search.filters.amenities && search.filters.amenities.length > 0 && (
                  <p><strong>Amenities:</strong> {search.filters.amenities.join(', ')}</p>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => handleApplySearch(search.filters)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center"
              >
                <FaSearch className="mr-2" /> Apply Search
              </button>
              <button
                onClick={() => handleDeleteSearch(search._id)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 flex items-center"
              >
                <FaTrash className="mr-2" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
