const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Send a message
router.post("/", messageController.sendMessage);

// Get messages of a specific conversation
router.get("/:conversationId", messageController.getMessages);

// Mark a message as read
router.patch("/:messageId/read", messageController.markMessageAsRead);

module.exports = router;