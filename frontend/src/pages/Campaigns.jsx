import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Badge, 
  Form,
  ProgressBar,
  Modal,
  Alert
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faSearch,
  faEdit,
  faCopy,
  faTrash,
  faCheckCircle,
  faPause,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import campaignService from '../services/campaignService';

const statusColors = {
  active: 'success',
  scheduled: 'primary',
  draft: 'secondary',
  paused: 'warning',
  failed: 'danger',
};

function Campaigns() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [duplicating, setDuplicating] = useState(false);

  // Load campaigns on component mount
  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await campaignService.getCampaigns();
      setCampaigns(result.data);
    } catch (err) {
      setError('Failed to load campaigns. Please try again later.');
      console.error('Error loading campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const handleDeleteCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await campaignService.deleteCampaign(selectedCampaign._id);
      setCampaigns(campaigns.filter(c => c._id !== selectedCampaign._id));
      setShowDeleteModal(false);
      setError(null);
    } catch (err) {
      setError('Failed to delete campaign. Please try again later.');
      console.error('Error deleting campaign:', err);
    }
  };
  const handleDuplicateCampaign = async (campaign) => {
  setDuplicating(true);
  setError(null);

  try {
    const result = await campaignService.duplicateCampaign(campaign._id);

    // Safety check in case result or result.data is undefined
    if (!result || !result.data) {
      throw new Error('No data returned from duplicateCampaign');
    }

    // Prepend the duplicated campaign to the list
    setCampaigns(prev => [result.data, ...prev]);
  } catch (err) {
    console.error('Error duplicating campaign:', err);
    setError('Failed to duplicate campaign. Please try again later.');
  } finally {
    setDuplicating(false);
  }
};


  // const handleDuplicateCampaign = async (campaign) => {
  //   try {
  //     setDuplicating(true);
  //     setError(null);
  //     const result = await campaignService.duplicateCampaign(campaign._id);
  //     setCampaigns([result.data, ...campaigns]);
  //     setDuplicating(false);
  //   } 
  //   catch (err) {
  //     setError('Failed to duplicate campaign. Please try again later.');
  //     console.error('Error duplicating campaign:', err);
  //     setDuplicating(false);
  //   }
  // };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const calculateMetrics = (campaign) => {
    const sent = campaign.analytics?.sent || 0;
    const opened = campaign.analytics?.opened || 0;
    const clicked = campaign.analytics?.clicked || 0;

    return {
      openRate: sent > 0 ? Math.round((opened / sent) * 100) : 0,
      clickRate: sent > 0 ? Math.round((clicked / sent) * 100) : 0
    };
  };

  if (loading) {
    return (
      <Container fluid className="px-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="px-4">
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Email Campaigns</h2>
        <Button variant="primary" onClick={() => navigate('/create-campaign')}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Create Campaign
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={4}>
              <Form.Group className="mb-0">
                <div className="position-relative">
                  <Form.Control
                    type="text"
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input pe-5"
                  />
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={8} className="d-flex justify-content-end">
              <div className="d-flex gap-2">
                <Button 
                  variant={statusFilter === 'all' ? 'primary' : 'outline-primary'}
                  onClick={() => handleStatusFilter('all')}
                >
                  All
                </Button>
                <Button 
                  variant={statusFilter === 'scheduled' ? 'info' : 'outline-info'}
                  onClick={() => handleStatusFilter('scheduled')}
                >
                  Scheduled
                </Button>
                <Button 
                  variant={statusFilter === 'draft' ? 'secondary' : 'outline-secondary'}
                  onClick={() => handleStatusFilter('draft')}
                >
                  Drafts
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Campaigns List */}
      <div className="campaigns-list">
        {filteredCampaigns.length === 0 ? (
          <Card className="text-center py-5">
            <Card.Body>
              <h4>No campaigns found</h4>
              <p className="text-muted">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your filters'
                  : 'Create your first campaign to get started'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button variant="primary" onClick={() => navigate('/create-campaign')}>
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  Create Campaign
                </Button>
              )}
            </Card.Body>
          </Card>
        ) : (
          filteredCampaigns.map((campaign) => {
            const metrics = calculateMetrics(campaign);
            return (
              <Card key={campaign._id} className="mb-3">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <h5 className="mb-1">{campaign.name}</h5>
                      <div className="d-flex align-items-center">
                        <Badge bg={statusColors[campaign.status]} className="me-2">
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </Badge>
                        {campaign.schedule?.date && (
                          <small className="text-muted">
                            {new Date(campaign.schedule.date).toLocaleDateString()}
                          </small>
                        )}
                        {campaign.schedule?.recurring && (
                          <small className="text-muted">
                            {campaign.schedule.recurring}
                          </small>
                        )}
                      </div>
                    </Col>
                    <Col md={5}>
                      <Row className="g-3">
                        <Col md={4}>
                          <div className="small text-muted mb-1">Sent</div>
                          <div className="fw-bold">{campaign.analytics?.sent || 0}</div>
                        </Col>
                        <Col md={4}>
                          <div className="small text-muted mb-1">Open Rate</div>
                          <div className="d-flex align-items-center">
                            <div className="fw-bold me-2">{metrics.openRate}%</div>
                            <ProgressBar 
                              now={metrics.openRate}
                              variant="success" 
                              className="flex-grow-1"
                              style={{ height: '4px' }}
                            />
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="small text-muted mb-1">Click Rate</div>
                          <div className="d-flex align-items-center">
                            <div className="fw-bold me-2">{metrics.clickRate}%</div>
                            <ProgressBar 
                              now={metrics.clickRate}
                              variant="info" 
                              className="flex-grow-1"
                              style={{ height: '4px' }}
                            />
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={3} className="text-end">
                      <Button 
                        variant="light" 
                        className="me-2"
                        onClick={() => navigate(`/edit-campaign/${campaign._id}`)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                      <Button 
                        variant="light" 
                        className="me-2"
                        onClick={() => handleDuplicateCampaign(campaign)}
                        disabled={duplicating}
                      >
                        <FontAwesomeIcon icon={faCopy} />
                      </Button>
                      <Button 
                        variant="light" 
                        className="text-danger"
                        onClick={() => handleDeleteCampaign(campaign)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Campaign</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the campaign "{selectedCampaign?.name}"? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete Campaign
          </Button>
        </Modal.Footer>
      </Modal>

      <style>
        {`
          .search-input::-webkit-search-cancel-button {
            display: none;
          }
          
          .search-input {
            padding-right: 2.5rem !important;
          }
          
          .search-input::-ms-clear,
          .search-input::-ms-reveal {
            display: none;
          }
        `}
      </style>
    </Container>
  );
}

export default Campaigns;
