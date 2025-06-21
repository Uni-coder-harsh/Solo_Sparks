
const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  points: { type: Number, default: 10 },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  userResponse: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quest', questSchema);