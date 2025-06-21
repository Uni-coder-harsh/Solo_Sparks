const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const questRoutes = require('./routes/quests');
const analyticsRoutes = require('./routes/analytics');
const rewardsRoutes = require('./routes/rewards');
require('dotenv').config();
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:3000', // for local development
    'https://solo-sparks-xkwc.onrender.com' // your deployed frontend
  ],
  methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cosmic-journey',
    allowed_formats: ['jpg', 'png', 'mp3']
  }
});
const upload = multer({ storage });

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/uploads', express.static('uploads'));

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.get('/mongo-test', async (req, res) => {
  try {
    // Try a simple MongoDB command
    await mongoose.connection.db.admin().ping();
    res.send('MongoDB connection: OK');
  } catch (err) {
    console.error('MongoDB test error:', err);
    res.status(500).send('MongoDB connection: ERROR');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));