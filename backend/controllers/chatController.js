const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

exports.getRecentChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const recentChats = await Conversation.aggregate([
      { $match: { participants: mongoose.Types.ObjectId(userId) } },
      { $sort: { updatedAt: -1 } },
      {
        $lookup: {
          from: "messages",
          localField: "_id",
          foreignField: "conversationId",
          as: "lastMessage",
        },
      },
      { $unwind: { path: "$lastMessage", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "participants",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $project: {
          lastMessage: "$lastMessage.text",
          timestamp: "$lastMessage.timestamp",
          userInfo: { name: 1, email: 1 },
        },
      },
    ]);

    res.json(recentChats);
  } catch (error) {
    console.error("Error fetching recent chats:", error);
    res.status(500).json({ error: "Failed to fetch recent chats" });
  }
};
