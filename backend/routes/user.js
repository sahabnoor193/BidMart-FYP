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

// router.put("/switch-account", auth, switchAccount);

// Backend route for switching accounts
router.put('/switch-account', auth, switchAccount, async (req, res) => {
    try {
      const currentUser = req.user;
      const oppositeType = currentUser.type === 'buyer' ? 'seller' : 'buyer';
  
      // Check if opposite account exists
      const oppositeAccount = await User.findOne({ 
        email: currentUser.email, 
        type: oppositeType 
      });
  
      if (oppositeAccount) {
        // Generate new token for opposite account
        const token = generateToken(oppositeAccount);
        return res.json({
          exists: true,
          token,
          userType: oppositeAccount.type
        });
      }
  
      return res.json({ exists: false });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error during account switch' });
    }
  });


module.exports = router;