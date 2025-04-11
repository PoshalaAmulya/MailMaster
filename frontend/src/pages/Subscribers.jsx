import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
  Badge,
  Dropdown,
  Modal,
  Alert,
  Spinner
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus,
  faFilter,
  faTrash,
  faEdit,
  faEnvelope,
  faCheck,
  faTimes,
  faTag,
  faChartLine,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { subscriberService } from '../services/subscriberService';

const tagColors = {
  VIP: 'danger',
  Newsletter: 'primary',
  'Product Updates': 'success',
};

function Subscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [newSubscriber, setNewSubscriber] = useState({
    email: '',
    firstName: '',
    lastName: '',
    tags: [],
    status: 'active'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({
    email: '',
    firstName: ''
  });

  // Add debounced search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term to avoid too many re-renders
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load subscribers on component mount
  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await subscriberService.getSubscribers();
      setSubscribers(response.data || []);
    } catch (err) {
      setError('Failed to load subscribers. Please try again later.');
      console.error('Error loading subscribers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTagFilter = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const handleInputChange = (field, value) => {
    setNewSubscriber({ ...newSubscriber, [field]: value });
    
    // Clear error when user starts typing
    setFormErrors({ ...formErrors, [field]: '' });
    
    // Validate email as user types
    if (field === 'email' && value) {
      if (!validateEmail(value)) {
        setFormErrors(prev => ({
          ...prev,
          email: 'Please enter a valid email address'
        }));
      }
    }
  };

  const handleAddSubscriber = async () => {
    try {
      setError(null);
      setFormErrors({ email: '', firstName: '' });
      
      // Validate form
      let hasErrors = false;
      const newErrors = { email: '', firstName: '' };

      if (!newSubscriber.email) {
        newErrors.email = 'Email is required';
        hasErrors = true;
      } else if (!validateEmail(newSubscriber.email)) {
        newErrors.email = 'Please enter a valid email address';
        hasErrors = true;
      }

      if (!newSubscriber.firstName) {
        newErrors.firstName = 'First name is required';
        hasErrors = true;
      }

      if (hasErrors) {
        setFormErrors(newErrors);
        return;
      }

      setIsSubmitting(true);
      
      // Format the subscriber data
      const subscriberData = {
        ...newSubscriber,
        name: `${newSubscriber.firstName} ${newSubscriber.lastName}`.trim()
      };
      
      const response = await subscriberService.createSubscriber(subscriberData);
      
      if (response.data) {
        setSubscribers([...subscribers, response.data]);
        setNewSubscriber({
          email: '',
          firstName: '',
          lastName: '',
          tags: [],
          status: 'active'
        });
        setShowAddModal(false);
      }
    } catch (err) {
      if (err.response?.data?.message?.includes('email already exists')) {
        setFormErrors(prev => ({
          ...prev,
          email: 'This email is already registered'
        }));
      } else {
        setError('Failed to add subscriber. Please try again.');
      }
      console.error('Error adding subscriber:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (subscriber) => {
    setSelectedSubscriber(subscriber);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setError(null);
      setIsSubmitting(true);
      
      await subscriberService.deleteSubscriber(selectedSubscriber._id);
      setSubscribers(subscribers.filter(s => s._id !== selectedSubscriber._id));
      setShowDeleteModal(false);
      setSelectedSubscriber(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete subscriber. Please try again.');
      console.error('Error deleting subscriber:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setError('Please select a file to import');
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);
      
      const response = await subscriberService.importSubscribers(selectedFile);
      
      if (response.data) {
        await loadSubscribers(); // Reload the subscribers list
        setShowImportModal(false);
        setSelectedFile(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to import subscribers. Please try again.');
      console.error('Error importing subscribers:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = () => {
    // Add CSV export logic here
  };

  // Enhanced search function
  const searchSubscribers = (subscribers, term) => {
    if (!term) return subscribers;

    const searchTerm = term.toLowerCase().trim();
    return subscribers.filter((subscriber) => {
      return (
        // Search by email
        subscriber.email?.toLowerCase().includes(searchTerm) ||
        // Search by first name
        subscriber.firstName?.toLowerCase().includes(searchTerm) ||
        // Search by last name
        subscriber.lastName?.toLowerCase().includes(searchTerm)
      );
    });
  };

  // Update the filtered subscribers logic
  const filteredSubscribers = React.useMemo(() => {
    let filtered = [...subscribers];

    // Apply search filter
    if (debouncedSearchTerm) {
      filtered = searchSubscribers(filtered, debouncedSearchTerm);
    }

    // Apply tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(
        (subscriber) =>
          subscriber.tags &&
          selectedTags.every((tag) => subscriber.tags.includes(tag))
      );
    }

    return filtered;
  }, [subscribers, debouncedSearchTerm, selectedTags]);

  // Add new state variables for edit functionality
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSubscriber, setEditingSubscriber] = useState({
    email: '',
    firstName: '',
    lastName: '',
    tags: [],
    status: 'active'
  });

  const handleEditClick = (subscriber) => {
    setEditingSubscriber({
      _id: subscriber._id,
      email: subscriber.email,
      firstName: subscriber.firstName || '',
      lastName: subscriber.lastName || '',
      tags: subscriber.tags || [],
      status: subscriber.status
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    try {
      setError(null);
      setIsSubmitting(true);

      // Validate form
      let hasErrors = false;
      const newErrors = { email: '', firstName: '' };

      if (!editingSubscriber.email) {
        newErrors.email = 'Email is required';
        hasErrors = true;
      } else if (!validateEmail(editingSubscriber.email)) {
        newErrors.email = 'Please enter a valid email address';
        hasErrors = true;
      }

      if (!editingSubscriber.firstName) {
        newErrors.firstName = 'First name is required';
        hasErrors = true;
      }

      if (hasErrors) {
        setFormErrors(newErrors);
        return;
      }

      const response = await subscriberService.updateSubscriber(
        editingSubscriber._id,
        {
          ...editingSubscriber,
          name: `${editingSubscriber.firstName} ${editingSubscriber.lastName}`.trim()
        }
      );

      if (response.data) {
        setSubscribers(subscribers.map(sub => 
          sub._id === editingSubscriber._id ? response.data : sub
        ));
        setShowEditModal(false);
      }
    } catch (err) {
      if (err.response?.data?.message?.includes('email already exists')) {
        setFormErrors(prev => ({
          ...prev,
          email: 'This email is already registered'
        }));
      } else {
        setError('Failed to update subscriber. Please try again.');
      }
      console.error('Error updating subscriber:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container fluid className="px-4">
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Subscribers</h2>
          <p className="text-muted mb-0">
            {subscribers.length} total subscribers
          </p>
        </div>
        <div>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <FontAwesomeIcon icon={faUserPlus} className="me-2" />
            Add Subscriber
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={4}>
              <Form.Group className="mb-0">
                <div className="position-relative">
                  <Form.Control
                    type="text"
                    placeholder="Search by email or name..."
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
            <Col md={8}>
              <div className="d-flex align-items-center justify-content-end">
                <span className="me-2">
                  <FontAwesomeIcon icon={faFilter} className="me-1" />
                  Filter by tags:
                </span>
                {Object.keys(tagColors).map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTags.includes(tag) ? tagColors[tag] : 'outline-secondary'}
                    size="sm"
                    className="ms-2"
                    onClick={() => handleTagFilter(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Subscribers Table */}
      <Card>
        {loading ? (
          <Card.Body className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 mb-0">Loading subscribers...</p>
          </Card.Body>
        ) : (
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Date Added</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No subscribers found
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber._id}>
                    <td>
                      {subscriber.firstName && subscriber.lastName 
                        ? `${subscriber.firstName} ${subscriber.lastName}`
                        : subscriber.firstName || 'N/A'}
                    </td>
                    <td>{subscriber.email}</td>
                    <td>
                      <Badge bg={subscriber.status === 'active' ? 'success' : 'danger'}>
                        {subscriber.status}
                      </Badge>
                    </td>
                    <td>{new Date(subscriber.subscriptionDate).toLocaleDateString()}</td>
                    <td>
                      {subscriber.tags && subscriber.tags.map((tag) => (
                        <Badge key={tag} bg={tagColors[tag] || 'secondary'} className="me-1">
                          {tag}
                        </Badge>
                      ))}
                    </td>
                    <td>
                      <Button
                        variant="link"
                        className="text-danger p-0 me-3"
                        onClick={() => handleDeleteClick(subscriber)}
                        disabled={isSubmitting}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                      <Button 
                        variant="link" 
                        className="p-0"
                        onClick={() => handleEditClick(subscriber)}
                        disabled={isSubmitting}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </Card>

      {/* Add Subscriber Modal */}
      <Modal show={showAddModal} onHide={() => !isSubmitting && setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Subscriber</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Email <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={newSubscriber.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={isSubmitting}
                required
                isInvalid={!!formErrors.email}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>First Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                value={newSubscriber.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                disabled={isSubmitting}
                required
                isInvalid={!!formErrors.firstName}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.firstName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                value={newSubscriber.lastName}
                onChange={(e) =>
                  setNewSubscriber({ ...newSubscriber, lastName: e.target.value })
                }
                disabled={isSubmitting}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tags</Form.Label>
              <div>
                {Object.keys(tagColors).map((tag) => (
                  <Form.Check
                    key={tag}
                    inline
                    type="checkbox"
                    label={tag}
                    checked={newSubscriber.tags.includes(tag)}
                    onChange={(e) => {
                      const updatedTags = e.target.checked
                        ? [...newSubscriber.tags, tag]
                        : newSubscriber.tags.filter((t) => t !== tag);
                      setNewSubscriber({ ...newSubscriber, tags: updatedTags });
                    }}
                    disabled={isSubmitting}
                  />
                ))}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => {
              setShowAddModal(false);
              setFormErrors({ email: '', firstName: '' });
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddSubscriber}
            disabled={isSubmitting || !!formErrors.email}
          >
            {isSubmitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Adding...
              </>
            ) : (
              'Add Subscriber'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => !isSubmitting && setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the subscriber{' '}
          {selectedSubscriber?.name} ({selectedSubscriber?.email})?
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteModal(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleConfirmDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Import Modal */}
      <Modal show={showImportModal} onHide={() => !isSubmitting && setShowImportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Import Subscribers</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Upload CSV File</Form.Label>
            <Form.Control
              type="file"
              accept=".csv"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              disabled={isSubmitting}
            />
            <Form.Text className="text-muted">
              CSV file should have the following columns: email, firstName, lastName, tags
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowImportModal(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleImport}
            disabled={isSubmitting || !selectedFile}
          >
            {isSubmitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Importing...
              </>
            ) : (
              'Import'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Edit Modal */}
      <Modal show={showEditModal} onHide={() => !isSubmitting && setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Subscriber</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Email <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={editingSubscriber.email}
                onChange={(e) => {
                  setEditingSubscriber({ ...editingSubscriber, email: e.target.value });
                  if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                }}
                disabled={isSubmitting}
                required
                isInvalid={!!formErrors.email}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>First Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                value={editingSubscriber.firstName}
                onChange={(e) => {
                  setEditingSubscriber({ ...editingSubscriber, firstName: e.target.value });
                  if (formErrors.firstName) setFormErrors({ ...formErrors, firstName: '' });
                }}
                disabled={isSubmitting}
                required
                isInvalid={!!formErrors.firstName}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.firstName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                value={editingSubscriber.lastName}
                onChange={(e) => setEditingSubscriber({ ...editingSubscriber, lastName: e.target.value })}
                disabled={isSubmitting}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tags</Form.Label>
              <div>
                {Object.keys(tagColors).map((tag) => (
                  <Form.Check
                    key={tag}
                    inline
                    type="checkbox"
                    label={tag}
                    checked={editingSubscriber.tags.includes(tag)}
                    onChange={(e) => {
                      const updatedTags = e.target.checked
                        ? [...editingSubscriber.tags, tag]
                        : editingSubscriber.tags.filter((t) => t !== tag);
                      setEditingSubscriber({ ...editingSubscriber, tags: updatedTags });
                    }}
                    disabled={isSubmitting}
                  />
                ))}
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={editingSubscriber.status}
                onChange={(e) => setEditingSubscriber({ ...editingSubscriber, status: e.target.value })}
                disabled={isSubmitting}
              >
                <option value="active">Active</option>
                <option value="unsubscribed">Unsubscribed</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => {
              setShowEditModal(false);
              setFormErrors({ email: '', firstName: '' });
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleEditSubmit}
            disabled={isSubmitting || !!formErrors.email}
          >
            {isSubmitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Updating...
              </>
            ) : (
              'Update Subscriber'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <style>
        {`
          .search-input {
            padding-right: 2.5rem !important;
          }
          
          .search-input::-webkit-search-cancel-button {
            display: none;
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

export default Subscribers; 