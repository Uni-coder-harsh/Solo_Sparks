const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  points: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  userResponse: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Quest', questSchema);