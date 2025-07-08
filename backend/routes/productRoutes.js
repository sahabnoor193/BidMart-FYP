// productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, checkRole } = require('../middleware/authMiddleware');
const { upload, handleMulterError } = require('../config/multer');

// Public routes
// Add this to productRoutes.js
router.get('/active', productController.getActiveProducts);
// router.get('/search', productController.searchProducts);
router.get('/similar/:productId', productController.getSimilarProducts);
router.get('/search', productController.searchProducts);

// Protected routes
router.post('/', protect, upload.array('images', 5), handleMulterError, productController.createProduct);
router.get('/user/:userId', protect, productController.getUserProducts);
router.get('/drafts', protect, productController.getDraftProducts);
router.delete('/:id', protect, productController.deleteProduct);
router.put('/:id', protect, upload.array('images', 5), handleMulterError, productController.updateProduct);
router.get("/getAllProducts", productController.getAllProducts);
router.get("/getProductById/:id", productController.getProductById);
router.put("/updateProductStatus/:id", productController.updateProductStatus);
router.delete("/deleteProduct/:id", productController.deleteProduct);
router.delete("/deleteProductForAdmin/:id", productController.deleteProductForAdmin);
// Public route (keep this last to avoid conflict)
router.get('/:id', productController.getProductById);

module.exports = router;