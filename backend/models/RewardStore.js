const mongoose = require('mongoose');

const rewardStoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  cost: { type: Number, required: true },
  imageUrl: String // Optional
});

module.exports = mongoose.model('RewardStore', rewardStoreSchema, 'rewardstores');