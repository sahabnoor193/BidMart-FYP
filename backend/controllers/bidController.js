const Bid = require("../models/Bid");
const Product = require("../models/productModel");
const User = require("../models/User");
const Alert = require("../models/alertModel");
const asyncHandler = require("express-async-handler");
const { validationResult } = require('express-validator');
const { createAlertAndEmit } = require("./alertController");
const { sendCheckoutLinkEmail, sendBidRejectEmail, sendBidRejectEmailForBuyer } = require("../services/emailService");
const axios = require('axios');
const Payment = require("../models/Payment");

// @desc    Create a new bid
// @route   POST /api/bids
// @access  Private (Buyer only)

// Changes BY Muneeb
exports.createBid = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const io = req.app.get('io');

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, amount } = req.body;
    const buyerId = req.user._id;

    if (req.user.type !== "buyer") {
      return res.status(403).json({ message: "Only buyers can place bids" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.status !== "active") {
      return res.status(400).json({ message: "Cannot bid on inactive product" });
    }

    const existingBid = await Bid.findOne({
      productId,
      bidderId: buyerId,
      status: { $in: ["pending", "accepted"] }
    });

    if (existingBid) {
      return res.status(400).json({ message: "You have already placed a bid on this product" });
    }

    if (amount <= product.currentPrice || amount <= product.startingPrice) {
      return res.status(400).json({ message: "Bid amount must be higher than current price" });
    }

    const bid = await Bid.create({
      productId,
      bidderId: buyerId,
      amount,
      status: "pending"
    });

    product.currentPrice = amount;
    product.highestBidder = buyerId;
    await product.save();

    await User.findByIdAndUpdate(buyerId, { $inc: { requestedBids: 1 } });

    const buyer = await User.findById(buyerId).select('name email');

    // 🔔 Alerts using central helper
    await createAlertAndEmit({
      user: product.user,
      userType: "seller",
      product: product._id,
      productName: product.name,
      action: "new-bid"
    }, io);

    await createAlertAndEmit({
      user: userId,
      userType: "buyer",
      product: product._id,
      productName: product.name,
      action: "bid-placed"
    }, io);

    // 🔄 Product page room update
    io.to(`product_${productId}`).emit("newBid", {
      productId,
      bid: {
        amount,
        bidder: {
          name: buyer.name,
          email: buyer.email
        },
        timestamp: bid.createdAt
      }
    });

    // Optional: Direct bidNotification for seller
    io.to(`user_${product.user.toString()}`).emit("bidNotification", {
      productId,
      productName: product.name,
      amount: bid.amount,
      bidder: {
        name: buyer.name,
        email: buyer.email
      },
      timestamp: bid.createdAt
    });

    res.status(201).json({
      message: "Bid placed successfully",
      latestBid: {
        amount: bid.amount,
        bidder: buyer.name,
        timestamp: bid.createdAt
      }
    });

  } catch (error) {
    console.error("Error creating bid:", error);
    res.status(500).json({ message: "Server error" });
  }
});


exports.getBidsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const bids = await Bid.find({ 
        bidderId: userId, 
        status: "pending" 
      })
      .populate("productId")
      .populate("paymentId");

    res.status(200).json(bids);
  } catch (error) {
    console.error("Error fetching pending bids by user ID:", error);
    res.status(500).json({ error: "Failed to fetch pending bids for the user." });
  }
};

// @desc    Get all bids for a product
// @route   GET /api/bids/product/:productId
// @access  Private
exports.getProductBids = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Get all bids for the product
    const bids = await Bid.find({ productId })
      .populate("bidderId", "name email")
      .sort("-createdAt");

    res.json(bids);
  } catch (error) {
    console.error("Error fetching bids:", error);
    res.status(500).json({ message: "Server error" });
  }
});
exports.acceptBid = asyncHandler(async (req, res) => {
  const { bidId, productId, bidderEmail } = req.body;
  const io = req.app.get('io');

  // 1. Fetch bid details
  const bid = await Bid.findById(bidId);
  const product = await Product.findById(productId);
  if (!bid || !product) {
    res.status(404);
    throw new Error('Bid or product not found');
  }

  bid.status = 'payment pending';
  product.status = 'pending';

  let checkoutUrl;

  try {
    // 2. Create checkout session
    const response = await axios.post('http://localhost:5000/api/payments/create-checkout-session', {
      product: {
        name: product.name,
        description: product.description,
      },
      buyerEmail: bidderEmail,
      bidAmount: bid.amount,
      bidId: bidId,
      sellerId: product.user
    });

    checkoutUrl = response.data.url;
  } catch (err) {
    const stripeError = err?.response?.data?.error || 'Checkout session creation failed';
    res.status(500);
    throw new Error(`Stripe Error: ${stripeError}`);
  }

  await createAlertAndEmit({
    user: bid.bidderId,
    userType: "buyer",
    product: product._id,
    productName: product.name,
    action: "bid-accepted"
  }, io);

  bid.checkoutUrl = checkoutUrl;
  await Promise.all([bid.save(), product.save()]);

  // 3. Send email to buyer
  await sendCheckoutLinkEmail(bidderEmail, product.name, checkoutUrl);

  res.json({ message: 'Checkout link sent to buyer.' });
});

// @desc    Update bid status (accept/reject)
// @route   PUT /api/bids/:bidId/status
// @access  Private (Seller only)
exports.updateBidStatus = asyncHandler(async (req, res) => {
  const { bidId } = req.params;
  const { status } = req.body;

  const bid = await Bid.findById(bidId)
    .populate({
      path: "productId",
      populate: { path: "user" } // populate seller (user) inside product
    })
    .populate("bidderId");

  if (!bid) {
    return res.status(404).json({ message: "Bid not found" });
  }

  const product = bid.productId;
  const buyer = bid.bidderId;
  const seller = product.user;

  if (!seller || !seller.email) {
    return res.status(500).json({ message: "Seller information is missing" });
  }
  product.status = 'active';
  await product.save();
  // Update bid status
  bid.status = status;
  await bid.save();

  const io = req.app.get('io');

  // Emit bid status update to product watchers
  io.to(`product_${product._id}`).emit('bidStatusUpdate', {
    bidId: bid._id,
    status: bid.status
  });

  // Emit bid notification to the seller
  io.to(`user_${seller._id}`).emit("bidNotification", {
    productId: product._id,
    productName: product.name,
    amount: bid.amount,
    bidder: {
      name: buyer.name,
      email: buyer.email
    },
    timestamp: bid.createdAt
  });

  // Emit custom alert to both parties if rejected
  if (status === "rejected") {
    await createAlertAndEmit({
      user: seller._id,
      userType: "seller",
      product: product._id,
      productName: product.name,
      action: "bid-rejected"
    }, io);
    await sendBidRejectEmail(seller.email, product.name, seller.name);

    await createAlertAndEmit({
      user: buyer._id,
      userType: "buyer",
      product: product._id,
      productName: product.name,
      action: "bid-rejected"
    }, io);
    await sendBidRejectEmailForBuyer(buyer.email, product.name, buyer.name);
  }

  res.json(bid);
});

