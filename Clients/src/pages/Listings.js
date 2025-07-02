import React, { useState, useEffect, Suspense, lazy } from 'react';
import PropertyCard from '../components/PropertyCard';
import API from '../utils/api';
import { FaList, FaMap } from 'react-icons/fa';

const MapComponent = lazy(() => import('../components/MapComponent'));

export default function Listings() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
    amenities: []
  });
  const [showSaveSearchModal, setShowSaveSearchModal] = useState(false);
  const [savedSearchName, setSavedSearchName] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  useEffect(() => {
    fetchProperties();
  }, [filters]); // Re-fetch properties whenever filters change

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.location) params.location = filters.location;
      if (filters.bedrooms) params.bedrooms = filters.bedrooms;
      if (filters.bathrooms) params.bathrooms = filters.bathrooms;
      if (filters.propertyType) params.propertyType = filters.propertyType;
      if (filters.amenities.length > 0) params.amenities = filters.amenities.join(',');

      const response = await API.get('/properties', { params });
      setProperties(response.data.properties);
    } catch (err) {
      console.error('Failed to fetch properties:', err);
      setError('Failed to load properties. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFilters(prev => {
        const amenities = new Set(prev.amenities);
        if (checked) {
          amenities.add(value);
        } else {
          amenities.delete(value);
        }
        return { ...prev, amenities: Array.from(amenities) };
      });
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveSearch = () => {
    setShowSaveSearchModal(true);
  };

  const saveSearch = async () => {
    try {
      await API.post('/savedSearches', {
        name: savedSearchName,
        filters: filters,
      });
      alert(`Search "${savedSearchName}" saved successfully!`);
      setShowSaveSearchModal(false);
      setSavedSearchName('');
    } catch (err) {
      console.error('Failed to save search:', err);
      alert('Failed to save search. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Filter Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-400 focus:border-blue-400"
              placeholder="e.g., Lagos"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Min Price</label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-400 focus:border-blue-400"
              placeholder="e.g., 100000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Price</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-400 focus:border-blue-400"
              placeholder="e.g., 500000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
            <input
              type="number"
              name="bedrooms"
              value={filters.bedrooms}
              onChange={handleFilterChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-400 focus:border-blue-400"
              min="0"
              placeholder="e.g., 3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
            <input
              type="number"
              name="bathrooms"
              value={filters.bathrooms}
              onChange={handleFilterChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-400 focus:border-blue-400"
              min="0"
              placeholder="e.g., 2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Property Type</label>
            <select
              name="propertyType"
              value={filters.propertyType}
              onChange={handleFilterChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-400 focus:border-blue-400"
            >
              <option value="">Any</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="shared_room">Shared Room</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Lease Duration</label>
            <select
              name="leaseDuration"
              value={filters.leaseDuration}
              onChange={handleFilterChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-400 focus:border-blue-400"
            >
              <option value="">Any</option>
              <option value="Short-term">Short-term</option>
              <option value="Long-term">Long-term</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleSaveSearch}
          className="mt-6 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200 shadow-md"
        >
          Save Search
        </button>
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setViewMode('list')}
          className={`px-6 py-3 rounded-l-lg font-semibold ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
        >
          <FaList className="inline-block mr-2" /> List View
        </button>
        <button
          onClick={() => setViewMode('map')}
          className={`px-6 py-3 rounded-r-lg font-semibold ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
        >
          <FaMap className="inline-block mr-2" /> Map View
        </button>
      </div>

      {loading && <p className="text-center text-xl text-blue-600">Loading properties...</p>}
      {error && <p className="text-center text-xl text-red-600">{error}</p>}
      {!loading && !error && properties.length === 0 && (
        <p className="text-center text-xl text-gray-600">No properties found matching your criteria.</p>
      )}

      {viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && !error && properties.map(property => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}

      {viewMode === 'map' && (
        <Suspense fallback={<div className="text-center text-xl text-blue-600">Loading map...</div>}>
          <MapComponent properties={properties} />
        </Suspense>
      )}

      {/* Save Search Modal */}
      {showSaveSearchModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4">Name Your Saved Search</h3>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:ring-blue-400 focus:border-blue-400"
              placeholder="e.g., 'My Dream Apartment Search'"
              value={savedSearchName}
              onChange={(e) => setSavedSearchName(e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowSaveSearchModal(false)}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={saveSearch}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
