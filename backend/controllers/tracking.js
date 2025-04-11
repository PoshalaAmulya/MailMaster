const Campaign = require('../models/Campaign');
const Subscriber = require('../models/Subscriber');

// @desc    Track email opens
// @route   GET /api/tracking/open
// @access  Public
exports.trackOpen = async (req, res) => {
  try {
    const { cid, sid } = req.query;

    if (!cid || !sid) {
      // Return a 1x1 transparent pixel even if tracking failed
      return res.status(200)
        .set('Content-Type', 'image/gif')
        .set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
        .set('Pragma', 'no-cache')
        .set('Expires', '0')
        .send(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'));
    }

    // Find campaign and subscriber
    const campaign = await Campaign.findById(cid);
    const subscriber = await Subscriber.findById(sid);

    if (campaign && subscriber) {
      // Update campaign analytics
      campaign.analytics.opened += 1;
      await campaign.save();

      // Check if subscriber already has this open recorded
      const hasOpenActivity = subscriber.campaignActivity.some(
        activity => activity.campaign.toString() === cid && activity.action === 'opened'
      );

      if (!hasOpenActivity) {
        // Record open in subscriber's campaign activity
        subscriber.campaignActivity.push({
          campaign: cid,
          action: 'opened',
          timestamp: Date.now()
        });
        await subscriber.save();
      }
    }

    // Return a 1x1 transparent pixel
    res.status(200)
      .set('Content-Type', 'image/gif')
      .set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      .set('Pragma', 'no-cache')
      .set('Expires', '0')
      .send(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'));
  } catch (error) {
    console.error('Tracking error:', error);
    
    // Return a 1x1 transparent pixel even if tracking failed
    res.status(200)
      .set('Content-Type', 'image/gif')
      .set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      .set('Pragma', 'no-cache')
      .set('Expires', '0')
      .send(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'));
  }
};

// @desc    Track email link clicks
// @route   GET /api/tracking/click
// @access  Public
exports.trackClick = async (req, res) => {
  try {
    const { cid, sid, url } = req.query;

    if (!cid || !sid || !url) {
      return res.status(400).json({
        success: false,
        message: 'Missing required tracking parameters'
      });
    }

    // Find campaign and subscriber
    const campaign = await Campaign.findById(cid);
    const subscriber = await Subscriber.findById(sid);

    if (campaign && subscriber) {
      // Update campaign analytics
      campaign.analytics.clicked += 1;
      await campaign.save();

      // Record click in subscriber's campaign activity
      subscriber.campaignActivity.push({
        campaign: cid,
        action: 'clicked',
        timestamp: Date.now(),
        metadata: { url }
      });
      await subscriber.save();
    }

    // Redirect to the original URL
    res.redirect(url);
  } catch (error) {
    console.error('Click tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Tracking error'
    });
  }
}; 