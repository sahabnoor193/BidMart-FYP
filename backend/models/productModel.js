const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  brand: { type: String, required: true },
  quantity: { type: Number, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true }, // Added city field
  startingPrice: { type: Number, required: true },
  bidQuantity: { type: Number },
  bidIncrease: { type: Number },
  category: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  images: [{ type: String }],
  mainImageIndex: { type: Number, default: 0 },
  isDraft: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['active', 'ended', 'draft','pending'], 
    default: 'active' 
  },
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  favoriteCount: {
    type: Number,
    default: 0
  }
});


// Sania Updates
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ city: 1, country: 1 });

module.exports = mongoose.model('Product', productSchema);