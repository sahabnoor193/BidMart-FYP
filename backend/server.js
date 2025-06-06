require("dotenv").config();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); 
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require('path');
const authRoutes = require("./routes/authRoutes");
const app = express();
const connectDB = require("../backend/config/db");
const session = require('express-session');
const passport = require('passport');
const { errorHandler } = require("./middleware/errorMiddleware");
const sellerRoutes = require("./routes/seller");
const buyerRoutes = require("./routes/buyer");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/productRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const alertRoutes = require("./routes/alertRoutes");
const contactRoutes = require("./routes/contactRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const bidRoutes = require("./routes/bid");
const stripeRoute = require("./routes/stripe");
const paymentRoutes = require('./routes/paymentRoutes');
const mongoose = require('mongoose');
const configureSocket = require('./config/socket');
const conversationRoutes = require("./routes/conversationRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const adminRoutes = require("./routes/adminRoutes");
const Bid = require("./models/Bid");
const productModel = require("./models/productModel");
const User = require("./models/User");
const { sendBidRejectEmail, sendPaymentSuccessEmail } = require("./services/emailService");
const { createAlertAndEmit } = require("./controllers/alertController");
const Payment = require("./models/Payment");

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());


// Webhook endpoint
// app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
//   const sig = req.headers['stripe-signature'];
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
//   } catch (err) {
//     console.error("Webhook Error:", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   const session = event.data.object;
//   const bidId = session.metadata?.bidId;

//   if (!bidId) {
//     return res.status(400).send("Missing bidId in metadata.");
//   }

//   try {
//     if (event.type === 'checkout.session.completed') {
//       let bid = await Bid.findById(bidId);
//       const productId = bid.productId;
//       const product = await productModel.findById(productId);
//       const buyerId = bid.bidderId;
//       const buyer = await User.findById(buyerId);
//       const seller = await User.findById(product.user);
//        const payment = await Payment.create({
//     bidId: bid._id,
//     amount: bid.amount,
//     status: 'completed' 
//   });

//         bid.status = 'Payment Success';
//   bid.paymentId = payment._id;
//   await bid.save();

//       if (!bid) return res.status(404).send("Bid not found.");

//       if (bid.productId) {
//         await productModel.findByIdAndUpdate(bid.productId, { status: 'ended' });
//       }
//       if (bid.bidderId) {
//         await User.findByIdAndUpdate(bid.bidderId, { $inc: { acceptedBids: 1 } });
//       }
//       if (buyer?._id) {
//         await User.findByIdAndUpdate(buyer._id, { $inc: { acceptedBids: 1 } });
//       }

//       // Send emails
//       if (buyer?.email) {
//         await sendPaymentSuccessEmail(buyer.email, product.name, 'buyer', buyer.name);
//       }
//       if (seller?.email) {
//         await sendPaymentSuccessEmail(seller.email, product.name, 'seller', seller.name);
//       }

//       if (buyer?._id) {
//         await createAlertAndEmit({
//           user: buyer._id,
//           userType: 'buyer',
//           product: product._id,
//           productName: product.name,
//           action: 'payment_success'
//         }, io);
//       }

//       if (seller?._id) {
//         await createAlertAndEmit({
//           user: seller._id,
//           userType: 'seller',
//           product: product._id,
//           productName: product.name,
//           action: 'product_sold'
//         }, io);
//       }
//       console.log(`✅ Bid ${bidId} paid. Product ended. Buyer updated.`);
//     } 
//     else if (event.type === 'checkout.session.expired') {
//       const bid = await Bid.findByIdAndUpdate(
//         bidId,
//         { status: 'rejected' },
//         { new: true }
//       );

//       if (!bid) return res.status(404).send("Bid not found.");

//       if (bid.productId) {
//         await productModel.findByIdAndUpdate(bid.productId, { status: 'active' });
//         const product = await productModel.findById(bid.productId).populate('user');
//         const seller = product?.user;

//         if (seller?.email) {
//           await sendBidRejectEmail(seller.email, product.name, seller.name);
//         }
//         if (seller?._id) {
//           await createAlertAndEmit({
//             user: seller._id,
//             userType: 'seller',
//             product: product._id,
//             productName: product.name,
//             action: 'payment_failed'
//           }, io);
//         }
//       }

//       console.log(`⛔ Bid ${bidId} expired. Product set to active.`);
//     }

//     res.status(200).json({ received: true });

//   } catch (error) {
//     console.error("Webhook processing error:", error);
//     res.status(500).send("Server error.");
//   }
// });

app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const session = event.data.object;
  const bidId = session.metadata?.bidId;
  console.log(bidId,"bidId");
  
  if (!bidId) {
    return res.status(400).send("Missing bidId in metadata.");
  }

  try {
    if (event.type === 'checkout.session.completed') {
      let bid = await Bid.findById(bidId);
      const productId = bid.productId;
      const product = await productModel.findById(productId);
      const buyerId = bid.bidderId;
      const buyer = await User.findById(buyerId);
      const seller = await User.findById(product.user);
       const payment = await Payment.create({
    bidId: bid._id,
    amount: bid.amount,
    status: 'completed' 
  });
  console.log(payment,"payment");
  console.log(bid,"bid");
  
  
        bid.status = 'Payment Success';
  bid.paymentId = payment._id;
  await bid.save();

      if (!bid) return res.status(404).send("Bid not found.");

      if (bid.productId) {
        await productModel.findByIdAndUpdate(bid.productId, { status: 'ended' });
      }
      if (bid.bidderId) {
        await User.findByIdAndUpdate(bid.bidderId, { $inc: { acceptedBids: 1 } });
      }
      if (buyer?._id) {
        await User.findByIdAndUpdate(buyer._id, { $inc: { acceptedBids: 1 } });
      }

      // Send emails
      if (buyer?.email) {
        await sendPaymentSuccessEmail(buyer.email, product.name, 'buyer', buyer.name);
      }
      if (seller?.email) {
        await sendPaymentSuccessEmail(seller.email, product.name, 'seller', seller.name);
      }

      if (buyer?._id) {
        await createAlertAndEmit({
          user: buyer._id,
          userType: 'buyer',
          product: product._id,
          productName: product.name,
          action: 'payment_success'
        }, io);
      }

      if (seller?._id) {
        await createAlertAndEmit({
          user: seller._id,
          userType: 'seller',
          product: product._id,
          productName: product.name,
          action: 'product_sold'
        }, io);
      }
      console.log(`✅ Bid ${bidId} paid. Product ended. Buyer updated.`);
    } 
    else if (event.type === 'checkout.session.expired') {
      const bid = await Bid.findByIdAndUpdate(
        bidId,
        { status: 'rejected' },
        { new: true }
      );

      if (!bid) return res.status(404).send("Bid not found.");

      if (bid.productId) {
        await productModel.findByIdAndUpdate(bid.productId, { status: 'active' });
        const product = await productModel.findById(bid.productId).populate('user');
        const seller = product?.user;

        if (seller?.email) {
          await sendBidRejectEmail(seller.email, product.name, seller.name);
        }
        if (seller?._id) {
          await createAlertAndEmit({
            user: seller._id,
            userType: 'seller',
            product: product._id,
            productName: product.name,
            action: 'payment_failed'
          }, io);
        }
      }

      console.log(`⛔ Bid ${bidId} expired. Product set to active.`);
    }

    res.status(200).json({ received: true });

  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).send("Server error.");
  }
});


// Middleware
app.use(express.json());

// Allow both frontend ports
const corsOptions = {
  origin: ['http://localhost:5000', 'http://localhost:5173','http://localhost:5174','http://192.168.5.91:5173'], // Add your frontend URL
  credentials: true,  // Allows cookies & authentication headers
};

app.use(cors(corsOptions));
app.use(cookieParser());

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/user", userRoutes);
app.use("/api/buyer", buyerRoutes);
app.use("/api/stripe", stripeRoute);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
// Create HTTP server
const server = require('http').createServer(app);

// Configure Socket.IO
const io = configureSocket(server);

// Make io accessible to routes
app.set('io', io);

// Error handling middleware (must be after routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
