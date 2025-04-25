// // const cron = require('node-cron');
// // const Product = require('./models/productModel');

// // // Schedule a cron job to run every hour
// // cron.schedule('0 * * * *', async () => {
// //   try {
// //     console.log('[CRON] Running job to update product statuses');

// //     const now = new Date();

// //     // Update products whose endDate has passed
// //     const updateResult = await Product.updateMany(
// //       { endDate: { $lt: now }, status: 'active' },
// //       { $set: { status: 'ended' } }
// //     );

// //     console.log(`[CRON] Updated ${updateResult.nModified} products to "ended"`);
// //   } catch (error) {
// //     console.error('[CRON] Error updating product statuses:', error);
// //   }
// // });

// // console.log('[CRON] Scheduled job to update product statuses');
// const cron = require('node-cron');
// const Product = require('../models/productModel');
// const Alert = require('../models/alertModel');

// // Schedule a cron job to run every hour
// cron.schedule('0 * * * *', async () => {
//   try {
//     console.log('[CRON] Running job to update product statuses and notify sellers');

//     const now = new Date();

//     // Find products whose endDate has passed and are still active
//     const productsToUpdate = await Product.find({
//       endDate: { $lt: now },
//       status: 'active',
//     });

//     // Update the status of these products to 'ended'
//     const productIds = productsToUpdate.map(product => product._id);
//     const updateResult = await Product.updateMany(
//       { _id: { $in: productIds } },
//       { $set: { status: 'ended' } }
//     );

//     console.log(`[CRON] Updated ${updateResult.nModified} products to "ended"`);

//     // Create alerts for the sellers of these products
//     const alerts = productsToUpdate.map(product => ({
//       seller: product.sellerId, // Assuming `sellerId` is the field for the seller
//       product: product._id,
//       productName: product.name,
//       action: 'ended', // Custom action for ended products
//       createdAt: new Date(),
//     }));

//     if (alerts.length > 0) {
//       await Alert.insertMany(alerts);
//       console.log(`[CRON] Created ${alerts.length} alerts for sellers`);
//     }
//   } catch (error) {
//     console.error('[CRON] Error updating product statuses or notifying sellers:', error);
//   }
// });

// console.log('[CRON] Scheduled job to update product statuses and notify sellers');
const cron = require('node-cron');
const Product = require('../models/productModel');
const User = require('../models/User');
const Alert = require('../models/alertModel');

// Schedule a cron job to run every hour
cron.schedule('0 * * * *', async () => {
  try {
    console.log('[CRON] Running job to update product statuses and notify sellers');

    const now = new Date();
    const utcNow = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    );

    // Find products whose endDate has passed and are still active
    const productsToUpdate = await Product.find({
      endDate: { $lt: new Date(utcNow) },
      status: 'active',
      isDraft: false
    });

    // Update the status of these products to 'ended'
    const productIds = productsToUpdate.map(product => product._id);
    const updateResult = await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: { status: 'ended' } }
    );

    console.log(`[CRON] Updated ${updateResult.nModified} products to "ended"`);

    // Create alerts for the sellers of these products
    const alerts = productsToUpdate.map(product => ({
      seller: product.user,
      product: product._id,
      productName: product.name,
      action: 'ended',
      createdAt: new Date(),
    }));

    if (alerts.length > 0) {
      await Alert.insertMany(alerts);
      console.log(`[CRON] Created ${alerts.length} alerts for sellers`);
    }

    // Update the ended bids count for each seller
    const sellerUpdates = {};
    productsToUpdate.forEach(product => {
      if (!sellerUpdates[product.user]) {
        sellerUpdates[product.user] = 0;
      }
      sellerUpdates[product.user]++;
    });

    for (const [sellerId, count] of Object.entries(sellerUpdates)) {
      await User.findByIdAndUpdate(sellerId, { 
        $inc: { 
          endedBids: count,
          activeBids: -count 
        } 
      });
    }

    console.log('[CRON] Updated ended bids count for sellers');
  } catch (error) {
    console.error('[CRON] Error updating product statuses or notifying sellers:', error);
  }
});

console.log('[CRON] Scheduled job to update product statuses and notify sellers');