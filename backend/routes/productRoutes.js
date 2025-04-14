const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload, handleMulterError } = require('../config/multer');

// Public routes

// Protected routes
router.post('/', protect, upload.array('images', 5), handleMulterError, productController.createProduct); 
router.put('/:id', protect, productController.updateProduct);
router.delete('/:id', protect, productController.deleteProduct);
router.get('/user/:userId', protect, productController.getUserProducts);

module.exports = router;