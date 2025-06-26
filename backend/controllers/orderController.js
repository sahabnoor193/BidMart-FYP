const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Bid = require('../models/Bid');
const Payment = require('../models/Payment');

// @desc    Get user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate({
      path: 'orderItems.product',
      select: 'name images category'
    })
    .populate({
      path: 'orderItems.seller',
      select: 'name email'
    })
    .populate({
      path: 'bidId',
      select: 'amount status'
    })
    .sort({ createdAt: -1 });

  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate({
      path: 'orderItems.product',
      select: 'name images category description'
    })
    .populate({
      path: 'orderItems.seller',
      select: 'name email'
    })
    .populate({
      path: 'bidId',
      select: 'amount status'
    });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Ensure user can only access their own orders
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this order');
  }

  res.json(order);
});

// @desc    Create order from successful payment
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { bidId, shippingAddress } = req.body;

  // Find the bid
  const bid = await Bid.findById(bidId)
    .populate({
      path: 'productId',
      select: 'name images startingPrice user'
    })
    .populate({
      path: 'bidderId',
      select: 'name email'
    });

  if (!bid) {
    res.status(404);
    throw new Error('Bid not found');
  }

  // Ensure the bid belongs to the current user
  if (bid.bidderId._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to create order for this bid');
  }

  // Check if bid status is Payment Success
  if (bid.status !== 'Payment Success') {
    res.status(400);
    throw new Error('Bid must have Payment Success status to create order');
  }

  // Check if order already exists for this bid
  const existingOrder = await Order.findOne({ bidId });
  if (existingOrder) {
    res.status(400);
    throw new Error('Order already exists for this bid');
  }

  // Create order items
  const orderItems = [{
    product: bid.productId._id,
    seller: bid.productId.user,
    name: bid.productId.name,
    qty: 1,
    price: bid.amount,
    image: bid.productId.images[0] || '',
    reviewLeft: false
  }];

  // Create the order
  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress: shippingAddress || {},
    paymentMethod: 'stripe',
    totalPrice: bid.amount,
    status: 'pending',
    bidId: bid._id
  });

  // Populate the order with details
  const populatedOrder = await Order.findById(order._id)
    .populate({
      path: 'orderItems.product',
      select: 'name images category'
    })
    .populate({
      path: 'orderItems.seller',
      select: 'name email'
    })
    .populate({
      path: 'bidId',
      select: 'amount status'
    });

  res.status(201).json(populatedOrder);
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Only allow status updates for valid statuses
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid order status');
  }

  order.status = status;
  await order.save();

  res.json(order);
});

module.exports = {
  getMyOrders,
  getOrderById,
  createOrder,
  updateOrderStatus
}; 