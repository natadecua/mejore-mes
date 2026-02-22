// backend/src/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static: serve uploaded QC photos
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads/qc-photos';
app.use('/uploads', express.static(path.resolve(UPLOAD_DIR, '..')));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/bom',       require('./routes/bom'));
app.use('/api/orders',    require('./routes/orders'));
app.use('/api/qbo',       require('./routes/qbo'));
app.use('/api/qc-photos', require('./routes/qcPhotos'));
app.use('/auth',          require('./routes/auth'));

// ── Health + discovery ────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  const otConfigured  = !!(process.env.OT_API_KEY && process.env.OT_EMAIL);
  const qboConfigured = !!(process.env.QB_ACCESS_TOKEN && process.env.QB_REALM_ID);

  res.json({
    service: 'Mejore MES Backend',
    version: '0.2.0',
    status: 'running',
    integrations: {
      orderTime:     otConfigured  ? '✅ configured' : '⚠️  mock mode (set OT_API_KEY + OT_EMAIL)',
      quickbooks:    qboConfigured ? '✅ configured' : '⚠️  mock mode (visit /auth/qbo to authenticate)',
      pythaWatcher:  `watching ${process.env.PYTHA_WATCH_DIR || './test-exports'}`,
    },
    endpoints: [
      'GET  /api/bom/imports',
      'POST /api/bom/import                (multipart: file)',
      'GET  /api/bom/imports/:id/items',
      'GET  /api/orders',
      'GET  /api/orders/:docNo',
      'POST /api/orders',
      'PUT  /api/orders/:docNo/status',
      'GET  /api/qbo/invoice/:id',
      'GET  /api/qbo/invoices',
      'GET  /api/qbo/cached',
      'POST /api/qc-photos               (multipart: file)',
      'GET  /api/qc-photos',
      'GET  /auth/qbo                    (QBO OAuth2 init)',
      'GET  /auth/qbo/callback           (QBO OAuth2 callback)',
    ],
  });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Mejore MES running on :${PORT}`);
  // Start PYTHA watcher
  require('./services/watcher');
});
