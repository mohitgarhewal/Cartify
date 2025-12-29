// backend/routes/admin.js
// Admin API: list all users, list all orders, RBAC enforced

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

// List all users (admin only)
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ users: data.users });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// List all orders (admin only)
router.get('/orders', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*,order_items(*,product:products(*)),user:users(email)')
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json({ orders: data });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
