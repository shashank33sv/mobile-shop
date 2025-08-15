const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// --- Import all your route files ---
const authRoutes = require('../routes/auth');
const billsRoutes = require('../routes/bills');
const servicesRoutes = require('../routes/services');
const investmentsRoutes = require('../routes/investments');
const productsRoutes = require('../routes/products');
const profitRoutes = require('../routes/profits');
const { authenticate } = require('../controllers/authController');

const app = express();

// --- Middleware ---
// Note: Vercel handles the frontend URL, so a simple cors() setup is often enough.
app.use(cors());
app.use(express.json());

// --- Database Connection ---
// This connects to MongoDB when the serverless function starts.
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));


// --- API Routes ---
// These are your existing API endpoints.
app.use('/api/auth', authRoutes);
app.use('/api/public/products', productsRoutes);
app.use('/api/bills', authenticate, billsRoutes);
app.use('/api/services', authenticate, servicesRoutes);
app.use('/api/investments', authenticate, investmentsRoutes);
app.use('/api/profits', authenticate, profitRoutes);
app.use('/api/products', authenticate, productsRoutes);

// Root endpoint for the API
app.get('/api', (req, res) => {
  res.send('API is running');
});

// --- Export the app for Vercel ---
// This is the crucial part that allows Vercel to use your Express app.
module.exports = app;