// controllers/paymentController.js
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res) => {
    const { product, buyerEmail, bidAmount, bidId } = req.body;
  
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: buyerEmail,
        line_items: [
          {
            price_data: {
              currency: 'usd', // Use supported currency like 'usd'
              product_data: {
                name: product.name,
                description: product.description,
              },
              unit_amount: Math.round(bidAmount * 100), // in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:5173/payment-cancelled`,
        metadata: {
          bidId: bidId,
        },
      });
  
      res.status(200).json({ url: session.url });
    } catch (error) {
      console.error("Stripe session error:", error.message);
      res.status(500).json({ error: error.message });
    }
  };
