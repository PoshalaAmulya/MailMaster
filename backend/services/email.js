const nodemailer = require('nodemailer');

// Create a transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Send email to a single recipient
 * @param {Object} options - Email options
 * @param {String} options.to - Recipient email
 * @param {String} options.subject - Email subject
 * @param {String} options.html - Email content (HTML)
 * @param {String} options.text - Email content (Plain text fallback)
 * @param {String} options.from - Sender email (optional, defaults to EMAIL_USER)
 * @param {Object} options.subscriber - Subscriber data for tracking
 * @param {Object} options.campaign - Campaign data for tracking
 * @returns {Promise} - Nodemailer response
 */
exports.sendEmail = async (options) => {
  try {
    const { to, subject, html, text, from, subscriber, campaign } = options;

    // Generate tracking pixel for open tracking
    const trackingPixel = subscriber && campaign 
      ? `<img src="${process.env.BACKEND_URL}/api/tracking/open?cid=${campaign._id}&sid=${subscriber._id}" width="1" height="1" />` 
      : '';

    // Add tracking pixel to email content if subscriber and campaign are provided
    const htmlContent = subscriber && campaign 
      ? `${html}${trackingPixel}` 
      : html;

    // Send email
    const message = {
      from: from || process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
      text
    };

    const info = await transporter.sendMail(message);
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

/**
 * Convert regular URLs in HTML content to trackable URLs
 * @param {String} html - Original HTML content
 * @param {Object} campaign - Campaign data
 * @param {Object} subscriber - Subscriber data
 * @returns {String} - HTML with trackable links
 */
exports.makeLinksTrackable = (html, campaign, subscriber) => {
  if (!campaign || !subscriber || !html) {
    return html;
  }

  // Regular expression to find links in HTML
  const linkRegex = /<a\s+(?:[^>]*?\s+)?href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi;

  // Replace each link with a tracking link
  return html.replace(linkRegex, (match, url, text) => {
    // Skip if URL is already a tracking link
    if (url.includes('/api/tracking/click')) {
      return match;
    }

    // Skip mailto: links
    if (url.startsWith('mailto:')) {
      return match;
    }

    // Create tracking URL
    const trackingUrl = `${process.env.BACKEND_URL}/api/tracking/click?cid=${campaign._id}&sid=${subscriber._id}&url=${encodeURIComponent(url)}`;

    // Replace the original URL with the tracking URL
    return match.replace(url, trackingUrl);
  });
};

/**
 * Send a campaign to multiple subscribers (batch processing)
 * @param {Object} campaign - Campaign data
 * @param {Array} subscribers - Array of subscriber objects
 * @param {Number} batchSize - Number of emails to send in each batch
 * @returns {Object} - Results of the send operation
 */
exports.sendCampaignEmails = async (campaign, subscribers, batchSize = 50) => {
  const results = {
    sent: 0,
    failed: 0,
    errors: []
  };

  // Process subscribers in batches to avoid overloading email service
  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize);
    
    // Process each subscriber in the current batch
    const batchPromises = batch.map(async (subscriber) => {
      try {
        // Replace placeholders in content with subscriber data
        let personalizedHtml = campaign.content;
        let personalizedSubject = campaign.subject;
        
        // Replace first name
        if (subscriber.firstName) {
          personalizedHtml = personalizedHtml.replace(/\{\{firstName\}\}/g, subscriber.firstName);
          personalizedSubject = personalizedSubject.replace(/\{\{firstName\}\}/g, subscriber.firstName);
        } else {
          personalizedHtml = personalizedHtml.replace(/\{\{firstName\}\}/g, 'there');
          personalizedSubject = personalizedSubject.replace(/\{\{firstName\}\}/g, 'there');
        }
        
        // Replace last name
        if (subscriber.lastName) {
          personalizedHtml = personalizedHtml.replace(/\{\{lastName\}\}/g, subscriber.lastName);
          personalizedSubject = personalizedSubject.replace(/\{\{lastName\}\}/g, subscriber.lastName);
        } else {
          personalizedHtml = personalizedHtml.replace(/\{\{lastName\}\}/g, '');
          personalizedSubject = personalizedSubject.replace(/\{\{lastName\}\}/g, '');
        }
        
        // Replace email
        personalizedHtml = personalizedHtml.replace(/\{\{email\}\}/g, subscriber.email);
        personalizedSubject = personalizedSubject.replace(/\{\{email\}\}/g, subscriber.email);
        
        // Replace custom fields
        if (subscriber.customFields) {
          Object.keys(subscriber.customFields).forEach(key => {
            const placeholder = `{{${key}}}`;
            const value = subscriber.customFields[key] || '';
            personalizedHtml = personalizedHtml.replace(new RegExp(placeholder, 'g'), value);
            personalizedSubject = personalizedSubject.replace(new RegExp(placeholder, 'g'), value);
          });
        }
        
        // Make links trackable
        personalizedHtml = exports.makeLinksTrackable(personalizedHtml, campaign, subscriber);
        
        // Add unsubscribe link
        const unsubscribeLink = `${process.env.BACKEND_URL}/api/subscribers/unsubscribe?email=${subscriber.email}&token=${subscriber._id}`;
        personalizedHtml += `<p style="font-size: 12px; color: #666; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px;">
          If you no longer wish to receive these emails, you can <a href="${unsubscribeLink}">unsubscribe here</a>.
        </p>`;
        
        // Send the personalized email
        await exports.sendEmail({
          to: subscriber.email,
          subject: personalizedSubject,
          html: personalizedHtml,
          text: personalizedHtml.replace(/<[^>]*>/g, ''), // Simple HTML to text conversion
          subscriber,
          campaign
        });
        
        results.sent++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Failed to send to ${subscriber.email}: ${error.message}`);
      }
    });
    
    // Wait for all emails in the current batch to be processed
    await Promise.all(batchPromises);
    
    // Add a small delay between batches to avoid rate limiting
    if (i + batchSize < subscribers.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
};

// Verify email configuration on startup
exports.verifyConfiguration = async () => {
  try {
    await transporter.verify();
    console.log('Email service is ready to send messages');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
}; 
 
 
 