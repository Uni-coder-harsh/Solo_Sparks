const express = require('express');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const Reflection = require('../models/Reflection');
const Quest = require('../models/Quest');
const User = require('../models/User');
const router = express.Router();

// Middleware to verify JWT
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token error:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Submit reflection
router.post('/:questId', auth, async (req, res) => {
  const { type } = req.body;
  const file = req.file;
  const content = req.body.content || '';
  console.log('Reflection request:', { questId: req.params.questId, type, content, file: !!file });

  try {
    const quest = await Quest.findById(req.params.questId);
    if (!quest || quest.userId.toString() !== req.user.userId) {
      return res.status(404).json({ msg: 'Quest not found or unauthorized' });
    }

    let contentUrl = content;
    if (type === 'photo' || type === 'audio') {
      if (!file) {
        return res.status(400).json({ msg: 'File required for photo or audio reflection' });
      }
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: type === 'audio' ? 'video' : 'image', folder: 'solo_sparks' },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        );
        stream.end(file.buffer);
      });
      contentUrl = uploadResult.secure_url;
    } else if (type === 'text' && !content) {
      return res.status(400).json({ msg: 'Text content required' });
    }

    if (!contentUrl) {
      return res.status(400).json({ msg: 'Content cannot be empty' });
    }

    const reflection = new Reflection({
      userId: req.user.userId,
      questId: req.params.questId,
      type,
      content: contentUrl,
    });

    await reflection.save();
    console.log('Reflection saved:', reflection);

    // Mark quest as completed and award points
    quest.completed = true;
    await quest.save();

    const user = await User.findById(req.user.userId);
    user.sparkPoints += quest.points;
    await user.save();

    res.json(reflection);
  } catch (err) {
    console.error('Reflection error:', err.message);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
});

module.exports = router;