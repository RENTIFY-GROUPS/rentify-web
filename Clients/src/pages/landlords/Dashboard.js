import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function LandlordDashboard() {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    dateListed: '',
    landDimension: '',
    houseType: '',
    numberOfRooms: '',
    accessibility: '',
    majorLandmarks: '',
    documentTypes: '',
    negotiablePrice: false,
    neighborhoodDescription: '',
    description: '',
    photos: [],
    videos: [],
    tags: [],
    kycStatus: ''
  });

  useEffect(() => {
    const fetchKycStatus = async () => {
      try {
        const res = await api.get('/profile');
        const user = res.data;
        setFormData(prev => ({ ...prev, kycStatus: user.kycStatus || '' }));
      } catch (err) {
        console.error('Failed to fetch KYC status', err);
      }
    };
    fetchKycStatus();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTagChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const tags = new Set(prev.tags);
      if (checked) {
        tags.add(value);
      } else {
        tags.delete(value);
      }
      return { ...prev, tags: Array.from(tags) };
    });
  };

  const autoTagging = (title, description) => {
    const tags = new Set(formData.tags);

    const text = (title + ' ' + description).toLowerCase();

    if (text.includes('pet')) tags.add('pet-friendly');
    if (text.includes('school')) tags.add('near schools');
    if (text.includes('parking')) tags.add('parking');

    return Array.from(tags);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const autoTags = autoTagging(formData.title, formData.description);
    const allTags = Array.from(new Set([...formData.tags, ...autoTags]));

    const data = new FormData();
    data.append('title', formData.title);
    data.append('location', formData.location);
    data.append('price', formData.price);
    data.append('dateListed', formData.dateListed);
    data.append('landDimension', formData.landDimension);
    data.append('houseType', formData.houseType);
    data.append('numberOfRooms', formData.numberOfRooms);
    data.append('accessibility', formData.accessibility);
    data.append('majorLandmarks', formData.majorLandmarks);
    data.append('documentTypes', formData.documentTypes);
    data.append('negotiablePrice', formData.negotiablePrice);
    data.append('neighborhoodDescription', formData.neighborhoodDescription);
    data.append('description', formData.description);
    allTags.forEach(tag => data.append('tags[]', tag));

    if (formData.photos.length > 0) {
      for (let i = 0; i < formData.photos.length; i++) {
        data.append('images', formData.photos[i]);
      }
    }
    if (formData.videos.length > 0) {
      for (let i = 0; i < formData.videos.length; i++) {
        data.append('videos', formData.videos[i]);
      }
    }

    try {
      const res = await api.post('/properties', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Listing created successfully');
      // Reset form or redirect as needed
    } catch (err) {
      console.error('Failed to create listing', err);
      alert('Failed to create listing');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Vendor Dashboard - Create Listing</h1>
      {formData.kycStatus === 'pending' && (
        <p className="mb-4 text-yellow-600 font-semibold">Your KYC documents are under review.</p>
      )}
      {formData.kycStatus === 'rejected' && (
        <p className="mb-4 text-red-600 font-semibold">Your KYC documents were rejected. Please update your documents.</p>
      )}
      {formData.kycStatus === 'approved' && (
        <p className="mb-4 text-green-600 font-semibold">Your KYC documents have been approved.</p>
      )}
      <form onSubmit={handleSubmit} className="bg-accent p-6 rounded-lg shadow-md space-y-6">
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border border-primary rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border border-primary rounded"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border border-primary rounded"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Date Listed</label>
            <input
              type="date"
              name="dateListed"
              value={formData.dateListed}
              onChange={handleChange}
              className="w-full p-2 border border-primary rounded"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Land Dimension</label>
            <input
              type="text"
              name="landDimension"
              value={formData.landDimension}
              onChange={handleChange}
              className="w-full p-2 border border-primary rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">House Type</label>
            <input
              type="text"
              name="houseType"
              value={formData.houseType}
              onChange={handleChange}
              className="w-full p-2 border border-primary rounded"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Number of Rooms</label>
            <input
              type="number"
              name="numberOfRooms"
              value={formData.numberOfRooms}
              onChange={handleChange}
              className="w-full p-2 border border-primary rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Accessibility</label>
            <input
              type="text"
              name="accessibility"
              value={formData.accessibility}
              onChange={handleChange}
              className="w-full p-2 border border-primary rounded"
            />
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">Major Landmarks</label>
          <input
            type="text"
            name="majorLandmarks"
            value={formData.majorLandmarks}
            onChange={handleChange}
            className="w-full p-2 border border-primary rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Document Types</label>
          <input
            type="text"
            name="documentTypes"
            value={formData.documentTypes}
            onChange={handleChange}
            placeholder="Comma separated"
            className="w-full p-2 border border-primary rounded"
          />
        </div>
        <div className="flex items-center space-x-4">
          <label className="font-semibold">Negotiable Price?</label>
          <input
            type="checkbox"
            name="negotiablePrice"
            checked={formData.negotiablePrice}
            onChange={handleChange}
            className="form-checkbox"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Neighborhood Description</label>
          <textarea
            name="neighborhoodDescription"
            value={formData.neighborhoodDescription}
            onChange={handleChange}
            className="w-full p-2 border border-primary rounded"
            rows="3"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border border-primary rounded"
            rows="4"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Photos (images only)</label>
          <input
            type="file"
            name="photos"
            onChange={handleChange}
            multiple
            accept="image/*"
            className="w-full"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Videos (videos only)</label>
          <input
            type="file"
            name="videos"
            onChange={handleChange}
            multiple
            accept="video/*"
            className="w-full"
          />
        </div>
        <div>
          <fieldset>
            <legend className="font-semibold mb-2">Tags (auto-tagging)</legend>
            <label className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                value="pet-friendly"
                checked={formData.tags.includes('pet-friendly')}
                onChange={handleTagChange}
                className="form-checkbox"
              />
              <span className="ml-2">Pet-friendly</span>
            </label>
            <label className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                value="near schools"
                checked={formData.tags.includes('near schools')}
                onChange={handleTagChange}
                className="form-checkbox"
              />
              <span className="ml-2">Near Schools</span>
            </label>
            <label className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                value="parking"
                checked={formData.tags.includes('parking')}
                onChange={handleTagChange}
                className="form-checkbox"
              />
              <span className="ml-2">Parking</span>
            </label>
          </fieldset>
        </div>
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded hover:bg-secondary"
        >
          Create Listing
        </button>
      </form>
    </div>
  );
}
