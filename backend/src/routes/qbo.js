// backend/src/routes/qbo.js
// QuickBooks Online routes (read-only for PoC)
// Auth: OAuth2 Bearer token — set QB_ACCESS_TOKEN + QB_REALM_ID in .env
// QBO Sandbox: https://sandbox-quickbooks.api.intuit.com/v3/company/{realmId}

const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { getInvoice, getOpenInvoices, getQuery } = require('../services/qboClient');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const QBO_CONFIGURED = !!(process.env.QB_ACCESS_TOKEN && process.env.QB_REALM_ID);

// ── GET /api/qbo/invoice/:id ──────────────────────────────────────────────────
router.get('/invoice/:id', async (req, res) => {
  if (!QBO_CONFIGURED) {
    return res.json({
      source: 'mock',
      note: 'Set QB_ACCESS_TOKEN + QB_REALM_ID in .env for live data',
      Invoice: {
        Id: req.params.id,
        DocNumber: '1037',
        TxnDate: '2026-02-22',
        TotalAmt: 362.07,
        Balance: 362.07,
        CustomerRef: { name: 'Mejore Sample Client', value: '24' },
        Line: [
          { Description: 'Solid Wood Dining Table', Amount: 275.00, DetailType: 'SalesItemLineDetail' },
          { Description: 'Delivery & Installation',  Amount: 87.07,  DetailType: 'SalesItemLineDetail' },
        ],
      },
    });
  }

  try {
    const invoice = await getInvoice(req.params.id);
    // Cache in local DB
    await pool.query(
      `INSERT INTO qb_invoices (qb_id, doc_number, txn_date, customer_name, total_amt, balance, raw_payload)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (qb_id) DO UPDATE SET total_amt = EXCLUDED.total_amt, balance = EXCLUDED.balance, synced_at = NOW()`,
      [
        invoice.Id,
        invoice.DocNumber,
        invoice.TxnDate,
        invoice.CustomerRef?.name,
        invoice.TotalAmt,
        invoice.Balance,
        JSON.stringify(invoice),
      ]
    );
    res.json({ source: 'quickbooks', Invoice: invoice });
  } catch (err) {
    res.status(502).json({ error: 'QuickBooks API error', details: err.message });
  }
});

// ── GET /api/qbo/invoices — list open invoices ────────────────────────────────
router.get('/invoices', async (req, res) => {
  if (!QBO_CONFIGURED) {
    return res.json({ source: 'mock', data: [] });
  }
  try {
    const data = await getOpenInvoices(req.query.customer);
    res.json({ source: 'quickbooks', data });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// ── GET /api/qbo/cached — return locally cached invoices ─────────────────────
router.get('/cached', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM qb_invoices ORDER BY txn_date DESC LIMIT 50');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
