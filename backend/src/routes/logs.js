// backend/src/routes/logs.js
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// ── POST /api/logs/start — Start a machine/manual job ────────────────────────
router.post('/start', async (req, res) => {
  const { node_id, station_id, operator_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO station_logs (node_id, station_id, operator_id, start_time, status)
       VALUES ($1, $2, $3, NOW(), 'running') RETURNING *`,
      [node_id, station_id, operator_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/logs/stop — Complete a unit and record time ─────────────────────
router.post('/stop', async (req, res) => {
  const { log_id, units_produced } = req.body;
  try {
    const result = await pool.query(
      `UPDATE station_logs 
       SET end_time = NOW(), 
           status = 'completed', 
           units_produced = units_produced + $1,
           run_time_sec = EXTRACT(EPOCH FROM (NOW() - start_time))
       WHERE id = $2 RETURNING *`,
      [units_produced || 1, log_id]
    );
    
    // Also update the BOM node progress
    if (result.rows.length) {
      await pool.query(
        'UPDATE bom_nodes SET completed_qty = completed_qty + $1 WHERE id = $2',
        [units_produced || 1, result.rows[0].node_id]
      );
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
