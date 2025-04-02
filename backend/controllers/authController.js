const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const Buyer = require("../models/Buyer");
// const Seller = require("../models/Seller");
const User = require("../models/User");
const crypto = require("crypto");
const Verification = require("../models/Verification");
const { OAuth2Client } = require("google-auth-library");
const { sendOTPEmail } = require("../services/emailService"); // Import email service


exports.register = async (req, res) => {
  try {
    console.log("🔹 Received Registration Request:", req.body);

    const { name, email, password, type } = req.body;

    if (!name || !email || !password || !type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Validate Email Format
    if (!email.endsWith("@gmail.com")) {
      return res.status(400).json({ message: "Only Google emails (@gmail.com) are allowed." });
    }

    // ✅ Check if the user has already registered with the same email and type
    let existingUser = await User.findOne({ email, type });

    if (existingUser) {
      return res.status(400).json({ message: `You have already registered as a ${type}. Please log in.` });
    }

    // ✅ Generate New OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("✅ Generated OTP:", otp);

    // ✅ Check if OTP already exists for this user type
    let verificationEntry = await Verification.findOne({ email, type });

    if (verificationEntry) {
      verificationEntry.otp = otp;
      verificationEntry.createdAt = new Date(); // Reset expiration time
      await verificationEntry.save();
    } else {
      await Verification.create({ email, otp, type });
    }

    // ✅ Send OTP via Email
    console.log("📧 Sending OTP to:", email);
    await sendOTPEmail(email, otp);

    res.status(201).json({ message: `OTP sent for ${type} registration. Please check your email.` });

  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ error: "Server Error: " + error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    console.log("🔹 Login request received:", email);

    // ✅ Find all accounts for this email
    const userAccounts = await User.find({ email });

    if (userAccounts.length === 0) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ Check password against any valid user
    let user = null;
    for (let acc of userAccounts) {
      const isMatch = await bcrypt.compare(password, acc.password);
      if (isMatch) {
        user = acc;
        break; // Stop checking once we find a valid password match
      }
    }

    if (!user) {
      console.log("❌ Incorrect password for:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ Determine user type
    const hasBuyer = userAccounts.some((acc) => acc.type === "buyer");
    const hasSeller = userAccounts.some((acc) => acc.type === "seller");

    let userType = user.type; // Default to the type of the matched user
    if (hasBuyer && hasSeller) {
      userType = "buyer"; // If both accounts exist, default to buyer
    }
    // ✅ Generate JWT Token
    // Update token expiration based on remember me
    const token = jwt.sign(
      { id: user.id, type: userType },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? "30d" : "1d" } // 30 days if checked, 1 day if not
    );
    console.log("✅ User logged in:", email, "as", userType);
    res.status(200).json({ message: "Login successful", token, type: userType });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.googleRegister = async (req, res) => {
  try {
    console.log(req.body)

    const { credential } = req.body;
    const CLIENT_ID = '1001588197500-mmp90e0a3vmftbb3a8h3jbeput110kok.apps.googleusercontent.com'; // Replace with your actual client ID
    const client = new OAuth2Client(CLIENT_ID);

    // Verify the ID token using Google Auth Library
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: CLIENT_ID, // Ensure the ID token is for the correct client
    });

    // Get the decoded payload from the ID token
    const payload = ticket.getPayload();

    console.log(payload);
    User.deleteMany({});
    // Return the payload in the response
    let user = await User.create({ name: payload.name, email: payload.email, type: "buyer", provider: "google" });

    const token = jwt.sign({ user: user }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.status(200).json({ token, user });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Google Login
exports.googleLogin = async (req, res) => {
  console.log("Google Login - Session Data:", req.session.tempUser); // Debugging

  if (!req.user && req.session.tempUser) {
    return res.redirect(`http://localhost:5000/select-account?name=${encodeURIComponent(req.session.tempUser.name)}&email=${encodeURIComponent(req.session.tempUser.email)}`);
  }

  const { name, email } = req.user || req.session.tempUser;

  let buyer = await Buyer.findOne({ email });
  let seller = await Seller.findOne({ email });

  if (!buyer && !seller) {
    req.session.tempUser = { name, email };
    return res.redirect(`http://localhost:5000/select-account?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`);
  }

  let user = buyer || seller;
  const token = jwt.sign({ id: user.id, type: buyer ? "buyer" : "seller" }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.redirect(`http://localhost:5000?token=${token}`);
};

// Facebook Login
exports.facebookLogin = async (req, res) => {
  const { name, email } = req.user;

  let buyer = await Buyer.findOne({ email });
  let seller = await Seller.findOne({ email });

  if (!buyer && !seller) {
    return res.redirect(`http://localhost:5000/select-account?email=${email}`);
  }

  let user = buyer || seller;
  const token = jwt.sign({ id: user.id, type: buyer ? "buyer" : "seller" }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.redirect(`http://localhost:5000?token=${token}`);
};


exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, name, password, type } = req.body;

    console.log("🔹 Received OTP verification request:", { email, otp, name, password, type });

    // ✅ Find OTP in database (must match email & type)
    const verificationEntry = await Verification.findOne({ email, otp, type });

    if (!verificationEntry) {
      console.log("❌ OTP Verification Failed: Invalid or expired OTP.");
      return res.status(400).json({ message: "Invalid OTP or expired OTP" });
    }

    // ✅ Ensure a user with the same email & type does not already exist
    let existingUser = await User.findOne({ email, type });

    if (existingUser) {
      return res.status(400).json({ message: `You are already verified as a ${type}. Please log in.` });
    }

    // ✅ Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('✅ Password hashed successfully');

    // ✅ Create and save the new user with a new `_id`
    const newUser = new User({ name, email, password: hashedPassword, type });
    await newUser.save();

    console.log("✅ OTP Verified & Account Created:", email, type);

    // ✅ Delete OTP entry for this specific email & type
    await Verification.deleteOne({ email, type });

    res.status(200).json({ message: `Account verified successfully as ${type}! Please log in.` });
  } catch (error) {
    console.error("❌ OTP Verification Error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // ✅ Check if OTP exists
    let verificationEntry = await Verification.findOne({ email });

    if (!verificationEntry) {
      return res.status(400).json({ message: "No OTP request found for this email. Please register first." });
    }

    // ✅ Generate a New OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("🔄 Resending OTP:", otp);

    // ✅ Update OTP and Reset Expiration
    verificationEntry.otp = otp;
    verificationEntry.createdAt = new Date(); // Reset expiration time
    await verificationEntry.save();

    // ✅ Send the new OTP via email
    await sendOTPEmail(email, otp);

    res.status(200).json({ message: "New OTP sent to your email." });
  } catch (error) {
    console.error("❌ Resend OTP Error:", error);
    res.status(500).json({ error: "Server Error: " + error.message });
  }
};

exports.loginStatus = (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json(false);
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified) {
      return res.json(true);
    }

    return res.json(false);
  } catch (error) {
    console.error("❌ Login Status Error:", error);
    return res.json(false);
  }
};



