const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Or use your Cloudinary storage

// Password validation helper
function validatePassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}

// Middleware to authenticate user
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied.' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ msg: 'Token is not valid.' });
  }
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, mood, personality, emotionalNeeds } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Name, email, and password are required.' });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({
        msg: 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.'
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists.' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      mood: mood || 'Neutral',
      personality: personality || {},
      emotionalNeeds: emotionalNeeds || []
    });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.error('Register error:', err, req.body);
    res.status(500).json({ msg: 'Server error. Please try again later.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: 'Email and password are required.' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found.' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Incorrect password.' });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err, req.body);
    res.status(500).json({ msg: 'Server error. Please try again later.' });
  }
});

// GET current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

// PUT update profile (with optional avatar upload)
router.put('/me', authMiddleware, upload.single('reflectionPhoto'), async (req, res) => {
  try {
    const update = {
      name: req.body.name,
      mood: req.body.mood,
      emotionalNeeds: req.body.emotionalNeeds?.split(',').map(s => s.trim())
    };
    if (req.file) {
      update.avatar = `/uploads/${req.file.filename}`;
    }
    const user = await User.findByIdAndUpdate(req.userId, update, { new: true }).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

module.exports = router;