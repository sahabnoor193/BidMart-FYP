const User = require("../models/User");
const Bid = require("../models/Bid");
const Product = require("../models/Products");

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

    // Get products by this seller
    const products = await Product.find({ sellerId: req.user.id });
    const productIds = products.map(product => product._id);

    // Get bid history for the seller's products
    let bidHistory = [];
    if (productIds.length > 0) {
      const bids = await Bid.find({ productId: { $in: productIds } })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('productId', 'name startingPrice currentPrice')
        .populate('bidderId', 'name');

      bidHistory = bids.map(bid => ({
        item: bid.productId.name,
        startPrice: bid.productId.startingPrice,
        currentPrice: bid.amount,
        bidTime: bid.createdAt,
        bidderName: bid.bidderId.name,
        sold: bid.status === 'accepted'
      }));
    }

    res.json({
      activeBids: user.activeBids,
      endedBids: user.endedBids,
      favourites: user.favourites,
      bidHistory,
      notifications: [] // Placeholder for notifications
    });
  } catch (error) {
    console.error("Error fetching seller dashboard:", error);
    res.status(500).json({ message: "Server error" });
  }
};