
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    // Add a check for JWT_SECRET
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log('Registration attempt with:', { name, email });
        
        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email and password'
            });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id),
                },
            });
        } else {
            throw new Error('Failed to create user');
        }
    } catch (error) {
        console.error('Registration error details:', error);
        console.error('Error stack:', error.stack);
        
        // Check for validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        
        // Check for duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email already in use'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Login attempt with email:', email);

        // Check for user email
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            console.log('Login failed: User not found');
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            console.log('Login failed: Password does not match');
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        console.log('Login successful for user:', user.email);
        
        // Create token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: token,
            },
        });
    } catch (error) {
        console.error('Login error details:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('GetMe error details:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};