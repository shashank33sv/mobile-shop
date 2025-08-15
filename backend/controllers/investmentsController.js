const Investment = require('../models/investment'); // make sure the filename matches exactly

// GET all investments
exports.getAll = async (req, res) => {
  try {
    const investments = await Investment.find().sort({ date: -1 });
    res.json(investments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch investments' });
  }
};

// GET investment by ID
exports.getById = async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id);
    if (!investment) return res.status(404).json({ error: 'Investment not found' });
    res.json(investment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch investment' });
  }
};

// CREATE new investment
exports.create = async (req, res) => {
  try {
    const investment = new Investment(req.body);
    await investment.save();
    res.json(investment);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create investment' });
  }
};

// UPDATE investment
exports.update = async (req, res) => {
  try {
    const investment = await Investment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!investment) return res.status(404).json({ error: 'Investment not found' });
    res.json(investment);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update investment' });
  }
};

// DELETE investment
exports.delete = async (req, res) => {
  try {
    await Investment.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete investment' });
  }
};
