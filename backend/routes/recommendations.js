// backend/routes/recommendations.js
const express = require('express');
const router = express.Router();
const { getTopProducts } = require('../config/db');
const cache = require('../config/cache');
const { exec } = require('child_process');
const path = require('path');

// Helper to run Python recommendation script if model exists
function runPythonRec(userId) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(__dirname, '../../ml/recommend_user.py');
    // Pass userId as argument
    exec(`python "${scriptPath}" ${userId}`, (error, stdout, stderr) => {
        if (error) {
            console.error('Python recommendation error:', stderr);
            return reject(error);
        }
        try {
          const result = JSON.parse(stdout.trim());
          resolve(result.recommendations);
        } catch (e) {
          console.error('Failed to parse Python output');
          reject(e);
        }
    });
  });
}

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const cacheKey = `rec:${userId}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json({ recommendations: cached, cached: true });
  }
  try {
    // Try Python model if present
    const modelPath = path.resolve(__dirname, '../../ml/model');
    let recs;
    if (require('fs').existsSync(modelPath)) {
      recs = await runPythonRec(userId);
    } else {
      // Fallback to popularity based
      recs = getTopProducts(5);
    }
    // Cache for 5 minutes
    cache.set(cacheKey, recs);
    res.json({ recommendations: recs, cached: false });
  } catch (err) {
    console.error('Recommendation error', err);
    // As a safe fallback return popular items
    const recs = getTopProducts(5);
    res.json({ recommendations: recs, cached: false, fallback: true });
  }
});

module.exports = router;
