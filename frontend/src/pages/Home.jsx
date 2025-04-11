import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';

function Home() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="home-page">
      <div className="content">
        <h1 className="title">MailMaster</h1>
        <div className="buttons">
          <Button 
            variant="primary" 
            size="lg" 
            className="login-btn"
            onClick={handleLogin}
          >
            <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
            Login
          </Button>
          <Button 
            variant="outline-primary" 
            size="lg" 
            className="register-btn"
            onClick={handleRegister}
          >
            <FontAwesomeIcon icon={faUserPlus} className="me-2" />
            Register
          </Button>
        </div>
      </div>

      <style>
        {`
          .home-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          }

          .content {
            text-align: center;
            padding: 2rem;
          }

          .title {
            font-family: 'Poppins', sans-serif;
            font-size: 5.5rem;
            font-weight: 800;
            margin-bottom: 3rem;
            background: linear-gradient(135deg, #2563eb, #4f46e5, #7c3aed);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -2px;
            text-shadow: 2px 2px 20px rgba(79, 70, 229, 0.15);
            position: relative;
          }

          .title::after {
            content: '';
            position: absolute;
            width: 100px;
            height: 4px;
            background: linear-gradient(90deg, #4f46e5, transparent);
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            border-radius: 2px;
          }

          .buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
          }

          .login-btn, .register-btn {
            padding: 0.8rem 2.5rem;
            font-size: 1.1rem;
            font-weight: 500;
            transition: transform 0.2s;
          }

          .login-btn:hover, .register-btn:hover {
            transform: translateY(-2px);
          }
        `}
      </style>
    </div>
  );
}

export default Home; 