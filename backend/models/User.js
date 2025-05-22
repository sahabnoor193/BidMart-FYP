const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: false }, // Optional for OAuth users
  type: { type: String, enum: ["seller", "buyer"], required: true },
  provider: { type: String, enum: ["local", "google", "facebook"], default: "local" },
  activeBids: { type: Number, default: 0 },
  endedBids: { type: Number, default: 0 },
  requestBids: { type: Number, default: 0 },
  acceptedBids: { type: Number, default: 0 },
  favourites: { type: Number, default: 0 },
  phone: { type: Number, default: undefined },
  city: { type: String, default: undefined },
  address: { type: String, default: undefined },
  stripeAccountId : { type: String,default: null },
  stripeLoginLink : { type: String,default: null },
  createdAt: { type: Date, default: Date.now },
  totalFavorites: { type: Number, default: 0 },

  // ✅ New status field
  status: {
    type: String,
    enum: ["active", "inactive", "suspended","blocked"],
    default: "active"
  }
});

// ✅ Ensure email & type combination is unique
UserSchema.index({ email: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("User", UserSchema);
