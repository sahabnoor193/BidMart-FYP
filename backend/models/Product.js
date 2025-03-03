// models/Product.js
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  sellerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  startingPrice: { 
    type: Number, 
    required: true 
  },
  currentPrice: { 
    type: Number, 
    default: function() {
      return this.startingPrice;
    }
  },
  images: [{ 
    type: String 
  }],
  endTime: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["active", "ended", "sold"], 
    default: "active" 
  },
  favoriteCount: { 
    type: Number, 
    default: 0 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Product", ProductSchema);