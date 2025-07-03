const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const Review = require('../models/Review');
const router = express.Router();

// Create a review
router.post('/', auth, [
  body('propertyId').notEmpty().withMessage('Property ID is required'),
  body('landlordId').notEmpty().withMessage('Landlord ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').notEmpty().withMessage('Comment is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array().map(e => e.msg).join(', ') });
  }

  try {
    const { propertyId, landlordId, rating, comment } = req.body;

    const review = new Review({
      property: propertyId,
      landlord: landlordId,
      tenant: req.user.id,
      rating,
      comment
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reviews for a property
router.get('/property/:propertyId', async (req, res) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId }).populate('tenant', 'name avatar');
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reviews for a landlord
router.get('/landlord/:landlordId', async (req, res) => {
  try {
    const reviews = await Review.find({ landlord: req.params.landlordId }).populate('tenant', 'name avatar');
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;