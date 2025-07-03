import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaMapMarkerAlt, FaCheckCircle, FaEye } from 'react-icons/fa';
import QuickViewModal from './QuickViewModal';

export default function PropertyCard({ property }) {
  const [showQuickView, setShowQuickView] = useState(false);

  const handleQuickViewClick = (e) => {
    e.preventDefault(); // Prevent navigating to property details page
    setShowQuickView(true);
  };

  return (
    <div className="relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 group">
      <Link to={`/property/${property._id}`} className="block">
        <div className="relative">
          <img 
            src={property.images && property.images.length > 0 ? property.images[0] : 'https://via.placeholder.com/400x250?text=No+Image+Available'} 
            alt={property.title} 
            className="w-full h-56 object-cover"
            loading="lazy"
          />
          {property.verified && (
            <div className="absolute top-3 left-3 group">
              <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                <FaCheckCircle className="mr-1" /> Verified
              </span>
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                This property has been verified by Rentify for authenticity.
              </div>
            </div>
          )}
          {/* Quick View Button - Appears on hover */}
          <button
            onClick={handleQuickViewClick}
            className="absolute bottom-3 right-3 bg-blue-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg"
            title="Quick View"
          >
            <FaEye className="text-xl" />
          </button>
        </div>
        <div className="p-5">
          <h3 className="text-2xl font-bold text-gray-800 mb-2 truncate">{property.title}</h3>
          <p className="text-gray-600 flex items-center mb-3">
            <FaMapMarkerAlt className="mr-2 text-blue-500" /> {property.location}
          </p>
          <div className="flex items-center justify-between text-gray-700 mb-4">
            <span className="flex items-center">
              <FaBed className="mr-2 text-lg" /> {property.bedrooms || 'N/A'} Beds
            </span>
            <span className="flex items-center">
              <FaBath className="mr-2 text-lg" /> {property.bathrooms || 'N/A'} Baths
            </span>
          </div>
          <p className="text-3xl font-extrabold text-blue-700 mb-4">₦{property.price.toLocaleString()}<span className="text-xl font-normal text-gray-500">/month</span></p>
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300">
            View Details
          </button>
        </div>
      </Link>

      {showQuickView && (
        <QuickViewModal property={property} onClose={() => setShowQuickView(false)} />
      )}
    </div>
  );
}
