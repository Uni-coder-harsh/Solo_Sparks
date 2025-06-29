const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Reward = require('../models/Reward');
const User = require('../models/User');

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

router.get('/', async (req, res) => {
  try {
    const rewards = await Reward.find();
    res.json(rewards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/redeem/:id', auth, async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.id);
    const user = await User.findById(req.userId);
    if (user.sparkPoints >= reward.cost) {
      user.sparkPoints -= reward.cost;
      await user.save();
      res.json({ msg: 'Reward redeemed' });
    } else {
      res.status(400).json({ msg: 'Not enough points' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;