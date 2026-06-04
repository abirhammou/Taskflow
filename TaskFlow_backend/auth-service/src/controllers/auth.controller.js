const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (user) =>
    jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

// POST /auth/register
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ message: 'Email already in use' });

        // ✅ role is always USER — cannot be set from outside
        const user = new User({ username, email, password, role: 'USER' });
        await user.save();

        const token = generateToken(user);
        res.status(201).json({
            token,
            user: { id: user._id, username: user.username, email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const valid = await user.comparePassword(password);
        if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

        const token = generateToken(user);
        res.json({
            token,
            user: { id: user._id, username: user.username, email, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /auth/validate
exports.validate = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.status(401).json({ valid: false });

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ valid: true, user: decoded });
    } catch {
        res.status(401).json({ valid: false, message: 'Invalid or expired token' });
    }
};

// GET /auth/users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /auth/users/:id
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /auth/profile/:id
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /auth/profile/:id
exports.updateProfile = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const updateData = {};

        if (username) updateData.username = username;
        if (email)    updateData.email    = email;
        if (password) {
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({
            user: { id: user._id, username: user.username, email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};