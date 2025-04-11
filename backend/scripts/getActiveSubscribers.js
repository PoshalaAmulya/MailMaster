const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Subscriber = require('../models/Subscriber');

// Use MongoDB connection string from environment variables
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    console.error('MongoDB URI is not defined in environment variables');
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB Connected...');
    fetchActiveSubscribers();
})
.catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
});

async function fetchActiveSubscribers() {
    try {
        const activeSubscribers = await Subscriber.find({
            status: 'active'
        }).select('email firstName lastName');

        console.log('\nActive Subscribers Email IDs:');
        console.log('----------------------------');
        activeSubscribers.forEach(subscriber => {
            console.log(`${subscriber.email} (${subscriber.firstName} ${subscriber.lastName})`);
        });
        
        console.log(`\nTotal active subscribers: ${activeSubscribers.length}`);
        
        // Close the MongoDB connection
        mongoose.connection.close();
    } catch (error) {
        console.error('Error fetching active subscribers:', error);
        mongoose.connection.close();
    }
}

const getActiveSubscribers = async () => {
    try {
        const activeSubscribers = await Subscriber.find({
            status: 'active'
        }).select('email firstName lastName');

        return activeSubscribers;
    } catch (error) {
        console.error('Error getting active subscribers:', error);
        throw error;
    }
};

module.exports = getActiveSubscribers; 