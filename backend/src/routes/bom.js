// backend/src/routes/bom.js
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Mock PYTHA BOM Import
router.post('/import', async (req, res) => {
  const { filename, status, log } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO bom_imports (filename, status, log) VALUES ($1, $2, $3) RETURNING *',
      [filename || 'manual_upload.xml', status || 'pending', log || 'Initial import']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/imports', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bom_imports ORDER BY import_date DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
