// backend/src/services/otClient.js
// Order Time REST API client
// Docs: https://help.ordertime.com/help/order-time-rest-api
// Base URL: https://services.ordertime.com/api
// Auth headers: apiKey + email + password (or DevKey instead of password)

const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const BASE_URL = process.env.OT_BASE_URL || 'https://services.ordertime.com/api';

function getHeaders() {
  const headers = {
    'apiKey':        process.env.OT_API_KEY,
    'email':         process.env.OT_EMAIL,
    'Content-Type':  'application/json',
  };
  // Use DevKey if available, otherwise password
  if (process.env.OT_DEV_KEY) {
    headers['DevKey'] = process.env.OT_DEV_KEY;
  } else {
    headers['password'] = process.env.OT_PASSWORD;
  }
  return headers;
}

const otClient = axios.create({ baseURL: BASE_URL });

// ── Work Orders ──────────────────────────────────────────────────────────────

/**
 * GET /workorder?docNo=<n>  — fetch a single work order
 * GET /workorder            — list work orders (paginated, max 1000)
 */
async function getWorkOrders(docNo = null) {
  const params = docNo ? { docNo } : {};
  const res = await otClient.get('/workorder', { headers: getHeaders(), params });
  return res.data;
}

/**
 * POST /workorder — create a work order from a BOM
 * Payload shape (from OT docs):
 * {
 *   "ItemRef":        { "Name": "A1000" },   // finished good (Assembly Item)
 *   "QuantityOrdered": 10,
 *   "BomRef":         { "Name": "Default" }, // optional: named BOM revision
 *   "PromiseDate":    "2026-03-01",
 *   "StatusRef":      { "Name": "Open" },    // Open | In Production | Finished
 *   "Memo":           "...",
 *   "Instructions":   "...",
 *   "CustomFields":   []
 * }
 */
async function createWorkOrder(payload) {
  // OT requires $type discriminator for POST
  const body = {
    '$type': 'AOLib7.WorkOrder, AOLib7',
    ...payload,
  };
  const res = await otClient.post('/workorder', body, { headers: getHeaders() });
  return res.data;
}

/**
 * PUT /workorder — update a work order (e.g. change status to Finished)
 * Must include ALL applicable properties (holistic PUT — read first, then PUT)
 */
async function updateWorkOrder(payload) {
  const body = {
    '$type': 'AOLib7.WorkOrder, AOLib7',
    ...payload,
  };
  const res = await otClient.put('/workorder', body, { headers: getHeaders() });
  return res.data;
}

// ── BOM ──────────────────────────────────────────────────────────────────────

/**
 * GET /bom?itemId=<n>&name=Default — fetch BOM for an assembly item
 */
async function getBOM(itemId, name = 'Default') {
  const res = await otClient.get('/bom', { headers: getHeaders(), params: { itemId, name } });
  return res.data;
}

// ── Items ─────────────────────────────────────────────────────────────────────

/**
 * GET /partitem?name=<sku> — look up a part item by name/SKU
 */
async function getPartItem(name) {
  const res = await otClient.get('/partitem', { headers: getHeaders(), params: { name } });
  return res.data;
}

// ── Sales Orders ──────────────────────────────────────────────────────────────

/**
 * GET /salesorder?docNo=<n>
 */
async function getSalesOrder(docNo) {
  const res = await otClient.get('/salesorder', { headers: getHeaders(), params: { docNo } });
  return res.data;
}

module.exports = { getWorkOrders, createWorkOrder, updateWorkOrder, getBOM, getPartItem, getSalesOrder };
