const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

// Load environment variables from root .env
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = require('./app');

const PORT = process.env.PORT || 5000;

// Serve React build files in production mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
}

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });
