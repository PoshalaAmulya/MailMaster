# AI-Driven Email Marketing Platform

A modern email marketing platform that uses AI to help create and manage effective email campaigns. Built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- AI-powered email content generation
- Campaign management and scheduling
- Subscriber list management
- Performance analytics and tracking
- Responsive design
- Secure authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- OpenAI API key
- Gmail account (for sending emails)

## Environment Setup

1. Create a `.env` file in the `backend` directory with the following variables:

```
MONGODB_URI=mongodb://localhost:27017/email-marketing
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
PORT=5000
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd email-marketing-platform
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

3. Access the application at `http://localhost:3000`

## API Documentation

### Authentication Endpoints

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Campaign Endpoints

- GET `/api/campaigns` - Get all campaigns
- POST `/api/campaigns` - Create a new campaign
- GET `/api/campaigns/:id` - Get campaign details
- PUT `/api/campaigns/:id` - Update campaign
- DELETE `/api/campaigns/:id` - Delete campaign

### Subscriber Endpoints

- GET `/api/subscribers` - Get all subscribers
- POST `/api/subscribers` - Add new subscriber
- GET `/api/subscribers/:id` - Get subscriber details
- PUT `/api/subscribers/:id` - Update subscriber
- DELETE `/api/subscribers/:id` - Delete subscriber

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 