const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Quest = require('../models/Quest');
const User = require('../models/User');
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer({ dest: './uploads/' });

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

const generatePersonalizedQuest = async (user) => {
  const baseQuests = [
    { title: 'Write a Love Letter', description: 'Pen a romantic letter.', category: 'romance', difficulty: 'easy', points: 10 },
    { title: 'Plan a Star Date', description: 'Plan a date under the stars.', category: 'connection', difficulty: 'medium', points: 20 },
    { title: 'Meditate Under the Stars', description: 'Meditate outdoors at night.', category: 'self', difficulty: 'hard', points: 30 },
    { title: 'Create a Poem', description: 'Write a short poem about your feelings.', category: 'creativity', difficulty: 'easy', points: 15 },
    { title: 'Gratitude Journal', description: 'List three things you’re grateful for.', category: 'mindfulness', difficulty: 'easy', points: 10 }
  ];

  const moodWeight = { Romantic: 1.2, Dreamy: 1.1, Hopeful: 1.0, Neutral: 0.9, Sad: 0.8, Stressed: 0.7 };
  const categoryPreference = user.emotionalNeeds.length ? user.emotionalNeeds.reduce((a, c) => ({ ...a, [c.toLowerCase()]: (a[c.toLowerCase()] || 0) + 1 }), {}) : { self: 1 };

  const weightedQuests = baseQuests.map(quest => {
    let weight = moodWeight[user.mood] || 1.0;
    weight *= categoryPreference[quest.category] || 1.0;
    weight *= quest.difficulty === 'easy' ? 1.0 : quest.difficulty === 'medium' ? 1.2 : 1.5;
    return { ...quest, weight };
  });

  const selectedQuest = weightedQuests.reduce((max, current) => max.weight > current.weight ? max : current, weightedQuests[0]);
  return new Quest({ userId: user._id, ...selectedQuest });
};

router.get('/', auth, async (req, res) => {
  try {
    const quests = await Quest.find({ userId: req.userId, status: 'pending' });
    res.json(quests);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/generate', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    const newQuest = await generatePersonalizedQuest(user);
    await newQuest.save();
    res.json(newQuest);
  } catch (err) {
    console.error('Generate quest error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/complete/:id', auth, upload.single('photo'), async (req, res) => {
  try {
    const { id } = req.params;
    const response = req.body.response;
    if (!response || typeof response !== 'string' || response.trim() === '') {
      return res.status(400).json({ msg: 'A valid response is required' });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Invalid quest ID' });
    }
    const quest = await Quest.findOneAndUpdate(
      { _id: id, userId: req.userId, status: 'pending' },
      { status: 'completed', userResponse: response },
      { new: true, runValidators: true }
    );
    if (!quest) return res.status(404).json({ msg: 'Quest not found or already completed' });
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    user.sparkPoints = Number.isNaN(user.sparkPoints) ? 0 : user.sparkPoints;
    user.markModified('sparkPoints');
    user.sparkPoints += quest.points;
    user.analytics = user.analytics || { completions: 0, growth: 0 };
    user.analytics.completions += 1;
    user.analytics.growth = Math.min(100, user.analytics.growth + (quest.points / 100));
    if (user.analytics.completions >= 10 && !user.rewards.includes('Cosmic Badge')) {
      user.rewards.push('Cosmic Badge');
    }
    if (user.sparkPoints >= 50 && !user.rewards.includes('Profile Boost')) {
      user.rewards.push('Profile Boost');
    }
    if (user.sparkPoints >= 100 && !user.rewards.includes('Exclusive Prompt')) {
      user.rewards.push('Exclusive Prompt');
    }
    await user.save();
    res.json({
      quest,
      updatedPoints: user.sparkPoints,
      rewards: user.rewards,
      analytics: user.analytics
    });
  } catch (err) {
    console.error('Complete quest error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;