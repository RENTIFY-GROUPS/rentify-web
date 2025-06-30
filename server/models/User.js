const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['landlord', 'tenant'], required: true },
  avatar: { type: String }, // URL to profile image

  // Social Auth
  googleId: { type: String, unique: true, sparse: true },

  // KYC Documents
  idDocument: { type: String }, // URL or path to ID document
  ownershipProof: { type: String }, // URL or path to proof of ownership

  // 2FA
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String },

  // Profile fields for landlords
  portfolio: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  transactionHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],

  // Profile fields for tenants
  savedSearches: [{ type: String }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  inquiryHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inquiry' }],

  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
