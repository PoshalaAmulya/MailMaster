const express = require('express');
const router = express.Router();
const {
  getSubscribers,
  getSubscriber,
  createSubscriber,
  updateSubscriber,
  deleteSubscriber,
  importSubscribers,
  unsubscribe,
  getActiveSubscribers
} = require('../controllers/subscribers');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/unsubscribe', unsubscribe);

// Protected routes
router.get('/active', protect, getActiveSubscribers);

router.route('/')
  .get(protect, getSubscribers)
  .post(protect, createSubscriber);

router.route('/:id')
  .get(protect, getSubscriber)
  .put(protect, updateSubscriber)
  .delete(protect, deleteSubscriber);

router.route('/import')
  .post(protect, importSubscribers);

module.exports = router; 
 
 