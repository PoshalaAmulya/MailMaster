const aiService = require('../services/aiService');

// @desc    Process email content with templates
// @route   POST /api/content/process
// @access  Private
exports.processContent = async (req, res) => {
  try {
    const { subject, content } = req.body;

    // Here you would typically process any template variables
    // For now, we'll just return the content as is since template processing
    // happens when sending to individual subscribers
    const processedContent = {
      subject,
      content
    };

    res.status(200).json({
      success: true,
      data: processedContent
    });
  } catch (error) {
    console.error('Error processing content:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Generate email content using AI
// @route   POST /api/content/generate-content
// @access  Private
exports.generateContent = async (req, res) => {
  try {
    console.log('Received content generation request:', req.body);
    const { prompt, keyPoints } = req.body;

    if (!prompt) {
      console.log('Missing prompt in request');
      return res.status(400).json({
        success: false,
        message: 'Please provide a prompt for content generation'
      });
    }

    console.log('Generating content with prompt:', prompt, 'and key points:', keyPoints);
    const content = await aiService.generateEmailContent(prompt, keyPoints);
    console.log('Content generated successfully');

    res.status(200).json({
      success: true,
      data: {
        content
      }
    });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating content',
      error: error.message
    });
  }
}; 