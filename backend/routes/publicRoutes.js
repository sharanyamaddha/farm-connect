// routes/publicRoutes.js
const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

// ✅ GET all available fruits from inventory
router.get('/available-fruits', async (req, res) => {
  try {
    const fruits = await Inventory.find({ category: 'Fruits', quantity: { $gt: 0 } });

    // Group by productName (avoid duplicates)
    const uniqueFruits = Array.from(
      new Map(fruits.map(item => [item.productName, item])).values()
    );

    res.json(uniqueFruits);
  } catch (err) {
    console.error('❌ Error fetching fruits:', err);
    res.status(500).json({ message: 'Failed to load available fruits' });
  }
});

module.exports = router;
