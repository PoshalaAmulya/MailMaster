const Campaign = require('../models/Campaign');
const Subscriber = require('../models/Subscriber');
const emailService = require('../services/email');
const { spawn } = require('child_process');
const path = require('path');

// @desc    Get all campaigns
// @route   GET /api/campaigns
// @access  Private
exports.getCampaigns = async (req, res) => {
  try {
    // Filter by user
    console.log('getCampaigns called');
    const campaigns = await Campaign.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: campaigns.length,
      data: campaigns
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get single campaign
// @route   GET /api/campaigns/:id
// @access  Private
exports.getCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Make sure user owns campaign
    if (campaign.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this campaign'
      });
    }

    res.status(200).json({
      success: true,
      data: campaign
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Create new campaign
// @route   POST /api/campaigns
// @access  Private
exports.createCampaign = async (req, res) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;

    // Remove schedule field for non-recurring campaigns
    if (req.body.type !== 'Recurring') {
      delete req.body.schedule;
    }

    const campaign = await Campaign.create(req.body);

    res.status(201).json({
      success: true,
      data: campaign
    });
  } catch (error) {
    console.error('Campaign creation error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Server Error'
      });
    }
  }
};

// @desc    Update campaign
// @route   PUT /api/campaigns/:id
// @access  Private
exports.updateCampaign = async (req, res) => {
  try {
    let campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Make sure user owns campaign
    if (campaign.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this campaign'
      });
    }

    campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: campaign
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Server Error'
      });
    }
  }
};

// @desc    Delete campaign
// @route   DELETE /api/campaigns/:id
// @access  Private
exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Make sure user owns campaign
    if (campaign.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this campaign'
      });
    }

    await campaign.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Send campaign to subscribers
// @route   POST /api/campaigns/:id/send
// @access  Private
exports.sendCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Make sure user owns campaign
    if (campaign.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to send this campaign'
      });
    }

    // Spawn the script as a child process
    const scriptPath = path.join(__dirname, '..', 'scripts', 'sendCampaignEmails.js');
    const child = spawn('node', [scriptPath, campaign._id.toString()], {
      detached: true,
      stdio: 'ignore'
    });

    // Unref the child to allow the parent process to exit independently
    child.unref();

    res.status(200).json({
      success: true,
      message: 'Campaign sending process started',
      data: { campaignId: campaign._id }
    });

  } catch (error) {
    console.error('Error in sendCampaign:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send campaign'
    });
  }
}; 