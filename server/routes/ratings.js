const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const { auth } = require('../middleware/auth');

// Create a new rating
router.post('/', auth, async (req, res) => {
  try {
    const { reviewee, property, rating, comment } = req.body;
    const reviewer = req.user.id;

    const newRating = new Rating({ reviewer, reviewee, property, rating, comment });
    await newRating.save();

    res.status(201).json(newRating);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get ratings for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const ratings = await Rating.find({ reviewee: req.params.userId }).populate('reviewer', 'name');
    res.json(ratings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get ratings for a property
router.get('/property/:propertyId', async (req, res) => {
  try {
    const ratings = await Rating.find({ property: req.params.propertyId }).populate('reviewer', 'name');
    res.json(ratings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
