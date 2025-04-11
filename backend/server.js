// 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  };
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));
// Enable CORS
// app.use(cors({
//   origin: process.env.NODE_ENV === 'production' 
//     ? process.env.FRONTEND_URL 
//     : 'http://localhost:3000',
//   credentials: true
// }));

// Body parser
app.use(express.json());

// Detailed request logging middleware
app.use((req, res, next) => {
    console.log('--------------------');
    console.log('Request details:');
    console.log(`Method: ${req.method}`);
    console.log(`Path: ${req.path}`);
    console.log(`Headers:`, req.headers);
    console.log('--------------------');
    next();
});

// Check for required environment variables
if (!process.env.JWT_SECRET) {
    console.error('ERROR: JWT_SECRET is not defined in environment variables');
    process.exit(1);
}

if (!process.env.MONGO_URI) {
    console.error('ERROR: MONGO_URI is not defined in environment variables');
    process.exit(1);
}

// Root route - Define this before MongoDB connection
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Zithara Email Marketing API',
        version: '1.0.0',
        endpoints: [
            '/api/auth',
            '/api/campaigns',
            '/api/subscribers'
        ]
    });
});

// Test route - Define this before MongoDB connection
app.get('/api/test', (req, res) => {
    res.json({ success: true, message: 'API is working' });
});

// Connect to MongoDB and initialize routes
const initializeServer = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');

        // Mount routes with logging
        console.log('\nLoading routes...');

        // Import all routes first
        const campaignRoutes = require('./routes/campaigns');
        const authRoutes = require('./routes/auth');
        const subscriberRoutes = require('./routes/subscribers');
        const contentRoutes = require('./routes/content');

        // Add a test route to verify Express is working
        app.get('/api/health', (req, res) => {
            res.json({ status: 'ok', message: 'Server is running' });
        });

        // Mount routes in order
        console.log('\nMounting routes...');
        
        // Mount content routes first
        app.use('/api/content', contentRoutes);
        console.log('Mounted content routes at /api/content');
        
        app.use('/api/auth', authRoutes);
        console.log('Mounted auth routes at /api/auth');
        
        app.use('/api/campaigns', campaignRoutes);
        console.log('Mounted campaign routes at /api/campaigns');
        
        app.use('/api/subscribers', subscriberRoutes);
        console.log('Mounted subscriber routes at /api/subscribers');

        // Add route debugging middleware after mounting routes
        app.use((req, res, next) => {
            console.log(`[DEBUG] Incoming request: ${req.method} ${req.path}`);
            console.log('Available routes:', app._router.stack.map(r => r.regexp && r.regexp.source).filter(Boolean));
            next();
        });

        // 404 handler should be last
        app.use((req, res) => {
            console.log(`404 - Not Found: ${req.method} ${req.path}`);
            console.log('Request headers:', req.headers);
            res.status(404).json({
                success: false,
                message: 'Route not found',
                path: req.path,
                method: req.method
            });
        });

        // Error handler middleware
        app.use((err, req, res, next) => {
            console.error('Global error:', err.stack);
            res.status(500).json({
                success: false,
                message: 'Server Error',
                error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
            });
        });

        // Start server
        const PORT = process.env.PORT || 5000;
        const server = app.listen(PORT, () => {
            console.log(`\nServer running on port ${PORT}`);
            console.log('\nAvailable routes:');
            console.log('- /api/auth');
            console.log('- /api/campaigns');
            console.log('- /api/subscribers');
            console.log('- /api/content');
            console.log('\nTest the API:');
            console.log(`GET http://localhost:${PORT}/api/campaigns/subscribers/active`);
        });

        // Handle server errors
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use. Please try a different port.`);
            } else {
                console.error('Server error:', error);
            }
            process.exit(1);
        });

    } catch (error) {
        console.error('Failed to initialize server:', error);
        process.exit(1);
    }
};

// Initialize server
initializeServer().catch(error => {
    console.error('Server initialization failed:', error);
    process.exit(1);
});