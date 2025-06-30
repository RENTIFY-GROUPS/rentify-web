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
  neighborhoodInsights: neighborhoodInsightSchema,
  landlord: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', propertySchema);
