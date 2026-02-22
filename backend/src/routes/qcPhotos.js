// backend/src/routes/qcPhotos.js
// QC Photo upload + listing
// Multer stores to UPLOAD_DIR (local disk for PoC; swap for S3 in prod)

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads/qc-photos';
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    cb(null, allowed.includes(file.mimetype));
  },
});

// ── POST /api/qc-photos — upload a QC photo for a work order ─────────────────
// Multipart fields: file (image), ot_doc_no (int), notes (string), uploaded_by
router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded (field: "file")' });

  const { ot_doc_no, notes, uploaded_by } = req.body;
  const filepath = path.join(UPLOAD_DIR, req.file.filename);

  try {
    // Resolve work_order_id if we have it locally
    let workOrderId = null;
    if (ot_doc_no) {
      const wo = await pool.query('SELECT id FROM work_orders WHERE ot_doc_no = $1', [ot_doc_no]);
      if (wo.rows.length) workOrderId = wo.rows[0].id;
    }

    const result = await pool.query(
      `INSERT INTO qc_photos (work_order_id, ot_doc_no, filepath, original_name, uploaded_by, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [workOrderId, ot_doc_no || null, filepath, req.file.originalname, uploaded_by || 'floor', notes || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/qc-photos — list all QC photos (optionally filter by work order) ─
router.get('/', async (req, res) => {
  try {
    const { ot_doc_no } = req.query;
    let query = 'SELECT * FROM qc_photos ORDER BY upload_date DESC LIMIT 100';
    const params = [];
    if (ot_doc_no) {
      query = 'SELECT * FROM qc_photos WHERE ot_doc_no = $1 ORDER BY upload_date DESC';
      params.push(ot_doc_no);
    }
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
