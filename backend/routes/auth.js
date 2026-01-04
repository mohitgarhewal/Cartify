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

// Signup (supports email confirmation; session may be null until confirmed)
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const errorMsg = validateAuthInput(email, password);
  if (errorMsg) return res.status(400).json({ error: errorMsg });
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // allow confirmation email to be sent
    });

    if (error) {
      console.error('Supabase signup error:', error);
      return res.status(400).json({ error: error.message });
    }

    // In confirmation-required mode, session is null. This is expected.
    return res.status(201).json({
      userId: data.user.id,
      message: 'User created. Please check your email to confirm.',
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Resend confirmation email
router.post('/resend-confirmation', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: 'http://localhost:3000/auth/callback',
      },
    });

    if (error) {
      console.error('Resend confirmation error:', error);
      return res.status(400).json({ error: error.message });
    }

    return res.json({ message: 'Confirmation email sent' });
  } catch (err) {
    console.error('Resend confirmation error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Login (returns JWT)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const errorMsg = validateAuthInput(email, password);
  if (errorMsg) return res.status(400).json({ error: errorMsg });
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Supabase login error:', error);
      return res.status(401).json({ error: error.message });
    }
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
