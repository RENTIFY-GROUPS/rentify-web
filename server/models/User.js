const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { encrypt, decrypt } = require('../utils/encryption');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { 
    type: String, 
    required: true,
    set: encrypt,
    get: decrypt
  },
  password: { type: String, required: true },
  role: { type: String, enum: ['landlord', 'tenant'], required: true },
  avatar: { type: String }, // URL to profile image

  // Social Auth
  googleId: { type: String, unique: true, sparse: true },

  // KYC Documents
  idDocument: { 
    type: String,
    set: encrypt,
    get: decrypt
  }, // URL or path to ID document
  ownershipProof: { 
    type: String,
    set: encrypt,
    get: decrypt
  }, // URL or path to proof of ownership

  // 2FA
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String },
  emailOtp: { type: String },
  emailOtpExpires: { type: Date },
  smsOtp: { type: String },
  smsOtpExpires: { type: Date },

  // Profile fields for landlords
  portfolio: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  transactionHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],

  // Profile fields for tenants
  savedSearches: [{ type: String }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  inquiryHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inquiry' }],

  // Gamification
  badges: [{ type: String }],

  // Referral Program
  referralCode: { type: String, unique: true, sparse: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  referralCredit: { type: Number, default: 0 },

  // Landlord Listing Progress
  listingProgress: {
    profileComplete: { type: Boolean, default: false },
    kycApproved: { type: Boolean, default: false },
    firstPropertyListed: { type: Boolean, default: false },
  },

  createdAt: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false }
});
});

// Generate referral code before saving (if not already present)
userSchema.pre('save', async function(next) {
  if (this.isNew && !this.referralCode) {
    this.referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
  }
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
