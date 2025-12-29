// backend/routes/auth.js
// Auth API routes: signup, login, get user, logout

const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// Helper: Validate email and password
function validateAuthInput(email, password) {
  if (!email || !password) return 'Email and password required.';
  if (typeof email !== 'string' || typeof password !== 'string') return 'Invalid input type.';
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return 'Invalid email format.';
  if (password.length < 6) return 'Password too short.';
  return null;
}

// Signup
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const errorMsg = validateAuthInput(email, password);
  if (errorMsg) return res.status(400).json({ error: errorMsg });
  try {
    const { data, error } = await supabase.auth.admin.createUser({ email, password });
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ user: data.user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login (returns JWT)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const errorMsg = validateAuthInput(email, password);
  if (errorMsg) return res.status(400).json({ error: errorMsg });
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ error: error.message });
    res.json({ access_token: data.session.access_token, user: data.user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user info (requires Bearer token)
router.get('/me', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error) return res.status(401).json({ error: error.message });
    res.json({ user: data.user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
