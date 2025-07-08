const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  checkReviewEligibility,
  createReview,
  getSellerReviews,
  getMyReviews
} = require('../controllers/reviewController');

// Check if buyer is eligible to review a seller
router.get('/eligibility/:sellerId', protect, checkReviewEligibility);

// Create a new review
router.post('/', protect, createReview);

// Get reviews for a seller (public)
router.get('/seller/:sellerId', getSellerReviews);

// Get buyer's reviews
router.get('/my-reviews', protect, getMyReviews);

module.exports = router; 