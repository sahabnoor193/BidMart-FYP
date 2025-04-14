// routes/seller.js
const express = require("express");
const router = express.Router();
// const auth = require("../middleware/authMiddleware");
const { protect } = require("../middleware/authMiddleware"); // Destructure protect
const { getSellerDashboard, getSellerProducts } = require("../controllers/sellerController");

// @route   GET /api/seller/dashboard
// @desc    Get seller dashboard statistics
// @access  Private
router.get("/dashboard", protect, getSellerDashboard);
router.get('/products', protect, getSellerProducts);
module.exports = router;
