const express = require('express');
const router = express.Router();
const { trackOpen, trackClick } = require('../controllers/tracking');

// These routes are public (no authentication required)
router.get('/open', trackOpen);
router.get('/click', trackClick);

module.exports = router; 