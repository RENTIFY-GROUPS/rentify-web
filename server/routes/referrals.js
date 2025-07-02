const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Simulate applying a referral discount
router.post('/apply-discount', auth, async (req, res) => {
  try {
    const { referralCode } = req.body;

    const referredByUser = await User.findOne({ referralCode });

    if (!referredByUser) {
      return res.status(400).json({ message: 'Invalid referral code' });
    }

    // In a real application, you would apply a discount here
    // For example, update user's discount balance, apply a coupon, etc.
    res.json({ message: 'Referral discount applied successfully!', discountAmount: 10 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;