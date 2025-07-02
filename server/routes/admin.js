const express = require('express');
const auth = require('../middleware/auth');
const Property = require('../models/Property');
const User = require('../models/User');
const router = express.Router();

// Middleware to check if user is admin
const adminAuth = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

// Get all properties (for admin review)
router.get('/properties', auth, adminAuth, async (req, res) => {
  try {
    const properties = await Property.find().populate('landlord', 'name email');
    res.json(properties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve/Reject a property listing
router.put('/properties/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { status } = req.body; // 'approved', 'rejected', 'under review'
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    property.status = status;
    await property.save();
    res.json({ message: `Property ${status} successfully`, property });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Flag a property as fraudulent
router.put('/properties/:id/flag', auth, adminAuth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    property.isFlagged = true;
    await property.save();
    res.json({ message: 'Property flagged as fraudulent.', property });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (for admin management)
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle user admin status
router.put('/users/:id/toggle-admin', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.isAdmin = !user.isAdmin;
    await user.save();
    res.json({ message: `User ${user.name} admin status toggled to ${user.isAdmin}`, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;