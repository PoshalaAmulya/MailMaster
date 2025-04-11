const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const Subscriber = require('../models/Subscriber');
const Campaign = require('../models/Campaign');

// Load environment variables
dotenv.config();

// MongoDB connection string
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zithara_email_marketing';

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
    // host: "gmial",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
        user: "amulyaposhala1@gmail.com",
        pass: "gzprjudmcgpaxaaa"
    }
});

// Verify transporter configuration before proceeding
async function verifyTransporter() {
    try {
        await transporter.verify();
        console.log('SMTP connection verified successfully');
        return true;
    } catch (error) {
        console.error('SMTP Verification Error:', error.message);
        return false;
    }
}

// Send campaign emails to active subscribers
async function sendCampaignEmails(campaignId) {
    try {
        // Connect to MongoDB
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected Successfully');

        // Get campaign data
        console.log('Searching for campaign with ID:', campaignId);
        const campaign = await Campaign.findById(campaignId);
        console.log('Campaign search result:', campaign);
        if (!campaign) {
            console.error('Campaign not found');
            return;
        }

        // Find all active subscribers
        const activeSubscribers = await Subscriber.find({ status: 'active' })
            .select('email firstName lastName -_id');

        console.log(`\nFound ${activeSubscribers.length} active subscribers`);
        
        if (activeSubscribers.length === 0) {
            console.log('No active subscribers found.');
            await mongoose.connection.close();
            return;
        }

        let successCount = 0;
        let failureCount = 0;

        // Send emails to each subscriber
        for (const subscriber of activeSubscribers) {
            try {
                const personalizedName = [subscriber.firstName, subscriber.lastName]
                    .filter(Boolean)
                    .join(' ') || 'Subscriber';

                // Replace placeholders in content
                let personalizedContent = campaign.content;
                personalizedContent = personalizedContent.replace(/\{\{firstName\}\}/g, subscriber.firstName || 'there');
                personalizedContent = personalizedContent.replace(/\{\{lastName\}\}/g, subscriber.lastName || '');
                personalizedContent = personalizedContent.replace(/\{\{email\}\}/g, subscriber.email);

                // Add unsubscribe link
                const unsubscribeLink = `${process.env.BACKEND_URL}/api/subscribers/unsubscribe?email=${subscriber.email}`;
                personalizedContent += `
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="font-size: 12px; color: #666;">
                            If you no longer wish to receive these emails, you can <a href="${unsubscribeLink}">unsubscribe here</a>.
                        </p>
                    </div>
                `;

                const mailOptions = {
                    from: {
                        name: 'Zithara Team',
                        address: process.env.EMAIL_USER
                    },
                    to: subscriber.email,
                    subject: campaign.subject,
                    html: personalizedContent
                };

                await transporter.sendMail(mailOptions);
                console.log(`✓ Email sent successfully to ${subscriber.email}`);
                successCount++;
                
                // Add a small delay between emails to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
                
            } catch (error) {
                console.error(`✗ Failed to send email to ${subscriber.email}:`, error.message);
                failureCount++;
            }
        }

        console.log('\nEmail sending process completed!');
        console.log(`Successfully sent: ${successCount}`);
        console.log(`Failed to send: ${failureCount}`);

        // Update campaign analytics
        campaign.analytics = {
            ...campaign.analytics,
            sent: (campaign.analytics?.sent || 0) + successCount,
            failed: (campaign.analytics?.failed || 0) + failureCount,
            lastSent: new Date()
        };
        await campaign.save();
        
    } catch (error) {
        console.error('Error in sending campaign emails:', error.message);
    } finally {
        await mongoose.connection.close();
    }
}

// Check if campaign ID is provided as command line argument
const campaignId = process.argv[2];
if (!campaignId) {
    console.error('Please provide a campaign ID as a command line argument');
    process.exit(1);
}

// Start the process
async function start() {
    try {
        // Verify SMTP connection first
        const isSmtpValid = await verifyTransporter();
        if (!isSmtpValid) {
            console.error('Failed to establish SMTP connection. Please check your email credentials.');
            process.exit(1);
        }

        await sendCampaignEmails(campaignId);
        process.exit(0);
    } catch (error) {
        console.error('Startup Error:', error.message);
        process.exit(1);
    }
}

start(); 