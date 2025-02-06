const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Buyer = require("../models/Buyer");
const Seller = require("../models/Seller");
const crypto = require("crypto");
const Verification = require("../models/Verification"); // Create this model
const { sendVerificationEmail } = require("../services/emailService");

exports.register = async (req, res) => {
  try {
    console.log("🔹 Received Registration Request:", req.body);

    const { name, email, password, type } = req.body;

    if (!email.endsWith("@gmail.com")) {
      console.log("❌ Invalid Email: ", email);
      return res.status(400).json({ message: "Only Google emails are allowed" });
    }

    const UserModel = type === "buyer" ? Buyer : Seller;

    let user = await UserModel.findOne({ email });
    if (user) {
      console.log("❌ User Already Exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    console.log("✅ Generated Token:", verificationToken);

    // Save to database
    await Verification.create({ email, token: verificationToken });

    console.log("📧 Sending Email to:", email);
    await sendVerificationEmail(email, verificationToken);

    res.status(200).json({ message: "Verification email sent. Please check your inbox." });
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

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const verificationEntry = await Verification.findOne({ token });

    if (!verificationEntry) {
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }

    // Hash password (use a default or request user to set it later)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("defaultPassword123", salt); // Default password for now

    // Create user after verification
    let user = new Buyer({ name: "User", email: verificationEntry.email, password: hashedPassword });
    await user.save();

    // Delete verification entry
    await Verification.deleteOne({ email: verificationEntry.email });

    res.status(200).json({ message: "Email verified! Account created successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

