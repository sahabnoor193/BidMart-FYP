// const express = require("express");
// const passport = require("passport");
// const { register, login, googleLogin, facebookLogin, verifyOTP, resendOTP, logout, loginStatus, googleRegister } = require("../controllers/authController");

// const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);

// // Google OAuth
// router.get("/session-data", (req, res) => {
//   res.json(req.session.tempUser || {});
// });
// router.post("/register-google", googleRegister);

// // Facebook OAuth
// router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
// router.get("/facebook/callback", passport.authenticate("facebook", { session: false }), facebookLogin);

//   // Email verification
// router.post('/verify-otp', verifyOTP);    // OTP verification
// router.post("/resend-otp", resendOTP); // Resend OTP if not received

// module.exports = router;
const express = require("express");
const passport = require("passport");
const { register, login, googleLogin, facebookLogin, verifyOTP, resendOTP, logout, loginStatus, googleRegister } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Google OAuth
router.get("/session-data", (req, res) => {
  res.json(req.session.tempUser || {});
});
router.post("/register-google", googleRegister);

// Facebook OAuth
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get("/facebook/callback", passport.authenticate("facebook", { session: false }), facebookLogin);

  // Email verification
router.post('/verify-otp', verifyOTP);    // OTP verification
router.post("/resend-otp", resendOTP); // Resend OTP if not received

module.exports = router;
