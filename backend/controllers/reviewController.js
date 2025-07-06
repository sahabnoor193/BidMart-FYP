const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Bid = require('../models/Bid');
const User = require('../models/User');
const Product = require('../models/productModel');

// @desc    Check if buyer is eligible to review a seller for a specific product
// @route   GET /api/reviews/eligibility/:sellerId?productId=xxx
// @access  Private
const checkReviewEligibility = asyncHandler(async (req, res) => {
  const { sellerId } = req.params;
  const { productId } = req.query;
  const buyerId = req.user._id;

  if (!sellerId || !productId) {
    res.status(400);
    throw new Error('Seller ID and Product ID are required');
  }

  // Check if seller exists
  const seller = await User.findById(sellerId);
  if (!seller || seller.type !== 'seller') {
    res.status(404);
    throw new Error('Seller not found');
  }

  // Prevent self-review
  if (buyerId.toString() === sellerId) {
    res.status(400);
    throw new Error('You cannot review yourself');
  }

  // Check if the buyer has a successful bid for this product from this seller
  const bid = await Bid.findOne({
    bidderId: buyerId,
    status: 'Payment Success',
    productId: productId
  }).populate('productId', 'name images user');

  if (!bid || !bid.productId || bid.productId.user.toString() !== sellerId) {
    return res.json({ eligible: false });
  }

  // Check if review already exists for this buyer, seller, and product
  const existingReview = await Review.findOne({
    reviewer: buyerId,
    seller: sellerId,
    product: productId
  });

  if (existingReview) {
    return res.json({ eligible: false });
  }

  res.json({
    eligible: true,
    productName: bid.productId.name,
    productImage: bid.productId.images?.[0] || null
  });
});

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { sellerId, rating, comment, productId } = req.body;
  const reviewerId = req.user._id;

  // Validate required fields
  if (!sellerId || !rating || !comment) {
    res.status(400);
    throw new Error('Seller ID, rating, and comment are required');
  }

  // Validate rating
  if (rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5');
  }

  // Validate comment length
  if (comment.length < 10) {
    res.status(400);
    throw new Error('Comment must be at least 10 characters long');
  }

  // Check if seller exists
  const seller = await User.findById(sellerId);
  if (!seller || seller.type !== 'seller') {
    res.status(404);
    throw new Error('Seller not found');
  }

  // Prevent self-review
  if (reviewerId.toString() === sellerId) {
    res.status(400);
    throw new Error('You cannot review yourself');
  }

  // Verify that the buyer has successfully purchased from this seller
  const successfulBid = await Bid.findOne({
    bidderId: reviewerId,
    status: 'Payment Success',
    productId: productId
  }).populate('productId', 'user');

  if (!successfulBid || successfulBid.productId.user.toString() !== sellerId) {
    res.status(400);
    throw new Error('You can only review sellers you have purchased from');
  }

  // Check if review already exists for this buyer-seller-product combination
  const existingReview = await Review.findOne({
    reviewer: reviewerId,
    seller: sellerId,
    product: productId
  });

  if (existingReview) {
    res.status(400);
    throw new Error('You have already reviewed this seller for this product');
  }

  // Create the review
  const review = await Review.create({
    reviewer: reviewerId,
    seller: sellerId,
    product: productId,
    rating,
    comment,
    isApproved: true // Auto-approve reviews for now
  });

  // Populate the review with user details
  const populatedReview = await Review.findById(review._id)
    .populate('reviewer', 'name')
    .populate('seller', 'name')
    .populate('product', 'name');

  res.status(201).json(populatedReview);
});

// @desc    Get reviews for a seller
// @route   GET /api/reviews/seller/:sellerId
// @access  Public
const getSellerReviews = asyncHandler(async (req, res) => {
  const { sellerId } = req.params;

  const reviews = await Review.find({ 
    seller: sellerId, 
    isApproved: true 
  })
  .populate('reviewer', 'name')
  .populate('product', 'name')
  .sort({ createdAt: -1 });

  // Calculate average rating
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  res.json({
    reviews,
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews: reviews.length
  });
});

// @desc    Get buyer's reviews
// @route   GET /api/reviews/my-reviews
// @access  Private
const getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ reviewer: req.user._id })
    .populate('seller', 'name')
    .populate('product', 'name')
    .sort({ createdAt: -1 });

  res.json(reviews);
});

module.exports = {
  checkReviewEligibility,
  createReview,
  getSellerReviews,
  getMyReviews
}; 