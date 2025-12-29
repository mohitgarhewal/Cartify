// backend/routes/orders.js
// Orders API: list, get, create (checkout), user only, with transaction

const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// Middleware: Require authenticated user (reuse from cart)
async function requireUser(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return res.status(401).json({ error: 'Invalid token' });
  req.user = data.user;
  next();
}

// List user's orders
router.get('/', requireUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*,order_items(*,product:products(*))')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json({ orders: data });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get order by id (user only)
router.get('/:id', requireUser, async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*,order_items(*,product:products(*))')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();
    if (error) return res.status(404).json({ error: 'Order not found' });
    res.json({ order: data });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create order (checkout) - transactional
router.post('/', requireUser, async (req, res) => {
  // This assumes a Supabase RPC function 'checkout_cart' for atomicity
  try {
    const { data, error } = await supabase.rpc('checkout_cart', { user_id: req.user.id });
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ order: data });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
