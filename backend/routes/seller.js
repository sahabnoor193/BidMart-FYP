// routes/seller.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getSellerDashboard } = require("../controllers/sellerController");

// @route   GET /api/seller/dashboard
// @desc    Get seller dashboard statistics
// @access  Private
router.get("/dashboard", auth, getSellerDashboard);

module.exports = router;
