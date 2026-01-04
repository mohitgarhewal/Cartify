// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

/**
 * Safe require for route modules so server won't crash if a route file is
 * temporarily missing during testing. This helps when copying this file into
 * an existing project that already has route modules.
 */
function safeRequire(path) {
  try {
    return require(path);
  } catch (err) {
    console.warn(`[server] Warning: could not load ${path}. Using placeholder router.`);
    return express.Router(); // placeholder no-op router
  }
}

/**
 * CORS configuration
 * - origin must be explicit when credentials are used
 * - allowedHeaders must include headers your client sends
 * - methods must include OPTIONS
 */
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200, // legacy browsers
};

// Apply CORS as the very first middleware (before bodyparser, auth, routes, etc.)
app.use(cors(corsOptions));

// Do NOT override OPTIONS; let cors() handle preflight and set headers.

// Parse JSON bodies
app.use(express.json());

// Simple request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Mount routes (use safeRequire to avoid server crash if a file is absent)
app.use('/auth', safeRequire('./routes/auth'));
app.use('/products', safeRequire('./routes/products'));
app.use('/categories', safeRequire('./routes/categories'));
app.use('/cart', safeRequire('./routes/cart'));
app.use('/orders', safeRequire('./routes/orders'));
app.use('/admin', safeRequire('./routes/admin'));
app.use('/payments', safeRequire('./routes/payments'));
app.use('/webhooks', safeRequire('./routes/webhooks'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 404 handler (only reached when no route matched)
app.use((req, res) => {
  res.status(404).json({ error: 'route Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[server] Error:', err);
  // Don't leak internals in production; adjust as needed
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
