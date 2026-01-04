// backend/routes/admin.js
// Admin API: list all users, list all orders, RBAC enforced

const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// Middleware: Require authenticated user (not just admin)
async function requireUser(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return res.status(401).json({ error: 'Invalid token' });
  req.user = data.user;
  next();
}

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

// Revoke sessions (self or admin)
router.post('/revoke-session', requireUser, async (req, res) => {
  try {
    const { userId } = req.body || {};
    const targetUserId = userId && req.user.user_metadata?.role === 'admin' ? userId : req.user.id;

    const { error } = await supabase.auth.admin.signOut({ user_id: targetUserId });
    if (error) return res.status(400).json({ error: error.message });

    return res.json({ message: 'Sessions revoked' });
  } catch (err) {
    console.error('Revoke session error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Delete account (self or admin)
router.post('/delete-account', requireUser, async (req, res) => {
  try {
    const { userId } = req.body || {};
    const targetUserId = userId && req.user.user_metadata?.role === 'admin' ? userId : req.user.id;

    const { error } = await supabase.auth.admin.deleteUser(targetUserId);
    if (error) return res.status(400).json({ error: error.message });

    return res.json({ message: 'Account deleted' });
  } catch (err) {
    console.error('Delete account error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
