const express = require('express');
const cors = require('cors');
const connectToDatabase = require('../utils/db');
require('dotenv').config();
const serverless = require('serverless-http');

// Import routes
const authRoutes = require('../routes/auth');
const billsRoutes = require('../routes/bills');
const servicesRoutes = require('../routes/services');
const investmentsRoutes = require('../routes/investments');
const productsRoutes = require('../routes/products');
const profitRoutes = require('../routes/profits');
const { authenticate } = require('../controllers/authController');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ensure DB connection before handling requests
app.use(async (req, res, next) => {
  try {
    await connectToDatabase(process.env.MONGO_URI);
    next();
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    res.status(500).json({ error: 'DB connection failed' });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/public/products', productsRoutes);
app.use('/api/bills', authenticate, billsRoutes);
app.use('/api/services', authenticate, servicesRoutes);
app.use('/api/investments', authenticate, investmentsRoutes);
app.use('/api/profits', authenticate, profitRoutes);
app.use('/api/products', authenticate, productsRoutes);

// Root
app.get('/api', (req, res) => res.send('API is running'));

// Export wrapped app for Vercel
module.exports = serverless(app);
