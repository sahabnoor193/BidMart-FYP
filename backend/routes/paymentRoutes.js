const express = require('express');
const router = express.Router();
const { createCheckoutSession } = require('../controllers/PaymentController');
const { getAllPaymentDetails, getPaymentDetails } = require('../controllers/allPaymentController');

// POST /api/payments/create-checkout-session
router.post('/create-checkout-session', createCheckoutSession);
router.get('/allPayments', getAllPaymentDetails);
router.get('/getPaymentDetails/:id', getPaymentDetails);

module.exports = router;
