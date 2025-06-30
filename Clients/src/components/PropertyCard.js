import { Link } from 'react-router-dom';

export default function PropertyCard({ property }) {
  return (
    <Link to={`/property/${property._id}`} className="block border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <img 
        src={property.images && property.images.length > 0 ? property.images[0] : 'https://via.placeholder.com/300x200'} 
        alt={property.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold">{property.title}</h3>
        <p className="text-gray-600">{property.location}</p>
        <p className="text-blue-600 font-bold">₦{property.price.toLocaleString()}/month</p>
        <div className="mt-2 flex space-x-2">
          {property.verified && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Verified</span>}
        </div>
      </div>
    </Link>
  );
}
