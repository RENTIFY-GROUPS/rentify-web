import { useState } from 'react';
import PropertyCard from '../components/PropertyCard';

const allProperties = [
  // Add more properties here
];

export default function Listings() {
  const [properties, setProperties] = useState(allProperties);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    location: '',
    bedrooms: '',
    amenities: []
  });

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

  const applyFilters = () => {
    let filtered = allProperties;
    
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= Number(filters.minPrice));
    }
    
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= Number(filters.maxPrice));
    }
    
    if (filters.location) {
      filtered = filtered.filter(p => 
        p.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.bedrooms) {
      filtered = filtered.filter(p => p.bedrooms === Number(filters.bedrooms));
    }

    if (filters.amenities.length > 0) {
      filtered = filtered.filter(p => 
        filters.amenities.every(a => p.amenities && p.amenities.includes(a))
      );
    }
    
    setProperties(filtered);
  };

  const showInstantMatches = () => {
    // For demo, filter properties with price less than 300000 and pet-friendly tag
    const matches = allProperties.filter(p => p.price < 300000 && p.amenities && p.amenities.includes('pet-friendly'));
    setProperties(matches);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">Filter Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Min Price</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Price</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                value={filters.bedrooms}
                onChange={handleFilterChange}
                className="mt-1 p-2 border rounded w-full"
                min="0"
              />
            </div>
            <div className="col-span-3">
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-2">Amenities</legend>
                <label className="inline-flex items-center mr-4">
                  <input
                    type="checkbox"
                    name="amenities"
                    value="pet-friendly"
                    checked={filters.amenities.includes('pet-friendly')}
                    onChange={handleFilterChange}
                    className="form-checkbox"
                  />
                  <span className="ml-2">Pet-friendly</span>
                </label>
                <label className="inline-flex items-center mr-4">
                  <input
                    type="checkbox"
                    name="amenities"
                    value="near schools"
                    checked={filters.amenities.includes('near schools')}
                    onChange={handleFilterChange}
                    className="form-checkbox"
                  />
                  <span className="ml-2">Near Schools</span>
                </label>
                <label className="inline-flex items-center mr-4">
                  <input
                    type="checkbox"
                    name="amenities"
                    value="parking"
                    checked={filters.amenities.includes('parking')}
                    onChange={handleFilterChange}
                    className="form-checkbox"
                  />
                  <span className="ml-2">Parking</span>
                </label>
              </fieldset>
            </div>
          </div>
          <button
            onClick={applyFilters}
            className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-secondary"
          >
            Apply Filters
          </button>
          <button
            onClick={showInstantMatches}
            className="mt-4 ml-4 bg-cta text-white px-4 py-2 rounded hover:bg-secondary"
          >
            Show Instant Matches
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      </div>
    </>
  );
}
