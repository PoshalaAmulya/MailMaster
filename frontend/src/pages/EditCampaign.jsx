import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faTimes } from '@fortawesome/free-solid-svg-icons';
import campaignService from '../services/campaignService';

const EditCampaign = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [campaign, setCampaign] = useState({
    name: '',
    subject: '',
    content: '',
    status: 'draft',
    segmentationCriteria: {
      recipientList: 'all'
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCampaign = async () => {
      try {
        setLoading(true);
        const response = await campaignService.getCampaign(id);
        setCampaign(response.data);
      } catch (err) {
        setError('Failed to load campaign. Please try again later.');
        console.error('Error loading campaign:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCampaign();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'recipientList') {
      setCampaign(prev => ({
        ...prev,
        segmentationCriteria: {
          ...prev.segmentationCriteria,
          recipientList: value
        }
      }));
    } else {
      setCampaign(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // Validate required fields
      if (!campaign.name || !campaign.subject || !campaign.content) {
        setError('Please fill in all required fields');
        return;
      }

      // Create campaign object
      const campaignData = {
        name: campaign.name,
        subject: campaign.subject,
        content: campaign.content,
        status: campaign.status,
        segmentationCriteria: campaign.segmentationCriteria
      };

      // Update campaign through the service
      await campaignService.updateCampaign(id, campaignData);
      
      // Redirect to campaigns list on success
      navigate('/campaigns');
    } catch (err) {
      console.error('Error updating campaign:', err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Failed to update campaign. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="mb-4">Edit Campaign</h2>
      
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
                  <Form.Label>Campaign Name</Form.Label>
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
                  <Form.Label>Email Subject</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    value={campaign.subject}
                    onChange={handleChange}
                    required
                    placeholder="Enter email subject"
                    maxLength={200}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Recipient List</Form.Label>
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
              <Form.Label>Email Content</Form.Label>
              <Form.Control
                as="textarea"
                name="content"
                value={campaign.content}
                onChange={handleChange}
                required
                placeholder="Enter email content"
                style={{ minHeight: '200px' }}
              />
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
                {loading ? 'Updating...' : 'Update Campaign'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EditCampaign; 