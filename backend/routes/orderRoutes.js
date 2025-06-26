const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getMyOrders,
  getOrderById,
  createOrder,
  updateOrderStatus
} = require('../controllers/orderController');

// Get user's orders
router.get('/myorders', protect, getMyOrders);

// Get order by ID
router.get('/:id', protect, getOrderById);

// Create order from successful payment
router.post('/', protect, createOrder);

// Update order status
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router; 
 