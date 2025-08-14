
const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const verifyToken = require('../middleware/verifyToken');
const Farmer = require('../models/Farmer');
const Category = require('../models/Category');

// ✅ Bulk add/update inventory route (accepts array directly)
router.post('/add-bulk', verifyToken, async (req, res) => {
  try {
    const farmerId = req.user.id;
    const newProducts = req.body; // ✅ Accepts array directly from frontend

    if (!Array.isArray(newProducts)) {
      return res.status(400).json({ message: "❌ Invalid payload: Expected an array of products" });
    }

    const inventoryDoc = await Inventory.findOne({ farmerId });

    if (inventoryDoc) {
      // Update existing farmer’s inventory
      newProducts.forEach((newProd) => {
        const index = inventoryDoc.products.findIndex(
          (p) => p.productId.toString() === newProd.productId
        );

        const totalPrice = newProd.quantity * newProd.pricePerUnit;

        if (index !== -1) {
          // Update existing product
          inventoryDoc.products[index] = {
            ...inventoryDoc.products[index],
            quantity: newProd.quantity,
            pricePerUnit: newProd.pricePerUnit,
            totalPrice,
          };
        } else {
          // Add new product
          inventoryDoc.products.push({ ...newProd, totalPrice });
        }
      });

      inventoryDoc.updatedAt = new Date();
      await inventoryDoc.save();
    } else {
      // Create new inventory document
      const productsWithTotal = newProducts.map((p) => ({
        ...p,
        totalPrice: p.quantity * p.pricePerUnit,
      }));

      const newInventory = new Inventory({
        farmerId,
        products: productsWithTotal,
      });

      await newInventory.save();
    }

    res.status(200).json({ message: '✅ Inventory saved for farmer' });
  } catch (err) {
    console.error('❌ Error in saving inventory:', err);
    res.status(500).json({ message: '❌ Server error' });
  }
});

// ✅ Get all inventory items of the logged-in farmer
router.get('/my-products', verifyToken, async (req, res) => {
  try {
    const farmerId = req.user.id;
    const inventory = await Inventory.findOne({ farmerId });

    if (!inventory) {
      return res.status(200).json([]);
    }

    res.status(200).json(inventory.products);
  } catch (err) {
    console.error("❌ Failed to fetch inventory", err);
    res.status(500).json({ message: "❌ Failed to fetch inventory" });
  }
});

// ✅ Fetch all fruits from all inventories
router.get('/available/fruits', async (req, res) => {
  try {
    const fruitCategory = await Category.findOne({ name: { $regex: /^fruits$/i } });

    if (!fruitCategory) {
      return res.status(404).json({ error: 'Fruits category not found' });
    }

    const fruitCategoryId = fruitCategory._id;

    const inventoryDocs = await Inventory.find({})
      .populate('products.category', 'name')
      .populate('products.subcategory', 'name')
      .populate('farmerId', 'fullName');

    const fruitProducts = [];

    inventoryDocs.forEach(doc => {
      doc.products.forEach(prod => {
        const isFruit = prod.category?.toString() === fruitCategoryId.toString();
        if (isFruit && prod.quantity > 0) {
          fruitProducts.push({
            ...prod._doc,
            farmer: doc.farmerId
          });
        }
      });
    });

    res.status(200).json(fruitProducts);
  } catch (err) {
    console.error("❌ Error fetching fruits:", err);
    res.status(500).json({ error: 'Failed to fetch fruits' });
  }
});

module.exports = router;

