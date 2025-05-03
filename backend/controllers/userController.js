const User = require("../models/User");
const Verification = require("../models/Verification");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Add this line
const { sendOTPEmail } = require("../services/emailService");

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone, city, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, phone, city, address },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.changeUserPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.switchAccount = async (req, res) => {
  try {
    // Get full user document from database
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const email = currentUser.email;
    const currentType = currentUser.type;
    const newType = currentType === 'buyer' ? 'seller' : 'buyer';

    // Check for existing opposite account
    const oppositeAccount = await User.findOne({ 
      email: email,
      type: newType
    });

    if (oppositeAccount) {
      // Generate token for existing account
      const token = jwt.sign(
        { id: oppositeAccount._id, type: newType },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      return res.json({
        exists: true,
        message: `Switched to existing ${newType} account`,
        token,
        userType: newType,
        user: {
          id: oppositeAccount._id,
          _id: oppositeAccount._id,
          name: oppositeAccount.name,
          email: oppositeAccount.email,
          type: oppositeAccount.type
        }
      });
    }

    // If no existing account, return proper response
    return res.json({
      exists: false,
      message: `${newType} account not found for this email`
    });

  } catch (error) {
    console.error("Switch Account Error:", error);
    res.status(500).json({ 
      error: "Server Error",
      details: error.message
    });
  }
};

exports.switchRegister = async (req, res) => {
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

exports.switchVerifyOTP = async (req, res) => {
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

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: newUser.id, type: newUser.type },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ message: "OTP verified. Logged in successfully", token, type: newUser.type });
  } catch (error) {
    console.error("❌ OTP Verification Error:", error);
    res.status(500).json({ error: error.message });
  }
};