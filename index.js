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

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Goa Resort API',
        version: '1.0.0',
        endpoints: {
            users: '/api/users',
            enquiries: '/api/enquiries',
            health: '/health'
        }
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
