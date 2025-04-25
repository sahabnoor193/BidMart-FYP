const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { body, validationResult } = require('express-validator');
const {
  createBid,
  getProductBids,
  updateBidStatus,
} = require("../controllers/bidController");

// Validation middleware
const validateBid = [
  body('productId').isMongoId().withMessage('Invalid product ID'),
  body('amount').isFloat({ min: 0 }).withMessage('Bid amount must be a positive number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Create a new bid
router.post("/", protect, validateBid, createBid);

// Get all bids for a product
router.get("/product/:productId", protect, getProductBids);

// Update bid status
router.put("/:bidId/status", protect, updateBidStatus);

module.exports = router;
