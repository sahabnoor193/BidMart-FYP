// const express = require('express');
// const router = express.Router();
// const { protect } = require('../middleware/authMiddleware');
// const { getAlerts, markAlertAsRead, createAlert, deleteAlert } = require('../controllers/alertController');

// router.use(protect); // All routes require authentication

// router.get('/', getAlerts);
// router.put('/:alertId/read', markAlertAsRead);
// router.delete('/:alertId', deleteAlert);
// router.post('/', createAlert);

// module.exports = router; 
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  getAlerts, 
  markAlertAsRead, 
  deleteAlert, 
  createAlert 
} = require('../controllers/alertController');

router.use(protect);

// Generic alert routes
router.get('/', getAlerts);
router.put('/:alertId/read', markAlertAsRead);
router.delete('/:alertId', deleteAlert);
router.post('/', createAlert);

module.exports = router;