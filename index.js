const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const allowedOrigins = [
    'http://localhost:5173',
    'https://crazy-coupons.in',
    'https://resort-server-bimal.onrender.com'
  ];
  
  // CORS options with origin check
  const corsOptions = {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
  
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  };
  
  // Apply CORS middleware with options
  app.use(cors(corsOptions));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://crazycoupons08:YBgTsd6ugps1nsg9@cluster0.im6cmnt.mongodb.net/crazycoupons')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
const userRoutes = require('./routes/userRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');



app.use('/api/users', userRoutes);
app.use('/api/enquiries', enquiryRoutes);

// Health check route
app.get('/health', (req, res) => {
    res.json({ 
        message: 'Goa Resort API is running',
        timestamp: new Date().toISOString(),
        status: 'healthy'
    });
});



// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Documentation: http://localhost:${PORT}`);
});
