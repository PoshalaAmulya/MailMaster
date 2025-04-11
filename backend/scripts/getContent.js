const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: '../.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Import the Campaign model
const Campaign = require('../models/Campaign');

const getScheduledCampaignContent = async () => {
    try {
        // Find all campaigns that are scheduled
        const scheduledCampaigns = await Campaign.find({ 
            status: 'scheduled'
        }).select('subject content');

        if (scheduledCampaigns.length === 0) {
            console.log('No scheduled campaigns found.');
            return [];
        }

        // Process each campaign
        const campaignContents = scheduledCampaigns.map(campaign => ({
            subject: campaign.subject,
            content: campaign.content
        }));

        console.log(`Found ${campaignContents.length} scheduled campaigns:\n`);
        campaignContents.forEach((campaign, index) => {
            console.log(`Campaign ${index + 1}:`);
            console.log(`Subject: ${campaign.subject}`);
            console.log(`Content: ${campaign.content}`);
            console.log('-------------------\n');
        });

        return campaignContents;
    } catch (error) {
        console.error('Error fetching campaign contents:', error);
        throw error;
    } finally {
        // Close the MongoDB connection
        await mongoose.connection.close();
    }
};

const processEmailContent = async (contentData) => {
    try {
        const { subject, content } = contentData;

        // Process subject line - replace any template variables
        const processedSubject = subject.replace(/\{\{([^}]+)\}\}/g, (match, variable) => {
            // Add any subject line template processing logic here
            return match; // For now, return as is
        });

        // Process email content - replace any template variables and add common elements
        let processedContent = content.replace(/\{\{([^}]+)\}\}/g, (match, variable) => {
            // Add any content template processing logic here
            return match; // For now, return as is
        });

        // Add common elements like header, footer, unsubscribe link
        processedContent = `
            <div style="font-family: Arial, sans-serif;">
                <!-- Email Header -->
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                    <img src="{{logoUrl}}" alt="Company Logo" style="max-height: 50px;" />
                </div>

                <!-- Email Content -->
                <div style="padding: 20px;">
                    ${processedContent}
                </div>

                <!-- Email Footer -->
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d;">
                    <p>This email was sent to {{recipientEmail}}.</p>
                    <p>If you no longer wish to receive these emails, you can <a href="{{unsubscribeUrl}}">unsubscribe here</a>.</p>
                </div>
            </div>
        `;

        return {
            subject: processedSubject,
            content: processedContent
        };
    } catch (error) {
        console.error('Error processing email content:', error);
        throw error;
    }
};

// Execute the function if this script is run directly
if (require.main === module) {
    getScheduledCampaignContent()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = { getScheduledCampaignContent, processEmailContent }; 