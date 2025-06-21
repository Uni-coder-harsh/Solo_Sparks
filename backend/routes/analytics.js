const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Quest = require('../models/Quest');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

router.get('/mood-trend', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json([{ date: new Date(), moodScore: user.mood === 'Romantic' ? 0.8 : 0.5 }]); // Simplified example
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/analytics
router.get('/', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalQuests = await Quest.countDocuments({ status: 'completed' });
    const moods = await User.aggregate([
      { $group: { _id: '$mood', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json({
      totalUsers,
      totalQuests,
      popularMood: moods[0]?._id || 'Neutral'
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Trending Quests: Most completed quests by title
router.get('/trending-quests', async (req, res) => {
  try {
    const trending = await Quest.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$title', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    res.json(trending);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch trending quests' });
  }
});

// Trending Rewards: Most redeemed rewards by name
router.get('/trending-rewards', async (req, res) => {
  try {
    const trending = await User.aggregate([
      { $unwind: '$rewards' },
      { $group: { _id: '$rewards', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    res.json(trending);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch trending rewards' });
  }
});

module.exports = router;