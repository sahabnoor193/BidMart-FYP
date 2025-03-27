// routes/buyer.js
const express = require('express');
const router = express.Router();
const { getBuyerDashboard } = require('../controllers/buyerController');
const auth = require("../middleware/authMiddleware"); // Destructure protect

router.get('/dashboard', auth, getBuyerDashboard);
module.exports = router;
