// backend/src/routes/orders.js
// Work Order routes — proxies to Order Time REST API
// OT API Docs: https://help.ordertime.com/help/work-order
// Endpoint: GET/POST/PUT /workorder
// Auth: headers { apiKey, email, password } or { apiKey, email, DevKey }

const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { getWorkOrders, createWorkOrder, updateWorkOrder } = require('../services/otClient');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const OT_CONFIGURED = !!(process.env.OT_API_KEY && process.env.OT_EMAIL);

// ── GET /api/orders — list work orders from OT (or mock) ──────────────────────
router.get('/', async (req, res) => {
  if (!OT_CONFIGURED) {
    return res.json({
      source: 'mock',
      note: 'Set OT_API_KEY + OT_EMAIL in .env for live data',
      data: [
        {
          DocNo: 101, ItemRef: { Name: 'CHAIR-001' }, QuantityOrdered: 10,
          StatusRef: { Name: 'In Production' }, PromiseDate: '2026-03-01',
          Memo: 'Sample work order'
        },
        {
          DocNo: 102, ItemRef: { Name: 'TABLE-002' }, QuantityOrdered: 5,
          StatusRef: { Name: 'Open' }, PromiseDate: '2026-03-10',
          Memo: 'Sample work order 2'
        },
      ]
    });
  }

  try {
    const data = await getWorkOrders(req.query.docNo);
    // Optionally cache to local DB
    res.json({ source: 'ordertime', data });
  } catch (err) {
    res.status(502).json({ error: 'Order Time API error', details: err.message });
  }
});

// ── GET /api/orders/:docNo — single work order ────────────────────────────────
router.get('/:docNo', async (req, res) => {
  if (!OT_CONFIGURED) return res.json({ source: 'mock', DocNo: req.params.docNo });
  try {
    const data = await getWorkOrders(req.params.docNo);
    res.json({ source: 'ordertime', data });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// ── POST /api/orders — create a work order in OT ─────────────────────────────
// Body: { ItemRef: { Name }, QuantityOrdered, PromiseDate, Memo?, Instructions? }
router.post('/', async (req, res) => {
  if (!OT_CONFIGURED) {
    return res.status(200).json({
      source: 'mock',
      note: 'OT not configured — this would POST to https://services.ordertime.com/api/workorder',
      receivedPayload: req.body,
    });
  }
  try {
    const result = await createWorkOrder(req.body);
    // Cache in local DB
    await pool.query(
      `INSERT INTO work_orders (ot_doc_no, ot_item_ref, quantity_ordered, promise_date, status, memo, raw_payload)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (ot_doc_no) DO UPDATE SET status = EXCLUDED.status, synced_at = NOW()`,
      [
        result.DocNo,
        result.ItemRef?.Name,
        result.QuantityOrdered,
        result.PromiseDate,
        result.StatusRef?.Name,
        result.Memo,
        JSON.stringify(result),
      ]
    );
    res.status(201).json({ source: 'ordertime', data: result });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// ── PUT /api/orders/:docNo/status — change work order status ──────────────────
// Body: { StatusRef: { Name: "Finished" } }  (holistic PUT — we GET first, merge, then PUT)
router.put('/:docNo/status', async (req, res) => {
  if (!OT_CONFIGURED) {
    return res.json({ source: 'mock', note: 'Would PUT status to OT', ...req.body });
  }
  try {
    // OT requires holistic PUT — fetch current state first
    const current = await getWorkOrders(req.params.docNo);
    const updated = await updateWorkOrder({ ...current, ...req.body, DocNo: parseInt(req.params.docNo) });
    res.json({ source: 'ordertime', data: updated });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

module.exports = router;
