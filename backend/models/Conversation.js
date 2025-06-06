const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
  participants: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }],
    validate: [array => array.length >= 2, "A conversation must have at least two participants."]
  },
  lastMessage: {
    type: String,
    default: "",
  },
}, { timestamps: true });

ConversationSchema.index({ participants: 1 });

module.exports = mongoose.model("Conversation", ConversationSchema);