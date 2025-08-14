const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', unique: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      productName: String,
      category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
      subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' },
      quantity: Number,
      pricePerUnit: Number,
      totalPrice: Number,
    }
  ],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inventory', inventorySchema);
