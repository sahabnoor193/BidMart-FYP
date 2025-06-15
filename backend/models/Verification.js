// const mongoose = require("mongoose");

// const VerificationSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   token: { type: String, required: true },
//   type: { type: String, enum: ["buyer", "seller"], required: true },  // ✅ Store user type
//   createdAt: { type: Date, default: Date.now, expires: 3600 }, // Expires in 1 hour
// });

// module.exports = mongoose.model("Verification", VerificationSchema);

const mongoose = require("mongoose");

const VerificationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  type: { 
    type: String,
    enum: ['buyer', 'seller', 'password_reset'],
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 300 // Expires after 5 minutes
  }
});

// Compound index to ensure unique email-type combinations
VerificationSchema.index({ email: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("Verification", VerificationSchema);

