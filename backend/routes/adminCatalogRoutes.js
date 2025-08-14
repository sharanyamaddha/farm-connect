const express = require('express');
const router = express.Router();

const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const Product = require('../models/Product');

// 👉 Add a category
router.post('/add-category', async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json({ message: '✅ Category added successfully' });
  } catch (error) {
    res.status(500).json({ message: '❌ Failed to add category' });
  }
});

// 👉 Add a subcategory
router.post('/add-subcategory', async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    const newSubcategory = new Subcategory({ name, category: categoryId });
    await newSubcategory.save();
    res.status(201).json({ message: '✅ Subcategory added successfully' });
  } catch (error) {
    res.status(500).json({ message: '❌ Failed to add subcategory' });
  }
});

// 👉 Add a product
router.post('/add-product', async (req, res) => {
  try {
    const { name, subcategoryId } = req.body;
    const newProduct = new Product({ name, subcategory: subcategoryId });
    await newProduct.save();
    res.status(201).json({ message: '✅ Product added successfully' });
  } catch (error) {
    res.status(500).json({ message: '❌ Failed to add product' });
  }
});

module.exports = router;
