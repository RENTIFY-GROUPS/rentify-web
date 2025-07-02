const express = require('express');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const Feedback = require('../models/Feedback');
const router = express.Router();

// Submit feedback
router.post('/', auth, [
  body('type').isIn(['bug', 'feature', 'general']).withMessage('Invalid feedback type'),
  body('message').notEmpty().withMessage('Message is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { type, message, screenshot, page, browser, os } = req.body;

    const newFeedback = new Feedback({
      user: req.user.id,
      type,
      message,
      screenshot,
      page,
      browser,
      os,
    });

    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;