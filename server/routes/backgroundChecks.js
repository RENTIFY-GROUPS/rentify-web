const express = require('express');
const router = express.Router();
const BackgroundCheck = require('../models/BackgroundCheck');
const { auth } = require('../middleware/auth');

// Request a background check
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { userId, transactionId } = req.body;
    const user = req.user.id;

    if (user !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const newCheck = new BackgroundCheck({ user: userId, transaction: transactionId });
    await newCheck.save();

    res.status(201).json(newCheck);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get background check status for a user
router.get('/user/:userId', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const checks = await BackgroundCheck.find({ user: req.params.userId });
    res.json(checks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
