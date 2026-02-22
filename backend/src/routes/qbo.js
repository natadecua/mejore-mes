// backend/src/routes/qbo.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// GET /api/qbo/invoice/:id
router.get('/invoice/:id', async (req, res) => {
  const { id } = req.params;

  if (!process.env.QB_ACCESS_TOKEN) {
    // Return mock data for POC
    return res.json({
      Id: id,
      DocNumber: "1037",
      TxnDate: "2026-02-22",
      TotalAmt: 362.07,
      CustomerRef: { name: "Sonnenschein Family Store", value: "24" },
      Line: [
        { Description: "Rock Fountain", Amount: 275.0, DetailType: "SalesItemLineDetail" }
      ]
    });
  }

  try {
    const realmId = process.env.QB_REALM_ID;
    const response = await axios.get(`https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/invoice/${id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.QB_ACCESS_TOKEN}`,
        'Accept': 'application/json'
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'QuickBooks API Error', details: err.message });
  }
});

module.exports = router;
