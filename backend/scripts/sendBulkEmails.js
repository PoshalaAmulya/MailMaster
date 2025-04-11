const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const Subscriber = require('../models/Subscriber');

// Use MongoDB connection string from environment variables
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    console.error('MongoDB URI is not defined in environment variables');
    process.exit(1);
}

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB Connected...');
    sendBulkEmails();
})
.catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
});

async function sendBulkEmails() {
    try {
        // Find all active subscribers
        const activeSubscribers = await Subscriber.find({ status: 'active' })
            .select('email firstName lastName');

        console.log(`Found ${activeSubscribers.length} active subscribers`);

        // Email content
        const emailSubject = 'Test Bulk Email';
        const emailTemplate = (firstName) => `
            <h2>Hello ${firstName || 'Valued Subscriber'}!</h2>
            <p>This is a test bulk email from your Zithara Email Marketing Platform.</p>
            <p>Thank you for being a subscriber!</p>
        `;

        // Send emails to each subscriber
        for (const subscriber of activeSubscribers) {
            try {
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: subscriber.email,
                    subject: emailSubject,
                    html: emailTemplate(subscriber.firstName)
                });
                console.log(`✓ Email sent successfully to ${subscriber.email}`);
            } catch (error) {
                console.error(`✗ Error sending email to ${subscriber.email}:`, error.message);
            }
        }

        console.log('\nBulk email sending completed!');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error in sendBulkEmails:', error);
        mongoose.connection.close();
    }
} 