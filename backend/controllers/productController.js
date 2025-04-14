const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const slugify = require("slugify");
const cloudinary = require("cloudinary").v2;
const User = require("../models/User");

// @desc    Create a new product (or draft)
// @route   POST /api/products
// @access  Private
const createProduct = asyncHandler(async (req, res) => {
  try {
    const { 
      name, 
      description, 
      brand, 
      quantity, 
      country,
      city, 
      startingPrice, 
      bidQuantity, 
      bidIncrease, 
      category, 
      startDate, 
      endDate,
      isDraft,
      images
    } = req.body;

    console.log('Received product data:', req.body);

    const userId = req.user._id;

    // Basic validation
    if (!name || !description || !brand || !quantity || !country || !city || 
        !startingPrice || !bidQuantity || !bidIncrease || !category || 
        !startDate || !endDate) {
      console.log('Missing required fields:', {
        name: !!name,
        description: !!description,
        brand: !!brand,
        quantity: !!quantity,
        country: !!country,
        city: !!city,
        startingPrice: !!startingPrice,
        bidQuantity: !!bidQuantity,
        bidIncrease: !!bidIncrease,
        category: !!category,
        startDate: !!startDate,
        endDate: !!endDate
      });
      res.status(400);
      throw new Error("Please fill in all required fields");
    }

    // Validate numeric fields
    if (isNaN(quantity) || quantity <= 0) {
      throw new Error("Quantity must be a positive number");
    }
    if (isNaN(startingPrice) || startingPrice <= 0) {
      throw new Error("Starting price must be a positive number");
    }
    if (isNaN(bidQuantity) || bidQuantity <= 0) {
      throw new Error("Bid quantity must be a positive number");
    }
    if (isNaN(bidIncrease) || bidIncrease <= 0) {
      throw new Error("Bid increase must be a positive number");
    }

      // Validate dates
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      const now = new Date();

      // Set all dates to UTC midnight for comparison
      const utcStart = Date.UTC(
        startDateObj.getFullYear(),
        startDateObj.getMonth(),
        startDateObj.getDate()
      );
      const utcNow = Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

      if (isNaN(startDateObj.getTime())) {
        throw new Error("Invalid start date");
      }
      if (isNaN(endDateObj.getTime())) {
        throw new Error("Invalid end date");
      }
      // Modified validation to allow today's date
      if (utcStart < utcNow) {
        throw new Error("Start date cannot be in the past");
      }
      if (endDateObj <= startDateObj) {
        throw new Error("End date must be after start date");
      }

    // Create slug
    const originalSlug = slugify(name, { lower: true, strict: true });
    let slug = originalSlug;
    let suffix = 1;

    while (await Product.findOne({ slug })) {
      slug = `${originalSlug}-${suffix}`;
      suffix++;
    }

    // Create product
    const product = await Product.create({
      user: userId,
      name,
      slug,
      description,
      brand,
      quantity: parseInt(quantity),
      country,
      city,
      startingPrice: parseFloat(startingPrice),
      bidQuantity: parseInt(bidQuantity),
      bidIncrease: parseFloat(bidIncrease),
      category,
      startDate: startDateObj,
      endDate: endDateObj,
      images: images || [],
      isDraft: isDraft === true,
      status: 'active'
    });

    console.log('Created product:', product);
    // Update seller's activeBids if not a draft AND start date is today
    if (!product.isDraft) {
      const today = new Date();
      const productStartDate = new Date(product.startDate);
      
      // Compare dates without time components
      const isToday = 
        productStartDate.getFullYear() === today.getFullYear() &&
        productStartDate.getMonth() === today.getMonth() &&
        productStartDate.getDate() === today.getDate();

      if (isToday) {
        await User.findByIdAndUpdate(userId, { $inc: { activeBids: 1 } });
        console.log(`Updated activeBids for user ${userId}`);
      }
    }
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
});


// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check if user is product owner
  if (product.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  // Update product
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      quantity: req.body.quantity ? parseInt(req.body.quantity) : product.quantity,
      startingPrice: req.body.startingPrice ? parseFloat(req.body.startingPrice) : product.startingPrice,
      bidQuantity: req.body.bidQuantity ? parseInt(req.body.bidQuantity) : product.bidQuantity,
      bidIncrease: req.body.bidIncrease ? parseFloat(req.body.bidIncrease) : product.bidIncrease,
      startDate: req.body.startDate ? new Date(req.body.startDate) : product.startDate,
      endDate: req.body.endDate ? new Date(req.body.endDate) : product.endDate,
      status: 'pending' // Reset status when updating
    },
    { new: true }
  );

  res.status(200).json(updatedProduct);
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check if user is product owner or admin
  if (product.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await product.remove();
  res.status(200).json({ message: "Product removed" });
});

// @desc    Get user's products
// @route   GET /api/products/user/:userId
// @access  Private
const getUserProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ user: req.params.userId })
    .sort("-createdAt")
    .populate("user", "name email");
  res.status(200).json(products);
});

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getUserProducts
};