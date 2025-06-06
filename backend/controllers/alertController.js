const asyncHandler = require('express-async-handler');
const Alert = require('../models/alertModel');
console.log('[Alert Model] Is Model:', Alert.modelName === 'Alert'); 
// // @desc    Get seller's alerts
// // @route   GET /api/seller/alerts
// // @access  Private
// const getAlerts = asyncHandler(async (req, res) => {
//   try {
//     const alerts = await Alert.find({ seller: req.user._id })
//       .sort('-createdAt')
//       .limit(50); // Limit to last 50 alerts

//     res.json(alerts);
//   } catch (error) {
//     console.error('Error fetching alerts:', error);
//     res.status(500).json({ message: error.message });
//   }
// });

// // @desc    Mark alert as read
// // @route   PUT /api/seller/alerts/:alertId/read
// // @access  Private
// const markAlertAsRead = asyncHandler(async (req, res) => {
//   try {
//     const alert = await Alert.findOneAndUpdate(
//       { _id: req.params.alertId, seller: req.user._id },
//       { read: true },
//       { new: true }
//     );

//     if (!alert) {
//       res.status(404);
//       throw new Error('Alert not found');
//     }

//     res.json(alert);
//   } catch (error) {
//     console.error('Error marking alert as read:', error);
//     res.status(500).json({ message: error.message });
//   }
// });

// // @desc    Create a new alert
// // @route   POST /api/seller/alerts
// // @access  Private
// const createAlert = asyncHandler(async (req, res) => {
//   try {
//     const { productId, productName, action } = req.body;

//     const alert = await Alert.create({
//       seller: req.user._id,
//       product: productId,
//       productName,
//       action
//     });

//     res.status(201).json(alert);
//   } catch (error) {
//     console.error('Error creating alert:', error);
//     res.status(500).json({ message: error.message });
//   }
// });

// // @desc    Delete an alert
// // @route   DELETE /api/seller/alerts/:alertId
// // @access  Private
// const deleteAlert = asyncHandler(async (req, res) => {
//   try {
//     const alert = await Alert.findOneAndDelete({
//       _id: req.params.alertId,
//       seller: req.user._id
//     });

//     if (!alert) {
//       res.status(404);
//       throw new Error('Alert not found');
//     }

//     res.json({ message: 'Alert deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting alert:', error);
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = {
//   getAlerts,
//   markAlertAsRead,
//   createAlert,
//   deleteAlert
// }; 

// Generic alert controller methods
const getAlerts = asyncHandler(async (req, res) => {
  try {
    const alerts = await Alert.find({ 
      user: req.user._id,
      userType: req.user.type // Changed to match User model's field name
    }).sort('-createdAt').limit(50);

    res.json(alerts);
  } catch (error) {
    console.error('Alert fetch error:', error);
    res.status(500).json({ message: error.message });
  }
});
const createAlertAndEmit = async ({ user, userType, product, productName, action }, io) => {
  try {
    const alert = await Alert.create({
      user,
      userType,
      product,
      productName,
      action
    });
   console.log('Created alert:', alert);
   
    io.to(`user_${user.toString()}`).emit('newAlert', alert);
  } catch (error) {
    console.error('Error creating/emitting alert:', error);
  }
};
const markAlertAsRead = asyncHandler(async (req, res) => {
  try {
    const alert = await Alert.findOneAndUpdate(
      { _id: req.params.alertId, user: req.user._id },
      { read: true },
      { new: true }
    );
    if (!alert) throw new Error('Alert not found');
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const deleteAlert = asyncHandler(async (req, res) => {
  try {
    const alert = await Alert.findOneAndDelete({
      _id: req.params.alertId,
      user: req.user._id
    });
    if (!alert) throw new Error('Alert not found');
    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create alert with user type detection
const createAlert = asyncHandler(async (req, res) => {
  try {
    const { productId, productName, action, userType } = req.body;
    
    const alert = await Alert.create({
      user: req.user._id,
      userType,
      product: productId,
      productName,
      action
    });

    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  getAlerts,
  markAlertAsRead,
  deleteAlert,
  createAlert,
  createAlertAndEmit
};