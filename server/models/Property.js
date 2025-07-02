const mongoose = require('mongoose');

const neighborhoodInsightSchema = new mongoose.Schema({
  crimeRate: { type: String },
  schools: { type: String },
  transport: { type: String }
}, { _id: false });

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  amenities: [String],
  images: [String],
  videos: [String],
  floorPlans: [String],
  tags: [String],
  propertyType: { type: String, enum: ['Apartment', 'House', 'Condo'] },
  leaseDuration: { type: String, enum: ['Short-term', 'Long-term'] },
  neighborhoodInsights: neighborhoodInsightSchema,
  landlord: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  verified: { type: Boolean, default: false },
  latitude: { type: Number },
  longitude: { type: Number },
  virtualTourUrl: { type: String },
  isDealOfTheDay: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  flaggedReason: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', propertySchema);
