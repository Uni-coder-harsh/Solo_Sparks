const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  cost: { type: Number, required: true },
  type: { type: String, enum: ['profile_boost', 'exclusive_prompt'], required: true }
});

module.exports = mongoose.model('Reward', rewardSchema);