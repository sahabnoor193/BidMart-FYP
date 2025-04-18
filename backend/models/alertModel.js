const mongoose = require('mongoose');

const alertSchema = mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  productName: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['added', 'edited', 'deleted', 'draft', 'favorited', 'ended']
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Alert', alertSchema); 