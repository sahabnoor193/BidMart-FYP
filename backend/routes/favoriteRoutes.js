const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { toggleFavorite, getFavorites, checkFavorite } = require('../controllers/favoriteController');

router.use(protect); // All routes require authentication

router.post('/:productId', toggleFavorite);
router.get('/', getFavorites);
router.get('/:productId', checkFavorite);

module.exports = router; 