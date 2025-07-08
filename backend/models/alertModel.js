const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  userType: {
    type: String,
    required: true,
    enum: ['seller', 'buyer']
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  productName: String,
  action: {
    type: String,
    required: true,
    enum: ['added', 'edited', 'deleted', 'draft','favorited-product', 'favorited', 'ended', 'bid-placed', 'bid-accepted', 'bid-rejected', 'new-bid', 'new-offer', 'offer-accepted', 'offer-rejected', 'offer-placed','payment_success','product_sold']
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Alert', alertSchema);