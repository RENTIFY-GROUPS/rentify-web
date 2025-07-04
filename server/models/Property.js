const mongoose = require('mongoose');
const User = require('./User');

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

propertySchema.pre('save', async function(next) {
  // Check for duplicate listings (title and location)
  if (this.isNew || this.isModified('title') || this.isModified('location')) {
    const existingProperty = await this.constructor.findOne({
      title: this.title,
      location: this.location,
      _id: { $ne: this._id } // Exclude self when updating
    });

    if (existingProperty) {
      this.status = 'pending';
      this.flaggedReason = (this.flaggedReason ? this.flaggedReason + '; ' : '') + 'Duplicate listing detected.';
    }
  }

  // Check for suspicious keywords
  const suspiciousKeywords = ['scam', 'fraud', 'urgent money', 'quick cash', 'investment opportunity'];
  const textToCheck = (this.title + ' ' + this.description).toLowerCase();
  const foundKeywords = suspiciousKeywords.filter(keyword => textToCheck.includes(keyword));

  if (foundKeywords.length > 0) {
    this.status = 'pending';
    this.flaggedReason = (this.flaggedReason ? this.flaggedReason + '; ' : '') + `Suspicious keywords detected: ${foundKeywords.join(', ')}.`;
  }

  next();
});

module.exports = mongoose.model('Property', propertySchema);
