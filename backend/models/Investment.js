// backend/models/investment.js
const mongoose = require('mongoose');

const InvestmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Prevent OverwriteModelError by reusing existing model if present
module.exports = mongoose.models.Investment || mongoose.model('Investment', InvestmentSchema);
