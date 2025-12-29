// backend/routes/products.js
// Products API: list, get, create (admin), update (admin), delete (admin)

const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// Middleware: Require admin role (for mutating routes)
async function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return res.status(401).json({ error: 'Invalid token' });
  // Assume 'role' is stored in user_metadata
  if (data.user.user_metadata?.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  req.user = data.user;
  next();
}

// Helper: Validate product input
function validateProductInput({ name, price, category_id }) {
  if (!name || typeof name !== 'string' || name.length < 2) return 'Invalid name';
  if (typeof price !== 'number' || price < 0) return 'Invalid price';
  if (!category_id || typeof category_id !== 'string') return 'Invalid category_id';
  return null;
}

// List products
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json({ products: data });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get product by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) return res.status(404).json({ error: 'Product not found' });
    res.json({ product: data });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create product (admin only)
router.post('/', requireAdmin, async (req, res) => {
  const errorMsg = validateProductInput(req.body);
  if (errorMsg) return res.status(400).json({ error: errorMsg });
  try {
    const { data, error } = await supabase.from('products').insert([req.body]).select().single();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ product: data });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update product (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const errorMsg = validateProductInput(req.body);
  if (errorMsg) return res.status(400).json({ error: errorMsg });
  try {
    const { data, error } = await supabase.from('products').update(req.body).eq('id', id).select().single();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ product: data });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete product (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
