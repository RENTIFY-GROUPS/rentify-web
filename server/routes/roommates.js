const express = require('express');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const RoommateProfile = require('../models/RoommateProfile');
const User = require('../models/User');
const router = express.Router();

// Create or update roommate profile
router.post('/', auth, [
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
  body('age').isInt({ min: 18 }).withMessage('Age must be at least 18'),
  body('smoking').isBoolean().withMessage('Smoking must be a boolean'),
  body('pets').isBoolean().withMessage('Pets must be a boolean'),
  body('sleepSchedule').isIn(['Early Bird', 'Night Owl', 'Flexible']).withMessage('Invalid sleep schedule'),
  body('cleanliness').isIn(['Very Clean', 'Moderately Clean', 'Relaxed']).withMessage('Invalid cleanliness preference'),
  body('socialHabits').isIn(['Very Social', 'Moderately Social', 'Quiet']).withMessage('Invalid social habits'),
  body('budget').isFloat({ min: 0 }).withMessage('Budget must be a positive number'),
  body('locationPreference').optional().isString(),
  body('moveInDate').optional().isISO8601().toDate().withMessage('Invalid date format'),
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const profileData = { ...req.body, user: req.user.id };
    let profile = await RoommateProfile.findOneAndUpdate(
      { user: req.user.id },
      profileData,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get roommate profile
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await RoommateProfile.findOne({ user: req.user.id }).populate('user', 'name email avatar');
    if (!profile) {
      return res.status(404).json({ message: 'Roommate profile not found' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Find roommate matches
router.get('/matches', auth, async (req, res) => {
  try {
    const myProfile = await RoommateProfile.findOne({ user: req.user.id });
    if (!myProfile) {
      return res.status(404).json({ message: 'Please complete your roommate profile first.' });
    }

    // Simple matching algorithm (can be expanded)
    const matches = await RoommateProfile.find({
      user: { $ne: req.user.id }, // Exclude self
      gender: myProfile.gender, // Match by gender
      smoking: myProfile.smoking, // Match by smoking preference
      pets: myProfile.pets, // Match by pet preference
      budget: { $gte: myProfile.budget * 0.8, $lte: myProfile.budget * 1.2 }, // +/- 20% budget
      // Add more matching criteria here based on other fields
    }).populate('user', 'name email avatar');

    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;