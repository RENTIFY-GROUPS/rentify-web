const express = require('express');
const router = express.Router();
const SavedSearch = require('../models/SavedSearch');
const { auth } = require('../middleware/auth');

// @route   POST api/savedSearches
// @desc    Save a new search
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name, filters } = req.body;
    const newSavedSearch = new SavedSearch({
      user: req.user.id,
      name,
      filters,
    });

    const savedSearch = await newSavedSearch.save();
    res.json(savedSearch);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/savedSearches
// @desc    Get all saved searches for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const savedSearches = await SavedSearch.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(savedSearches);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/savedSearches/:id
// @desc    Delete a saved search
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const savedSearch = await SavedSearch.findById(req.params.id);

    if (!savedSearch) {
      return res.status(404).json({ msg: 'Saved search not found' });
    }

    // Check user
    if (savedSearch.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await savedSearch.deleteOne();

    res.json({ msg: 'Saved search removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
