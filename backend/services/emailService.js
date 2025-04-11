const nodemailer = require('nodemailer');
const Campaign = require('../models/Campaign');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendEmail(to, subject, html, campaignId = null) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html
      };

      const result = await this.transporter.sendMail(mailOptions);

      if (campaignId) {
        await Campaign.findByIdAndUpdate(
          campaignId,
          { $inc: { 'stats.sent': 1 } }
        );
      }

      return result;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendCampaign(campaign) {
    try {
      const promises = campaign.recipients.map(recipient => 
        this.sendEmail(
          recipient.email,
          campaign.subject,
          campaign.content,
          campaign._id
        )
      );

      await Promise.all(promises);
      
      await Campaign.findByIdAndUpdate(
        campaign._id,
        { status: 'completed' }
      );

      return true;
    } catch (error) {
      console.error('Campaign sending failed:', error);
      await Campaign.findByIdAndUpdate(
        campaign._id,
        { status: 'failed' }
      );
      throw error;
    }
  }
}

module.exports = new EmailService(); 