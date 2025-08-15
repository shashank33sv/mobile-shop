const mongoose = require('mongoose');

const ProfitSchema = new mongoose.Schema({
  type: { type: String, enum: ['daily', 'monthly'], required: true },
  date: { type: String, required: true },  // YYYY-MM-DD or YYYY-MM
  profit: { type: Number, required: true },
}, { timestamps: true });

ProfitSchema.index({ type: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Profit', ProfitSchema);
