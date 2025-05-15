const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User'); // Assuming seller's Stripe ID is stored here

exports.createCheckoutSession = async (req, res) => {
  const { product, buyerEmail, bidAmount, bidId, sellerId } = req.body;

  try {
    // Fetch seller’s connected Stripe account ID
    const seller = await User.findById(sellerId);
    const sellerStripeAccountId = seller?.stripeAccountId;

    if (!sellerStripeAccountId) {
      return res.status(400).json({ error: 'Seller has no Stripe account linked' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: buyerEmail,
      line_items: [
        {
          price_data: {
            currency: 'pkr',
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: Math.round(bidAmount * 100), // e.g. $10.00 = 1000
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/payment-cancelled`,
      metadata: {
        bidId,
        sellerId,
      },
      payment_intent_data: {
        application_fee_amount: 100, // platform fee in cents (optional)
        transfer_data: {
          destination: sellerStripeAccountId, // send money to seller
        },
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe session error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
