const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  sparkPoints: { type: Number, default: 0, min: 0 },
  mood: { type: String, default: 'Neutral' },
  personality: {
    loveType: { type: String, default: '' },
    openness: { type: Number, min: 0, max: 1, default: 0.5 },
    extraversion: { type: Number, min: 0, max: 1, default: 0.5 },
    conscientiousness: { type: Number, min: 0, max: 1, default: 0.5 },
  },
  emotionalNeeds: [{ type: String }],
  rewards: [{ type: String }],
  analytics: {
    completions: { type: Number, default: 0 },
    growth: { type: Number, default: 0 }
  },
  avatar: { type: String }
});

module.exports = mongoose.model('User', userSchema, 'users');

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Or use Cloudinary storage

// ...authMiddleware as before...

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