const axios = require('axios');

class AIService {
  constructor() {
    this.API_KEY = process.env.GEMINI_API_KEY;
    this.GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    
    if (!this.API_KEY) {
      throw new Error('GEMINI_API_KEY is required but not found in environment variables');
    }
  }

  generateEmailPrompt(purpose = 'custom', tone = 'professional', type = 'content', keyPoints = '', campaignName = '') {
    const baseInstructions = `You are an expert email marketing specialist. Generate ${type === 'subject' ? 'a compelling email subject line' : 'an engaging email content'} for the following campaign: "${campaignName}".`;

    const purposeInstructions = {
      'promotion': `Create content that highlights the benefits and creates urgency for the promotion.`,
      'newsletter': `Write informative and engaging content for the newsletter that provides value to subscribers.`,
      'announcement': `Craft a clear and impactful message about the announcement.`,
      'custom': `Generate content based on the following specific requirements: ${keyPoints}`
    };

    const toneInstructions = {
      'professional': 'Use formal language, proper grammar, and maintain a business-appropriate tone.',
      'casual': 'Use conversational language while maintaining professionalism.',
      'friendly': 'Use warm and approachable language that builds rapport.',
      'custom': `Maintain the following specific tone: ${keyPoints}`
    };

    return `${baseInstructions}

Purpose: ${purposeInstructions[purpose] || purposeInstructions['custom']}
Tone: ${toneInstructions[tone] || toneInstructions['custom']}

Generate comprehensive email content that:
1. Has a clear and engaging opening
2. Elaborates on these key points: ${keyPoints}
3. Includes a strong call-to-action
4. Has a professional closing

Provide only the email content text, without any markdown formatting or additional explanations.`;
  }

  async generateEmailContent(prompt, keyPoints = '') {
    try {
      console.log('Generating email content with prompt:', { prompt, keyPoints });

      if (!prompt) {
        throw new Error('Prompt is required for content generation');
      }

      const generatedPrompt = this.generateEmailPrompt('custom', 'professional', 'content', keyPoints, prompt);
      console.log('Sending request to Gemini API...');

      const response = await axios.post(
        `${this.GEMINI_API_ENDPOINT}?key=${this.API_KEY}`,
        {
          contents: [{
            parts: [{
              text: generatedPrompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.candidates && response.data.candidates[0]) {
        const generatedContent = response.data.candidates[0].content.parts[0].text.trim();
        console.log('Successfully generated content');
        return {
          success: true,
          generated_content: generatedContent
        };
      } else {
        throw new Error('No content generated from Gemini');
      }

    } catch (error) {
      console.error('AI content generation failed:', {
        error: error.message,
        stack: error.stack,
        details: error.response?.data
      });
      
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message || 'Failed to generate content. Please try again.'
      };
    }
  }

  async generateSubjectLine(content) {
    try {
      if (!content) {
        throw new Error('Content is required for subject line generation');
      }

      console.log('Generating subject line for content');
      const generatedPrompt = this.generateEmailPrompt('custom', 'professional', 'subject', '', content);

      const response = await axios.post(
        `${this.GEMINI_API_ENDPOINT}?key=${this.API_KEY}`,
        {
        contents: [{ 
            parts: [{
              text: generatedPrompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.candidates && response.data.candidates[0]) {
        return response.data.candidates[0].content.parts[0].text.trim();
      } else {
        throw new Error('No subject line generated from Gemini');
      }
    } catch (error) {
      console.error('Subject line generation failed:', error);
      throw new Error(`Failed to generate subject line: ${error.message}`);
    }
  }
}

const aiService = new AIService();
module.exports = aiService; 