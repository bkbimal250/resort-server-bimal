const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');
const { auth, adminAuth } = require('../middlewares/auth');

// Public route (anyone can submit an enquiry)
router.post('/', enquiryController.createEnquiry);

// User routes (require authentication)
router.get('/my-enquiries', auth, enquiryController.getUserOwnEnquiries);

// Admin only routes
router.get('/', auth, enquiryController.getAllEnquiries); // Changed from adminAuth to auth, role check is inside controller
router.get('/stats', adminAuth, enquiryController.getEnquiryStats);
router.get('/:id', adminAuth, enquiryController.getEnquiryById);
router.put('/:id/status', adminAuth, enquiryController.updateEnquiryStatus);
router.delete('/:id', adminAuth, enquiryController.deleteEnquiry);

module.exports = router;
