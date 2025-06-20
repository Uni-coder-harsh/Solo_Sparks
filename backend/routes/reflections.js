const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Reflection = require('../models/Reflection');

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

router.post('/:questId', auth, async (req, res) => {
  const { type, content } = req.body;
  try {
    const reflection = new Reflection({ userId: req.userId, questId: req.params.questId, type, content });
    await reflection.save();
    res.json(reflection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;