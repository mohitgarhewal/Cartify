// backend/routes/cart.js
// Cart API: get cart, add item, update item, remove item (user only)

const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// Middleware: Require authenticated user
async function requireUser(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return res.status(401).json({ error: 'Invalid token' });
  req.user = data.user;
  next();
}

// Helper: Validate cart item input
function validateCartItemInput({ product_id, quantity }) {
  if (!product_id || typeof product_id !== 'string') return 'Invalid product_id';
  if (typeof quantity !== 'number' || quantity < 1) return 'Invalid quantity';
  return null;
}

// Get current user's cart
router.get('/', requireUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select('id,product_id,quantity,product:products(*)')
      .eq('user_id', req.user.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ cart: data });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add item to cart (upsert)
router.post('/', requireUser, async (req, res) => {
  const errorMsg = validateCartItemInput(req.body);
  if (errorMsg) return res.status(400).json({ error: errorMsg });
  try {
    // Upsert: if item exists, update quantity; else insert
    const { data, error } = await supabase.rpc('upsert_cart_item', {
      user_id: req.user.id,
      product_id: req.body.product_id,
      quantity: req.body.quantity
    });
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ cart_item: data });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update item quantity
router.put('/:id', requireUser, async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  if (typeof quantity !== 'number' || quantity < 1) return res.status(400).json({ error: 'Invalid quantity' });
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ cart_item: data });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove item from cart
router.delete('/:id', requireUser, async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);
    if (error) return res.status(400).json({ error: error.message });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
