// backend/routes/webhooks.js
// Webhook API: idempotent, secure, logs all events

const express = require('express');
const crypto = require('crypto');
const supabase = require('../supabaseClient');
const router = express.Router();

// Helper: Verify webhook signature (HMAC SHA256)
function verifySignature(req, secret) {
  const signature = req.headers['x-webhook-signature'];
  if (!signature) return false;
  const payload = JSON.stringify(req.body);
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

// Helper: Log webhook event
async function logWebhookEvent(event, status, details) {
  await supabase.from('webhook_logs').insert([
    { event, status, details: JSON.stringify(details), received_at: new Date().toISOString() }
  ]);
}

// POST /webhooks/event
router.post('/event', async (req, res) => {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) return res.status(500).json({ error: 'Webhook secret not set' });

  // Verify signature
  if (!verifySignature(req, WEBHOOK_SECRET)) {
    await logWebhookEvent('unknown', 'rejected', { reason: 'Invalid signature', headers: req.headers });
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const eventId = req.headers['x-webhook-id'];
  if (!eventId) {
    await logWebhookEvent('unknown', 'rejected', { reason: 'Missing event id', headers: req.headers });
    return res.status(400).json({ error: 'Missing event id' });
  }

  // Idempotency: check if event already processed
  const { data: existing } = await supabase.from('webhook_logs').select('id').eq('event', eventId).maybeSingle();
  if (existing) {
    await logWebhookEvent(eventId, 'duplicate', req.body);
    return res.status(200).json({ status: 'duplicate' });
  }

  // Process event (example: just log)
  try {
    // TODO: Add your event processing logic here
    await logWebhookEvent(eventId, 'processed', req.body);
    res.status(200).json({ status: 'processed' });
  } catch (err) {
    await logWebhookEvent(eventId, 'error', { error: err.message });
    res.status(500).json({ error: 'Processing error' });
  }
});

module.exports = router;
