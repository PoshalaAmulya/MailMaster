const mongoose = require('mongoose');

const RecurringScheduleSchema = new mongoose.Schema({
  date: Date,
  recurring: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'custom']
  },
  cronExpression: String
}, { _id: false });

const CampaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a campaign name'],
    trim: true,
    maxlength: [100, 'Campaign name cannot be more than 100 characters']
  },
  subject: {
    type: String,
    required: [true, 'Please add an email subject'],
    trim: true,
    maxlength: [200, 'Subject cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Please add email content']
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'active', 'paused', 'completed', 'failed'],
    default: 'draft'
  },
  type: {
    type: String,
    enum: ['One-time', 'Recurring', 'Automated'],
    default: 'One-time'
  },
  schedule: {
    type: RecurringScheduleSchema,
    validate: {
      validator: function(v) {
        // Only validate schedule if campaign type is Recurring
        if (this.type === 'Recurring') {
          return v && v.recurring;
        }
        // For non-recurring campaigns, schedule can be anything (or missing)
        return true;
      },
      message: 'Schedule is required for recurring campaigns'
    }
  },
  analytics: {
    sent: {
      type: Number,
      default: 0
    },
    delivered: {
      type: Number,
      default: 0
    },
    opened: {
      type: Number,
      default: 0
    },
    clicked: {
      type: Number,
      default: 0
    },
    bounced: {
      type: Number,
      default: 0
    },
    complaints: {
      type: Number,
      default: 0
    },
    unsubscribed: {
      type: Number,
      default: 0
    }
  },
  segmentationCriteria: {
    type: Object,
    default: {}
  },
  lastSent: {
    type: Date,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to handle schedule for non-recurring campaigns
CampaignSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Remove schedule completely for non-recurring campaigns
  if (this.type !== 'Recurring') {
    this.schedule = undefined;
  }
  
  next();
});

module.exports = mongoose.model('Campaign', CampaignSchema);
