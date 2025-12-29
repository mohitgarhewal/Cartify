const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware: JSON body parsing
app.use(express.json());

// Simple request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Mount auth routes
app.use('/auth', require('./routes/auth'));

// Mount products routes
app.use('/products', require('./routes/products'));

// Mount categories routes
app.use('/categories', require('./routes/categories'));

// Mount cart routes
app.use('/cart', require('./routes/cart'));

// Mount orders routes
app.use('/orders', require('./routes/orders'));

// Mount admin routes
app.use('/admin', require('./routes/admin'));

// Mount webhooks routes
app.use('/webhooks', require('./routes/webhooks'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});