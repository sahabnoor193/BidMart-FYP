const User = require("../models/User");
const Product = require("../models/Product");
const Bid = require("../models/Bid");

exports.getBuyerDashboard = async (req, res) => {
    try {
      if (req.user.type !== "buyer") {
        return res.status(403).json({ message: "Access denied. Not a buyer account." });
      }
  
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const bids = await Bid.find({ bidderId: req.user.id })
        .sort({ createdAt: -1 })
        .populate({
          path: 'productId',
          select: 'name sellerId',
          populate: {
            path: 'sellerId',
            select: 'name email profilePicture'
          }
        })
        .populate({
          path: 'paymentId',
          select: 'amount createdAt'
        });
  
      const bidHistory = bids.map(bid => ({
        itemName: bid.productId?.name || 'Deleted Item',
        bidAmount: bid.paymentId?.amount || bid.amount,
        paymentDate: bid.paymentId?.createdAt,
        sellerName: bid.productId?.sellerId?.name || 'Unknown Seller',
        sellerEmail: bid.productId?.sellerId?.email,
        // sellerAvatar: bid.productId?.sellerId?.profilePicture
      }));
  
      res.json({
        requestedBids: user.requestBids,
        acceptedBids: user.acceptedBids,
        favourites: user.favourites,
        bidHistory,
        notifications: []
      });
      
    } catch (error) {
      console.error("Error fetching buyer dashboard:", error);
      res.status(500).json({ message: "Server error" });
    }
  };