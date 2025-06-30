import React, { useState, useEffect, lazy, Suspense } from 'react';
const PropertyCard = lazy(() => import('../components/PropertyCard'));
import API from '../utils/api';
const Carousel = lazy(() => import('../components/Carousel'));

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [filteredProperties, setFilteredProperties] = useState([]);

  useEffect(() => {
    // Fetch featured properties from backend API
    const fetchFeaturedProperties = async () => {
      try {
        const response = await API.get('/properties', {
          params: {
            limit: 6,
            sortBy: 'verified',
            order: 'desc'
          }
        });
        setFeaturedProperties(response.data.properties);
        setFilteredProperties(response.data.properties);
      } catch (error) {
        console.error('Failed to fetch featured properties:', error);
      }
    };
    fetchFeaturedProperties();
  }, []);

  useEffect(() => {
    // Filter properties by location search
    if (!searchLocation) {
      setFilteredProperties(featuredProperties);
    } else {
      const filtered = featuredProperties.filter(property =>
        property.location.toLowerCase().includes(searchLocation.toLowerCase())
      );
      setFilteredProperties(filtered);
    }
  }, [searchLocation, featuredProperties]);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="bg-accent p-8 rounded-lg text-center">
          <h1 className="text-4xl font-bold mb-4 text-primary">Find Your Perfect Home</h1>
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search by location..."
              className="w-full p-3 rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchLocation}
              onChange={e => setSearchLocation(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-primary">Featured Properties</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <Carousel items={filteredProperties} />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          {filteredProperties.length > 0 ? (
            filteredProperties.map(property => (
              <PropertyCard key={property._id} property={property} />
            ))
          ) : (
            <p>No properties found.</p>
          )}
        </Suspense>
      </section>

      {/* Placeholder for new UI sections or components */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-primary">Coming Soon</h2>
        <p>New features and sections will be added here.</p>
      </section>
    </div>
  );
}
