const User = require('../models/User');
const jwt = require('jsonwebtoken');
const validator = require('validator');

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register User
const register = async (req, res) => {
    try {
        console.log('Registration request received');
        console.log('Request headers:', req.headers);
        console.log('Request body:', req.body);
        console.log('Request method:', req.method);
        console.log('Request URL:', req.url);

        const { name, username, email, phone, password } = req.body;

        // Validation
        if (!name || !username || !email || !phone || !password) {
            console.log('Missing required fields:', { name, username, email, phone, password: password ? 'provided' : 'missing' });
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        // Name validation
        if (name.trim().length < 2) {
            return res.status(400).json({ message: 'Name must be at least 2 characters long' });
        }

        // Email validation
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        // Phone validation (allowing various formats)
        const cleanPhone = phone.replace(/\s+/g, '').replace(/[()-]/g, '');
        if (!validator.isMobilePhone(cleanPhone, 'any')) {
            return res.status(400).json({ message: 'Please provide a valid phone number' });
        }

        // Username validation
        if (username.length < 3 || username.length > 20) {
            return res.status(400).json({ message: 'Username must be between 3 and 20 characters' });
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return res.status(400).json({ message: 'Username can only contain letters, numbers, and underscores' });
        }

        // Password validation
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { username: username.toLowerCase() }
            ]
        });

        if (existingUser) {
            return res.status(400).json({ 
                message: existingUser.email === email.toLowerCase() ? 'Email already registered' : 'Username already taken' 
            });
        }

        // Create new user
        const user = new User({
            name: name.trim(),
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            phone: cleanPhone,
            password
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        console.log('User registered successfully:', user.username);
        res.status(201).json({
            message: 'User registered successfully',
            user: user.toJSON(),
            token
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// Login User (with email or username)
const login = async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;

        if (!emailOrUsername || !password) {
            return res.status(400).json({ message: 'Email/Username and password are required' });
        }

        // Find user by email or username
        const user = await User.findOne({
            $or: [
                { email: emailOrUsername.toLowerCase() },
                { username: emailOrUsername.toLowerCase() }
            ]
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!user.isActive) {
            return res.status(401).json({ message: 'Account is deactivated' });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            message: 'Login successful',
            user: user.toJSON(),
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// Get User Profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user: user.toJSON() });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update User Profile
const updateProfile = async (req, res) => {
    try {
        const { name, email, phone, address, dateOfBirth, username, profilePicture } = req.body;
        const updateData = {};

        // Validate and add fields to update
        if (name !== undefined) {
            if (name.trim().length < 2) {
                return res.status(400).json({ message: 'Name must be at least 2 characters long' });
            }
            updateData.name = name.trim();
        }

        if (email !== undefined) {
            if (!validator.isEmail(email)) {
                return res.status(400).json({ message: 'Please provide a valid email address' });
            }
            
            // Check if email is already taken by another user
            const existingEmail = await User.findOne({ 
                email: email.toLowerCase(), 
                _id: { $ne: req.user._id } 
            });
            if (existingEmail) {
                return res.status(400).json({ message: 'Email already registered by another user' });
            }
            updateData.email = email.toLowerCase();
        }

        if (phone !== undefined) {
            const cleanPhone = phone.replace(/\s+/g, '').replace(/[()-]/g, '');
            if (!validator.isMobilePhone(cleanPhone, 'any')) {
                return res.status(400).json({ message: 'Please provide a valid phone number' });
            }
            
            // Check if phone is already taken by another user
            const existingPhone = await User.findOne({ 
                phone: cleanPhone, 
                _id: { $ne: req.user._id } 
            });
            if (existingPhone) {
                return res.status(400).json({ message: 'Phone number already registered by another user' });
            }
            updateData.phone = cleanPhone;
        }

        if (username !== undefined) {
            if (username.length < 3 || username.length > 20) {
                return res.status(400).json({ message: 'Username must be between 3 and 20 characters' });
            }
            if (!/^[a-zA-Z0-9_]+$/.test(username)) {
                return res.status(400).json({ message: 'Username can only contain letters, numbers, and underscores' });
            }
            
            // Check if username is already taken by another user
            const existingUsername = await User.findOne({ 
                username: username.toLowerCase(), 
                _id: { $ne: req.user._id } 
            });
            if (existingUsername) {
                return res.status(400).json({ message: 'Username already taken' });
            }
            updateData.username = username.toLowerCase();
        }

        if (address !== undefined) {
            // Handle address as an object or string
            if (typeof address === 'object') {
                updateData.address = {
                    street: address.street || '',
                    city: address.city || '',
                    state: address.state || '',
                    zipCode: address.zipCode || '',
                    country: address.country || ''
                };
            } else {
                // If address is a string, store it in street field
                updateData.address = {
                    street: address.trim(),
                    city: '',
                    state: '',
                    zipCode: '',
                    country: ''
                };
            }
        }

        if (dateOfBirth !== undefined) {
            if (dateOfBirth && !validator.isDate(dateOfBirth)) {
                return res.status(400).json({ message: 'Please provide a valid date of birth' });
            }
            updateData.dateOfBirth = dateOfBirth;
        }

        if (profilePicture !== undefined) {
            updateData.profilePicture = profilePicture;
        }

        // Update user
        const user = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            user: user.toJSON()
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get All Users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json({ users });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create Admin User (Admin only)
const createAdmin = async (req, res) => {
    try {
        const { name, username, email, phone, password } = req.body;

        if (!name || !username || !email || !phone || !password) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        // Name validation
        if (name.trim().length < 2) {
            return res.status(400).json({ message: 'Name must be at least 2 characters long' });
        }

        // Email validation
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        // Phone validation
        const cleanPhone = phone.replace(/\s+/g, '').replace(/[()-]/g, '');
        if (!validator.isMobilePhone(cleanPhone, 'any')) {
            return res.status(400).json({ message: 'Please provide a valid phone number' });
        }

        // Username validation
        if (username.length < 3 || username.length > 20) {
            return res.status(400).json({ message: 'Username must be between 3 and 20 characters' });
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return res.status(400).json({ message: 'Username can only contain letters, numbers, and underscores' });
        }

        // Password validation
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const existingUser = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { username: username.toLowerCase() }
            ]
        });

        if (existingUser) {
            return res.status(400).json({ 
                message: existingUser.email === email.toLowerCase() ? 'Email already registered' : 'Username already taken' 
            });
        }

        const adminUser = new User({
            name: name.trim(),
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            phone: cleanPhone,
            password,
            role: 'admin'
        });

        await adminUser.save();

        res.status(201).json({
            message: 'Admin user created successfully',
            user: adminUser.toJSON()
        });

    } catch (error) {
        console.error('Create admin error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    getAllUsers,
    createAdmin
};
