const express = require('express');
const jwt = require('jsonwebtoken');
const Reward = require('../models/Reward');
const User = require('../models/User');
const router = express.Router();

// Middleware to verify JWT
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token error:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Get available rewards
router.get('/', async (req, res) => {
  try {
    const rewards = await Reward.find({ available: true });
    res.json(rewards);
  } catch (err) {
    console.error('Rewards error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Redeem reward
router.post('/redeem/:rewardId', auth, async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.rewardId);
    if (!reward || !reward.available) {
      return res.status(404).json({ msg: 'Reward not found or unavailable' });
    }

    const user = await User.findById(req.user.userId);
    if (user.sparkPoints < reward.pointsCost) {
      return res.status(400).json({ msg: 'Insufficient points' });
    }

    user.sparkPoints -= reward.pointsCost;
    reward.redeemedBy.push(user._id);
    await user.save();
    await reward.save();

    res.json({ msg: 'Reward redeemed!', user });
  } catch (err) {
    console.error('Redeem error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;