import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { register } from '../utils/api';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      const data = await register(registerData);
      
      // Save user data to localStorage
      localStorage.setItem('accessToken', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      
      // Notify app about authentication change
      window.dispatchEvent(new Event('authChange'));

      // Redirect to login page after successful registration
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <Row className="justify-content-center w-100">
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold mb-1">Create Account</h2>
                <p className="text-muted">Get started with your free account</p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <div className="position-relative">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="position-absolute top-50 translate-middle-y ms-3 text-muted"
                    />
                    <Form.Control
                      type="text"
                      name="name"
                      value={name}
                      onChange={handleChange}
                      placeholder="Full name"
                      required
                      className="ps-5"
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <div className="position-relative">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="position-absolute top-50 translate-middle-y ms-3 text-muted"
                    />
                    <Form.Control
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleChange}
                      placeholder="Email address"
                      required
                      className="ps-5"
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <div className="position-relative">
                    <FontAwesomeIcon
                      icon={faLock}
                      className="position-absolute top-50 translate-middle-y ms-3 text-muted"
                    />
                    <Form.Control
                      type="password"
                      name="password"
                      value={password}
                      onChange={handleChange}
                      placeholder="Password"
                      required
                      className="ps-5"
                      minLength="6"
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <div className="position-relative">
                    <FontAwesomeIcon
                      icon={faLock}
                      className="position-absolute top-50 translate-middle-y ms-3 text-muted"
                    />
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                      required
                      className="ps-5"
                      minLength="6"
                    />
                  </div>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-4"
                  disabled={loading}
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>

                <div className="text-center">
                  <p className="mb-0 text-muted">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary text-decoration-none">
                      Sign in
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style>
        {`
          .form-control {
            padding: 0.75rem 1rem;
            font-size: 1rem;
          }
          .form-control:focus {
            box-shadow: none;
            border-color: #0d6efd;
          }
          .btn {
            padding: 0.75rem 1rem;
          }
        `}
      </style>
    </Container>
  );
}

export default Register; 
