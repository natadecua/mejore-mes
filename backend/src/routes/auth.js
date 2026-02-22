// backend/src/routes/auth.js
// QBO OAuth2 flow
// Step 1: GET /auth/qbo          → redirects user to Intuit login
// Step 2: GET /auth/qbo/callback → exchanges code for tokens, saves to .env-adjacent store

const express = require('express');
const router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const QBO_AUTH_URL = 'https://appcenter.intuit.com/connect/oauth2';
const QBO_TOKEN_URL = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';

const SCOPES = 'com.intuit.quickbooks.accounting';

// ── GET /auth/qbo — initiate OAuth2 ──────────────────────────────────────────
router.get('/qbo', (req, res) => {
  const params = new URLSearchParams({
    client_id:     process.env.QB_CLIENT_ID,
    redirect_uri:  process.env.QB_REDIRECT_URI,
    scope:         SCOPES,
    response_type: 'code',
    state:         'mejore-mes-qbo',
  });
  res.redirect(`${QBO_AUTH_URL}?${params.toString()}`);
});

// ── GET /auth/qbo/callback — exchange code for tokens ────────────────────────
router.get('/qbo/callback', async (req, res) => {
  const { code, realmId, error } = req.query;
  if (error) return res.status(400).json({ error });

  const credentials = Buffer.from(
    `${process.env.QB_CLIENT_ID}:${process.env.QB_CLIENT_SECRET}`
  ).toString('base64');

  try {
    const response = await axios.post(QBO_TOKEN_URL,
      new URLSearchParams({
        grant_type:   'authorization_code',
        code,
        redirect_uri: process.env.QB_REDIRECT_URI,
      }),
      {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type':  'application/x-www-form-urlencoded',
          'Accept':        'application/json',
        },
      }
    );

    const { access_token, refresh_token, expires_in } = response.data;

    // In production store these in DB. For PoC: return to UI for manual .env update.
    res.json({
      message: 'QBO OAuth2 successful! Copy these into your .env file:',
      QB_REALM_ID:      realmId,
      QB_ACCESS_TOKEN:  access_token,
      QB_REFRESH_TOKEN: refresh_token,
      expires_in:       `${expires_in}s (~1 hour)`,
      note: 'Refresh token valid 100 days. Re-run this flow to renew.',
    });
  } catch (err) {
    res.status(500).json({
      error: 'Token exchange failed',
      details: err.response?.data || err.message,
    });
  }
});

module.exports = router;
