const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { auth } = require('../middleware/auth');
const Payment = require('../models/Payment');
const router = express.Router();

// Create a payment intent
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { amount, propertyId, landlordId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount in cents
      currency: 'usd',
    });

    const payment = new Payment({
      tenant: req.user.id,
      landlord: landlordId,
      property: propertyId,
      amount,
      stripePaymentId: paymentIntent.id,
      status: 'pending'
    });
    await payment.save();

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    await Payment.findOneAndUpdate(
      { stripePaymentId: paymentIntent.id },
      { status: 'succeeded' }
    );
  } else if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    await Payment.findOneAndUpdate(
      { stripePaymentId: paymentIntent.id },
      { status: 'failed' }
    );
  }

  res.json({ received: true });
});

module.exports = router;