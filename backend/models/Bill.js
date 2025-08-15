const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String },
  customerEmail: { type: String },
  type: { type: String, enum: ['Sale', 'Service'], default: 'Sale' },
  items: [{
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false }
  }],
  amount: { type: Number, required: true },
  date: { type: String, required: true }, // e.g., "2023-07-25"
}, { timestamps: true });

module.exports = mongoose.model('Bill', BillSchema);
