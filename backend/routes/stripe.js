const express = require('express');
const router = express.Router();
const stripe = require('../config/stripe'); // Your Stripe initialized instance
const User = require('../models/User');     // Mongoose User model

// Utility: Fetch seller's Stripe account ID from DB
const getStripeAccountIdFromDB = async (userId) => {
  const user = await User.findById(userId);
  return user?.stripeAccountId || null;
};

// Utility: Save seller's Stripe account ID to DB
const saveStripeAccountIdToDB = async (userId, stripeAccountId) => {
  await User.findByIdAndUpdate(userId, { stripeAccountId });
};

router.post('/onboard-seller', async (req, res) => {
  const { userId, email } = req.body;

  try {
    let stripeAccountId = await getStripeAccountIdFromDB(userId);

    if (!stripeAccountId) {
      // Create new Express account
      const account = await stripe.accounts.create({
        type: 'express',
        email,
        capabilities: {
          transfers: { requested: true },
        },
      });

      stripeAccountId = account.id;
      await saveStripeAccountIdToDB(userId, stripeAccountId);
    }

    // Retrieve account to check onboarding status
    const account = await stripe.accounts.retrieve(stripeAccountId);

    if (account.charges_enabled && account.details_submitted) {
      // Onboarding complete – return login link
      const loginLink = await stripe.accounts.createLoginLink(stripeAccountId);
      return res.json({ url: loginLink.url, status: 'onboarded' });
    } else {
      // Onboarding NOT complete – return onboarding link
      const accountLink = await stripe.accountLinks.create({
        account: stripeAccountId,
        refresh_url: 'http://localhost:5173/stripe/refresh',
        return_url: 'http://localhost:5173/seller-dashboard',
        type: 'account_onboarding',
      });
      return res.json({ url: accountLink.url, status: 'onboarding' });
    }

  } catch (err) {
    console.error('Stripe onboarding error:', err.message);
    res.status(500).json({ error: 'Stripe onboarding failed', details: err.message });
  }
});

// STEP 2: Get login link (AFTER onboarding)
router.post('/get-stripe-login-link', async (req, res) => {
  const { userId } = req.body;

  try {
    const stripeAccountId = await getStripeAccountIdFromDB(userId);
    if (!stripeAccountId) {
      return res.status(400).json({ error: 'No Stripe account linked' });
    }

    // Check onboarding status (optional)
    const account = await stripe.accounts.retrieve(stripeAccountId);
    if (!account.details_submitted) {
      return res.status(400).json({ error: 'Stripe onboarding not complete' });
    }

    // Create login link
    const loginLink = await stripe.accounts.createLoginLink(stripeAccountId);
    res.json({ url: loginLink.url });
  } catch (err) {
    console.error('Login link error:', err.message);
    res.status(400).json({ error: 'Login link failed', details: err.message });
  }
});

// Optional: Check if Stripe account exists
router.post('/checkStripeAccount', async (req, res) => {
  const { userId } = req.body;

  try {
    const stripeAccountId = await getStripeAccountIdFromDB(userId);
    res.json({ stripeAccountId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch account ID' });
  }
});

module.exports = router;
