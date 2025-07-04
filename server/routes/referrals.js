const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Claim referral credit
router.post('/claim-credit', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.referralCredit <= 0) {
      return res.status(400).json({ message: 'No referral credit to claim.' });
    }

    // Here you would implement the logic to apply the credit, e.g., generate a coupon,
    // reduce next payment, etc. For now, we'll just reset the credit.
    const claimedAmount = user.referralCredit;
    user.referralCredit = 0;
    await user.save();

    res.json({ message: `Successfully claimed ${claimedAmount} referral credit.`, claimedAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
