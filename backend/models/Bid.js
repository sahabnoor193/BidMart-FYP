// models/Bid.js
const mongoose = require("mongoose");

const BidSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product", 
    required: true 
  },
  bidderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["pending", "accepted", "rejected", "expired","payment pending","Payment Success"], 
    default: "pending" 
  },
  message: { 
    type: String 
  },
  checkoutUrl: { 
    type: String 
  },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Bid", BidSchema);