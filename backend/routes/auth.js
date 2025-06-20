const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
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

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update profile (details or avatar)
router.put('/me', upload.single('reflectionPhoto'), async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ msg: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    // Update details if present
    if (req.body.name) user.name = req.body.name;
    if (req.body.mood) user.mood = req.body.mood;
    if (req.body.emotionalNeeds) {
      // Accept either array or comma-separated string
      if (Array.isArray(req.body.emotionalNeeds)) {
        user.emotionalNeeds = req.body.emotionalNeeds;
      } else if (typeof req.body.emotionalNeeds === 'string') {
        try {
          // Try to parse JSON array
          user.emotionalNeeds = JSON.parse(req.body.emotionalNeeds);
        } catch {
          // Fallback: split by comma
          user.emotionalNeeds = req.body.emotionalNeeds.split(',').map(s => s.trim());
        }
      }
    }

    // Update avatar if file uploaded
    if (req.file) {
      user.avatar = `/uploads/${req.file.filename}`;
    }

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/onboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    const { personality, mood, emotionalNeeds } = req.body;
    user.personality = { ...user.personality, ...personality };
    user.mood = mood;
    user.emotionalNeeds = emotionalNeeds;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/submissions', [auth, upload.fields([{ name: 'photo' }, { name: 'audio' }])], async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    const { text } = req.body;
    if (text) user.reflections.text = text;
    if (req.files['photo']) user.reflections.photo = `/uploads/${req.files['photo'][0].filename}`;
    if (req.files['audio']) user.reflections.audio = `/uploads/${req.files['audio'][0].filename}`;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/redeem/:rewardId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    const rewardId = req.params.rewardId;
    if (user.rewards.includes(rewardId)) return res.status(400).json({ msg: 'Reward already redeemed' });
    if (rewardId === 'Profile Boost' && user.sparkPoints >= 50) {
      user.rewards.push(rewardId);
      user.sparkPoints -= 50;
    } else if (rewardId === 'Exclusive Prompt' && user.sparkPoints >= 100) {
      user.rewards.push(rewardId);
      user.sparkPoints -= 100;
    } else {
      return res.status(400).json({ msg: 'Insufficient spark points' });
    }
    await user.save();
    res.json({ sparkPoints: user.sparkPoints, rewards: user.rewards });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;