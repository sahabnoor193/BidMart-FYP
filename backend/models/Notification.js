// models/Notification.js
const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  type: { 
    type: String, 
    enum: ["bid", "accept", "reject", "message", "system"], 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  relatedItemId: { 
    type: mongoose.Schema.Types.ObjectId, 
    refPath: "onModel" 
  },
  onModel: { 
    type: String, 
    enum: ["Product", "Bid", "User"] 
  },
  read: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Notification", NotificationSchema);