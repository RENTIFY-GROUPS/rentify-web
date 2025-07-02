const mongoose = require('mongoose');

const forumPostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['General', 'Rent Negotiation', 'Moving Tips', 'Roommate Advice', 'Property Management'], default: 'General' },
  views: { type: Number, default: 0 },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ForumComment' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ForumPost', forumPostSchema);