# 🏖️ Goa Resort API

A robust Node.js/Express.js backend API for managing Goa resort bookings, user authentication, and enquiry systems. Built with modern JavaScript, MongoDB, and JWT authentication.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with secure token management
- **User registration** with email/username validation
- **Password hashing** using bcryptjs
- **Protected routes** with middleware authentication
- **Role-based access control** (User/Admin)

### 👥 User Management
- **User registration** with comprehensive validation
- **Profile management** with update capabilities
- **Address management** with structured data
- **Password reset** functionality
- **User search** and filtering

### 📞 Enquiry System
- **Enquiry creation** with form validation
- **Enquiry management** for administrators
- **Status tracking** (Pending, In Progress, Completed, Cancelled)
- **Email notifications** using Nodemailer
- **Enquiry statistics** and reporting

### 🛡️ Security Features
- **CORS configuration** for cross-origin requests
- **Input validation** using validator.js
- **Error handling** with proper HTTP status codes
- **Environment variable** management
- **Request rate limiting** (configurable)

### 📊 Database
- **MongoDB** with Mongoose ODM
- **Data validation** at schema level
- **Indexing** for optimal performance
- **Connection pooling** for scalability

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | Runtime environment |
| **Express.js** | 4.18.2 | Web framework |
| **MongoDB** | 8.0.0 | Database |
| **Mongoose** | 8.0.0 | ODM for MongoDB |
| **JWT** | 9.0.2 | Authentication tokens |
| **bcryptjs** | 2.4.3 | Password hashing |
| **Nodemailer** | 7.0.5 | Email functionality |
| **Validator.js** | 13.11.0 | Input validation |
| **CORS** | 2.8.5 | Cross-origin resource sharing |
| **Dotenv** | 16.3.1 | Environment variables |

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local or cloud instance)
- **Git** for version control

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd goaresort
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Configure the following environment variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Email Configuration (for Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Optional: Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Start the Application

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 5000 | No |
| `NODE_ENV` | Environment mode | development | No |
| `MONGO_URI` | MongoDB connection string | - | Yes |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `JWT_EXPIRE` | JWT token expiration | 7d | No |
| `EMAIL_HOST` | SMTP host for emails | - | No |
| `EMAIL_PORT` | SMTP port | 587 | No |
| `EMAIL_USER` | SMTP username | - | No |
| `EMAIL_PASS` | SMTP password | - | No |

### Database Configuration

The application uses MongoDB with the following collections:

- **users** - User accounts and profiles
- **enquiries** - Customer enquiries and bookings

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### User Endpoints

#### 🔐 Authentication

##### Register User
```http
POST /api/users/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe"
  }
}
```

##### Login User
```http
POST /api/users/login
```

**Request Body:**
```json
{
  "emailOrUsername": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### 👤 Profile Management

##### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

##### Update User Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "phone": "9876543210",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India"
  }
}
```

##### Change Password
```http
PUT /api/users/change-password
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newsecurepassword123"
}
```

#### 🔍 User Search (Admin Only)

##### Get All Users
```http
GET /api/users?page=1&limit=10&search=john
Authorization: Bearer <admin-token>
```

### Enquiry Endpoints

#### 📝 Enquiry Management

##### Create Enquiry
```http
POST /api/enquiries
```

**Request Body:**
```json
{
  "name": "Customer Name",
  "email": "customer@example.com",
  "phone": "5555555555",
  "dateOfPlan": "2024-12-25",
  "subject": "Hotel Booking Enquiry",
  "message": "I would like to book a hotel for next weekend."
}
```

##### Get All Enquiries (Admin Only)
```http
GET /api/enquiries?page=1&limit=10&status=pending
Authorization: Bearer <admin-token>
```

##### Get User's Own Enquiries
```http
GET /api/enquiries/my-enquiries
Authorization: Bearer <token>
```

##### Get Enquiry by ID
```http
GET /api/enquiries/:id
Authorization: Bearer <token>
```

##### Update Enquiry Status (Admin Only)
```http
PUT /api/enquiries/:id/status
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "status": "in-progress",
  "adminNotes": "Processing the booking request"
}
```

##### Delete Enquiry (Admin Only)
```http
DELETE /api/enquiries/:id
Authorization: Bearer <admin-token>
```

#### 📊 Enquiry Statistics (Admin Only)

##### Get Enquiry Stats
```http
GET /api/enquiries/stats
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "total": 150,
  "pending": 25,
  "inProgress": 15,
  "completed": 100,
  "cancelled": 10,
  "recentEnquiries": [...]
}
```

### Health Check

##### API Health Status
```http
GET /health
```

**Response:**
```json
{
  "message": "Goa Resort API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "status": "healthy"
}
```

## 🧪 Testing

### Running Tests

The project includes a comprehensive test suite:

```bash
# Run all tests
npm test

# Run specific test file
node test-api.js
```

### Test API Endpoints

Use the included `test-api.js` file to test all endpoints:

```bash
node test-api.js
```

This will test:
- ✅ User registration
- ✅ User login
- ✅ Profile management
- ✅ Enquiry creation
- ✅ Enquiry management
- ✅ Admin operations

### Manual Testing with cURL

#### Test Registration
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "username": "testuser",
    "email": "test@example.com",
    "phone": "1234567890",
    "password": "password123"
  }'
```

#### Test Login
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "testuser",
    "password": "password123"
  }'
```

## 📁 Project Structure

```
goaresort/
├── 📁 controllers/          # Business logic handlers
│   ├── userController.js    # User management logic
│   └── enquiryController.js # Enquiry management logic
├── 📁 middlewares/          # Custom middleware
│   └── auth.js             # Authentication middleware
├── 📁 models/              # Database schemas
│   ├── User.js            # User model
│   └── Enquiry.js         # Enquiry model
├── 📁 routes/              # API route definitions
│   ├── userRoutes.js      # User endpoints
│   └── enquiryRoutes.js   # Enquiry endpoints
├── 📁 utils/               # Utility functions
├── 📄 index.js            # Main application file
├── 📄 package.json        # Dependencies and scripts
├── 📄 test-api.js         # API testing suite
├── 📄 .env                # Environment variables
├── 📄 .gitignore          # Git ignore rules
└── 📄 README.md           # This file
```

### Key Files Explained

| File | Purpose |
|------|---------|
| `index.js` | Main server file with Express setup |
| `controllers/` | Business logic and request handling |
| `models/` | MongoDB schemas and validation |
| `routes/` | API endpoint definitions |
| `middlewares/` | Custom middleware functions |
| `test-api.js` | Comprehensive API testing |

## 🚀 Deployment

### Production Deployment

#### 1. Environment Setup
```bash
# Set production environment
NODE_ENV=production
PORT=3000
```

#### 2. Database Setup
- Use MongoDB Atlas or production MongoDB instance
- Ensure proper connection string with authentication

#### 3. Process Management
```bash
# Install PM2 for process management
npm install -g pm2

# Start application with PM2
pm2 start index.js --name "goaresort-api"

# Monitor application
pm2 monit

# View logs
pm2 logs goaresort-api
```

#### 4. Reverse Proxy (Nginx)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Docker Deployment

#### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

#### Docker Compose
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGO_URI=mongodb://mongo:27017/goaresort
    depends_on:
      - mongo
  
  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### 1. Fork the Repository
```bash
git clone https://github.com/your-username/goaresort.git
cd goaresort
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/amazing-feature
```

### 3. Make Your Changes
- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed

### 4. Commit Your Changes
```bash
git commit -m "Add amazing feature"
```

### 5. Push to Branch
```bash
git push origin feature/amazing-feature
```

### 6. Create a Pull Request

### Development Guidelines

- **Code Style**: Follow ESLint configuration
- **Testing**: Write tests for new features
- **Documentation**: Update README and API docs
- **Commits**: Use conventional commit messages

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help

- **Documentation**: Check this README first
- **Issues**: Create an issue on GitHub
- **Email**: Contact the development team

### Common Issues

#### MongoDB Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod
```

#### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

#### JWT Token Issues
- Ensure `JWT_SECRET` is set in environment variables
- Check token expiration settings
- Verify token format in Authorization header

## 🔄 Changelog

### Version 1.0.0
- ✅ Initial release
- ✅ User authentication system
- ✅ Enquiry management
- ✅ Admin dashboard
- ✅ Email notifications
- ✅ API documentation

---

**Built with ❤️ for Goa Resort Management**

For more information, visit: [https://crazy-coupons.in](https://crazy-coupons.in)