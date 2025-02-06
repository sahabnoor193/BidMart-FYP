const mongoose = require("mongoose");

const BuyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, 
  provider: { type: String, enum: ["local", "google", "facebook"], default: "local" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Buyer", BuyerSchema);
