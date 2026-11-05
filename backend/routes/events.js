// backend/routes/events.js
const express = require('express');
const router = express.Router();
const { addEvent } = require('../config/db');

router.post('/', (req, res) => {
  const { userId, productId, type } = req.body;
  if (!userId || !productId || !type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    addEvent(userId, productId, type);
    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Error logging event', err);
    res.status(500).json({ error: 'Failed to log event' });
  }
});

module.exports = router;
