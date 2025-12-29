// backend/routes/categories.js
// Categories API: list, get, create (admin), update (admin), delete (admin)

const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// Middleware: Require admin role (reuse from products)
async function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return res.status(401).json({ error: 'Invalid token' });
  if (data.user.user_metadata?.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  req.user = data.user;
  next();
}

// Helper: Validate category input
function validateCategoryInput({ name }) {
  if (!name || typeof name !== 'string' || name.length < 2) return 'Invalid name';
  return null;
}

// List categories
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json({ categories: data });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get category by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase.from('categories').select('*').eq('id', id).single();
    if (error) return res.status(404).json({ error: 'Category not found' });
    res.json({ category: data });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create category (admin only)
router.post('/', requireAdmin, async (req, res) => {
  const errorMsg = validateCategoryInput(req.body);
  if (errorMsg) return res.status(400).json({ error: errorMsg });
  try {
    const { data, error } = await supabase.from('categories').insert([req.body]).select().single();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ category: data });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update category (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const errorMsg = validateCategoryInput(req.body);
  if (errorMsg) return res.status(400).json({ error: errorMsg });
  try {
    const { data, error } = await supabase.from('categories').update(req.body).eq('id', id).select().single();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ category: data });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete category (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
