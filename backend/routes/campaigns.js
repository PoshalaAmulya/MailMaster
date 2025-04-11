const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { spawn } = require('child_process');
const path = require('path');

// Import campaign controllers
const {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  sendCampaign
} = require('../controllers/campaigns');

// Execute script route
router.post('/execute-script', protect, async (req, res) => {
  try {
    const { campaignId } = req.body;
    console.log('Executing script for campaign:', campaignId);

    // Path to the scripts directory
    const scriptPath = path.join(__dirname, '..', 'scripts', 'sendCampaignEmails.js');
    
    // Spawn the script process
    const scriptProcess = spawn('node', [scriptPath, campaignId], {
      stdio: ['ignore', 'pipe', 'pipe']
    });

    // Log script output
    scriptProcess.stdout.on('data', (data) => {
      console.log(`Script output: ${data}`);
    });

    scriptProcess.stderr.on('data', (data) => {
      console.error(`Script error: ${data}`);
    });

    // Send immediate response
    res.json({
      success: true,
      message: 'Script execution started',
      campaignId
    });
  } catch (error) {
    console.error('Script execution error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to execute script',
      error: error.message
    });
  }
});

// Campaign routes
router.route('/')
  .get(protect, getCampaigns)
  .post(protect, createCampaign);

router.route('/:id')
  .get(protect, getCampaign)
  .put(protect, updateCampaign)
  .delete(protect, deleteCampaign);

router.post('/:id/send', protect, sendCampaign);

module.exports = router; 