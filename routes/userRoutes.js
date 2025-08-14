const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, adminAuth } = require('../middlewares/auth');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes (require authentication)
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);

// Admin only routes
router.get('/all', adminAuth, userController.getAllUsers);
router.post('/admin', adminAuth, userController.createAdmin);

module.exports = router;
