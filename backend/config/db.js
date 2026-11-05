// backend/config/db.js
const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.resolve(__dirname, '../../data/sqlite.db');
const db = new Database(dbPath);

// Create tables if they don't exist
db.exec(`
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  price REAL NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

// Seed products if table empty
const count = db.prepare('SELECT COUNT(*) AS cnt FROM products').get().cnt;
if (count === 0) {
  const insert = db.prepare('INSERT INTO products (id, title, price, image, category) VALUES (?, ?, ?, ?, ?)');
  const sampleProducts = [
    {id:1, title:'Wireless Headphones', price:59.99, category:'Electronics'},
    {id:2, title:'Smart Watch', price:129.99, category:'Wearables'},
    {id:3, title:'Gaming Mouse', price:39.99, category:'Accessories'},
    {id:4, title:'Bluetooth Speaker', price:49.99, category:'Audio'},
    {id:5, title:'4K Monitor', price:299.99, category:'Displays'},
    {id:6, title:'Mechanical Keyboard', price:89.99, category:'Accessories'},
    {id:7, title:'Fitness Tracker', price:79.99, category:'Wearables'},
    {id:8, title:'USB-C Hub', price:24.99, category:'Accessories'},
    {id:9, title:'Portable Charger', price:34.99, category:'Power'},
    {id:10, title:'Noise Cancelling Earbuds', price:69.99, category:'Audio'},
    {id:11, title:'Smart Light Bulb', price:19.99, category:'Home'},
    {id:12, title:'VR Headset', price:399.99, category:'Gaming'},
    {id:13, title:'Laptop Stand', price:29.99, category:'Accessories'},
    {id:14, title:'Action Camera', price:199.99, category:'Photography'},
    {id:15, title:'Wireless Charger', price:25.99, category:'Power'}
  ];
  const insertMany = db.transaction((products) => {
    for (const p of products) {
      // Use Picsum placeholder images
      const img = `https://picsum.photos/seed/${p.id}/200/200`;
      insert.run(p.id, p.title, p.price, img, p.category);
    }
  });
  insertMany(sampleProducts);
}

module.exports = {
  db,
  getAllProducts: () => db.prepare('SELECT * FROM products').all(),
  addEvent: (userId, productId, type) => {
    const stmt = db.prepare('INSERT INTO events (user_id, product_id, type) VALUES (?, ?, ?)');
    stmt.run(userId, productId, type);
  },
  getTopProducts: (limit = 5) => {
    const stmt = db.prepare(`
      SELECT product_id, COUNT(*) as cnt FROM events
      GROUP BY product_id ORDER BY cnt DESC LIMIT ?
    `);
    return stmt.all(limit).map(row => row.product_id);
  }
};
