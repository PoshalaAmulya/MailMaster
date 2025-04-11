const mongoose = require('mongoose');

const SubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'unsubscribed', 'bounced', 'complained'],
    default: 'active'
  },
  source: {
    type: String,
    default: 'manual'
  },
  tags: {
    type: [String],
    default: []
  },
  customFields: {
    type: Object,
    default: {}
  },
  subscriptionDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  engagementScore: {
    type: Number,
    default: 0
  },
  campaignActivity: [{
    campaign: {
      type: mongoose.Schema.ObjectId,
      ref: 'Campaign'
    },
    action: {
      type: String,
      enum: ['sent', 'opened', 'clicked', 'bounced', 'complained', 'unsubscribed']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: {
      type: Object,
      default: {}
    }
  }],
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

// Index for faster queries
SubscriberSchema.index({ email: 1, createdBy: 1 });
SubscriberSchema.index({ tags: 1 });
SubscriberSchema.index({ status: 1 });

// Update the lastUpdated field before save
SubscriberSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model('Subscriber', SubscriberSchema);
