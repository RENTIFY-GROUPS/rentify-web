const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { auth } = require('../middleware/auth');

// Create a new transaction
router.post('/', auth, async (req, res) => {
  try {
    const { property, buyer, seller, amount } = req.body;

    const newTransaction = new Transaction({ property, buyer, seller, amount });
    await newTransaction.save();

    res.status(201).json(newTransaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get transactions for a user
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ buyer: req.params.userId }, { seller: req.params.userId }]
    }).populate('property');
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update transaction status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    if (status) transaction.status = status;
    if (paymentStatus) transaction.paymentStatus = paymentStatus;
    await transaction.save();
    res.json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
