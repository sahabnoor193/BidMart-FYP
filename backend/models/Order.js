const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  orderItems: [
    {
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
      },
      seller: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
      },
      name: String,
      qty: { type: Number, default: 1 },
      price: Number,
      image: String,
      reviewLeft: { type: Boolean, default: false },  // Track if review has been left
      reviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' } // Link to review if exists
    }
  ],
  shippingAddress: {
    address: String,
    city: String,
    country: String,
    postalCode: String
  },
  paymentMethod: String,
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  bidId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bid',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema); 