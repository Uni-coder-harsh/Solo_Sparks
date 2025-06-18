require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/solo_sparks', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Basic Route
app.get('/', (req, res) => {
  res.send('Solo Sparks Backend');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});