require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const authRoutes = require('./routes/auth');
const questRoutes = require('./routes/quests');
const reflectionRoutes = require('./routes/reflections');
const rewardRoutes = require('./routes/rewards');

const app = express();
const PORT = process.env.PORT || 5000;

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Config
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/reflections', upload.single('file'), reflectionRoutes); // Add multer
app.use('/api/rewards', rewardRoutes);

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/solo_sparks', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});