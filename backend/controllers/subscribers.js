const Subscriber = require('../models/Subscriber');

// @desc    Get all subscribers
// @route   GET /api/subscribers
// @access  Private
exports.getSubscribers = async (req, res) => {
  try {
    // Filter by user and add pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const startIndex = (page - 1) * limit;
    
    // Build query based on filters
    let query = { createdBy: req.user.id };
    
    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // Filter by tags
    if (req.query.tags) {
      const tags = req.query.tags.split(',');
      query.tags = { $in: tags };
    }
    
    // Search by email or name
    if (req.query.search) {
      query.$or = [
        { email: { $regex: req.query.search, $options: 'i' } },
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Count total documents for pagination
    const total = await Subscriber.countDocuments(query);

    // Execute query
    const subscribers = await Subscriber.find(query)
      .skip(startIndex)
      .limit(limit)
      .sort({ subscriptionDate: -1 });

    // Pagination result
    const pagination = {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };

    res.status(200).json({
      success: true,
      count: subscribers.length,
      pagination,
      data: subscribers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get single subscriber
// @route   GET /api/subscribers/:id
// @access  Private
exports.getSubscriber = async (req, res) => {
  try {
    const subscriber = await Subscriber.findById(req.params.id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }

    // Make sure user owns subscriber
    if (subscriber.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this subscriber'
      });
    }

    res.status(200).json({
      success: true,
      data: subscriber
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Create new subscriber
// @route   POST /api/subscribers
// @access  Private
exports.createSubscriber = async (req, res) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;

    // Check if subscriber already exists
    const existingSubscriber = await Subscriber.findOne({
      email: req.body.email,
      createdBy: req.user.id
    });

    if (existingSubscriber) {
      return res.status(400).json({
        success: false,
        message: 'Subscriber with this email already exists'
      });
    }

    const subscriber = await Subscriber.create(req.body);

    res.status(201).json({
      success: true,
      data: subscriber
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

// @desc    Update subscriber
// @route   PUT /api/subscribers/:id
// @access  Private
exports.updateSubscriber = async (req, res) => {
  try {
    let subscriber = await Subscriber.findById(req.params.id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }

    // Make sure user owns subscriber
    if (subscriber.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this subscriber'
      });
    }

    subscriber = await Subscriber.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: subscriber
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

// @desc    Delete subscriber
// @route   DELETE /api/subscribers/:id
// @access  Private
exports.deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await Subscriber.findById(req.params.id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }

    // Make sure user owns subscriber
    if (subscriber.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this subscriber'
      });
    }

    await subscriber.deleteOne();

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

// @desc    Bulk import subscribers
// @route   POST /api/subscribers/import
// @access  Private
exports.importSubscribers = async (req, res) => {
  try {
    // Expecting an array of subscribers in req.body.subscribers
    if (!req.body.subscribers || !Array.isArray(req.body.subscribers)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of subscribers'
      });
    }

    const subscribers = req.body.subscribers;
    const results = {
      imported: 0,
      failed: 0,
      duplicates: 0,
      errors: []
    };

    // Process each subscriber
    for (const sub of subscribers) {
      try {
        // Check for required fields
        if (!sub.email) {
          results.failed++;
          results.errors.push(`Missing email for entry: ${JSON.stringify(sub)}`);
          continue;
        }

        // Check if subscriber already exists
        const existingSubscriber = await Subscriber.findOne({
          email: sub.email,
          createdBy: req.user.id
        });

        if (existingSubscriber) {
          results.duplicates++;
          continue;
        }

        // Create new subscriber
        await Subscriber.create({
          ...sub,
          createdBy: req.user.id,
          source: 'import'
        });

        results.imported++;
      } catch (err) {
        results.failed++;
        results.errors.push(`Error importing ${sub.email}: ${err.message}`);
      }
    }

    res.status(200).json({
      success: true,
      message: `Imported ${results.imported} subscribers. ${results.duplicates} duplicates skipped. ${results.failed} failed.`,
      data: results
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Unsubscribe a subscriber (public route)
// @route   GET /api/subscribers/unsubscribe
// @access  Public
exports.unsubscribe = async (req, res) => {
  try {
    const { email, token } = req.query;

    if (!email || !token) {
      return res.status(400).json({
        success: false,
        message: 'Missing email or token'
      });
    }

    // Find subscriber by email and id
    const subscriber = await Subscriber.findOne({
      email,
      _id: token
    });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }

    // Update status to unsubscribed
    subscriber.status = 'unsubscribed';
    await subscriber.save();

    // Send a simple HTML response
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Unsubscribed</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
          }
          h1 {
            color: #333;
          }
          .card {
            background: #f9f9f9;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <h1>You've been unsubscribed</h1>
        <div class="card">
          <p>You have been successfully unsubscribed from our emails. You will no longer receive messages from us.</p>
          <p>If this was a mistake, please contact us to resubscribe.</p>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
}; 

// @desc    Get active subscribers
// @route   GET /api/subscribers/active
// @access  Private
exports.getActiveSubscribers = async (req, res) => {
  try {
    console.log('Getting active subscribers - Request details:', {
      user: req.user?.id,
      headers: req.headers
    });

    if (!req.user || !req.user.id) {
      console.error('No user found in request');
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const activeSubscribers = await Subscriber.find({
          createdBy: req.user.id,
      status: 'active'
    }).select('email firstName lastName');

    console.log(`Found ${activeSubscribers.length} active subscribers for user ${req.user.id}`);

    res.status(200).json({
      success: true,
      count: activeSubscribers.length,
      data: activeSubscribers
    });
  } catch (error) {
    console.error('Error in getActiveSubscribers:', {
      error: error.message,
      stack: error.stack,
      user: req.user?.id
    });
    
    // Send a more detailed error response
    res.status(500).json({
      success: false,
      message: 'Error fetching active subscribers',
      error: error.message
    });
  }
}; 
 
 