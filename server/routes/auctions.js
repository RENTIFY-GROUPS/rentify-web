const express = require('express');
const router = express.Router();
const Auction = require('../models/Auction');
const authMiddleware = require('../middleware/auth');

// Create a new auction
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { property, startingPrice, startTime, endTime } = req.body;
    const seller = req.user.id;

    const newAuction = new Auction({ property, seller, startingPrice, startTime, endTime });
    await newAuction.save();

    res.status(201).json(newAuction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get ongoing auctions
router.get('/ongoing', async (req, res) => {
  try {
    const now = new Date();
    const auctions = await Auction.find({ startTime: { $lte: now }, endTime: { $gte: now }, status: 'ongoing' })
      .populate('property')
      .populate('seller', 'name');
    res.json(auctions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Place a bid
router.post('/:id/bid', authMiddleware, async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }
    if (auction.status !== 'ongoing') {
      return res.status(400).json({ message: 'Auction is not ongoing' });
    }
    const { amount } = req.body;
    if (amount <= auction.currentBid || amount < auction.startingPrice) {
      return res.status(400).json({ message: 'Bid amount too low' });
    }

    auction.bids.push({ bidder: req.user.id, amount });
    auction.currentBid = amount;
    auction.currentBidder = req.user.id;
    await auction.save();

    res.json(auction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
