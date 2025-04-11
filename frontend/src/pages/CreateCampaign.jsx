import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faTimes, faMagicWandSparkles } from '@fortawesome/free-solid-svg-icons';
import campaignService from '../services/campaignService';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [campaign, setCampaign] = useState({
    name: '',
    subject: '',
    content: '',
    keyPoints: '',
    status: 'scheduled',
    segmentationCriteria: {
      recipientList: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'recipientList') {
      setCampaign(prev => ({
        ...prev,
        segmentationCriteria: {
          ...prev.segmentationCriteria,
          [name]: value
        }
      }));
    } else {
      setCampaign(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleGenerateContent = async () => {
    try {
      setGenerating(true);
      setError(null);
      
      const response = await campaignService.generateContent({
        prompt: campaign.keyPoints,
        wordLimit: { min: 50, max: 100 }
      });

      console.log('Generated content response:', response);

      if (response.success && response.generated_content) {
        const content = response.generated_content;
        
        // Extract the main content without subject and signature
        const mainContent = content
          .replace(/^Subject:.*\n/, '')
          .replace(/\nSincerely,.*$/, '')
          .replace(/Dear Valued Customer,?\s*/i, '') // Remove duplicate greeting
          .trim();

        // Format the content with HTML styling
        const formattedContent = `
<p>Dear Valued Customer,</p>

${mainContent.split('\n\n').map(paragraph => {
  // Add styling based on content
  if (paragraph.includes('discount') || paragraph.includes('off') || paragraph.includes('%')) {
    return `<p><strong>🎉 ${paragraph}</strong></p>`;
  } else if (paragraph.includes('limited time') || paragraph.includes('expires') || paragraph.includes('Don\'t miss out')) {
    return `<p><em>⏰ ${paragraph}</em></p>`;
  } else if (paragraph.includes('shop') || paragraph.includes('browse') || paragraph.includes('click')) {
    return `<div style="text-align: center; margin: 15px 0;">
      <a href="#" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        🛍️ Shop Now
      </a>
    </div>`;
  }
  return `<p>${paragraph}</p>`;
}).join('')}

<p>Best regards,<br/>The Zithara Team</p>`;
        
        setCampaign(prev => ({
          ...prev,
          content: formattedContent
        }));
      } else {
        throw new Error('No content received from AI');
      }
    } catch (err) {
      setError('Failed to generate content. Please try again.');
      console.error('Content generation error:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!campaign.name || !campaign.content) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Create campaign object
      const campaignData = {
        name: campaign.name,
        subject: `Campaign: ${campaign.name}`,
        content: campaign.content,
        status: campaign.status,
        segmentationCriteria: campaign.segmentationCriteria
      };

      // Create campaign through the service
      const response = await campaignService.createCampaign(campaignData);
      console.log('Campaign created successfully:', response);

      // Send the campaign immediately if it's scheduled
      if (response.data && response.data._id && campaign.status === 'scheduled') {
        try {
          await campaignService.sendCampaign(response.data._id);
          console.log('Campaign sending initiated');
        } catch (sendError) {
          console.error('Error sending campaign:', sendError);
          // Don't throw error here, as campaign was created successfully
        }
      }

      // Redirect to campaigns list on success
      navigate('/campaigns');
    } catch (err) {
      console.error('Campaign creation error:', err);
      setError(err.response?.data?.message || 'Failed to create campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="mb-4">Create New Campaign</h2>
      
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <Card className="shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label className="campaign-label">Campaign Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={campaign.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter campaign name"
                    maxLength={100}
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label className="campaign-label">Recipient List</Form.Label>
                  <Form.Select
                    name="recipientList"
                    value={campaign.segmentationCriteria.recipientList}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select recipient list</option>
                    <option value="all">All Subscribers</option>
                    <option value="active">Active Subscribers</option>
                    <option value="inactive">Inactive Subscribers</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="campaign-label">Key Points (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                name="keyPoints"
                value={campaign.keyPoints}
                onChange={handleChange}
                placeholder="Enter key points to include in the email content..."
                rows={6}
                style={{ minHeight: '150px' }}
              />
              <Form.Text className="text-muted">
                Add important points you want to include in your email content. Each point in a new line.
              </Form.Text>
            </Form.Group>

            <div className="mb-3">
              <Button
                variant="outline-primary"
                onClick={handleGenerateContent}
                disabled={generating || !campaign.keyPoints}
                className="w-100"
              >
                <FontAwesomeIcon icon={faMagicWandSparkles} className="me-2" />
                {generating ? 'Generating Content...' : 'Generate Email Content'}
              </Button>
            </div>

            <Form.Group className="mb-4">
              <Form.Label className="campaign-label">Email</Form.Label>
              <div 
                className="form-control" 
                style={{ 
                  minHeight: '200px', 
                  maxHeight: '400px', 
                  overflowY: 'auto',
                  backgroundColor: 'white',
                  padding: '10px'
                }}
              >
                <div
                  contentEditable
                  dangerouslySetInnerHTML={{ __html: campaign.content }}
                  onBlur={(e) => {
                    setCampaign(prev => ({
                      ...prev,
                      content: e.target.innerHTML
                    }));
                  }}
                  style={{
                    outline: 'none',
                    minHeight: '180px'
                  }}
                />
              </div>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="outline-secondary"
                onClick={() => navigate('/campaigns')}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faTimes} className="me-2" />
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                disabled={loading}
              >
                <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
                {loading ? 'Creating...' : 'Create Campaign'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <style>
        {`
          .campaign-label {
            font-size: 1.1rem;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 0.5rem;
          }

          textarea.form-control {
            resize: vertical;
          }
        `}
      </style>
    </div>
  );
};

export default CreateCampaign; 