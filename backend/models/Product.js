const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },       // Selling price per unit
  cost: { type: Number, default: 0 },            // Purchase cost per unit
  quantity: { type: Number, required: true, default: 0 }, // Stock quantity
  image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
