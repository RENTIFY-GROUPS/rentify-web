import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useParams } from 'react-router-dom';
import API from '../../utils/api';
import PropertyCard from '../../components/PropertyCard';
import ReviewForm from '../../components/ReviewForm';

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [nearbyProperties, setNearbyProperties] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPropertyAndReviews = async () => {
      try {
        const response = await API.get(`/properties/${id}`);
        setProperty(response.data);

        // Fetch nearby properties
        if (response.data.latitude && response.data.longitude) {
          const nearbyRes = await API.get('/properties/nearby', {
            params: {
              latitude: response.data.latitude,
              longitude: response.data.longitude,
              radius: 20,
            }
          });
          setNearbyProperties(nearbyRes.data.properties.filter(p => p._id !== id));
        }

        // Fetch reviews for the property
        const reviewsRes = await API.get(`/reviews/property/${id}`);
        setReviews(reviewsRes.data);

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch property details or reviews:', err);
        setError('Failed to load property details or reviews. Please try again later.');
        setLoading(false);
      }
    };
    fetchPropertyAndReviews();
  }, [id]);

  const handleReviewSubmit = (newReview) => {
    setReviews(prevReviews => [newReview, ...prevReviews]);
  };

  if (loading) {
    return <p className="text-center mt-10 text-xl text-blue-600">Loading property details...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-xl text-red-600">{error}</p>;
  }

  if (!property) {
    return <p className="text-center mt-10 text-xl text-gray-600">Property not found.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">{property.title}</h1>
      
      {property.images && property.images.length > 0 && (
        <img src={property.images[0]} alt={property.title} className="w-full max-w-4xl h-96 object-cover mb-6 rounded-lg shadow-lg" />
      )}

      {/* Virtual Tour Section */}
      {property.virtualTourUrl && (
        <section className="mb-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Virtual Tour</h2>
          <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src={property.virtualTourUrl}
              title="Virtual Tour"
              frameBorder="0"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
            ></iframe>
          </div>
        </section>
      )}

      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Property Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg text-gray-700">
          <p><strong>Location:</strong> {property.location}</p>
          <p><strong>Price:</strong> ₦{property.price.toLocaleString()}</p>
          <p><strong>Date Listed:</strong> {new Date(property.createdAt).toLocaleDateString()}</p>
          <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
          <p><strong>Bathrooms:</strong> {property.bathrooms}</p>
          <p><strong>Property Type:</strong> {property.propertyType || 'N/A'}</p>
          <p><strong>Lease Duration:</strong> {property.leaseDuration || 'N/A'}</p>
          <p><strong>Amenities:</strong> {property.amenities.join(', ') || 'N/A'}</p>
        </div>
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="text-xl font-bold text-yellow-800 mb-2">Contact Landlord</h3>
          <p className="text-yellow-700">For your privacy and security, the landlord's direct contact information is masked until a lease agreement is initiated. Please use the in-app chat or schedule a viewing to connect.</p>
        </div>
      </div>

      {/* Transparent Pricing Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Pricing Details</h2>
        <p className="text-lg text-gray-700">All prices are inclusive of standard service fees. Additional charges for specific services (e.g., background checks, premium support) will be clearly outlined before confirmation.</p>
        <div className="mt-4">
          <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700 mb-2">Promo Code (Optional)</label>
          <div className="flex">
            <input
              type="text"
              id="promoCode"
              className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-blue-400 focus:border-blue-400"
              placeholder="Enter promo code"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors duration-200">
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Escrow Service Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Secure Your Deposit</h2>
        <p className="text-lg text-gray-700">Rentify offers a secure escrow service to hold your deposit until move-in, ensuring peace of mind for both tenants and landlords. Your funds are protected until all conditions are met.</p>
      </div>

      {/* External Payment Disclaimer */}
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8" role="alert">
        <p className="font-bold">Important Payment Information</p>
        <p>While you may process payments outside the Rentify platform, please be aware that doing so is at your own risk. Rentify cannot guarantee the security or successful completion of transactions not conducted through our integrated payment systems or escrow service. We strongly advise using our secure platform for all financial transactions related to rentals.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Description</h2>
        <p className="text-lg text-gray-700 mb-4">{property.description}</p>
        <h3 className="text-xl font-bold mb-2 text-gray-800">Neighborhood Description</h3>
        <p className="text-lg text-gray-700">{property.neighborhoodInsights?.crimeRate || 'N/A'}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to leave a review!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review._id} className="border-b pb-4 last:border-b-0">
                <p><strong>{review.tenant.name}</strong> - Rating: {review.rating}/5</p>
                <p>{review.comment}</p>
                <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
        <ReviewForm propertyId={property._id} landlordId={property.landlord._id} onReviewSubmit={handleReviewSubmit} />
      </div>

      {/* Nearby Properties Section */}
      {nearbyProperties.length > 0 && (
        <section className="mt-10">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Properties Nearby</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyProperties.map(nearbyProperty => (
              <PropertyCard key={nearbyProperty._id} property={nearbyProperty} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
