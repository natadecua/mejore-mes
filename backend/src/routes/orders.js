// backend/src/routes/orders.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// Endpoint to fetch work orders from Order Time
router.get('/', async (req, res) => {
  // In a real scenario, we'd use process.env.OT_API_KEY etc.
  // For POC, we return a mock or try to hit the API if keys are provided
  if (!process.env.OT_API_KEY) {
    return res.json([
      { id: 101, item: 'A1000', qty: 10, status: 'In Production', promise_date: '2026-03-01' },
      { id: 102, item: 'B2000', qty: 5, status: 'Pending', promise_date: '2026-03-05' }
    ]);
  }

  try {
    const response = await axios.get('https://services.ordertime.com/api/workorder', {
      headers: {
        'apiKey': process.env.OT_API_KEY,
        'email': process.env.OT_EMAIL,
        'password': process.env.OT_PASSWORD
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Order Time API Error', details: err.message });
  }
});

module.exports = router;
