const asyncHandler = require('express-async-handler');
const Favorite = require('../models/favoriteModel');
const Product = require('../models/productModel');
const User = require('../models/User');
const Alert = require('../models/alertModel');

// @desc    Toggle favorite status for a product
// @route   POST /api/favorites/:productId
// @access  Private
const toggleFavorite = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  try {
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({ user: userId, product: productId });

    if (existingFavorite) {
      // Remove from favorites
      await Favorite.deleteOne({ _id: existingFavorite._id });
      
      // Update product's favorite count
      await Product.findByIdAndUpdate(productId, { $inc: { favoriteCount: -1 } });
      
      // Update seller's total favorites count
      await User.findByIdAndUpdate(product.user, { $inc: { totalFavorites: -1 } });

      // Decrement the user's favorites count
      await User.findByIdAndUpdate(userId, { $inc: { favourites: -1 } });

      res.json({ isFavorited: false });
    } else {
      // Add to favorites
      const favorite = await Favorite.create({
        user: userId,
        product: productId
      });

      // Update product's favorite count
      await Product.findByIdAndUpdate(productId, { $inc: { favoriteCount: 1 } });
      
      // Update seller's total favorites count
      await User.findByIdAndUpdate(product.user, { $inc: { totalFavorites: 1 } });

      // Increment the user's favorites count
      await User.findByIdAndUpdate(userId, { $inc: { favourites: 1 } });

      // Create alert for product being favorited
      // Replace both Alert.create calls with:
      await Alert.create({
        user: product.user,
        userType: 'seller',
        product: product._id,
        productName: product.name,
        action: 'favorited'
      });

      await Alert.create({
        user: userId,
        userType: 'buyer',
        product: product._id,
        productName: product.name,
        action: 'favorited-product'
      });

      res.json({ isFavorited: true });
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user's favorite products
// @route   GET /api/favorites
// @access  Private
const getFavorites = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const favorites = await Favorite.find({ user: userId })
      .populate({
        path: 'product',
        select: 'name startingPrice images category city country startDate endDate favoriteCount'
      })
      .sort('-createdAt');

    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Check if a product is favorited by the user
// @route   GET /api/favorites/:productId
// @access  Private
const checkFavorite = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  try {
    const favorite = await Favorite.findOne({ user: userId, product: productId });
    res.json({ isFavorited: !!favorite });
  } catch (error) {
    console.error('Error checking favorite:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  toggleFavorite,
  getFavorites,
  checkFavorite
}; 