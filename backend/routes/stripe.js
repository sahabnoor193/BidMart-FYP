const express = require('express');
const router = express.Router();
const stripe = require('../config/stripe'); // Initialized Stripe instance
const User = require('../models/User'); // Mongoose User model

// Utility: Fetch seller's Stripe account ID from DB
const getStripeAccountIdFromDB = async (userId) => {
  const user = await User.findById(userId);
  return user?.stripeAccountId || null;
};

// Utility: Save seller's Stripe account ID to DB
const saveStripeAccountIdToDB = async (userId, stripeAccountId) => {
  await User.findByIdAndUpdate(userId, { stripeAccountId });
};

// POST /api/stripe/onboard-seller
router.post('/onboard-seller', async (req, res) => {
  const { userId, email } = req.body;

  try {
    // Check if the seller already has a Stripe account
    let stripeAccountId = await getStripeAccountIdFromDB(userId);
    console.log('stripeAccountId', stripeAccountId);
const account = await stripe.accounts.retrieve(stripeAccountId);
console.log("Transfers Capability:", account.capabilities?.transfers); // Should be 'active'

    if (!stripeAccountId) {
      // Create a new Express connected account with the transfers capability
      const account = await stripe.accounts.create({
        type: 'express',
        email,
        capabilities: {
          transfers: { requested: true }, // 👈 This is required to allow payouts
        },
      });

      // Save the account ID in your DB
      await saveStripeAccountIdToDB(userId, account.id);
      stripeAccountId = account.id;
    }

    // Generate onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: 'http://localhost:5173/stripe/refresh',
      return_url: 'http://localhost:5173/seller-dashboard',
      type: 'account_onboarding',
    });

    res.json({ url: accountLink.url });
  } catch (err) {
    console.error('Stripe onboarding error:', err.message);
    res.status(500).json({ error: 'Stripe onboarding failed', details: err.message });
  }
});

router.post('/checkStripeAccount', async (req, res) => {
  const { userId } = req.body;
  const stripeAccountId = await getStripeAccountIdFromDB(userId);
  res.json({ stripeAccountId });
});

module.exports = router;
