const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  sparkPoints: { type: Number, default: 0, min: 0 },
  mood: { type: String, enum: ['Romantic', 'Dreamy', 'Hopeful', 'Neutral', 'Sad', 'Stressed'], default: 'Neutral' },
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

module.exports = mongoose.model('User', userSchema);