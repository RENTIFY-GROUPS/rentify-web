const mongoose = require('mongoose');

const backgroundCheckSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  transaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reportUrl: { type: String }, // URL to background check report
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BackgroundCheck', backgroundCheckSchema);
