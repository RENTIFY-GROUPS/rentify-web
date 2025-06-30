import React from 'react';
import { useParams } from 'react-router-dom';

const mockPropertyDetails = {
  id: 1,
  title: 'Modern Apartment in Lagos',
  location: 'Lekki, Lagos',
  price: 250000,
  dateListed: '2024-04-01',
  landDimension: '120 sqm',
  houseType: 'Apartment',
  numberOfRooms: 3,
  accessibility: 'Good road access, public transport nearby',
  majorLandmarks: 'Near Lekki Mall, Lekki Conservation Centre',
  documentTypes: ['Deed of Assignment', 'Survey Plan'],
  negotiablePrice: true,
  neighborhoodDescription: 'Safe and quiet neighborhood with parks and schools nearby.',
  description: 'A modern apartment with spacious rooms and great amenities.',
  image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
};

export default function PropertyDetails() {
  const { id } = useParams();

  // In a real app, fetch property details by id here

  const property = mockPropertyDetails; // Replace with fetched data

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
      <img src={property.image} alt={property.title} className="w-full max-w-4xl mb-6 rounded-lg" />
      <div className="text-lg text-gray-700 space-y-2">
        <p><strong>Location:</strong> {property.location}</p>
        <p><strong>Price:</strong> ₦{property.price.toLocaleString()}</p>
        <p><strong>Date Listed:</strong> {property.dateListed}</p>
        <p><strong>Land Dimension:</strong> {property.landDimension}</p>
        <p><strong>House Type:</strong> {property.houseType}</p>
        <p><strong>Number of Rooms:</strong> {property.numberOfRooms}</p>
        <p><strong>Accessibility:</strong> {property.accessibility}</p>
        <p><strong>Major Landmarks:</strong> {property.majorLandmarks}</p>
        <p><strong>Document Types:</strong> {property.documentTypes.join(', ')}</p>
        <p><strong>Negotiable Price:</strong> {property.negotiablePrice ? 'Yes' : 'No'}</p>
        <p><strong>Neighborhood Description:</strong> {property.neighborhoodDescription}</p>
        <p><strong>Description:</strong> {property.description}</p>
      </div>
    </div>
  );
}
