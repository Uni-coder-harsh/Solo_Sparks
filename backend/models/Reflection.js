const mongoose = require('mongoose');

const reflectionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quest', required: true },
  type: { type: String, enum: ['text', 'photo', 'audio'], required: true },
  content: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Reflection', reflectionSchema, 'reflections');