const mongoose = require('mongoose');

const SavedSearchSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  filters: {
    location: String,
    minPrice: Number,
    maxPrice: Number,
    bedrooms: Number,
    bathrooms: Number,
    propertyType: String,
    amenities: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SavedSearch', SavedSearchSchema);
