const express = require('express');
const { auth } = require('../middleware/auth');
const Wishlist = require('../models/Wishlist');
const router = express.Router();

// Get user's wishlist
router.get('/', auth, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate('properties');
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, properties: [] });
      await wishlist.save();
    }
    res.json(wishlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add property to wishlist
router.post('/', auth, async (req, res) => {
  try {
    const { propertyId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, properties: [propertyId] });
    } else {
      if (!wishlist.properties.includes(propertyId)) {
        wishlist.properties.push(propertyId);
      }
    }
    await wishlist.save();
    res.json(wishlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove property from wishlist
router.delete('/:propertyId', auth, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (wishlist) {
      wishlist.properties = wishlist.properties.filter(
        (prop) => prop.toString() !== req.params.propertyId
      );
      await wishlist.save();
    }
    res.json(wishlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

// Get a shareable wishlist by user ID
router.get('/share/:userId', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.params.userId }).populate('properties');
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    res.json(wishlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});