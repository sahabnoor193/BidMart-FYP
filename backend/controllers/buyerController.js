const User = require("../models/User");
const Product = require("../models/productModel");
const Bid = require("../models/Bid");
const Review = require("../models/Review");

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
        select: 'name user',
        populate: {
          path: 'user',
          select: 'name email'
        }
      })
      .populate({
        path: 'paymentId',
        select: 'amount createdAt'
      });

    // Filter out bids for deleted products (where productId is null)
    const activeProductBids = bids.filter(bid => bid.productId);

    // Get review information for bids with Payment Success status
    const bidHistory = await Promise.all(activeProductBids.map(async (bid) => {
      let reviewInfo = null;
      
      // Check if user has already reviewed this seller for this product
      if (bid.status === 'Payment Success' && bid.productId?.user) {
        const existingReview = await Review.findOne({
          reviewer: req.user.id,
          seller: bid.productId.user._id,
          product: bid.productId._id
        });
        
        reviewInfo = {
          canReview: !existingReview,
          hasReviewed: !!existingReview,
          reviewId: existingReview?._id
        };
      }

      return {
        itemName: bid.productId.name,
        bidAmount: bid.paymentId?.amount || bid.amount,
        paymentDate: bid.paymentId?.createdAt,
        bidStatus: bid.status,
        checkoutUrl: bid.checkoutUrl,
        sellerName: bid.productId.user?.name || 'Unknown Seller',
        sellerEmail: bid.productId.user?.email,
        sellerId: bid.productId.user?._id,
        productId: bid.productId._id,
        bidId: bid._id,
        reviewInfo
      };
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

