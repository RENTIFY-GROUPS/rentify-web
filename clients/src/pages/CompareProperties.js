import React, { useState, useEffect } from 'react';
import API from '../utils/api';

export default function CompareProperties() {
  const [properties, setProperties] = useState([]);
  const [selectedPropertyIds, setSelectedPropertyIds] = useState([]);
  const [propertiesToCompare, setPropertiesToCompare] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllProperties = async () => {
      try {
        const response = await API.get('/properties');
        setProperties(response.data.properties);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch properties for comparison:', err);
        setError('Failed to load properties for comparison.');
        setLoading(false);
      }
    };
    fetchAllProperties();
  }, []);

  useEffect(() => {
    const selected = properties.filter(p => selectedPropertyIds.includes(p._id));
    setPropertiesToCompare(selected);
  }, [selectedPropertyIds, properties]);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      if (selectedPropertyIds.length < 3) { // Limit to 3 properties for comparison
        setSelectedPropertyIds(prev => [...prev, value]);
      } else {
        alert("You can only compare up to 3 properties.");
        e.target.checked = false; // Uncheck the box if limit reached
      }
    } else {
      setSelectedPropertyIds(prev => prev.filter(id => id !== value));
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-xl text-blue-600">Loading properties for comparison...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-xl text-red-600">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Compare Properties</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Select Properties (Max 3)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto border p-4 rounded-md">
          {properties.map(property => (
            <label key={property._id} className="flex items-center p-2 border rounded-md hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                value={property._id}
                checked={selectedPropertyIds.includes(property._id)}
                onChange={handleCheckboxChange}
                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-700 font-medium">{property.title} - {property.location}</span>
            </label>
          ))}
        </div>
      </div>

      {propertiesToCompare.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Comparison Table</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Feature</th>
                  {propertiesToCompare.map(property => (
                    <th key={property._id} className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">
                      {property.title} ({property.location})
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b font-medium text-gray-700">Image</td>
                  {propertiesToCompare.map(property => (
                    <td key={property._id} className="py-3 px-4 border-b">
                      <img src={property.images && property.images.length > 0 ? property.images[0] : 'https://via.placeholder.com/150x100?text=No+Image'} alt={property.title} className="w-32 h-24 object-cover rounded-md" />
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b font-medium text-gray-700">Price</td>
                  {propertiesToCompare.map(property => (
                    <td key={property._id} className="py-3 px-4 border-b">₦{property.price?.toLocaleString() || 'N/A'}</td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b font-medium text-gray-700">Bedrooms</td>
                  {propertiesToCompare.map(property => (
                    <td key={property._id} className="py-3 px-4 border-b">{property.bedrooms || 'N/A'}</td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b font-medium text-gray-700">Bathrooms</td>
                  {propertiesToCompare.map(property => (
                    <td key={property._id} className="py-3 px-4 border-b">{property.bathrooms || 'N/A'}</td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b font-medium text-gray-700">Property Type</td>
                  {propertiesToCompare.map(property => (
                    <td key={property._id} className="py-3 px-4 border-b">{property.propertyType || 'N/A'}</td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b font-medium text-gray-700">Amenities</td>
                  {propertiesToCompare.map(property => (
                    <td key={property._id} className="py-3 px-4 border-b">
                      {(property.amenities && property.amenities.length > 0) ? property.amenities.join(', ') : 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b font-medium text-gray-700">Description</td>
                  {propertiesToCompare.map(property => (
                    <td key={property._id} className="py-3 px-4 border-b text-sm">{property.description?.substring(0, 100) + '...' || 'N/A'}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {propertiesToCompare.length === 0 && (
        <p className="text-center text-xl text-gray-600 mt-8">Select up to 3 properties above to compare them side-by-side.</p>
      )}
    </div>
  );
}
