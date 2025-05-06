const User = require("../models/User");
const Product = require("../models/productModel");
const Bid = require("../models/Bid");
const asyncHandler = require("express-async-handler");

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

    // Format products for bid history
    const bidHistory = products.map(product => ({
      item: product.name,
      productId: product._id,
      startPrice: product.startingPrice,
      currentPrice: product.currentPrice || product.startingPrice,
      bidTime: product.createdAt,
      status: product.status,
      startDate: product.startDate,
      endDate: product.endDate,
      sold: product.status === 'sold',
      category: product.category,
      image: product.images[0] // Get the first image if available
    }));

    // Count active and ended bids
    const activeBids = products.filter(p => p.status === 'active').length;
    const endedBids = products.filter(p => p.status === 'ended').length;

    res.json({
      activeBids,
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
      .select('name startingPrice currentPrice status startDate endDate isDraft images ');

    res.json(products);
  } catch (error) {
    console.error('Error fetching seller products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});