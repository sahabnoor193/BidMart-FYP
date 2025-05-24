const Bid = require('../models/Bid.js'); // Assuming you have a Bid model
const asyncHandler = require('express-async-handler');
const Payment = require('../models/Payment.js');

const getAllPaymentDetails = asyncHandler(async (req, res) => {
  const payments = await Payment.find({})
    .populate({
      path: 'bidId',
      populate: [
        { 
          path: 'productId',
          select: 'name description startingPrice user', // Use fields from Product model
          populate: {
            path: 'user', // Use 'user' instead of 'seller' for seller details
            select: 'name email' // Adjust fields based on your User model
          }
        },
        { 
          path: 'bidderId',
          select: 'name email' // Buyer details from User model
        }
      ]
    });

  if (!payments || payments.length === 0) {
    res.status(404);
    throw new Error('No payments found');
  }

  // Structure the response
  const paymentDetails = payments.map(payment => ({
    paymentId: payment._id,
    amount: payment.amount,
    status: payment.status,
    createdAt: payment.createdAt,
    updatedAt: payment.updatedAt,
    product: payment.bidId?.productId
      ? {
          name: payment.bidId.productId.name,
          description: payment.bidId.productId.description,
          startingPrice: payment.bidId.productId.startingPrice // Use startingPrice
        }
      : null,
    seller: payment.bidId?.productId?.user
      ? {
          name: payment.bidId.productId.user.name,
          email: payment.bidId.productId.user.email
        }
      : null,
    buyer: payment.bidId?.bidderId
      ? {
          name: payment.bidId.bidderId.name,
          email: payment.bidId.bidderId.email
        }
      : null
  }));

  res.status(200).json(paymentDetails);
});

const getPaymentDetails = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate({
      path: 'bidId',
      populate: [
        { 
          path: 'productId',
          select: 'name description startingPrice user',
          populate: {
            path: 'user',
            select: 'name email'
          }
        },
        { 
          path: 'bidderId',
          select: 'name email'
        }
      ]
    });

  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }

  const paymentDetails = {
    paymentId: payment._id,
    amount: payment.amount,
    status: payment.status,
    createdAt: payment.createdAt,
    updatedAt: payment.updatedAt,
    product: payment.bidId?.productId
      ? {
          name: payment.bidId.productId.name,
          description: payment.bidId.productId.description,
          startingPrice: payment.bidId.productId.startingPrice
        }
      : null,
    seller: payment.bidId?.productId?.user
      ? {
          name: payment.bidId.productId.user.name,
          email: payment.bidId.productId.user.email
        }
      : null,
    buyer: payment.bidId?.bidderId
      ? {
          name: payment.bidId.bidderId.name,
          email: payment.bidId.bidderId.email
        }
      : null
  };

  res.status(200).json(paymentDetails);
});
module.exports = { getAllPaymentDetails, getPaymentDetails };