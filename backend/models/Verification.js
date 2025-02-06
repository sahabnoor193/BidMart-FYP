const mongoose = require("mongoose");

const VerificationSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 }, // Expires in 1 hour
});

module.exports = mongoose.model("Verification", VerificationSchema);
