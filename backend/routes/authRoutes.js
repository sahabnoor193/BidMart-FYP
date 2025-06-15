const express = require("express");
const passport = require("passport");
const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Auth Routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/verify-otp", authController.verifyOTP);
router.post("/resend-otp", authController.resendOTP);
router.get("/login-status", protect, authController.loginStatus);
router.get("/check-token", protect, authController.checkToken);
router.post("/logout", protect, authController.logout);

// Password Reset Routes
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-reset-otp", authController.verifyResetOTP);
router.post("/reset-password", authController.resetPassword);

// Google Auth Routes
router.post("/login-google", authController.googleLogins);

// Facebook Auth Routes
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get("/facebook/callback", passport.authenticate("facebook", { session: false }), authController.facebookLogin);

module.exports = router;
