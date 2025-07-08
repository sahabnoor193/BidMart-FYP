const User = require("../models/User");
const Product = require("../models/productModel");
const Bid = require("../models/Bid");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');
exports.getSellerDashboard = async (req, res) => {
  try {
    // Ensure the user is a seller
    if (req.user.type !== "seller") {
      return res.status(403).json({ message: "Access denied. Not a seller account." });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Get all products by this seller
    const products = await Product.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select('name startingPrice currentPrice status startDate endDate createdAt images category');
    const productIds = products.map(p => p._id);

    const soldedBids = await Bid.find({
      productId: { $in: productIds },
      status: 'Payment Success'
    }).select('productId amount');
    // console.log("Solded bids:", soldedBids);
    const soldPriceMap = new Map(
      soldedBids.map(bid => [bid.productId.toString(), bid.amount])
    );
    const soldedProductIds = new Set(soldedBids.map(bid => bid.productId.toString()));
    const highestBids = await Bid.aggregate([
      { $match: { productId: { $in: productIds } } },
      {
        $group: {
          _id: '$productId',
          maxBidAmount: { $max: '$amount' }
        }
      }
    ]);

    // Map productId to max bid amount
    const highestBidMap = new Map(
      highestBids.map(b => [b._id.toString(), b.maxBidAmount])
    );
    // Format products for bid history
    const bidHistory = products.map(product => {
      const productIdStr = product._id.toString();
      const highestBidAmount = highestBidMap.get(productIdStr);
      const soldAmount = soldPriceMap.get(productIdStr);
      return {
        item: product.name,
        productId: product._id,
        startPrice: product.startingPrice,
        currentPrice: highestBidAmount || product.currentPrice || product.startingPrice,
        bidTime: product.createdAt,
        status: product.status,
        soldPrice: soldAmount || null,
        startDate: product.startDate,
        endDate: product.endDate,
        sold: product.status === 'sold' || soldedProductIds.has(productIdStr),
        category: product.category,
        image: product.images[0]
      };
    });

    // Count active and ended bids
    const activeBids = products.filter(p => p.status === 'active').length;
    const endedBids = products.filter(p => p.status === 'ended').length;

    res.json({
      activeBids,
      stripeLoginLink: user.stripeLoginLink || null,
      endedBids,
      favourites: user.favourites,
      bidHistory,
      notifications: [] // Placeholder for notifications
    });
  } catch (error) {
    console.error("Error fetching seller dashboard:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all products for logged-in seller
// @route   GET /api/seller/products
// @access  Private
exports.getSellerProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id })
      .sort('-createdAt')
      .select('name startingPrice currentPrice status startDate endDate isDraft images');

    const productIds = products.map(p => p._id);

    // Get highest bid amount for each product
    const highestBids = await Bid.aggregate([
      { $match: { productId: { $in: productIds.map(id => new mongoose.Types.ObjectId(id)) } } },
      {
        $group: {
          _id: '$productId',
          maxBidAmount: { $max: '$amount' }
        }
      }
    ]);

    // Create a lookup map: productId -> maxBidAmount
    const highestBidMap = new Map(
      highestBids.map(b => [b._id.toString(), b.maxBidAmount])
    );

    // Attach computed currentPrice to each product (without modifying DB)
    const enrichedProducts = products.map(product => {
      const maxBid = highestBidMap.get(product._id.toString());
      return {
        _id: product._id,
        name: product.name,
        startingPrice: product.startingPrice,
        currentPrice: maxBid || product.startingPrice,
        status: product.status,
        startDate: product.startDate,
        endDate: product.endDate,
        isDraft: product.isDraft,
        images: product.images,
      };
    });

    res.json(enrichedProducts);
  } catch (error) {
    console.error('Error fetching seller products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});