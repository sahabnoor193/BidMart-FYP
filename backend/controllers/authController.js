const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Buyer = require("../models/Buyer");
const Seller = require("../models/Seller");

exports.register = async (req, res) => {
  try {
    const { name, email, password, type } = req.body;

    // Choose model based on user type
    const UserModel = type === "buyer" ? Buyer : Seller;

    // Check if user already exists
    let user = await UserModel.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save new user
    user = new UserModel({ name, email, password: hashedPassword });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user.id, type }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Registration Error:", error);
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
