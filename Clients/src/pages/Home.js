import PropertyCard from '../components/PropertyCard';

const featuredProperties = [
  {
    id: 1,
    title: 'Modern Apartment in Lagos',
    location: 'Lekki, Lagos',
    price: 250000,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
    verified: true
  },
  // Add more properties
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="bg-blue-100 p-8 rounded-lg text-center">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Home</h1>
          <div className="max-w-md mx-auto">
            <input 
              type="text" 
              placeholder="Search by location..." 
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>
    </div>
  );
}