const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const upload = require('../middleware/cloudinaryUpload');
const User = require('../models/User');
const router = express.Router();

// Get current user profile
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'server/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const uploadMultiple = multer({ storage }).fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'idDocument', maxCount: 1 },
  { name: 'ownershipProof', maxCount: 1 }
]);

// Update user profile including avatar and KYC document uploads
router.put('/', auth, uploadMultiple, [
  body('name').optional().trim().notEmpty().withMessage('Name is required'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array().map(e => e.msg).join(', ') });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email, phone, password } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (password) user.password = password;

    // Update listing progress
    if (user.name && user.email && user.phone) {
      user.listingProgress.profileComplete = true;
    }

    if (req.files) {
      if (req.files['avatar']) {
        user.avatar = `/uploads/${req.files['avatar'][0].filename}`;
      }
      if (req.files['idDocument']) {
        user.idDocument = `/uploads/${req.files['idDocument'][0].filename}`;
      }
      if (req.files['ownershipProof']) {
        user.ownershipProof = `/uploads/${req.files['ownershipProof'][0].filename}`;
      }
    }

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get landlord dashboard data
router.get('/landlord-dashboard', auth, async (req, res) => {
  try {
    if (req.user.role !== 'landlord') {
      return res.status(403).json({ message: 'Access denied. Not a landlord.' });
    }

    const landlord = await User.findById(req.user.id)
      .populate('portfolio') // Populate properties
      .populate('transactionHistory'); // Populate transactions

    if (!landlord) {
      return res.status(404).json({ message: 'Landlord not found.' });
    }

    res.json(landlord);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
