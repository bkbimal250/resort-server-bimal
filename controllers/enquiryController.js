const Enquiry = require('../models/Enquiry');
const User = require('../models/User');
const validator = require('validator');

// Create Enquiry
const createEnquiry = async (req, res) => {
    try {
        const { name, email, phone, dateOfPlan, subject, message } = req.body;

        // Validation
        if (!name || !email || !phone || !dateOfPlan || !subject || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        // Validate dateOfPlan is a valid date
        const planDate = new Date(dateOfPlan);
        if (isNaN(planDate.getTime())) {
            return res.status(400).json({ message: 'Please provide a valid date for your plan' });
        }

        // Create enquiry
        const enquiry = new Enquiry({
            name,
            email,
            phone,
            dateOfPlan: planDate,
            subject,
            message
        });

        await enquiry.save();

        res.status(201).json({
            message: 'Enquiry submitted successfully',
            enquiry
        });

    } catch (error) {
        console.error('Create enquiry error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get All Enquiries (Admin only)
const getAllEnquiries = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin role required.' });
        }

        const { status, subject, page = 1, limit = 10 } = req.query;
        
        const filter = {};
        if (status) filter.status = status;
        if (subject) filter.subject = subject;

        const enquiries = await Enquiry.find(filter)
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Enquiry.countDocuments(filter);

        res.json({
            enquiries,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });

    } catch (error) {
        console.error('Get all enquiries error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get User's Own Enquiries (for regular users)
const getUserOwnEnquiries = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        
        // Only show enquiries created by the logged-in user
        const filter = { email: req.user.email };

        const enquiries = await Enquiry.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Enquiry.countDocuments(filter);

        res.json({
            enquiries,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });

    } catch (error) {
        console.error('Get user enquiries error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Enquiry by ID
const getEnquiryById = async (req, res) => {
    try {
        const enquiry = await Enquiry.findById(req.params.id)
            .populate('assignedTo', 'name email');

        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }

        res.json({ enquiry });

    } catch (error) {
        console.error('Get enquiry by ID error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update Enquiry Status (Admin only)
const updateEnquiryStatus = async (req, res) => {
    try {
        const { status, assignedTo } = req.body;
        const updateData = {};

        if (status) updateData.status = status;
        if (assignedTo) updateData.assignedTo = assignedTo;

        const enquiry = await Enquiry.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('assignedTo', 'name email');

        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }

        res.json({
            message: 'Enquiry status updated successfully',
            enquiry
        });

    } catch (error) {
        console.error('Update enquiry status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete Enquiry (Admin only)
const deleteEnquiry = async (req, res) => {
    try {
        const enquiry = await Enquiry.findByIdAndDelete(req.params.id);

        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }

        res.json({ message: 'Enquiry deleted successfully' });

    } catch (error) {
        console.error('Delete enquiry error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Enquiries by User (if logged in)
const getUserEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find({ email: req.user.email })
            .sort({ createdAt: -1 });

        res.json({ enquiries });

    } catch (error) {
        console.error('Get user enquiries error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Enquiry Statistics (Admin only)
const getEnquiryStats = async (req, res) => {
    try {
        const totalEnquiries = await Enquiry.countDocuments();
        const pendingEnquiries = await Enquiry.countDocuments({ status: 'pending' });
        const resolvedEnquiries = await Enquiry.countDocuments({ status: 'resolved' });
        
        const enquiryBySubject = await Enquiry.aggregate([
            {
                $group: {
                    _id: '$subject',
                    count: { $sum: 1 }
                }
            }
        ]);

        const enquiryByStatus = await Enquiry.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const recentEnquiries = await Enquiry.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('assignedTo', 'name');

        res.json({
            totalEnquiries,
            pendingEnquiries,
            resolvedEnquiries,
            enquiryBySubject,
            enquiryByStatus,
            recentEnquiries
        });

    } catch (error) {
        console.error('Get enquiry stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createEnquiry,
    getAllEnquiries,
    getUserOwnEnquiries,
    getEnquiryById,
    updateEnquiryStatus,
    deleteEnquiry,
    getUserEnquiries,
    getEnquiryStats
};
