const express = require('express');
const router = express.Router();
const RewardStore = require('../models/RewardStore');

// Get all rewards in the store
router.get('/', async (req, res) => {
  try {
    const rewards = await RewardStore.find();
    res.json(rewards);
  } catch (err) {
    console.error('Fetch reward store error:', err);
    res.status(500).json({ msg: 'Failed to fetch rewards' });
  }
});

module.exports = router;