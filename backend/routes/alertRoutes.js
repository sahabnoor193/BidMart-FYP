const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAlerts, markAlertAsRead, createAlert, deleteAlert } = require('../controllers/alertController');

router.use(protect); // All routes require authentication

router.get('/', getAlerts);
router.put('/:alertId/read', markAlertAsRead);
router.delete('/:alertId', deleteAlert);
router.post('/', createAlert);

module.exports = router; 