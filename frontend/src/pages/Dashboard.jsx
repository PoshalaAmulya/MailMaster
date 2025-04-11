import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, ProgressBar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faUsers,
  faChartLine,
  faPaperPlane,
  faExclamationTriangle,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import campaignService from '../services/campaignService';
import { subscriberService } from '../services/subscriberService';

// Sample data - replace with real data from your backend
const campaignData = [
  { name: 'Jan', campaigns: 4 },
  { name: 'Feb', campaigns: 6 },
  { name: 'Mar', campaigns: 8 },
  { name: 'Apr', campaigns: 5 },
  { name: 'May', campaigns: 10 },
  { name: 'Jun', campaigns: 7 },
];

const emailStats = [
  { name: 'Opened', value: 68 },
  { name: 'Unopened', value: 32 },
];

const COLORS = ['#0088FE', '#CCCCCC'];

function Dashboard() {
  const navigate = useNavigate();
  const [recentCampaigns, setRecentCampaigns] = useState([]);
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch campaigns
      const campaignsResponse = await campaignService.getCampaigns();
      const campaigns = campaignsResponse.data;
      setTotalCampaigns(campaigns.length);
      
      // Sort campaigns by creation date and take the 3 most recent
      const sortedCampaigns = campaigns.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      ).slice(0, 3);
      setRecentCampaigns(sortedCampaigns);

      // Fetch subscribers
      const subscribersResponse = await subscriberService.getSubscribers();
      setTotalSubscribers(subscribersResponse.pagination.total);

    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Dashboard Overview</h2>
        <Button variant="primary" onClick={() => navigate('/create-campaign')}>
          <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
          Create New Campaign
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Total Subscribers</h6>
                  <h3 className="mb-0">{totalSubscribers.toLocaleString()}</h3>
                </div>
                <div className="icon-shape bg-light-primary text-primary rounded-3 p-3">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-success">+12%</span>
                <span className="text-muted ms-2">from last month</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Campaigns Sent</h6>
                  <h3 className="mb-0">{totalCampaigns.toLocaleString()}</h3>
                </div>
                <div className="icon-shape bg-light-info text-info rounded-3 p-3">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-success">+8%</span>
                <span className="text-muted ms-2">from last month</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Average Open Rate</h6>
                  <h3 className="mb-0">68%</h3>
                </div>
                <div className="icon-shape bg-light-success text-success rounded-3 p-3">
                  <FontAwesomeIcon icon={faChartLine} />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-danger">-2%</span>
                <span className="text-muted ms-2">from last month</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Bounce Rate</h6>
                  <h3 className="mb-0">1.2%</h3>
                </div>
                <div className="icon-shape bg-light-warning text-warning rounded-3 p-3">
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-success">-0.5%</span>
                <span className="text-muted ms-2">from last month</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row className="g-4 mb-4">
        <Col md={8}>
          <Card className="h-100">
            <Card.Body>
              <h5 className="mb-4">Campaign Performance</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={campaignData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="campaigns"
                    stroke="#0d6efd"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <h5 className="mb-4">Email Statistics</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={emailStats}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {emailStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4">
                <div className="d-flex justify-content-between mb-2">
                  <span>Open Rate</span>
                  <span className="text-success">68%</span>
                </div>
                <ProgressBar now={68} variant="success" className="mb-3" />
                <div className="d-flex justify-content-between mb-2">
                  <span>Click Rate</span>
                  <span className="text-primary">42%</span>
                </div>
                <ProgressBar now={42} variant="primary" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Card>
        <Card.Body>
          <h5 className="mb-4">Recent Campaigns</h5>
          <div className="recent-activity">
            {loading ? (
              <div className="text-center py-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-3 text-danger">
                {error}
              </div>
            ) : recentCampaigns.length === 0 ? (
              <div className="text-center py-3 text-muted">
                No recent campaigns found
              </div>
            ) : (
              recentCampaigns.map((campaign) => (
                <div
                  key={campaign._id}
                  className="d-flex align-items-center p-3 border-bottom"
                >
                  <div className="icon-shape bg-light-success text-success rounded-3 p-3 me-3">
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{campaign.name}</h6>
                    <p className="text-muted mb-0">
                      Sent to {campaign.analytics?.sent || 0} subscribers • {campaign.analytics?.sent ? Math.round((campaign.analytics.opened / campaign.analytics.sent) * 100) : 0}% open rate
                    </p>
                  </div>
                  <small className="text-muted">{formatTimeAgo(campaign.createdAt)}</small>
                </div>
              ))
            )}
          </div>
        </Card.Body>
      </Card>

      <style>
        {`
          .icon-shape {
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .bg-light-primary {
            background-color: rgba(13, 110, 253, 0.1);
          }
          .bg-light-info {
            background-color: rgba(13, 202, 240, 0.1);
          }
          .bg-light-success {
            background-color: rgba(25, 135, 84, 0.1);
          }
          .bg-light-warning {
            background-color: rgba(255, 193, 7, 0.1);
          }
          .text-info {
            color: #0dcaf0;
          }
          .recent-activity .border-bottom:last-child {
            border-bottom: none !important;
          }
        `}
      </style>
    </div>
  );
}

export default Dashboard;