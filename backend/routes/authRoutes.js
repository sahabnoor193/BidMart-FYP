const express = require("express");
const passport = require("passport");
const { register, login, googleLogin, facebookLogin, verifyOTP, resendOTP, logout, loginStatus, googleRegister, checkToken, googleLogins } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login-google", googleLogins);
// Protected routes
router.get("/check-token", protect, checkToken);
router.post("/logout", protect, logout);
router.get("/login-status", protect, loginStatus);

// Google OAuth
router.get("/session-data", (req, res) => {
  res.json(req.session.tempUser || {});
});
router.post("/register-google", googleRegister);

// Facebook OAuth
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get("/facebook/callback", passport.authenticate("facebook", { session: false }), facebookLogin);

module.exports = router;
