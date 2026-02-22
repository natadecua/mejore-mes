// backend/src/services/qboClient.js
// QuickBooks Online REST API client (read-only for PoC)
// Auth: OAuth2 Bearer token
// Sandbox base: https://sandbox-quickbooks.api.intuit.com/v3/company/{realmId}
// Prod base:    https://quickbooks.api.intuit.com/v3/company/{realmId}
// Docs: https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/invoice

const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

function getBase() {
  const realmId = process.env.QB_REALM_ID;
  const isSandbox = process.env.QB_SANDBOX !== 'false';
  const host = isSandbox
    ? 'sandbox-quickbooks.api.intuit.com'
    : 'quickbooks.api.intuit.com';
  return `https://${host}/v3/company/${realmId}`;
}

function getHeaders() {
  return {
    'Authorization': `Bearer ${process.env.QB_ACCESS_TOKEN}`,
    'Accept':        'application/json',
  };
}

/**
 * GET /invoice/:id — read a single QBO invoice
 * Returns Invoice object with: Id, DocNumber, TxnDate, TotalAmt, Balance, CustomerRef, Line[]
 */
async function getInvoice(id) {
  const res = await axios.get(`${getBase()}/invoice/${id}`, { headers: getHeaders() });
  return res.data.Invoice;
}

/**
 * Query invoices via QBO query language
 * e.g. getQuery("SELECT * FROM Invoice WHERE Balance > '0.0' MAXRESULTS 20")
 */
async function getQuery(query) {
  const res = await axios.get(`${getBase()}/query`, {
    headers: getHeaders(),
    params: { query },
  });
  return res.data.QueryResponse;
}

/**
 * GET open/unpaid invoices for a customer by name
 */
async function getOpenInvoices(customerName = null) {
  let query = "SELECT * FROM Invoice WHERE Balance > '0.0' ORDERBY TxnDate DESC MAXRESULTS 50";
  if (customerName) {
    query = `SELECT * FROM Invoice WHERE CustomerRef.name = '${customerName}' AND Balance > '0.0' ORDERBY TxnDate DESC MAXRESULTS 50`;
  }
  return getQuery(query);
}

module.exports = { getInvoice, getQuery, getOpenInvoices };
