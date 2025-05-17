const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
const Verification = require("../models/Verification");
const {OAuth2Client} = require("google-auth-library");
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

//for using unique email and type
// exports.register = async (req, res) => {
//   try {
//     console.log("🔹 Received Registration Request:", req.body);

//     const { name, email, password, type } = req.body;

//     if (!name || !email || !password || !type) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // ✅ Validate Email Format
//     if (!email.endsWith("@gmail.com")) {
//       return res.status(400).json({ message: "Only Google emails (@gmail.com) are allowed." });
//     }

//     // const UserModel = type === "buyer" ? Buyer : Seller;
//     const UserModel = User; // Use the single User model

//     // ✅ Check if Email Already Exists
//     let existingUser = await UserModel.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists. Please log in." });
//     }

//     // ✅ Generate New OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     console.log("✅ Generated OTP:", otp);

//     // ✅ Check if OTP already exists for this user
//     let verificationEntry = await Verification.findOne({ email });

//     if (verificationEntry) {
//       // ✅ Update existing OTP and reset expiration time
//       verificationEntry.otp = otp;
//       verificationEntry.createdAt = new Date(); // Reset expiration time
//       await verificationEntry.save();
//     } else {
//       // ✅ Save New OTP in Verification Collection
//       await Verification.create({ email, otp, type });
//     }

//     // ✅ Send OTP via Email
//     console.log("📧 Sending OTP to:", email);
//     await sendOTPEmail(email, otp); // Call email service to send OTP

//     res.status(201).json({ message: "OTP sent. Please check your email." });
//   } catch (error) {
//     console.error("❌ Registration Error:", error);
//     res.status(500).json({ error: "Server Error: " + error.message });
//   }
// };

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
// Changes By Muneeb, Added userid and userName in response
// exports.login = async (req, res) => {
//   try {
//     const { email, password, rememberMe } = req.body;

//     console.log("🔹 Login request received:", email);

//     // ✅ Find all accounts for this email
//     const userAccounts = await User.find({ email });

//     if (userAccounts.length === 0) {
//       console.log("❌ User not found:", email);
//       return res.status(400).json({ message: "Invalid email or password" });
//     }


//         // ✅ Check password against each account
//         let matchedAccount = null;
//         for (let account of userAccounts) {
//           const isMatch = await bcrypt.compare(password, account.password);
//           if (isMatch) {
//             matchedAccount = account;
//             break; // Stop checking once we find a valid password match
//           }
//         }
//     if (!matchedAccount) {
//       console.log("❌ Incorrect password for:", email);
//       return res.status(400).json({ message: "Invalid email or password" });
//     }
//         // ✅ Generate JWT Token
//         const token = jwt.sign(
//           { id: matchedAccount.id, email: matchedAccount.email, type: matchedAccount.type },
//           process.env.JWT_SECRET,
//           { expiresIn: rememberMe ? '30d' : '1d' } // 30 days if "Remember Me" is checked, otherwise 1 day
//         );
//     // console.log("✅ User logged in:", email, "as", userType);
//     // res.status(200).json({ message: "Login successful", token, type: userType, id: user.id,name: user.name });
//     console.log("✅ User logged in:", email, "as", matchedAccount.type);
//     res.status(200).json({
//       message: "Login successful",
//       token,
//       type: matchedAccount.type,
//       id: matchedAccount.id,
//       name: matchedAccount.name,
//     });
//   } catch (error) {
//     console.error("❌ Login Error:", error);
//     res.status(500).json({ error: error.message });
//   }
// };
// Added By Muneeb

exports.login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
   console.log(password,"password");
   
    console.log("🔹 Login request received:", email);

    // ✅ Find all user accounts associated with the provided email
    const userAccounts = await User.find({ email });

    if (userAccounts.length === 0) {
      console.log("❌ No accounts found for email:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }
     console.log(userAccounts,"userAccounts");
     
    // ✅ Try to match the provided password with any account's hashed password
    const matchedAccount = await findMatchingAccount(userAccounts, password);

    if (!matchedAccount) {
      console.log("❌ Incorrect password for email:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      {
        id: matchedAccount._id, // Use _id instead of id (Mongoose convention)
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
};

// ✅ Helper function to find the account that matches the password
async function findMatchingAccount(accounts, password) {
  for (let account of accounts) {
    const isMatch = await bcrypt.compare(password, account.password);
    console.log(isMatch,"isMatch");
    
    if (isMatch) return account;
  }
  return null;
}

exports.googleRegister = async (req, res) => {
  try {
    const { credential } = req.body;
    const CLIENT_ID = '1001588197500-mmp90e0a3vmftbb3a8h3jbeput110kok.apps.googleusercontent.com';
    const client = new OAuth2Client(CLIENT_ID);

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // Check if user already exists
    let existingUser = await User.findOne({ email: payload.email });

    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    }

    const user = await User.create({
      name: payload.name,
      email: payload.email,
      type: "buyer",
      provider: "google"
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      token,
      userId: user._id,
      user,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const CLIENT_ID = '1001588197500-mmp90e0a3vmftbb3a8h3jbeput110kok.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);
// Added By Muneeb
exports.googleLogins = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: "No credential provided" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    if (!email) {
      return res.status(400).json({ message: "Google email not found" });
    }

    // Check if user already exists
    let user = await User.findOne({ email, provider: "google" });

    if (!user) {
      // Optional: if you want to auto-create user if not exist
      user = await User.create({
        name,
        email,
        type: "buyer", // or ask frontend to send type if you want to support both
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
};
// Google Login
exports.googleLogin = async (req, res) => {
  console.log("Google Login - Session Data:", req.session.tempUser); // Debugging

  if (!req.user && req.session.tempUser) {
    return res.redirect(`http://localhost:3000/select-account?name=${encodeURIComponent(req.session.tempUser.name)}&email=${encodeURIComponent(req.session.tempUser.email)}`);
  }

  const { name, email } = req.user || req.session.tempUser;

  let buyer = await Buyer.findOne({ email });
  let seller = await Seller.findOne({ email });

  if (!buyer && !seller) {
    req.session.tempUser = { name, email };
    return res.redirect(`http://localhost:3000/select-account?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`);
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

//for using unique email and type

// exports.verifyOTP = async (req, res) => {
//   try {
//     const { email, otp, name, password, type } = req.body;

//     console.log("🔹 Received OTP verification request:", { email, otp, name, password, type });

//     // ✅ Find OTP in database
//     const verificationEntry = await Verification.findOne({ email, otp });

//     if (!verificationEntry) {
//       console.log("❌ OTP Verification Failed: Invalid or expired OTP.");
//       return res.status(400).json({ message: "Invalid OTP or expired OTP" });
//     }

//     // ✅ Select User Model
//     // const UserModel = type === "buyer" ? Buyer : Seller;
//     const UserModel = User;

//     let existingUser = await UserModel.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already verified. Please log in." });
//     }

//     // ✅ Hash password before saving (Important!)
//     // Hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     console.log('Password hashed successfully');
//     // const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new UserModel({ name, email, password: hashedPassword, type });
//     await newUser.save();

//     console.log("✅ OTP Verified & Account Created:", email);

//     // ✅ Delete OTP after successful verification
//     await Verification.deleteOne({ email });

//     res.status(200).json({ message: "Account verified successfully! Please log in." });
//   } catch (error) {
//     console.error("❌ OTP Verification Error:", error);
//     res.status(500).json({ error: error.message });
//   }
// };


// Add User Id in Response By Muneeb
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
    console.log(password,"password in otp");
    
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

    res.status(200).json({ message: `Account verified successfully as ${type}! Please log in.`,
      userId: newUser._id,
     });
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

exports.checkToken = async (req, res) => {
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
};

exports.logout = async (req, res) => {
    try {
        // In a real application, you might want to:
        // 1. Add the token to a blacklist
        // 2. Clear any refresh tokens
        // 3. Clear any session data
        
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Server error during logout' });
    }
};