const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  personality: { type: Object, default: {} },
  mood: { type: String, default: '' },
  questsCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quest' }],
  sparkPoints: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', userSchema);