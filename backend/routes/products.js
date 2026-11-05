// backend/routes/products.js
const express = require('express');
const router = express.Router();
const { getAllProducts } = require('../config/db');

router.get('/', (req, res) => {
  try {
    const products = getAllProducts();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

module.exports = router;
