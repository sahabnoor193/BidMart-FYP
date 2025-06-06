const express = require('express');
const router = express.Router();
const { protect: auth } = require('../middleware/authMiddleware');
const { getRecentChats } = require('../controllers/chatController');

router.get('/recent', auth, getRecentChats);

module.exports = router;