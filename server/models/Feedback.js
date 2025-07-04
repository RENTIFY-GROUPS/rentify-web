const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['bug', 'feature', 'general'], required: true },
  message: { type: String, required: true },
  screenshot: { type: String }, // URL to screenshot
  page: { type: String }, // Page where feedback was submitted
  browser: { type: String },
  os: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Feedback', feedbackSchema);