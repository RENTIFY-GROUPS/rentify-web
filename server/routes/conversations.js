const express = require('express');
const auth = require('../middleware/auth');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const router = express.Router();

// New conversation
router.post('/', auth, async (req, res) => {
  try {
    const { recipientId } = req.body;
    const conversation = new Conversation({
      participants: [req.user.id, recipientId]
    });
    await conversation.save();
    res.status(201).json(conversation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get conversations for a user
router.get('/', auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user.id }).populate('participants', 'name avatar');
    res.json(conversations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages for a conversation
router.get('/:conversationId/messages', auth, async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId }).populate('sender', 'name avatar');
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;