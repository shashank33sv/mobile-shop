const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const billsRoutes = require('./routes/bills');
const servicesRoutes = require('./routes/services');
const investmentsRoutes = require('./routes/investments');
const productsRoutes = require('./routes/products');
const profitRoutes = require('./routes/profits');

const { authenticate } = require('./controllers/authController');

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/public/products', productsRoutes); // public products
app.use('/api/bills', authenticate, billsRoutes);
app.use('/api/services', authenticate, servicesRoutes);
app.use('/api/investments', authenticate, investmentsRoutes);
app.use('/api/profits', authenticate, profitRoutes);
app.use('/api/products', authenticate, productsRoutes); // protected products

// Root endpoint
app.get('/', (req, res) => {
  res.send('API is running');
});


// General error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;