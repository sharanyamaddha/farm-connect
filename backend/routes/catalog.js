const express = require('express');
const router = express.Router();

const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const Product = require('../models/Product');

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

// ✅ Get subcategories by category ID using renamed field 'categoryId'
router.get('/subcategories/:categoryId', async (req, res) => {
  try {
    const subcategories = await Subcategory.find({ categoryId: req.params.categoryId });
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subcategories' });
  }
});

// Get products by subcategory ID
router.get('/products/:subcategoryId', async (req, res) => {
  try {
    const products = await Product.find({ subcategory: req.params.subcategoryId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

module.exports = router;