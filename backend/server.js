// backend/server.js
const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/products');
const eventsRouter = require('./routes/events');
const recommendationsRouter = require('./routes/recommendations');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/recommendations', recommendationsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
