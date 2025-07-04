const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startingPrice: { type: Number, required: true },
  currentBid: { type: Number, default: 0 },
  currentBidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bids: [{
    bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number },
    timestamp: { type: Date, default: Date.now }
  }],
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ['ongoing', 'completed', 'cancelled'], default: 'ongoing' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Auction', auctionSchema);
