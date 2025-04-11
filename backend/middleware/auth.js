const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    console.log('Auth middleware checking token...');
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        console.log('No token found in request');
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route - No token provided'
        });
    }

    try {
        console.log('Verifying token...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token verified successfully:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route - Invalid token',
            error: error.message
        });
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};
