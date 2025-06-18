const express = require('express');
const jwt = require('jsonwebtoken');
const Quest = require('../models/Quest');
const User = require('../models/User');
const router = express.Router();

// Middleware to verify JWT
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Received token:', token); // Debug token
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debug decoded
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token error:', err); // Debug error
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Get user's active quests
router.get('/', auth, async (req, res) => {
  try {
    const quests = await Quest.find({ userId: req.user.userId, completed: false });
    console.log('Fetched quests for user:', req.user.userId, quests); // Debug
    res.json(quests);
  } catch (err) {
    console.error('Fetch quests error:', err); // Debug
    res.status(500).json({ msg: 'Server error' });
  }
});

// Generate new quest
router.post('/generate', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    console.log('User found:', user); // Debug user
    const mood = user.mood || 'neutral';
    const questPool = {
      reflection: [
        { title: 'Sunset Reflection', description: 'Watch a sunset and journal your thoughts.', points: 10 },
        { title: 'Gratitude List', description: 'Write 5 things you’re grateful for.', points: 8 },
      ],
      adventure: [
        { title: 'Explore a Park', description: 'Visit a new park and take a photo.', points: 15 },
      ],
      'self-care': [
        { title: 'Solo Dessert', description: 'Treat yourself to a dessert alone.', points: 12 },
      ],
    };

    const category = mood === 'sad' ? 'self-care' : mood === 'happy' ? 'adventure' : 'reflection';
    const quests = questPool[category];
    const newQuest = quests[Math.floor(Math.random() * quests.length)];

    const quest = new Quest({
      userId: req.user.userId,
      title: newQuest.title,
      description: newQuest.description,
      type: 'daily',
      category,
      points: newQuest.points,
    });

    await quest.save();
    console.log('Saved quest:', quest); // Debug
    res.json(quest);
  } catch (err) {
    console.error('Generate quest error:', err); // Debug
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;