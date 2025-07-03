import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import PropertyCard from '../components/PropertyCard';
import { toast } from 'react-toastify';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await API.get('/wishlists');
        setWishlist(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
        setError('Failed to load wishlist. Please try again later.');
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (propertyId) => {
    try {
      await API.delete(`/wishlists/${propertyId}`);
      setWishlist(prevWishlist => ({
        ...prevWishlist,
        properties: prevWishlist.properties.filter(prop => prop._id !== propertyId)
      }));
      toast.success('Property removed from wishlist!');
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
      toast.error('Failed to remove property from wishlist.');
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-xl text-blue-600">Loading wishlist...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-xl text-red-600">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">My Wishlist</h1>

      {wishlist && wishlist.properties.length === 0 ? (
        <p className="text-center text-xl text-gray-600">Your wishlist is empty. Start adding some properties!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist && wishlist.properties.map(property => (
            <div key={property._id} className="relative">
              <PropertyCard property={property} />
              <button
                onClick={() => handleRemoveFromWishlist(property._id)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600"
                title="Remove from Wishlist"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}