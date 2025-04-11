import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, Button, Offcanvas, Image, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faEnvelope,
  faUsers,
  faChartBar,
  faBars,
  faSignInAlt,
  faUserPlus,
  faSignOutAlt,
  faUser,
  faCog,
} from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

import Dashboard from './pages/Dashboard.jsx';
import Campaigns from './pages/Campaigns.jsx';
import CreateCampaign from './pages/CreateCampaign.jsx';
import EditCampaign from './pages/EditCampaign.jsx';
import Subscribers from './pages/Subscribers.jsx';
import Analytics from './pages/Analytics.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';

function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    console.log('Initial auth check, token exists:', !!token);
    
    if (token) {
      setIsAuthenticated(true);
      if (user) {
        setUserData(JSON.parse(user));
      }
    }

    // Add event listener for localStorage changes
    const handleStorageChange = () => {
      const token = localStorage.getItem('accessToken');
      const user = localStorage.getItem('user');
      console.log('Auth state changed, token exists:', !!token);
      setIsAuthenticated(!!token);
      
      if (token && user) {
        setUserData(JSON.parse(user));
      } else {
        setUserData(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for login/logout
    window.addEventListener('authChange', handleStorageChange);
    console.log('Auth event listeners added');

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleStorageChange);
      console.log('Auth event listeners removed');
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    window.dispatchEvent(new Event('authChange'));
  };

  const menuItems = [
    { text: 'Dashboard', icon: faHome, path: '/dashboard' },
    { text: 'Campaigns', icon: faEnvelope, path: '/campaigns' },
    { text: 'Subscribers', icon: faUsers, path: '/subscribers' },
    { text: 'Analytics', icon: faChartBar, path: '/analytics' },
  ];

  return (
    <Router>
      <div style={{ minHeight: '100vh' }}>
        {window.location.pathname === '/' ? null : (
          <Navbar bg="white" className="border-bottom fixed-top">
            <Container fluid>
              {isAuthenticated && (
                <Button
                  variant="outline-dark"
                  className="d-lg-none"
                  onClick={() => setShowSidebar(true)}
                >
                  <FontAwesomeIcon icon={faBars} />
                </Button>
              )}
              <Navbar.Brand className="ms-3">MailMaster</Navbar.Brand>
              
              {/* Auth Buttons */}
              <Nav className="ms-auto">
                {!isAuthenticated ? (
                  <>
                    <Link to="/login" className="btn btn-outline-primary me-2">
                      <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                      Login
                    </Link>
                    <Link to="/register" className="btn btn-primary">
                      <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                      Register
                    </Link>
                  </>
                ) : (
                  <div className="d-flex align-items-center">
                    <Dropdown align="end">
                      <Dropdown.Toggle variant="light" id="dropdown-user" className="bg-transparent border-0 d-flex align-items-center">
                        <div className="me-2 text-end d-none d-sm-block">
                          <div className="fw-bold">{userData?.name || 'User'}</div>
                          <div className="small text-muted">{userData?.email || ''}</div>
                        </div>
                        <div className="d-flex justify-content-center align-items-center rounded-circle bg-primary text-white" 
                          style={{ width: '40px', height: '40px' }}>
                          <FontAwesomeIcon icon={faUser} />
                        </div>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item>
                          <FontAwesomeIcon icon={faUser} className="me-2" />
                          Profile
                        </Dropdown.Item>
                        <Dropdown.Item>
                          <FontAwesomeIcon icon={faCog} className="me-2" />
                          Settings
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleLogout}>
                          <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                          Logout
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                )}
              </Nav>
            </Container>
          </Navbar>
        )}

        <div className="d-flex" style={{ paddingTop: window.location.pathname === '/' ? '0' : '56px' }}>
          {isAuthenticated && window.location.pathname !== '/' && (
            <Offcanvas 
              show={showSidebar} 
              onHide={() => setShowSidebar(false)} 
              responsive="lg"
              className="sidebar-nav"
            >
              <Offcanvas.Header closeButton className="border-bottom py-2">
                <Offcanvas.Title>MailMaster</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body className="p-0">
                <Nav className="flex-column">
                  {menuItems.map((item) => (
                    <Nav.Link
                      key={item.text}
                      as={Link}
                      to={item.path}
                      className="menu-link"
                      onClick={() => setShowSidebar(false)}
                    >
                      <FontAwesomeIcon icon={item.icon} className="me-3" />
                      {item.text}
                    </Nav.Link>
                  ))}
                </Nav>
              </Offcanvas.Body>
            </Offcanvas>
          )}

          <main className={`flex-grow-1 ${isAuthenticated && window.location.pathname !== '/' ? 'with-sidebar' : ''}`}>
            <Container fluid className={window.location.pathname === '/' ? 'p-0' : 'p-4'}>
              <div className={window.location.pathname !== '/' ? 'content-wrapper' : ''}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  {isAuthenticated ? (
                    <>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/campaigns" element={<Campaigns />} />
                      <Route path="/create-campaign" element={<CreateCampaign />} />
                      <Route path="/edit-campaign/:id" element={<EditCampaign />} />
                      <Route path="/subscribers" element={<Subscribers />} />
                      <Route path="/analytics" element={<Analytics />} />
                    </>
                  ) : (
                    <Route path="*" element={<Home />} />
                  )}
                </Routes>
              </div>
            </Container>
          </main>
        </div>

        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

            :root {
              --primary-gradient: linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6);
              --secondary-gradient: linear-gradient(135deg, #f3f4f6, #e5e7eb);
              --primary-color: #3b82f6;
              --secondary-color: #6366f1;
              --accent-color: #8b5cf6;
              --text-primary: #1f2937;
              --text-secondary: #4b5563;
              --bg-primary: #ffffff;
              --bg-secondary: #f9fafb;
              --border-color: #e5e7eb;
              --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
              --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
              --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            }

            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              color: var(--text-primary);
              background-color: var(--bg-secondary);
              line-height: 1.6;
            }

            .content-wrapper {
              padding-top: 1.5rem;
              min-height: calc(100vh - 56px);
            }

            .navbar {
              box-shadow: var(--shadow-sm);
              backdrop-filter: blur(8px);
              background-color: rgba(255, 255, 255, 0.95);
            }

            .navbar-brand {
              font-family: 'Poppins', sans-serif;
              font-weight: 700;
              letter-spacing: -1px;
              font-size: 1.5rem;
              background: var(--primary-gradient);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              position: relative;
              padding-bottom: 3px;
              transition: all 0.3s ease;
            }

            .navbar-brand:hover {
              transform: translateY(-1px);
            }

            .navbar-brand::after {
              content: '';
              position: absolute;
              width: 24px;
              height: 2px;
              background: var(--primary-gradient);
              bottom: 0;
              left: 0;
              border-radius: 1px;
              transition: width 0.3s ease;
            }

            .navbar-brand:hover::after {
              width: 100%;
            }

            .offcanvas {
              background-color: var(--bg-primary);
              border-right: 1px solid var(--border-color);
            }

            .offcanvas-title {
              font-family: 'Poppins', sans-serif;
              font-weight: 700;
              letter-spacing: -1px;
              font-size: 1.5rem;
              background: var(--primary-gradient);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              padding: 0.5rem 1.5rem;
            }

            .offcanvas-header {
              padding: 1rem 0;
              margin-bottom: 0.5rem;
            }

            .offcanvas-body {
              padding: 1.5rem 0;
            }

            .menu-link {
              padding: 1.25rem 2rem;
              color: var(--text-secondary);
              transition: all 0.3s ease;
              border-left: 3px solid transparent;
              font-size: 1.125rem;
              font-weight: 600;
              display: flex;
              align-items: center;
              margin: 0.375rem 0;
            }

            .menu-link .fa-icon {
              width: 1.75rem;
              font-size: 1.25rem;
              margin-right: 1.25rem;
              color: var(--text-secondary);
              transition: all 0.3s ease;
            }

            .menu-link:hover {
              color: var(--primary-color);
              background-color: var(--bg-secondary);
              border-left: 3px solid var(--primary-color);
            }

            .menu-link:hover .fa-icon {
              color: var(--primary-color);
            }

            .menu-link.active {
              color: var(--primary-color);
              background-color: var(--bg-secondary);
              border-left: 3px solid var(--primary-color);
              font-weight: 700;
            }

            .nav.flex-column {
              padding: 0.75rem 0;
            }

            .btn-primary {
              background: var(--primary-gradient);
              border: none;
              transition: all 0.3s ease;
            }

            .btn-primary:hover {
              transform: translateY(-1px);
              box-shadow: var(--shadow-md);
            }

            .btn-outline-primary {
              border-color: var(--primary-color);
              color: var(--primary-color);
              transition: all 0.3s ease;
            }

            .btn-outline-primary:hover {
              background: var(--primary-gradient);
              border-color: transparent;
              transform: translateY(-1px);
              box-shadow: var(--shadow-sm);
            }

            .dropdown-menu {
              border: none;
              box-shadow: var(--shadow-lg);
              border-radius: 0.5rem;
              padding: 0.5rem;
            }

            .dropdown-item {
              padding: 0.5rem 1rem;
              border-radius: 0.375rem;
              transition: all 0.2s ease;
            }

            .dropdown-item:hover {
              background-color: var(--bg-secondary);
              color: var(--primary-color);
            }

            .card {
              border: none;
              border-radius: 0.75rem;
              box-shadow: var(--shadow-sm);
              transition: all 0.3s ease;
            }

            .card:hover {
              transform: translateY(-2px);
              box-shadow: var(--shadow-md);
            }

            .form-control {
              border: 1px solid var(--border-color);
              border-radius: 0.5rem;
              padding: 0.75rem 1rem;
              transition: all 0.2s ease;
            }

            .form-control:focus {
              border-color: var(--primary-color);
              box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }

            .table {
              border-radius: 0.75rem;
              overflow: hidden;
            }

            .table thead th {
              background-color: var(--bg-secondary);
              border-bottom: 2px solid var(--border-color);
              font-weight: 600;
              text-transform: uppercase;
              font-size: 0.75rem;
              letter-spacing: 0.05em;
              color: var(--text-secondary);
            }

            .table tbody tr {
              transition: all 0.2s ease;
            }

            .table tbody tr:hover {
              background-color: var(--bg-secondary);
            }

            .badge {
              padding: 0.5em 0.75em;
              border-radius: 0.375rem;
              font-weight: 500;
            }

            .alert {
              border: none;
              border-radius: 0.75rem;
              box-shadow: var(--shadow-sm);
            }

            .modal-content {
              border: none;
              border-radius: 0.75rem;
              box-shadow: var(--shadow-lg);
            }

            .modal-header {
              border-bottom: 1px solid var(--border-color);
            }

            .modal-footer {
              border-top: 1px solid var(--border-color);
            }

            @media (min-width: 992px) {
              .with-sidebar {
                margin-left: 250px;
              }
              
              .sidebar-nav {
                width: 250px;
                position: fixed;
                top: 56px;
                height: calc(100vh - 56px);
                border-right: 1px solid var(--border-color);
              }
            }
          `}
        </style>
      </div>
    </Router>
  );
}

export default App;