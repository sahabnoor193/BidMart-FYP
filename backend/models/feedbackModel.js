const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  role: { type: String, enum: ["Buyer", "Seller"], required: true },
  name: { type: String },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Feedback", feedbackSchema);