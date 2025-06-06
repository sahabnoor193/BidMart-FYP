const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const slugify = require("slugify");
const cloudinary = require("cloudinary").v2;
const User = require("../models/User");
const Alert = require('../models/alertModel');
const Bid = require("../models/Bid");
const productModel = require("../models/productModel");
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
      !startingPrice || !category ||
      !startDate || !endDate) {
      console.log('Missing required fields:', {
        name: !!name,
        description: !!description,
        brand: !!brand,
        quantity: !!quantity,
        country: !!country,
        city: !!city,
        startingPrice: !!startingPrice,
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

    // Validate dates
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const now = new Date();

    // Validate date objects
    if (isNaN(startDateObj.getTime())) {
      throw new Error("Invalid start date format");
    }
    if (isNaN(endDateObj.getTime())) {
      throw new Error("Invalid end date format");
    }

    // Set all dates to UTC midnight for comparison
    const utcStart = Date.UTC(
      startDateObj.getUTCFullYear(),
      startDateObj.getUTCMonth(),
      startDateObj.getUTCDate()
    );
    const utcEnd = Date.UTC(
      endDateObj.getUTCFullYear(),
      endDateObj.getUTCMonth(),
      endDateObj.getUTCDate()
    );
    const utcNow = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    );

    // Only validate dates if not a draft
    if (!isDraft) {
      if (utcStart < utcNow) {
        throw new Error("Start date cannot be in the past");
      }
      if (utcEnd <= utcStart) {
        throw new Error("End date must be after start date");
      }
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
      category,
      startDate: startDateObj,
      endDate: endDateObj,
      images: images || [],
      isDraft: isDraft === true,
      status: isDraft ? 'draft' : 'active'
    });

    // Replace both Alert.create calls with:
    await Alert.create({
      user: product.user,
      userType: 'seller',
      product: product._id,
      productName: product.name,
      action: isDraft ? 'draft' : 'added'
    });

    await Alert.create({
      user: userId,
      userType: 'buyer',
      product: product._id,
      productName: product.name,
      action: isDraft ? 'draft' : 'added'
    });

    console.log('Created product:', product);

    // Only update activeBids if not a draft
    if (!isDraft) {
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
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user's products
// @route   GET /api/products/user/:userId
// @access  Private
const getUserProducts = asyncHandler(async (req, res) => {
  const requestedUserId = req.params.userId;
  if (requestedUserId !== req.user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized access" });
  }
  const products = await Product.find({ user: req.params.userId })
    .sort("-createdAt")
    .populate("user", "name email");
  res.status(200).json(products);
});

// Changes BY Muneeb
const getActiveProducts = asyncHandler(async (req, res) => {
  try {
    const now = new Date();
    const utcNow = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    ));

    console.log('[API] Fetching active products at:', utcNow.toISOString());

    const products = await Product.find({
      $and: [
        { isDraft: false },
        { status: 'active' },
        { endDate: { $gte: utcNow } }  // Filter for endDate today or later
      ]
    })
      .sort('-createdAt')
      .select('name startingPrice currentPrice status startDate endDate isDraft category city country images');

    console.log('[API] Found products:', products.length);
    res.json(products);
  } catch (error) {
    console.error('[API] Error fetching active products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find().populate("user", "name email");
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err });
  }
};

// Get a single product by ID
const getProductDetailById = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id).populate("user", "name email");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product", error: err });
  }
};

// Update product status
const updateProductStatus = async (req, res) => {
  const { status } = req.body;
  if (!["active", "ended", "draft"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Status updated", product });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status", error: err });
  }
};

// Delete a product

// const getActiveProducts = asyncHandler(async (req, res) => {
//   try {
//     const now = new Date();
//     const utcNow = Date.UTC(
//       now.getUTCFullYear(),
//       now.getUTCMonth(),
//       now.getUTCDate()
//     );

//     console.log('[API] Fetching active products at:', new Date(utcNow).toISOString());

//     const products = await Product.find({ 
//       $and: [
//         { startDate: { $lte: new Date(utcNow) } },
//         { endDate: { $gt: new Date(utcNow) } },
//         { isDraft: false },
//         { status: 'active' }
//       ]
//     })
//     .sort('-createdAt')
//     .select('name startingPrice currentPrice status startDate endDate isDraft category city country images');

//     console.log('[API] Found products:', products.length);
//     res.json(products);
//   } catch (error) {
//     console.error('[API] Error fetching active products:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
// const getProductById = asyncHandler(async (req, res) => {
//   try {
//     console.log('[API] Fetching product with ID:', req.params.id);

//     const product = await Product.findById(req.params.id)
//       .populate("user", "name email phone createdAt city _id")
//       .lean();

//     if (!product) {
//       console.error('[API] Product not found for ID:', req.params.id);
//       res.status(404);
//       throw new Error("Product not found");
//     }

//     console.log('[API] Found product:', product);

//     // Calculate years active
//     const seller = await User.findById(product.user._id);
//     const yearsActive = new Date().getFullYear() - new Date(seller.createdAt).getFullYear();

//     console.log('[API] Seller details:', seller);

//     // Format dates to MM/DD/YY
//     const formatDate = (date) => 
//       new Date(date).toLocaleDateString("en-US", {
//         year: "2-digit",
//         month: "2-digit",
//         day: "2-digit"
//       });

//     // Get seller's previous products (excluding current product)
//     const previousProducts = await Product.find({
//       user: product.user._id,
//       _id: { $ne: product._id },
//       isDraft: false
//     })
//     .sort('-createdAt')
//     .limit(5)
//     .select('name startingPrice currentPrice status startDate endDate images');

//     // Build response
//     const response = {
//       title: product.name,
//       sellerId: product.user._id, // Correctly assign the seller's user ID
//       country: product.country,
//       startBid: product.startingPrice,
//       latestBid: product.currentPrice,
//       totalBids: product.totalBids,
//       images: {
//         main: product.images[product.mainImageIndex] || product.images[0],
//         thumbnails: product.images
//       },
//       details: {
//         quantity: product.quantity,
//         brand: product.brand,
//         dateStart: formatDate(product.startDate),
//         dateEnd: formatDate(product.endDate),
//         description: product.description
//       },
//       profile: {
//         name: product.user.name,
//         years: yearsActive,
//         time: formatDate(product.user.createdAt),
//         bids: await Product.countDocuments({ user: product.user._id, isDraft: false }) // Total active products listed
//       },
//       contact: {
//         name: product.user.name,
//         email: product.user.email,
//         phone: product.user.phone,
//         city: product.user.city
//       },
//       previousBids: previousProducts.map(prod => ({
//         item: prod.name,
//         price: prod.currentPrice || prod.startingPrice,
//         status: prod.status,
//         startDate: formatDate(prod.startDate),
//         endDate: formatDate(prod.endDate),
//         image: prod.images[0]
//       }))
//     };

//     console.log('[API] Response:', response);
//     res.json(response);
//   } catch (error) {
//     console.error('[API] Error fetching product by ID:', error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });


// Added By Muneeb
const getProductById = asyncHandler(async (req, res) => {
 try {
    // Add this validation check at the start
    console.log('[API] Fetching product with ID:', req.params.id);

    const product = await Product.findById(req.params.id)
      .populate("user", "name email phone createdAt city _id")
      .lean();

    if (!product) {
      console.error('[API] Product not found for ID:', req.params.id);
      res.status(404);
      throw new Error("Product not found");
    }

    console.log('[API] Found product:', product);
    const seller = await User.findById(product.user._id);
    const yearsActive = new Date().getFullYear() - new Date(seller.createdAt).getFullYear();

    const formatDate = (date) =>
      new Date(date).toLocaleDateString("en-US", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit"
      });

    // ✅ Get all bids and latest bid
    const bids = await Bid.find({ productId: product._id })
      .populate("bidderId", "name email")
      .sort("-createdAt")
      .lean();

    const latestBidEntry = bids.length > 0 ? bids[0] : null;
    const latestBidPrice = latestBidEntry?.amount || product.startingPrice;

    // ✅ Seller's previous products (excluding current)
    const previousProducts = await Product.find({
      user: product.user._id,
      _id: { $ne: product._id },
      isDraft: false
    })
      .sort('-createdAt')
      .limit(5)
      .select('name startingPrice currentPrice status startDate endDate images');

    const response = {
      title: product.name,
      country: product.country,
      bidIncrease: product.bidIncrease,
      startBid: product.startingPrice,
      latestBid: latestBidPrice, // ✅ This is now accurate based on actual bids
      totalBids: bids.length,
      images: {
        main: product.images[product.mainImageIndex] || product.images[0],
        thumbnails: product.images
      },
      details: {
        quantity: product.quantity,
        brand: product.brand,
        dateStart: formatDate(product.startDate),
        dateEnd: formatDate(product.endDate),
        description: product.description
      },
      profile: {
        sellerId: product.user._id,
        name: product.user.name,
        years: yearsActive,
        time: formatDate(product.user.createdAt),
        bids: await Product.countDocuments({ user: product.user._id, isDraft: false })
      },

      contact: {
        name: product.user.name,
        email: product.user.email,
        phone: product.user.phone,
        city: product.user.city
      },
      previousBids: previousProducts.map(prod => ({
        item: prod.name,
        price: prod.currentPrice || prod.startingPrice,
        status: prod.status,
        startDate: formatDate(prod.startDate),
        endDate: formatDate(prod.endDate),
        image: prod.images[0]
      })),
      bids: bids.map(bid => ({
        amount: bid.amount,
        status: bid.status,
        createdAt: formatDate(bid.createdAt),
        bidder: {
          name: bid.bidderId?.name || 'Unknown',
          email: bid.bidderId?.email || 'N/A'
        }
      }))
    };

    res.json(response);
  } catch (error) {
    console.error('[API] Error fetching product by ID:', error);
    res.status(500).json({ message: "Server Error" });
  }
});


// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user._id;

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check ownership
    if (product.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this product" });
    }

    // Delete associated bids
    // if (Bid) { // Check if Bid model exists
    //   await Bid.deleteMany({ product: productId });
    // }

    // Remove product images from Cloudinary if they exist
    if (product.images && product.images.length > 0) {
      try {
        await Promise.all(
          product.images.map(async (image) => {
            if (image.public_id) {
              await cloudinary.uploader.destroy(image.public_id);
            }
          })
        );
      } catch (cloudinaryError) {
        console.error("Cloudinary deletion error:", cloudinaryError);
      }
    }

    // Delete the product
    await Product.deleteOne({ _id: productId });

    // Update user's activeBids if necessary
    if (!product.isDraft && product.status === "active") {
      const now = new Date();
      const utcNow = Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate()
      );
      const startDate = new Date(product.startDate);
      const endDate = new Date(product.endDate);
      const utcStart = Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate()
      );
      const utcEnd = Date.UTC(
        endDate.getUTCFullYear(),
        endDate.getUTCMonth(),
        endDate.getUTCDate()
      );
      if (utcStart <= utcNow && utcEnd >= utcNow) {
        await User.findByIdAndUpdate(userId, {
          $inc: { activeBids: -1 }
        });
      }
    }

    // Replace both Alert.create calls with:
    await Alert.create({
      user: product.user,
      userType: 'seller',
      product: product._id,
      productName: product.name,
      action: 'deleted'
    });

    await Alert.create({
      user: userId,
      userType: 'buyer',
      product: product._id,
      productName: product.name,
      action: 'deleted'
    });


    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      message: error.message || "Server error during product deletion"
    });
  }
});
const deleteProductForAdmin = asyncHandler(async (req, res) => {
  try {
    const productId = req.params.id;

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete associated images from Cloudinary
    if (product.images && product.images.length > 0) {
      try {
        await Promise.all(
          product.images.map(async (image) => {
            if (image.public_id) {
              await cloudinary.uploader.destroy(image.public_id);
            }
          })
        );
      } catch (cloudinaryError) {
        console.error("Cloudinary deletion error:", cloudinaryError);
      }
    }

    // Delete the product
    await Product.deleteOne({ _id: productId });
    await Bid.deleteMany({ product: productId });

    // Update seller's activeBids count if needed
    if (!product.isDraft && product.status === "active") {
      const now = new Date();
      const utcNow = Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate()
      );
      const startDate = new Date(product.startDate);
      const endDate = new Date(product.endDate);
      const utcStart = Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate()
      );
      const utcEnd = Date.UTC(
        endDate.getUTCFullYear(),
        endDate.getUTCMonth(),
        endDate.getUTCDate()
      );
      if (utcStart <= utcNow && utcEnd >= utcNow) {
        await User.findByIdAndUpdate(product.user, {
          $inc: { activeBids: -1 }
        });
      }
    }

    // Send alerts
    await Alert.create({
      user: product.user,
      userType: 'seller',
      product: product._id,
      productName: product.name,
      action: 'deleted'
    });


    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      message: error.message || "Server error during product deletion"
    });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user._id;
    const updates = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check ownership
    if (product.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to update this product" });
    }

    // Validate dates if being updated
    if (updates.startDate || updates.endDate) {
      const startDate = new Date(updates.startDate || product.startDate);
      const endDate = new Date(updates.endDate || product.endDate);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }

      const utcStart = Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate()
      );
      const utcEnd = Date.UTC(
        endDate.getUTCFullYear(),
        endDate.getUTCMonth(),
        endDate.getUTCDate()
      );

      if (utcStart >= utcEnd) {
        return res.status(400).json({ message: "End date must be after start date" });
      }
    }

    // Update slug if name changes
    if (updates.name && updates.name !== product.name) {
      const originalSlug = slugify(updates.name, { lower: true, strict: true });
      let slug = originalSlug;
      let suffix = 1;

      while (await Product.findOne({ slug, _id: { $ne: productId } })) {
        slug = `${originalSlug}-${suffix}`;
        suffix++;
      }
      updates.slug = slug;
    }

    // Update status based on isDraft
    if (updates.isDraft !== undefined) {
      updates.status = updates.isDraft ? 'draft' : 'active';
    }

    // Handle image updates
    if (updates.images) {
      // Validate that updates.images is an array of strings
      if (!Array.isArray(updates.images)) {
        updates.images = [updates.images];
      }

      // Filter out any non-string values
      updates.images = updates.images.filter(img => typeof img === 'string');

      // Get existing image public_ids from URLs
      const existingPublicIds = product.images.map(img => {
        const urlParts = img.split('/');
        const filename = urlParts[urlParts.length - 1];
        return filename.split('.')[0];
      });

      // Get new image public_ids from URLs
      const newPublicIds = updates.images.map(img => {
        const urlParts = img.split('/');
        const filename = urlParts[urlParts.length - 1];
        return filename.split('.')[0];
      });

      // Find images to delete
      const imagesToDelete = existingPublicIds.filter(
        public_id => !newPublicIds.includes(public_id)
      );

      // Delete removed images from Cloudinary
      await Promise.all(
        imagesToDelete.map(async (public_id) => {
          try {
            await cloudinary.uploader.destroy(public_id);
          } catch (error) {
            console.error('Error deleting image:', public_id, error);
          }
        })
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    // Create alert for product update

    await Alert.create({
      user: product.user,
      userType: 'seller',
      product: product._id,
      productName: product.name,
      action: 'edited'
    });

    await Alert.create({
      user: userId,
      userType: 'buyer',
      product: product._id,
      productName: product.name,
      action: 'edited'
    });


    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: error.message || "Server error during product update" });
  }
});

// @desc    Get similar products
// @route   GET /api/products/similar/:productId
// @access  Public
const getSimilarProducts = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;

    // Get the current product
    const currentProduct = await Product.findById(productId);
    if (!currentProduct) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Find similar products based on category and country
    const similarProducts = await Product.find({
      _id: { $ne: productId }, // Exclude current product
      category: currentProduct.category,
      country: currentProduct.country,
      status: 'active'
    })
      .limit(4) // Limit to 4 similar products
      .select('name startingPrice images category city country startDate endDate');

    res.json(similarProducts);
  } catch (error) {
    console.error('Error fetching similar products:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get draft products for a user
// @route   GET /api/products/drafts
// @access  Private
const getDraftProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({
      user: req.user._id,
      isDraft: true
    })
      .sort('-createdAt')
      .select('name startingPrice currentPrice status startDate endDate isDraft category city country images');

    res.json(products);
  } catch (error) {
    console.error('Error fetching draft products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add this new controller function
// const searchProducts = asyncHandler(async (req, res) => {
//   try {
//     const { term, category, location } = req.query;

//     // Build the search query
//     const query = {
//       status: 'active',
//       isDraft: false
//     };

//     // Add text search
//     if (term) {
//       query.$or = [
//         { name: { $regex: term, $options: 'i' } },
//         { description: { $regex: term, $options: 'i' } }
//       ];
//     }

//     // Add category filter
//     if (category) {
//       query.category = category;
//     }

//     // Add location search (city or country)
//     if (location) {
//       query.$or = [
//         ...(query.$or || []),
//         { city: { $regex: location, $options: 'i' } },
//         { country: { $regex: location, $options: 'i' } }
//       ];
//     }

//     const products = await Product.find(query)
//       .select('name startingPrice currentPrice category city country images startDate endDate')
//       .sort('-createdAt');

//     res.json(products);
//   } catch (error) {
//     console.error('Search error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// productController.js
// const searchProducts = asyncHandler(async (req, res) => {
//   try {
//     const { term, category, location } = req.query;
    
//     // Build the search query
//     const query = { 
//       status: 'active',
//       isDraft: false 
//     };

//     // Text search condition
//     if (term) {
//       query.$or = [
//         { name: { $regex: term, $options: 'i' } },
//         { description: { $regex: term, $options: 'i' } }
//       ];
//     }

//     // Category filter
//     if (category) {
//       query.category = category;
//     }

//     // Location search (city or country)
//     if (location) {
//       query.$or = [
//         ...(query.$or || []), // Keep existing OR conditions
//         { city: { $regex: location, $options: 'i' } },
//         { country: { $regex: location, $options: 'i' } }
//       ];
//     }

//     const products = await Product.find(query)
//       .select('name startingPrice currentPrice category city country images startDate endDate')
//       .sort('-createdAt');

//     res.json(products);
//   } catch (error) {
//     console.error('Search error:', error);
//     res.status(500).json({ 
//       message: 'Server error',
//       error: error.message // Include error message in response
//     });
//   }
// });


//updated by sania
// const searchProducts = asyncHandler(async (req, res) => {
//   try {
//     const { term, category, location } = req.query;
    
//     // Build the search query
//     const query = { 
//       status: 'active',
//       isDraft: false 
//     };

//     // Create separate arrays for conditions
//     const conditions = [];
    
//     // Text search condition
//     if (term) {
//       conditions.push({
//         $or: [
//           { name: { $regex: term, $options: 'i' } },
//           { description: { $regex: term, $options: 'i' } }
//         ]
//       });
//     }

//     // Location search condition
//     if (location) {
//       conditions.push({
//         $or: [
//           { city: { $regex: location, $options: 'i' } },
//           { country: { $regex: location, $options: 'i' } }
//         ]
//       });
//     }

//     // Category filter
//     if (category) {
//       conditions.push({ category });
//     }

//     // Combine all conditions
//     if (conditions.length > 0) {
//       query.$and = conditions;
//     }

//     const products = await Product.find(query)
//       .select('name startingPrice currentPrice category city country images startDate endDate')
//       .sort('-createdAt');

//     res.json(products);
//   } catch (error) {
//     console.error('Search error:', error);
//     res.status(500).json({ 
//       message: 'Server error',
//       error: error.message
//     });
//   }
// });


const searchProducts = asyncHandler(async (req, res) => {
  try {
    const { term, category, location } = req.query;
    
    // Build base query
    const query = { 
      status: 'active',
      isDraft: false 
    };

    // Text search condition (name OR description)
    if (term) {
      query.$or = [
        { name: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } }
      ];
    }

    // Location search condition (city OR country)
    if (location) {
      query.$or = [
        ...(query.$or || []),
        { city: { $regex: location, $options: 'i' } },
        { country: { $regex: location, $options: 'i' } }
      ];
    }

    // Case-insensitive category matching
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    const products = await Product.find(query)
      .select('name startingPrice currentPrice category city country images startDate endDate')
      .sort('-createdAt');

    res.json(products);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = {
  createProduct,
  getUserProducts,
  getActiveProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  getSimilarProducts,
  getDraftProducts,
  getAllProducts,
  getProductDetailById,
  updateProductStatus,
  deleteProductForAdmin,
  searchProducts
};