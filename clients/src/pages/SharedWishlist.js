import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../utils/api';
import PropertyCard from '../components/PropertyCard';

export default function SharedWishlist() {
  const { userId } = useParams();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedWishlist = async () => {
      try {
        const res = await API.get(`/wishlists/share/${userId}`);
        setWishlist(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch shared wishlist:', err);
        setError('Failed to load shared wishlist. It might not exist or is private.');
        setLoading(false);
      }
    };
    fetchSharedWishlist();
  }, [userId]);

  if (loading) {
    return <p className="text-center mt-10 text-xl text-blue-600">Loading shared wishlist...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-xl text-red-600">{error}</p>;
  }

  if (!wishlist || wishlist.properties.length === 0) {
    return <p className="text-center mt-10 text-xl text-gray-600">This wishlist is empty or does not exist.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">{wishlist.user.name}'s Wishlist</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.properties.map(property => (
          <PropertyCard key={property._id} property={property} />
        ))}
      </div>
    </div>
  );
}