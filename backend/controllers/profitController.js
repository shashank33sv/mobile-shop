const Profit = require('../models/Profit');

// GET all profits
exports.getProfit = async (req, res) => {
  try {
    const profits = await Profit.find().sort({ date: -1 });
    res.json(profits);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profits' });
  }
};

// CREATE or UPDATE profit
exports.createOrUpdateProfit = async (req, res) => {
  try {
    const profit = await Profit.findOneAndUpdate(
      { investmentId: req.body.investmentId },
      req.body,
      { upsert: true, new: true }
    );
    res.json(profit);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create/update profit' });
  }
};

// RECALCULATE profits
exports.calculateAndStoreProfits = async (req, res) => {
  try {
    // Add your profit calculation logic here
    res.json({ success: true, message: 'Profits recalculated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to recalculate profits' });
  }
};
