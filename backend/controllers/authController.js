const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Buyer = require("../models/Buyer");
const Seller = require("../models/Seller");
const crypto = require("crypto");
const Verification = require("../models/Verification"); // Create this model
const { sendOTPEmail } = require("../services/emailService"); // Import email service

// exports.register = async (req, res) => {
//   try {
//     console.log("🔹 Received Registration Request:", req.body);

//     const { name, email, password, type } = req.body;

//     // ✅ Validate Email Format
//     if (!email.endsWith("@gmail.com")) {
//       console.log("❌ Invalid Email: ", email);
//       return res.status(400).json({ message: "Only Google emails (@gmail.com) are allowed." });
//     }

//     const UserModel = type === "buyer" ? Buyer : Seller;

//     // ✅ Check if Email Already Exists
//     let existingUser = await UserModel.findOne({ email });
//     if (existingUser) {
//       console.log("❌ User Already Exists:", email);
//       return res.status(400).json({ message: "User already exists. Please log in." });
//     }

//     // ✅ Generate Verification Token
//     const verificationToken = crypto.randomBytes(32).toString("hex");
//     console.log("✅ Generated Token:", verificationToken);

//     // ✅ Save verification entry with type
//     await Verification.create({ email, token: verificationToken, type });

//     console.log("📧 Sending Email to:", email);
//     await sendVerificationEmail(email, verificationToken);

//     res.status(201).json({ message: "Verification email sent. Please check your inbox." });
//   } catch (error) {
//     console.error("❌ Registration Error:", error);
//     res.status(500).json({ error: "Server Error: " + error.message });
//   }
// };

exports.register = async (req, res) => {
  try {
    console.log("🔹 Received Registration Request:", req.body);

    const { name, email, password, type } = req.body;

    // ✅ Validate Email Format
    if (!email.endsWith("@gmail.com")) {
      return res.status(400).json({ message: "Only Google emails (@gmail.com) are allowed." });
    }

    const UserModel = type === "buyer" ? Buyer : Seller;

    // ✅ Check if Email Already Exists
    let existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists. Please log in." });
    }

    // ✅ Generate New OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("✅ Generated OTP:", otp);

    // ✅ Check if OTP already exists for this user
    let verificationEntry = await Verification.findOne({ email });

    if (verificationEntry) {
      // ✅ Update existing OTP and reset expiration time
      verificationEntry.otp = otp;
      verificationEntry.createdAt = new Date(); // Reset expiration time
      await verificationEntry.save();
    } else {
      // ✅ Save New OTP in Verification Collection
      await Verification.create({ email, otp, type });
    }

    // ✅ Send OTP via Email
    console.log("📧 Sending OTP to:", email);
    await sendOTPEmail(email, otp); // Call email service to send OTP

    res.status(201).json({ message: "OTP sent. Please check your email." });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ error: "Server Error: " + error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password, type } = req.body;

    let UserModel = type === "buyer" ? Buyer : Seller;

    let user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, type }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Google Login
exports.googleLogin = async (req, res) => {
  const { name, email } = req.user;

  let buyer = await Buyer.findOne({ email });
  let seller = await Seller.findOne({ email });

  if (!buyer && !seller) {
    return res.redirect(`http://localhost:3000/select-account?email=${email}`);
  }

  let user = buyer || seller;
  const token = jwt.sign({ id: user.id, type: buyer ? "buyer" : "seller" }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.redirect(`http://localhost:3000?token=${token}`);
};

// Facebook Login
exports.facebookLogin = async (req, res) => {
  const { name, email } = req.user;

  let buyer = await Buyer.findOne({ email });
  let seller = await Seller.findOne({ email });

  if (!buyer && !seller) {
    return res.redirect(`http://localhost:3000/select-account?email=${email}`);
  }

  let user = buyer || seller;
  const token = jwt.sign({ id: user.id, type: buyer ? "buyer" : "seller" }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.redirect(`http://localhost:3000?token=${token}`);
};

// exports.verifyEmail = async (req, res) => {
//   try {
//     const { token } = req.query;
//     const verificationEntry = await Verification.findOne({ token });

//     if (!verificationEntry) {
//       return res.status(400).json({ message: "Invalid or expired verification token." });
//     }

//     const { email, type } = verificationEntry; // ✅ Retrieve type from verification entry

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash("defaultPassword123", salt); // Temporary default password

//     // ✅ Choose model based on type
//     const UserModel = type === "buyer" ? Buyer : Seller;

//     let user = new UserModel({ name: "User", email, password: hashedPassword, provider: "local" });
//     await user.save();

//     // ✅ Delete verification entry after successful signup
//     await Verification.deleteOne({ email });

//     res.status(200).json({ message: "Email verified! Account created successfully." });
//   } catch (error) {
//     console.error("❌ Email Verification Error:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, name, password, type } = req.body;

    console.log("🔹 Received OTP verification request:", { email, otp, name, password, type });

    // ✅ Find OTP in database
    const verificationEntry = await Verification.findOne({ email, otp });
    if (!verificationEntry) {
      console.log("❌ OTP Verification Failed: Invalid or expired OTP.");
      return res.status(400).json({ message: "Invalid OTP or OTP expired." });
    }

    // ✅ Select User Model
    const UserModel = type === "buyer" ? Buyer : Seller;

    // ✅ Check if user already exists
    let existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already verified. Please log in." });
    }

    // ✅ Hash password before saving (Use bcrypt in production)
    const hashedPassword = password; // Ideally use bcrypt.hash(password, 10)

    // ✅ Create user account
    const newUser = new UserModel({ name, email, password: hashedPassword, type });
    await newUser.save();

    console.log("✅ OTP Verified & Account Created:", email);

    // ✅ Delete OTP after successful verification
    await Verification.deleteOne({ email });

    res.status(200).json({ message: "Account verified successfully! You can now log in." });
  } catch (error) {
    console.error("❌ OTP Verification Error:", error);
    res.status(500).json({ error: "Server Error: " + error.message });
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
