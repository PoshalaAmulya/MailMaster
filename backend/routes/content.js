const express = require('express');
const router = express.Router();
const { processContent, generateContent } = require('../controllers/content');
const { protect } = require('../middleware/auth');

// Debug middleware - should be first
router.use((req, res, next) => {
    console.log('[Content Routes] Request received:', {
        method: req.method,
        path: req.path,
        url: req.url,
        baseUrl: req.baseUrl,
        originalUrl: req.originalUrl,
        body: req.body,
        headers: req.headers
    });
    next();
});

// Test route (no auth required)
router.get('/test', (req, res) => {
    res.json({ 
        message: 'Content routes are working',
        timestamp: new Date().toISOString()
    });
});

// Unprotected test route for AI generation
router.post('/test-generate', async (req, res) => {
    console.log('[Content Routes] Test generate request received:', req.body);
    try {
        const { prompt, keyPoints } = req.body;
        if (!prompt) {
            return res.status(400).json({
                success: false,
                message: 'Prompt is required'
            });
        }

        const aiService = require('../services/aiService');
        console.log('[Content Routes] Calling AI service with:', { prompt, keyPoints });
        const content = await aiService.generateEmailContent(prompt, keyPoints);
        console.log('[Content Routes] AI service response received:', content);

        // If content is already an object with success property, return it directly
        if (content && typeof content === 'object' && 'success' in content) {
            res.json(content);
        } else {
            // Otherwise, wrap the content in our response format
            res.json({
                success: true,
                data: { content: content.toString() }
            });
        }
    } catch (error) {
        console.error('[Content Routes] Test generation error:', error);
        res.status(500).json({
            success: false,
            message: 'Content generation failed',
            error: error.message
        });
    }
});

// Protected routes
router.post('/process', protect, processContent);
router.post('/generate-content', protect, generateContent);

// Export the router
module.exports = router; 