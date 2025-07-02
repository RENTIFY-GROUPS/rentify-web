import React from 'react';
import { FaTimes, FaBed, FaBath, FaMapMarkerAlt } from 'react-icons/fa';

export default function QuickViewModal({ property, onClose }) {
  if (!property) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl relative transform transition-all duration-300 scale-95 hover:scale-100">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl z-10"
        >
          <FaTimes />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Image Section */}
          <div className="md:col-span-1">
            <img
              src={property.images && property.images.length > 0 ? property.images[0] : 'https://via.placeholder.com/400x300?text=No+Image+Available'}
              alt={property.title}
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Details Section */}
          <div className="md:col-span-1 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h2>
              <p className="text-gray-700 flex items-center mb-3">
                <FaMapMarkerAlt className="mr-2 text-blue-500" /> {property.location}
              </p>
              <p className="text-4xl font-extrabold text-blue-700 mb-4">₦{property.price.toLocaleString()}<span className="text-xl font-normal text-gray-500">/month</span></p>

              <div className="flex items-center space-x-6 text-gray-700 mb-4">
                <span className="flex items-center">
                  <FaBed className="mr-2 text-xl" /> {property.bedrooms || 'N/A'} Beds
                </span>
                <span className="flex items-center">
                  <FaBath className="mr-2 text-xl" /> {property.bathrooms || 'N/A'} Baths
                </span>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-4">{property.description || 'No description available.'}</p>
            </div>

            <div className="mt-4">
              <button
                onClick={() => window.location.href = `/property/${property._id}`}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-md"
              >
                View Full Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
