
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const admin = require('../models/admin');

// Replace with your actual secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Register admin
exports.registerAdmin = async (req, res) => {
  try {
    const { userName, password } = req.body;

    // Check if user already exists
    const existingAdmin = await admin.findOne({ userName });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new admin
    const newAdmin = new admin({ userName, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error });
  }
};

// Login admin
exports.loginAdmin = async (req, res) => {
  try {
    const { userName, password } = req.body;

    // Find admin by userName
    const adminData = await admin.findOne({ userName });
    if (!adminData) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, adminData.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ adminId: adminData._id }, JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ token, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
};
