// backend/routes/payments.js
// Razorpay order creation and signature verification

const express = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay');

const router = express.Router();

const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

function getClient() {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new Error('Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET');
  }
  return new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
}

// Create a Razorpay order
router.post('/order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body || {};
    if (!amount || Number.isNaN(Number(amount))) {
      return res.status(400).json({ error: 'Amount is required (paise)' });
    }

    const razorpay = getClient();
    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount)), // in paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      payment_capture: 1,
    });

    return res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.error('Razorpay order error:', err);
    return res.status(500).json({ error: err.message || 'Failed to create order' });
  }
});

// Verify payment signature (optional but recommended)
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing Razorpay params' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const valid = expectedSignature === razorpay_signature;
    if (!valid) return res.status(400).json({ error: 'Invalid signature' });

    return res.json({ success: true });
  } catch (err) {
    console.error('Razorpay verify error:', err);
    return res.status(500).json({ error: err.message || 'Verification failed' });
  }
});

module.exports = router;
