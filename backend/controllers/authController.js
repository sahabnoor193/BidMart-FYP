const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
const Verification = require("../models/Verification");
const {OAuth2Client} = require("google-auth-library");
const { sendOTPEmail } = require("../services/emailService"); // Import email service

// Email validation function
const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return emailRegex.test(email);
};

// Password validation function with detailed feedback
const validatePassword = (password) => {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[@$!%*?&]/.test(password)
  };

  const missing = [];
  if (!requirements.length) missing.push("at least 8 characters");
  if (!requirements.uppercase) missing.push("an uppercase letter");
  if (!requirements.lowercase) missing.push("a lowercase letter");
  if (!requirements.number) missing.push("a number");
  if (!requirements.special) missing.push("a special character (@$!%*?&)");

  return {
    isValid: Object.values(requirements).every(Boolean),
    missing
  };
};

// Helper function to find the account that matches the password
async function findMatchingAccount(accounts, password) {
  for (let account of accounts) {
    const isMatch = await bcrypt.compare(password, account.password);
    if (isMatch) return account;
  }
  return null;
}

// Auth Controller Functions
const authController = {
  register: async (req, res) => {
  try {
    console.log("🔹 Received Registration Request:", req.body);

    const { name, email, password, type } = req.body;

    if (!name || !email || !password || !type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ 
        message: "Invalid email format. Please use a valid Gmail address." 
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: "This email is already registered. Please use a different email or try logging in.",
        isRegistered: true
      });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        message: "Password is missing: " + passwordValidation.missing.join(", "),
        missingRequirements: passwordValidation.missing
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("✅ Generated OTP:", otp);

    let verificationEntry = await Verification.findOne({ email, type });

    if (verificationEntry) {
      verificationEntry.otp = otp;
        verificationEntry.createdAt = new Date();
      await verificationEntry.save();
    } else {
      await Verification.create({ email, otp, type });
    }

    await sendOTPEmail(email, otp);

    res.status(201).json({ message: `OTP sent for ${type} registration. Please check your email.` });

  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ error: "Server Error: " + error.message });
  }
  },

  login: async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    console.log("🔹 Login request received:", email);

    const userAccounts = await User.find({ email });

    if (userAccounts.length === 0) {
      console.log("❌ No accounts found for email:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }
     
    const matchedAccount = await findMatchingAccount(userAccounts, password);

    if (!matchedAccount) {
      console.log("❌ Incorrect password for email:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
          id: matchedAccount._id,
        email: matchedAccount.email,
        type: matchedAccount.type,
      },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? '30d' : '1d' }
    );

    console.log("✅ User logged in:", email, "as", matchedAccount.type);

    return res.status(200).json({
      message: "Login successful",
      token,
      type: matchedAccount.type,
      id: matchedAccount._id,
      name: matchedAccount.name,
    });

  } catch (error) {
    console.error("❌ Login Error:", error);
    return res.status(500).json({ error: "Server error during login" });
  }
  },

  verifyOTP: async (req, res) => {
  try {
    const { email, otp, name, password, type } = req.body;

    console.log("🔹 Received OTP verification request:", { email, otp, name, password, type });

    const verificationEntry = await Verification.findOne({ email, otp, type });

    if (!verificationEntry) {
      console.log("❌ OTP Verification Failed: Invalid or expired OTP.");
      return res.status(400).json({ message: "Invalid OTP or expired OTP" });
    }

    let existingUser = await User.findOne({ email, type });

    if (existingUser) {
      return res.status(400).json({ message: `You are already verified as a ${type}. Please log in.` });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword, type });
    await newUser.save();

    console.log("✅ OTP Verified & Account Created:", email, type);

    await Verification.deleteOne({ email, type });

      res.status(200).json({ 
        message: `Account verified successfully as ${type}! Please log in.`,
      userId: newUser._id,
     });
  } catch (error) {
    console.error("❌ OTP Verification Error:", error);
    res.status(500).json({ error: error.message });
  }
  },

  resendOTP: async (req, res) => {
  try {
      const { email, type } = req.body;

      let verificationEntry = await Verification.findOne({ email, type });

    if (!verificationEntry) {
      return res.status(400).json({ message: "No OTP request found for this email. Please register first." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("🔄 Resending OTP:", otp);

    verificationEntry.otp = otp;
      verificationEntry.createdAt = new Date();
    await verificationEntry.save();

    await sendOTPEmail(email, otp);

    res.status(200).json({ message: "New OTP sent to your email." });
  } catch (error) {
    console.error("❌ Resend OTP Error:", error);
    res.status(500).json({ error: "Server Error: " + error.message });
  }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      if (!validateEmail(email)) {
        return res.status(400).json({ 
          message: "Invalid email format. Please use a valid Gmail address." 
        });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ 
          message: "No account found with this email address." 
        });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log("✅ Generated OTP for password reset:", otp);

      let verificationEntry = await Verification.findOne({ email, type: "password_reset" });
      if (verificationEntry) {
        verificationEntry.otp = otp;
        verificationEntry.createdAt = new Date();
        await verificationEntry.save();
      } else {
        await Verification.create({ 
          email, 
          otp, 
          type: "password_reset" 
        });
      }

      await sendOTPEmail(email, otp, "password_reset");

      res.status(200).json({ 
        message: "OTP sent to your email for password reset." 
      });

    } catch (error) {
      console.error("❌ Forgot Password Error:", error);
      res.status(500).json({ error: "Server Error: " + error.message });
    }
  },

  verifyResetOTP: async (req, res) => {
    try {
      const { email, otp } = req.body;

      const verificationEntry = await Verification.findOne({ 
        email, 
        otp, 
        type: "password_reset" 
      });

      if (!verificationEntry) {
        return res.status(400).json({ 
          message: "Invalid or expired OTP" 
        });
      }

      await Verification.deleteOne({ 
        email, 
        type: "password_reset" 
      });

      res.status(200).json({ 
        message: "OTP verified successfully" 
      });

    } catch (error) {
      console.error("❌ Reset OTP Verification Error:", error);
      res.status(500).json({ error: error.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { email, newPassword } = req.body;

      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        return res.status(400).json({ 
          message: "Password is missing: " + passwordValidation.missing.join(", "),
          missingRequirements: passwordValidation.missing
        });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ 
          message: "User not found" 
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ 
        message: "Password reset successful" 
      });

    } catch (error) {
      console.error("❌ Reset Password Error:", error);
      res.status(500).json({ error: error.message });
    }
  },

  loginStatus: (req, res) => {
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
  },

  checkToken: async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ valid: false });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ valid: false });
        }

        res.json({ valid: true, user });
    } catch (error) {
        console.error('Token check failed:', error);
        res.status(401).json({ valid: false });
    }
  },

  logout: async (req, res) => {
    try {        
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Server error during logout' });
    }
  },

  googleLogins: async (req, res) => {
    try {
      const { credential } = req.body;
      if (!credential) {
        return res.status(400).json({ message: "No credential provided" });
      }

      const CLIENT_ID = '1001588197500-mmp90e0a3vmftbb3a8h3jbeput110kok.apps.googleusercontent.com';
      const client = new OAuth2Client(CLIENT_ID);

      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const { email, name } = payload;

      if (!email) {
        return res.status(400).json({ message: "Google email not found" });
      }

      let user = await User.findOne({ email, provider: "google" });

      if (!user) {
        user = await User.create({
          name,
          email,
          type: "buyer",
          provider: "google",
        });
      }

      const token = jwt.sign({ id: user._id, type: user.type }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.status(200).json({
        id: user._id,
        token,
        name: user.name,
        email: user.email,
        type: user.type,
      });

    } catch (error) {
      console.error("Google Login Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  facebookLogin: async (req, res) => {
    const { name, email } = req.user;

    let buyer = await User.findOne({ email, type: "buyer" });
    let seller = await User.findOne({ email, type: "seller" });

    if (!buyer && !seller) {
      return res.redirect(`http://localhost:3000/select-account?email=${email}`);
    }

    let user = buyer || seller;
    const token = jwt.sign({ id: user.id, type: buyer ? "buyer" : "seller" }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.redirect(`http://localhost:3000?token=${token}`);
  }
};

// Export all functions
module.exports = {
  register: authController.register,
  login: authController.login,
  verifyOTP: authController.verifyOTP,
  resendOTP: authController.resendOTP,
  loginStatus: authController.loginStatus,
  checkToken: authController.checkToken,
  logout: authController.logout,
  forgotPassword: authController.forgotPassword,
  verifyResetOTP: authController.verifyResetOTP,
  resetPassword: authController.resetPassword,
  googleLogins: authController.googleLogins,
  facebookLogin: authController.facebookLogin
};