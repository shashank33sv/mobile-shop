const Bill = require('../models/Bill');
const Product = require('../models/Product');

exports.getAll = async (req, res) => {
  try {
    const bills = await Bill.find().sort({ date: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
};

exports.create = async (req, res) => {
  try {
    const bill = new Bill(req.body);
    await bill.save();

    // Update product stocks on bill creation
    if (bill.items && Array.isArray(bill.items)) {
      for (const item of bill.items) {
        if (!item.productId) continue; // Only adjust stock for items linked to products

        const product = await Product.findById(item.productId);
        if (!product) continue;

        product.quantity -= item.qty;
        if (product.quantity <= 0) {
          await product.deleteOne();
        } else {
          await product.save();
        }
      }
    }

    res.json(bill);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create bill' });
  }
};
