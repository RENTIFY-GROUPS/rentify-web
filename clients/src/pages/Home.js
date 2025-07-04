import React, { useState, useEffect, lazy, Suspense } from 'react';
const PropertyCard = lazy(() => import('../components/PropertyCard'));
import API from '../utils/api';
import { isAuthenticated } from '../utils/auth';

// Hero Section Component
const Hero = ({ onSearch }) => (
  <section className="relative bg-cover bg-center text-white py-20 px-4" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }}>
    <div className="absolute inset-0 bg-black opacity-50"></div>
    <div className="relative z-10 text-center">
      <h1 className="text-5xl font-extrabold mb-4">Find Your Next Home, Hassle-Free</h1>
      <p className="text-xl mb-8">The easiest way to rent a home without agent fees.</p>
      <div className="max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Enter a city, neighborhood, or address"
          className="w-full p-4 rounded-full border-2 border-transparent focus:outline-none focus:ring-4 focus:ring-blue-500 text-gray-800"
          onChange={e => onSearch(e.target.value)}
        />
      </div>
    </div>
  </section>
);

// How It Works Section
const HowItWorks = () => (
  <section className="py-16 bg-gray-100">
    <div className="container mx-auto text-center">
      <h2 className="text-3xl font-bold mb-8">How It Works</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {/* For Tenants */}
        <div className="w-full md:w-1/3 p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">For Tenants</h3>
          <p>Discover verified properties, chat directly with landlords, and rent your dream home without paying any commission.</p>
        </div>
        {/* For Landlords */}
        <div className="w-full md:w-1/3 p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">For Landlords</h3>
          <p>List your properties for free, connect with qualified tenants, and maximize your rental income without agent fees.</p>
        </div>
      </div>
    </div>
  </section>
);

// Featured Properties Section
const FeaturedProperties = ({ properties }) => (
  <section className="py-16">
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Featured Properties</h2>
      <Suspense fallback={<div className="text-center">Loading Properties...</div>}>
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map(property => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <p className="text-center">No featured properties available at the moment.</p>
        )}
      </Suspense>
    </div>
  </section>
);

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [recommendedProperties, setRecommendedProperties] = useState([]);
  const [dealsOfTheDay, setDealsOfTheDay] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await API.get('/properties', {
          params: { limit: 6, sortBy: 'verified', order: 'desc' }
        });
        setProperties(response.data.properties);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      }
    };

    const fetchRecommendations = async () => {
      if (isAuthenticated()) {
        try {
          const response = await API.get('/properties/recommendations');
          setRecommendedProperties(response.data);
        } catch (error) {
          console.error('Failed to fetch recommendations:', error);
        }
      }
    };

    const fetchDealsOfTheDay = async () => {
      try {
        const response = await API.get('/properties/deals-of-the-day');
        setDealsOfTheDay(response.data);
      } catch (error) {
        console.error('Failed to fetch deals of the day:', error);
      }
    };

    fetchProperties();
    fetchRecommendations();
    fetchDealsOfTheDay();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log("Searching for:", query);
  };

  const filteredProperties = properties.filter(p => 
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Hero onSearch={handleSearch} />
      <HowItWorks />
      <FeaturedProperties properties={filteredProperties} />

      {dealsOfTheDay.length > 0 && (
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Deals of the Day!</h2>
            <Suspense fallback={<div className="text-center">Loading Deals...</div>}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {dealsOfTheDay.map(property => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            </Suspense>
          </div>
        </section>
      )}

      {isAuthenticated() && recommendedProperties.length > 0 && (
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Recommended for You</h2>
            <Suspense fallback={<div className="text-center">Loading Recommendations...</div>}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendedProperties.map(property => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            </Suspense>
          </div>
        </section>
      )}
    </div>
  );
}