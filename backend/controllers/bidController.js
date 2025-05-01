const Bid = require("../models/Bid");
const Product = require("../models/productModel");
const User = require("../models/User");
const Alert = require("../models/alertModel");
const asyncHandler = require("express-async-handler");
const { validationResult } = require('express-validator');
const { createAlertAndEmit } = require("./alertController");

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

// @desc    Update bid status (accept/reject)
// @route   PUT /api/bids/:bidId/status
// @access  Private (Seller only)
exports.updateBidStatus = asyncHandler(async (req, res) => {
  try {
    const { bidId } = req.params;
    const { status } = req.body;

    // Find the bid
    const bid = await Bid.findById(bidId).populate("productId");
    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    // Check if user is the seller
    if (bid.productId.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update bid status
    bid.status = status;
    await bid.save();

    // Update buyer's bid count
    if (status === "accepted") {
      await User.findByIdAndUpdate(bid.bidderId, { $inc: { acceptedBids: 1 } });
    }

    // Emit real-time bid status update
    const io = req.app.get('io');
    io.to(`product_${bid.productId._id}`).emit('bidStatusUpdate', {
      bidId: bid._id,
      status: bid.status
    });

    res.json(bid);
  } catch (error) {
    console.error("Error updating bid status:", error);
    res.status(500).json({ message: "Server error" });
  }
});
