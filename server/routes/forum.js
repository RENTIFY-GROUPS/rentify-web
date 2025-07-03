const express = require('express');
const { auth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const ForumPost = require('../models/ForumPost');
const ForumComment = require('../models/ForumComment');
const router = express.Router();

// Get all forum posts
router.get('/', async (req, res) => {
  try {
    const posts = await ForumPost.find().populate('user', 'name avatar').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single forum post with comments
router.get('/:id', async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate('user', 'name avatar')
      .populate({ path: 'comments', populate: { path: 'user', select: 'name avatar' } });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.views += 1; // Increment view count
    await post.save();

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new forum post
router.post('/', auth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('category').isIn(['General', 'Rent Negotiation', 'Moving Tips', 'Roommate Advice', 'Property Management']).withMessage('Invalid category'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newPost = new ForumPost({
      user: req.user.id,
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
    });

    const post = await newPost.save();
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a comment to a forum post
router.post('/:id/comments', auth, [
  body('content').notEmpty().withMessage('Comment content is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = new ForumComment({
      post: req.params.id,
      user: req.user.id,
      content: req.body.content,
    });

    const comment = await newComment.save();
    post.comments.push(comment._id);
    await post.save();

    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;