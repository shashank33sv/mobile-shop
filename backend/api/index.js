const express = require('express'); 
const cors = require('cors');
const connectToDatabase = require('../utils/db'); // new db helper
require('dotenv').config();

// --- Import routes ---
const authRoutes = require('../routes/auth');
const billsRoutes = require('../routes/bills');
const servicesRoutes = require('../routes/services');
const investmentsRoutes = require('../routes/investments');
const productsRoutes = require('../routes/products');
const profitRoutes = require('../routes/profits');
const { authenticate } = require('../controllers/authController');

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Connect to MongoDB for each serverless invocation ---
connectToDatabase(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/public/products', productsRoutes);
app.use('/api/bills', authenticate, billsRoutes);
app.use('/api/services', authenticate, servicesRoutes);
app.use('/api/investments', authenticate, investmentsRoutes);
app.use('/api/profits', authenticate, profitRoutes);
app.use('/api/products', authenticate, productsRoutes);

// Root endpoint
app.get('/api', (req, res) => res.send('API is running'));

// --- Export for Vercel ---
module.exports = app;
