// backend/config/cache.js
const NodeCache = require('node-cache');
// 5 minute TTL (300 seconds)
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

module.exports = {
  get: (key) => cache.get(key),
  set: (key, value, ttl) => cache.set(key, value, ttl),
  del: (key) => cache.del(key)
};
