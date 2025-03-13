const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getUserProfile, updateUserProfile, changeUserPassword , switchAccount} = require("../controllers/userController");

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", auth, getUserProfile);

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, updateUserProfile);

// @route   PUT /api/user/password
// @desc    Change user password
// @access  Private
router.put("/password", auth, changeUserPassword);

router.put("/switch-account", auth, switchAccount);

module.exports = router;